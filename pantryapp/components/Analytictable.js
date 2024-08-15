import React from 'react';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow} from '@mui/material';
import { StyledTableContainer } from './styledcomponents';

const AnalyticTable = ({inventory}) => {
  
  return (
    <StyledTableContainer component={Paper}>
      <Table
        aria-label="table with sticky header"
        stickyHeader
        hoverRow
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ textAlign: 'center', px: 'auto', fontWeight: 'bold' }}>
              Item
            </TableCell>
            <TableCell sx={{ textAlign: 'center', px: 'auto', fontWeight: 'bold' }}>
              Quantity
            </TableCell>
            <TableCell sx={{ textAlign: 'center', px: 'auto', fontWeight: 'bold' }}>
              Date Added
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody  overflow={'scroll'} spacing={2}>
          {inventory.map(({name, quantity, date}) => (
            <TableRow key={name}>
              <TableCell component="th" scope="row" sx={{ textAlign: 'center', px: 3 }}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </TableCell>
              <TableCell sx={{ textAlign: 'center', px: 3 }}>
                {quantity}
              </TableCell>
              <TableCell sx={{ textAlign: 'center', px: 3 }}>
                {date || 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

export default AnalyticTable;
