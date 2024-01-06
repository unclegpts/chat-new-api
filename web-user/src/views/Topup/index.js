import React from 'react';
import { Stack, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import TopupCard from './component/TopupCard';
import InviteCard from './component/InviteCard';

const Topup = () => {
  const theme = useTheme();
  const infoColor = theme.palette.info.main;
  const highlightStyle = {
    fontWeight: 'bold',
    color: infoColor,
  };
  
  return (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <Alert severity="info">
          温馨提示：充值记录请前往日志中选择类型<span style={highlightStyle}>【充值】</span>查询；邀请记录请前往日志中选择<span style={highlightStyle}>【系统】</span>查询即可！
        </Alert>
      </Grid>
      <Grid xs={12} md={6} lg={8}>
        <Stack spacing={2}>
          <TopupCard />
        </Stack>
      </Grid>
      <Grid xs={12} md={6} lg={4}>
        <InviteCard />
      </Grid>
    </Grid>
  );
};

export default Topup;
