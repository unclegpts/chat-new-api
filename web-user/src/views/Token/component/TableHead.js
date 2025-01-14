import PropTypes from 'prop-types';
import { TableCell, TableHead, TableRow,Checkbox } from '@mui/material';

const TokenTableHead = ({ numSelected, rowCount, onSelectAllClick, modelRatioEnabled, billingByRequestEnabled }) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        <TableCell>令牌名称</TableCell>
        <TableCell>令牌状态</TableCell>
        <TableCell>已用额度</TableCell>
        <TableCell>剩余额度</TableCell>
        <TableCell>创建时间</TableCell>
        <TableCell>过期时间</TableCell>
        {modelRatioEnabled && billingByRequestEnabled && (
          <TableCell>消费模式</TableCell>
        )}
        <TableCell>操作</TableCell>
      </TableRow>
    </TableHead>
  );
};

TokenTableHead.propTypes = {
  modelRatioEnabled: PropTypes.bool,
  billingByRequestEnabled: PropTypes.bool,
  onSelectAllClick: PropTypes.func.isRequired, // 新增 propType
  numSelected: PropTypes.number.isRequired, // 新增 propType
  rowCount: PropTypes.number.isRequired // 新增 propType
};

export default TokenTableHead;
