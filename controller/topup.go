package controller

import (
	"fmt"
	"log"
	"net/url"
	"one-api/common"
	"one-api/model"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/samber/lo"
	epay "github.com/star-horizon/go-epay"
)

type EpayRequest struct {
	Amount        int    `json:"amount"`
	PaymentMethod string `json:"payment_method"`
	TopUpCode     string `json:"top_up_code"`
}

type AmountRequest struct {
	Amount    int    `json:"amount"`
	TopUpCode string `json:"top_up_code"`
}

func GetEpayClient() *epay.Client {
	if common.PayAddress == "" || common.EpayId == "" || common.EpayKey == "" {
		return nil
	}
	withUrl, err := epay.NewClientWithUrl(&epay.Config{
		PartnerID: common.EpayId,
		Key:       common.EpayKey,
	}, common.PayAddress)
	if err != nil {
		return nil
	}
	return withUrl
}

func GetAmount(count float64, user model.User) float64 {
	// 别问为什么用float64，问就是这么点钱没必要
	topupGroupRatio := common.GetTopupGroupRatio(user.Group)
	if topupGroupRatio == 0 {
		topupGroupRatio = 1
	}
	amount := count * common.Price * topupGroupRatio
	return amount
}

func RequestEpay(c *gin.Context) {
	var req EpayRequest
	err := c.ShouldBindJSON(&req)
	if err != nil {
		c.JSON(200, gin.H{"message": err.Error(), "data": 10})
		return
	}
	if req.Amount < 5 {
		c.JSON(200, gin.H{"message": "出错了！充值金额不能低于5 PA币.", "data": 10})
		return
	}

	id := c.GetInt("id")
	user, _ := model.GetUserById(id, false)
	amount := GetAmount(float64(req.Amount), *user)

	var payType epay.PurchaseType
	if req.PaymentMethod == "zfb" {
		payType = epay.Alipay
	}
	if req.PaymentMethod == "wx" {
		req.PaymentMethod = "wxpay"
		payType = epay.WechatPay
	}

	returnUrl, _ := url.Parse(common.ServerAddress + "/log")
	notifyUrl, _ := url.Parse(common.ServerAddress + "/api/user/epay/notify")
	tradeNo := strconv.FormatInt(time.Now().Unix(), 10)
	payMoney := amount
	client := GetEpayClient()
	if client == nil {
		c.JSON(200, gin.H{"message": "error", "data": "当前管理员未配置支付信息"})
		return
	}
	uri, params, err := client.Purchase(&epay.PurchaseArgs{
		Type:           payType,
		ServiceTradeNo: "A" + tradeNo,
		Name:           "B" + tradeNo,
		Money:          strconv.FormatFloat(payMoney, 'f', 2, 64),
		Device:         epay.PC,
		NotifyUrl:      notifyUrl,
		ReturnUrl:      returnUrl,
	})
	if err != nil {
		c.JSON(200, gin.H{"message": "error", "data": "拉起支付失败"})
		return
	}
	topUp := &model.TopUp{
		UserId:     id,
		Amount:     req.Amount,
		Money:      payMoney,
		TradeNo:    "A" + tradeNo,
		CreateTime: time.Now().Unix(),
		Status:     "pending",
	}
	err = topUp.Insert()
	if err != nil {
		c.JSON(200, gin.H{"message": "error", "data": "创建订单失败"})
		return
	}
	c.JSON(200, gin.H{"message": "success", "data": params, "url": uri})
}

func EpayNotify(c *gin.Context) {
	params := lo.Reduce(lo.Keys(c.Request.URL.Query()), func(r map[string]string, t string, i int) map[string]string {
		r[t] = c.Request.URL.Query().Get(t)
		return r
	}, map[string]string{})
	client := GetEpayClient()
	if client == nil {
		log.Println("易支付回调失败 未找到配置信息")
		_, err := c.Writer.Write([]byte("fail"))
		if err != nil {
			log.Println("易支付回调写入失败")
		}
		notifyEmailForFail()    // 发送回调失败通知
		notifyWxPusherForFail() // 发送回调失败通知
		return
	}
	verifyInfo, err := client.Verify(params)
	if err != nil || !verifyInfo.VerifyStatus {
		log.Printf("易支付回调验证失败: %v", err)
		_, writeErr := c.Writer.Write([]byte("fail"))
		if writeErr != nil {
			log.Println("易支付回调写入失败")
		}
		notifyEmailForFail()    // 发送验证失败通知
		notifyWxPusherForFail() // 发送验证失败通知
		return
	}

	if verifyInfo.TradeStatus == epay.StatusTradeSuccess {
		log.Println(verifyInfo)
		topUp := model.GetTopUpByTradeNo(verifyInfo.ServiceTradeNo)
		if topUp != nil && topUp.Status == "pending" {
			topUp.Status = "success"
			err := topUp.Update()
			if err != nil {
				log.Printf("易支付回调更新订单失败: %v", topUp)
				return
			}
			//user, _ := model.GetUserById(topUp.UserId, false)
			//user.Quota += topUp.Amount * 500000
			err = model.IncreaseUserQuota(topUp.UserId, topUp.Amount*500000)
			if err != nil {
				log.Printf("易支付回调更新用户失败: %v", topUp)
				return
			}
			log.Printf("易支付回调更新用户成功 %v", topUp)
			notifyEmail(topUp)
			notifyWxPusher(topUp)
			model.RecordLog(topUp.UserId, model.LogTypeTopup, fmt.Sprintf("使用在线充值成功，充值金额: %v，支付金额：%f", common.LogQuota(topUp.Amount*500000), topUp.Money))
		}
		_, writeErr := c.Writer.Write([]byte("success")) // 确保发送 success 响应
		if writeErr != nil {
			log.Println("易支付回调响应成功写入失败")
		}
	} else {
		log.Printf("易支付异常回调: %v", verifyInfo)
		_, writeErr := c.Writer.Write([]byte("fail"))
		if writeErr != nil {
			log.Println("易支付回调写入失败")
		}
	}
}

