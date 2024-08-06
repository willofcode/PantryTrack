"use client"
import { useState, useEffect } from 'react';
import { firestore } from '../../firebase';
import { Box, Modal, Typography, Stack, TextField, Button } from "@mui/material";
import { collection, query, getDocs, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

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
        await deleteDoc(docRef);
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
      fullWidth  // add new item button
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="left"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute" // add new item pop up
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
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
            <Button variant="outlined" onClick={() => {
              addItem(itemName);
              setItemName('');
              handleClose();
            }}
            >Add</Button>
          </Stack>
        </Box>
      </Modal>

      <Box fullWidth height="800" overflow="auto">
        <Box
          fullWidth  // "inventory items" box
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ marginBottom: 2 }}
        >
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
        </Box>
        <TextField
          fullWidth
          variant="outlined" // search bar          
          label="Search Items"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Stack width="100vw" height="100vh" spacing={2}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name} // item display
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgColor="#f0f0f0"
              padding={5}
            >
              <Typography
                variant="h4"
                color="#333"
                textAlign="center"
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography
                variant="h4"
                color="#333"
                textAlign="center"
              >
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  rounded="true"
                  variant="contained"
                  onClick={() => {
                    addItem(name);
                  }}
                >
                  +
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    removeItem(name);
                  }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>

      <Button
        variant="contained"
        onClick={() => {
          handleOpen();
        }}
        sx={{ margin: 2 }} // Optional margin for spacing
      >
        Add New Item
      </Button>
    </Box>
  );
}