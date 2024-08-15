import React from 'react';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow} from '@mui/material';
import { ActionButton, StyledTableContainer } from './styledcomponents';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

const InventoryTable = ({ inventory, add, remove, DeleteConfirmation}) => {
  
  return (
    <StyledTableContainer component={Paper}>
      <Table
        aria-label="table with sticky header"
        stickyHeader
        hoverRow
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ textAlign: 'center', px: 'auto', fontWeight: 'bold' }}>Item</TableCell>
            <TableCell sx={{ textAlign: 'center', px: 'auto', fontWeight: 'bold' }}>Quantity</TableCell>
            <TableCell sx={{ textAlign: 'center', px: 'auto', fontWeight: 'bold' }}>Modify</TableCell>
          </TableRow>
        </TableHead>
        <TableBody  overflow={'scroll'} spacing={2}>
          {inventory.map(([name, quantity]) => (
            <TableRow key={name}>
              <TableCell component="th" scope="row" sx={{ textAlign: 'center', px: 5 }}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </TableCell>
              <TableCell sx={{ textAlign: 'center', px: 5 }}>{quantity}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <ActionButton sx={{ borderRadius: '80%' }} onClick={() => add(name, 1)}><AddIcon/></ActionButton>
                <ActionButton sx={{ borderRadius: '80%' }} onClick={() => remove(name, -1)}><RemoveIcon/></ActionButton>
                <ActionButton sx={{ borderRadius: '80%' }} onClick={() => DeleteConfirmation(name)}><DeleteIcon /></ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

export default InventoryTable;