func notifyEmail(topUp *model.TopUp) {
	emailNotifEnabled, _ := strconv.ParseBool(common.OptionMap["EmailNotificationsEnabled"])
	if emailNotifEnabled {
		notificationEmail := common.OptionMap["NotificationEmail"]
		if notificationEmail == "" {
			// 如果没有设置专门的通知邮箱，则尝试获取 RootUserEmail
			if common.RootUserEmail == "" {
				common.RootUserEmail = model.GetRootUserEmail()
			}
			notificationEmail = common.RootUserEmail
		}
		subject := fmt.Sprintf("充值成功通知: 用户「%d」充值金额：%v，支付金额：%f", topUp.UserId, common.LogQuota(topUp.Amount*500000), topUp.Money)
		content := fmt.Sprintf("用户「%d」使用在线充值成功。充值金额：%v，支付金额：%f", topUp.UserId, common.LogQuota(topUp.Amount*500000), topUp.Money)
		err := common.SendEmail(subject, notificationEmail, content)
		if err != nil {
			common.SysError(fmt.Sprintf("failed to send email notification: %s", err.Error()))
		}
	}
}

func notifyWxPusher(topUp *model.TopUp) {
	wxNotifEnabled, _ := strconv.ParseBool(common.OptionMap["WxPusherNotificationsEnabled"])
	if wxNotifEnabled {
		subject := fmt.Sprintf("充值成功通知: 用户「%d」充值金额：%v，支付金额：%f", topUp.UserId, common.LogQuota(topUp.Amount*500000), topUp.Money)
		content := fmt.Sprintf("用户「%d」使用在线充值成功。充值金额：%v，支付金额：%f", topUp.UserId, common.LogQuota(topUp.Amount*500000), topUp.Money)
		err := SendWxPusherNotification(subject, content)
		if err != nil {
			common.SysError(fmt.Sprintf("无法发送WxPusher通知: %s", err))
		}
	}
}

func notifyEmailForFail() {
	emailNotifEnabled, _ := strconv.ParseBool(common.OptionMap["EmailNotificationsEnabled"])
	if emailNotifEnabled {
		notificationEmail := common.OptionMap["NotificationEmail"]
		if notificationEmail == "" {
			// 如果没有设置专门的通知邮箱，则尝试获取 RootUserEmail
			if common.RootUserEmail == "" {
				common.RootUserEmail = model.GetRootUserEmail()
			}
			notificationEmail = common.RootUserEmail
		}
		subject := "支付回调失败通知"
		content := "一个支付回调未能成功处理，请检查系统日志获取更多信息。"
		err := common.SendEmail(subject, notificationEmail, content)
		if err != nil {
			common.SysError(fmt.Sprintf("failed to send email notification: %s", err.Error()))
		}
	}
}

func notifyWxPusherForFail() {
	wxNotifEnabled, _ := strconv.ParseBool(common.OptionMap["WxPusherNotificationsEnabled"])
	if wxNotifEnabled {
		subject := "支付回调失败通知"
		content := "一个支付回调未能成功处理，请检查系统日志获取更多信息。"
		err := SendWxPusherNotification(subject, content)
		if err != nil {
			common.SysError(fmt.Sprintf("无法发送WxPusher通知: %s", err))
		}
	}
}

func RequestAmount(c *gin.Context) {
	var req AmountRequest
	err := c.ShouldBindJSON(&req)
	if err != nil {
		c.JSON(200, gin.H{"message": "error", "data": "参数错误"})
		return
	}
	if req.Amount < 5 {
		c.JSON(200, gin.H{"message": "error", "data": "出错了！充值金额不能低于5 PA币."})
		return
	}
	id := c.GetInt("id")
	user, _ := model.GetUserById(id, false)
	payMoney := GetAmount(float64(req.Amount), *user)
	c.JSON(200, gin.H{"message": "success", "data": strconv.FormatFloat(payMoney, 'f', 2, 64)})
}
