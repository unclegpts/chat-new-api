import React, {useContext, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {UserContext} from '../context/User';

import {API, getLogo, getSystemName, isAdmin, isMobile, showSuccess} from '../helpers';
import '../index.css';

import {
    IconAt,
    IconHistogram,
    IconGift,
    IconKey,
    IconUser,
    IconLayers,
    IconSetting,
    IconCreditCard,
    IconSemiLogo,
    IconHome,
    IconImage
} from '@douyinfe/semi-icons';
import {Nav, Avatar, Dropdown, Layout} from '@douyinfe/semi-ui';

// HeaderBar Buttons
let headerButtons = [
    {
        text: '首页',
        itemKey: 'home',
        to: '/admin',
        icon: <IconHome/>
    },
    {
        text: '渠道',
        itemKey: 'channel',
        to: '/channel',
        icon: <IconLayers/>,
        className: isAdmin()?'semi-navigation-item-normal':'tableHiddle',
    },

    {
        text: '令牌',
        itemKey: 'token',
        to: '/token',
        icon: <IconKey/>,
        className: isAdmin()?'semi-navigation-item-normal':'tableHiddle',
    },
    {
        text: '兑换码',
        itemKey: 'redemption',
        to: '/redemption',
        icon: <IconGift/>,
        className: isAdmin()?'semi-navigation-item-normal':'tableHiddle',
    },
    {
        text: '钱包',
        itemKey: 'topup',
        to: '/topup',
        icon: <IconCreditCard/>,
        className: isAdmin()?'semi-navigation-item-normal':'tableHiddle',
    },
    {
        text: '用户管理',
        itemKey: 'user',
        to: '/user',
        icon: <IconUser/>,
        className: isAdmin()?'semi-navigation-item-normal':'tableHiddle',
    },
    {
        text: '日志',
        itemKey: 'log',
        to: '/log',
        icon: <IconHistogram/>,
        className: isAdmin()?'semi-navigation-item-normal':'tableHiddle',
    },
    {
        text: '统计',
        itemKey: 'logall',
        to: '/logall',
        icon: <IconHistogram/>,
        className: isAdmin()?'semi-navigation-item-normal':'tableHiddle',
    },
    {
        text: '绘图',
        itemKey: 'midjourney',
        to: '/midjourney',
        icon: <IconImage/>,
        className: isAdmin()?'semi-navigation-item-normal':'tableHiddle',
    },
    {
        text: '设置',
        itemKey: 'setting',
        to: '/setting',
        icon: <IconSetting/>,
        className: isAdmin()?'semi-navigation-item-normal':'tableHiddle',
    },
    // {
    //     text: '关于',
    //     itemKey: 'about',
    //     to: '/about',
    //     icon: <IconAt/>
    // }
];

const SiderBar = () => {
    const [userState, userDispatch] = useContext(UserContext);
    let navigate = useNavigate();
    const [selectedKeys, setSelectedKeys] = useState(['home']);
    const [showSidebar, setShowSidebar] = useState(false);
    const systemName = getSystemName();
    const logo = getLogo();

    async function logout() {
        setShowSidebar(false);
        await API.get('/api/user/logout');
        showSuccess('注销成功!');
        userDispatch({type: 'logout'});
        localStorage.removeItem('user');
        navigate('/admin/login');
    }

    return (
        <>
            <Layout>
                <div style={{height: '100%'}}>
                    <Nav
                        // mode={'horizontal'}
                        // bodyStyle={{ height: 100 }}
                        defaultIsCollapsed={isMobile()}
                        selectedKeys={selectedKeys}
                        renderWrapper={({itemElement, isSubNav, isInSubNav, props}) => {
                            const routerMap = {
                                home: "/admin/",
                                channel: "/admin/channel",
                                token: "/admin/token",
                                redemption: "/admin/redemption",
                                topup: "/admin/topup",
                                user: "/admin/user",
                                log: "/admin/log",
                                logall: "/admin/logall",
                                midjourney: "/admin/midjourney",
                                setting: "/admin/setting",
                                about: "/admin/about",
                            };
                            
                            return (
                                <Link
                                    style={{textDecoration: "none"}}
                                    to={routerMap[props.itemKey]}
                                >
                                    {itemElement}
                                </Link>
                            );
                        }}
                        items={headerButtons}
                        onSelect={key => {
                            //console.log(key);
                            setSelectedKeys([key.itemKey]);
                        }}
                        header={{
                            logo: <img src={logo} alt='logo' style={{marginRight: '0.75em'}}/>,
                            text: systemName,
                        }}
                        // footer={{
                        //   text: '© 2021 NekoAPI',
                        // }}
                    >

                        <Nav.Footer collapseButton={true}>
                        </Nav.Footer>
                    </Nav>
                </div>
            </Layout>
        </>
    );
};

export default SiderBar;
