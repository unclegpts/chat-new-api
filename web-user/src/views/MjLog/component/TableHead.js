import PropTypes from 'prop-types';
import { TableCell, TableHead, TableRow } from '@mui/material';

const LogTableHead = ({ userIsAdmin }) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>时间</TableCell>
        {userIsAdmin && <TableCell>渠道</TableCell>}
        {<TableCell>类型</TableCell>}
        <TableCell>任务ID</TableCell>
        <TableCell>提交结果</TableCell>
        <TableCell>任务状态</TableCell>
        <TableCell>进度</TableCell>
        <TableCell>结果图片</TableCell>
        <TableCell>Prompt</TableCell>
        <TableCell>PromptEn</TableCell>
        <TableCell>失败原因</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default LogTableHead;

LogTableHead.propTypes = {
  userIsAdmin: PropTypes.bool
};
