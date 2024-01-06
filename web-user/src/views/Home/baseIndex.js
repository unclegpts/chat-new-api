import { Box, Typography, Button, Container, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

// QQ群图标组件
const QQGroupIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    {<svg t="1703948109943" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3789" width="400" height="400"><path d="M512 117.76c-212.48 0-384 171.52-384 384s171.52 384 384 384 384-171.52 384-384-171.52-384-384-384z m-51.2 537.6c-5.12 5.12-10.24 10.24-12.8 15.36H435.2c-38.4 20.48-102.4 12.8-117.76 0-12.8-10.24-12.8-25.6 2.56-38.4 5.12-2.56 10.24-5.12 17.92-7.68-12.8-12.8-23.04-30.72-28.16-48.64-2.56 5.12-7.68 10.24-7.68 12.8-7.68 12.8-17.92 15.36-23.04 0-5.12-15.36-5.12-40.96 7.68-71.68 7.68-17.92 17.92-33.28 25.6-43.52-2.56-5.12-5.12-10.24-5.12-17.92 0-12.8 7.68-23.04 20.48-33.28 5.12-64 58.88-112.64 120.32-112.64 33.28 0 64 12.8 84.48 35.84-10.24 5.12-17.92 12.8-25.6 20.48-23.04 23.04-38.4 51.2-43.52 84.48-17.92 15.36-20.48 30.72-20.48 40.96 0 5.12 0 10.24 2.56 15.36-10.24 12.8-17.92 25.6-23.04 38.4-12.8 30.72-15.36 61.44-7.68 81.92 5.12 17.92 17.92 20.48 23.04 20.48 7.68 0 15.36-2.56 20.48-7.68 2.56 2.56 5.12 7.68 7.68 10.24-2.56 2.56-5.12 2.56-5.12 5.12z m284.16-43.52c-5.12 12.8-12.8 12.8-20.48 0-2.56-2.56-5.12-7.68-7.68-12.8-5.12 15.36-12.8 30.72-25.6 40.96 7.68 2.56 12.8 5.12 17.92 7.68 12.8 10.24 12.8 23.04 2.56 33.28-12.8 12.8-71.68 17.92-102.4 0h-23.04c-33.28 17.92-89.6 12.8-102.4 0-10.24-10.24-10.24-23.04 2.56-33.28 2.56-2.56 10.24-5.12 15.36-7.68-10.24-12.8-20.48-25.6-25.6-43.52-2.56 5.12-5.12 10.24-7.68 12.8-7.68 12.8-15.36 12.8-20.48 0-5.12-15.36-2.56-35.84 5.12-61.44 5.12-15.36 15.36-28.16 23.04-38.4-2.56-5.12-5.12-10.24-5.12-15.36 0-10.24 5.12-20.48 17.92-30.72 5.12-56.32 51.2-99.84 104.96-99.84 53.76 0 99.84 43.52 104.96 99.84 10.24 7.68 17.92 17.92 17.92 30.72 0 5.12-2.56 10.24-5.12 15.36 7.68 7.68 17.92 20.48 23.04 38.4 15.36 28.16 15.36 48.64 10.24 64z m0 0" fill="#707070" p-id="3790"></path><path d="M870.4 409.6l102.4 102.4-102.4 102.4v-25.6z" fill="#707070" p-id="3791"></path></svg>}
  </svg>
);

// 主页面组件
const BaseIndex = () => (
  <Box
    sx={{
      minHeight: 'calc(100vh - 136px)',
      backgroundImage: 'linear-gradient(to right, #5063cb, #3449b8)',
      color: 'white',
      p: 4
    }}
  >
    <Container maxWidth="lg">
      <Grid container columns={12} wrap="nowrap" alignItems="center" sx={{ minHeight: 'calc(100vh - 230px)' }}>
        <Grid md={7} lg={6}>
          <Stack spacing={3}>
            <Typography variant="h1" sx={{ fontSize: '4rem', color: '#fff', lineHeight: 1.5 }}>
              PartnerAI API
            </Typography>
            <Typography variant="h4" sx={{ fontSize: '1.5rem', color: '#fff', lineHeight: 1.5 }}>
              全模态模型服务商 <br />
              PartnerAI,您的24小时AI搭档 <br />
              支持目前90%大语言模型接口 <br />
              一键部署，开箱即用!
            </Typography>
            <Button
              variant="contained"
              //startIcon={<QQGroupIcon />} // 使用QQ群图标
              href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=pvh_yGyANVL32kt5QoY618dssd7xs92x&authKey=1Hg987zPRRo%2BGyP%2FPrd9BdgHlOUSX%2BHHlX2BVsYv2qCJCJTFYTnY5O7MM%2FkAmvnw&noverify=0&group_code=36794855"
              target="_blank"
              sx={{ backgroundColor: '#24292e', color: '#fff', width: 'fit-content', boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)' }}
            >
              加入QQ群
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default BaseIndex;
