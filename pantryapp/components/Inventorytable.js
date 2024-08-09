import React from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';

const InventoryTable = ({ inventory, add, remove }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ textAlign: 'center', px: 'auto', fontWeight: 'bold' }}>Item</TableCell>
            <TableCell sx={{ textAlign: 'center', px: 'auto', fontWeight: 'bold' }}>Quantity</TableCell>
            <TableCell sx={{ textAlign: 'center', px: 'auto', fontWeight: 'bold' }}>Modify</TableCell>
          </TableRow>
        </TableHead>
        <TableBody width="800px" spacing={2} overflow={'scroll'}>
          {inventory.map(({ name, quantity }) => (
            <TableRow key={name}>
              <TableCell component="th" scope="row" sx={{ textAlign: 'center', px: 5 }}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </TableCell>
              <TableCell sx={{ textAlign: 'center', px: 5 }}>{quantity}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <Button sx={{ borderRadius: '80%' }} onClick={() => add(name, 1)}>+</Button>
                <Button sx={{ borderRadius: '80%' }} onClick={() => remove(name, -1)}>-</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InventoryTable;
