"use client";

import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { 
  Box, 
  Modal, 
  Typography, 
  Stack, 
  TextField, 
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { collection, query, getDocs, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import DrawerAppBar from '@/components/navbar';

export default function InventoryTracker() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({name:doc.id, ...doc.data(),}
      )
    });
    setInventory(inventoryList);
    console.log(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await setDoc(docRef, { quantity: 0 });
      }
      else if (quantity === 0) {
        if (window.confirm(`Are you sure you want to delete ${item}?`)) {
          await deleteDoc(docRef);
        } else {
          return;
        }
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter(({ name }) =>
    name && name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      fullWidth  
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="left"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute" 
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="1px solid #333"
          borderRadius={4}
          boxShadow={24}
          padding={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)"
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined" // add new item pop up
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button variant="outlined"  onClick={() => {
              addItem(itemName);
              setItemName('');
              handleClose();
            }}
            >Add</Button>
          </Stack>
        </Box>
      </Modal>
      <DrawerAppBar />
      <Box fullWidth height="800" overflow={'auto'}>
    <Container maxWidth="md" position="fixed">
    <Box display="fixed" paddingY={2} >
      <Typography variant="h4" component="h1" sx={{ marginRight: 'auto' }} >
        Inventory List
      </Typography>
      <TextField
          width={100}
          align="right"
          position="absolute"
          size='small'
          variant="filled"        
          label="Search Items"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
      />
    </Box>
      <TableContainer component={Paper} >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: "center" , px: "auto" , fontWeight: "bold"}} >Item</TableCell>
              <TableCell sx={{ textAlign: "center", px: "auto", fontWeight: "bold"}} >Quantity</TableCell>
              <TableCell sx={{ textAlign: "center", px: "auto" , fontWeight: "bold"}} >Modify</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInventory.map(({name, quantity}) => (
              <TableRow key={name}>
                <TableCell component="th" scope="row" sx={{ textAlign: "center" , px: 5 }}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </TableCell>
                <TableCell sx={{ textAlign: "center" , px: 5}}>{quantity}</TableCell>
                <TableCell sx={{ textAlign: "center"}}>
                  <Button sx={{ borderRadius: '80%' }} onClick={() => addItem(name, 1)}>+</Button>
                  <Button sx={{ borderRadius: '80%' }} onClick={() => removeItem(name, -1)}>-</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
      </Box>
      <Button
        variant="contained"
        maxWidth="sm"
        onClick={() => {
          handleOpen();
        }}
        sx={{ padding: 2 }} // Optional margin for spacing
      >
        Add New Item
      </Button>
    </Box>
  );
}