"use client";

import React, { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { collection, query, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { 
  Box, 
  Typography, 
  TextField,
  Button, 
  Container, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton, 
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import SearchBar from '@/components/searchbar';
import InventoryTable from '@/components/Inventorytable';
// import { AddIcon, RemoveIcon, RestaurantIcon, CloseIcon, CameraAltIcon } from '@mui/icons-material';
import CameraComponent from '../../../components/camera';

export default function InventoryTracker() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openCamera, setOpenCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState('');
  const [newItemName, setNewItemName] = useState("");
  const [openNewItemDialog, setOpenNewItemDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    item: null,
  });

  const fetchInventory = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
    console.log(inventoryList);
  };

  const updateInventory = async (item, change) => {
    const newQuantity = Math.max(0, (inventory[item] || 0) + change);
    const itemRef = doc(collection(firestore, "pantry"), item);

    if (inventory[item] === undefined) {
      await setDoc(itemRef, { quantity: newQuantity });
    } else {
      await updateDoc(itemRef, { quantity: newQuantity });
    }

    setInventory((prev) => ({
      ...prev,
      [item]: newQuantity,
    }));
  }; 

  // const addItem = async (item) => {
  //   const docRef = doc(collection(firestore, 'pantry'), item);
  //   const docSnap = await getDoc(docRef);

  //   if (docSnap.exists()) {
  //     const { quantity } = docSnap.data();
  //     await setDoc(docRef, { quantity: quantity + 1 });
  //   } else {
  //     await setDoc(docRef, { quantity: 1 });
  //   }
  //   await updateInventory();
  // };
  
  // const removeItem = async (item) => {
  //   const docRef = doc(collection(firestore, 'pantry'), item);
  //   const docSnap = await getDoc(docRef);

  //   if (docSnap.exists()) {
  //     const { quantity } = docSnap.data();
  //     if (quantity === 1) {
  //       await setDoc(docRef, { quantity: 0 });
  //     } else if (quantity === 0) {
  //       if (window.confirm(`Are you sure you want to delete ${item}?`)) {
  //         await deleteDoc(docRef);
  //       } else {
  //         return;
  //       }
  //     } else {
  //       await setDoc(docRef, { quantity: quantity - 1 });
  //     }
  //   }
  //   await updateInventory();
  // };

  
  const deleteItem = async (item) => {
    const itemRef = doc(collection(firestore, "pantry"), item);
    await deleteDoc(itemRef);
    setInventory((prev) => {
      const newInventory = { ...prev };
      delete newInventory[item];
      return newInventory;
    });
    setDeleteConfirmation({ open: false, item: null });
  };

  const handleDetection = async (detectedObject) => {
    setOpenCamera(false);
    if (detectedObject !== 'none') {
      if (cameraMode === 'add_new') {
        await updateInventory(detectedObject, 1);
        setOpenNewItemDialog(false);
      } else {
        await updateInventory(detectedObject, action === 'in' ? 1 : -1);
      }
    } else {
      alert('No valid object detected');
    }
  };
  
  const handleAddNewItem = async () => {
    if (newItemName.trim()) {
      await updateInventory(newItemName.trim(), 1);
      setNewItemName('');
      setOpenNewItemDialog(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter(({ name }) =>
    name && name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'space-between'}
      gap={2}
    >
      <Dialog
        open={openCamera}
        onClose={() => setOpenCamera(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Capture Image
          <IconButton onClick={() => setOpenCamera(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <CameraComponent
            onDetection={handleDetection}
            inventoryItems={Object.keys(inventory)}
            mode={cameraMode}
          />
        </DialogContent>
      </Dialog> 

      <Dialog
        open={openNewItemDialog}
        onClose={() => setOpenNewItemDialog(false)}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Add New Item
          <IconButton onClick={() => setOpenNewItemDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Item Name"
            type="text"
            fullWidth
            variant="standard"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewItemDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddNewItem}>Add</Button>
          <Button
            onClick={() => {
              setCameraMode('add_new');
              setOpenCamera(true);
            }}
            startIcon={<CameraAltIcon />}
          >
            Use Camera
          </Button>
        </DialogActions>
      </Dialog> 
      <Dialog
        open={deleteConfirmation.open}
        onClose={() => setDeleteConfirmation({ open: false, item: null })}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {deleteConfirmation.item} from
            the inventory?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setDeleteConfirmation({ open: false, item: null })
            }
          >
            Cancel
          </Button>
          <Button
            onClick={() => deleteItem(deleteConfirmation.item)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog> 
    <Box 
      fullWidth
      display={'flex'}
      flexDirection={'row'}
      justifyContent={'space-evenly'}
      alignItems={'center'}
      paddingY={2} 
    >
      <Typography  variant="h4" component="h1" sx={{ align: "center", px: "auto" }}>
        Inventory List
      </Typography>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} sx={{ align: "center", px: "auto" }} />
    </Box>  
        {/* <Box
          fullWidth
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'space-evenly'}
          sx={{
            px: 'auto',
          }} >     
          <Button
            size="sm"
            variant="contained"
            onClick={() => handleOpen()}
            sx={{ padding: 2}}
          >
            Add New Item
          </Button> 
          <Button
            size="sm"
            variant="contained"
            onClick={() => handleOpen()}
            sx={{ padding: 2}}
          >
            Update Item
          </Button> 
          <Button
            size="sm"
            variant="contained"
            onClick={() => handleOpen()}
            sx={{ padding: 2}}
          >
            Delete Item
          </Button> 
        </Box> */}
      <Box mt={4} display="flex" justifyContent="center" gap={2}>
        <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setAction("in");
              setCameraMode("add");
              setOpenCamera(true);
            }}
          >
            Add to Inventory
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<RemoveIcon />}
            onClick={() => {
              setAction("out");
              setCameraMode("remove");
              setOpenCamera(true);
            }}
          >
            Remove from Inventory
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenNewItemDialog(true)}
          >
            Add New Item
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RestaurantIcon />}
            onClick={() => setOpenRecipeSuggestion(true)}
          >
            Suggest Recipe
          </Button> 
        </Box>
      <Box >
        <Container 
          maxWidth="md"
          >
          <Box fullWidth overflow={'scroll'}>
            {inventory.length === 0 ? (
              <Box display={'flex'} justifyContent={'center'} alignItems={'center'}> 
                <CircularProgress />
              </Box>
            ) : (
               <InventoryTable
                inventory={filteredInventory}
                add={updateInventory}
                remove={updateInventory}
              />
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};


