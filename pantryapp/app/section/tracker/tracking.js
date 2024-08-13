"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  TableCell,
  TableContainer,
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  ThemeProvider,
  createTheme,
  CssBaseline,
  InputAdornment
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { Switch } from '@mui/material'
import { firestore } from "@/firebase";
import SearchIcon from "@mui/icons-material/Search";
import {
  query,
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import CameraComponent from "@/components/camera";
import { styled } from "@mui/material/styles";
import { PieChart, BarChart } from "@mui/x-charts";
import { motion } from "framer-motion";
import GenerateRecipe from "@/components/generateRecipe";
import { darkPalette, lightPalette, StyledButton, StyledSearch } from "@/components/styledcomponents";
import InventoryTable from "../../../components/Inventorytable";

  

const AnimatedCard = motion(Card);

export default function Dashboard() {
  const [inventory, setInventory] = useState({});
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true);
  const [openCamera, setOpenCamera] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [openNewItemDialog, setOpenNewItemDialog] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [openGenerateRecipe, setOpenGenerateRecipe] = useState(false);
  const [cameraMode, setCameraMode] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)


  const customTheme = createTheme({
    palette: darkMode ? darkPalette : lightPalette,
    typography: {
      fontFamily: '"Poppins", "Roboto", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 500,
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          },
        },
      },
    },
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    const inventoryCollection = query(collection(firestore, "pantry"));
    const inventorySnapshot = await getDocs(inventoryCollection);
    const inventoryData = {};
    inventorySnapshot.forEach((doc) => {
      inventoryData[doc.id] = doc.data().quantity;
    });
    setInventory(inventoryData);
    console.log(inventoryData);
    setLoading(false);
  };

  const updateInventory = async (item, change) => {
    const newQuantity = Math.max(0, (inventory[item] || 0) + change);
    const itemRef = doc(collection(firestore, "pantry"), item);

    if (inventory[item] === undefined) {
      await setDoc(itemRef, { quantity: newQuantity});
    } else if (newQuantity === 0) {
      await deleteDoc(itemRef);
    } else {
      await updateDoc(itemRef, { quantity: newQuantity });
    }

    setInventory((prev) => ({
      ...prev,
      [item]: newQuantity,
    }));
    await fetchInventory();
  };

  // const deleteItem = async (item) => {
  //   console.log("Deleting item:", item);
  //   if (!item || item.trim() === '') {
  //     console.error("Invalid item:", item);
  //     return;
  //   }
  
  //   try {
  //     const itemRef = doc(firestore, "pantry", item);
  //     console.log("Document Reference:", itemRef);
  //     await deleteDoc(itemRef);
  //     setInventory((prev) => {
  //       const updatedInventory = { ...prev };
  //       delete updatedInventory[item];
  //       return updatedInventory;
  //     });
  //     await fetchInventory();
  //     setDeleteConfirmation({ open: false, item: null });
  //   } catch (error) {
  //     console.error("Error deleting item:", error);
  //   }
  // };

  const deleteItem = async (item) => {
    const itemRef = doc(firestore, "pantry", item);
    await deleteDoc(itemRef);
    setInventory((prev) => {
      const newInventory = { ...prev };
      delete newInventory[item];
      return newInventory;
    });
    setDeleteConfirmation(item);
  };
  

  console.log("item to be deleted", deleteConfirmation);

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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredInventory = Object.entries(inventory).filter(([item, _]) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box my={4}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
            overflow={'hidden'}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              Pantry Inventory
            </Typography>
            <TextField
            width={100}
            variant="outlined"
            placeholder="Search items..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ px: "auto"}}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
            {/* <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              color="default"
              inputProps={{ 'aria-label': 'toggle dark mode' }}
            /> */}
          </Box>
          {/* Action Buttons */}
          <Box 
            fullWidth
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'space-evenly'}
            sx={{
              px: 'auto',
            }}
          >
            <StyledButton
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
            </StyledButton>
            <StyledButton
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
            </StyledButton>
            <StyledButton
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenNewItemDialog(true)}
            >
              Add New Item
            </StyledButton>
            {/* <StyledButton
              variant="outlined"
              color="primary"
              startIcon={<RestaurantIcon />}
              onClick={() => setOpenGenerateRecipe(true)}
            >
              Suggest Recipe
            </StyledButton> */}
          </Box>

            {/* Inventory Table */}
            <Grid 
              item xs={12} 
              marginTop={4}  
              overflow={"scroll"}
              height={500}
              >
              <AnimatedCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <CardContent>
                  {/* <Typography variant="h6" gutterBottom color="secondary.main">
                    Inventory List
                  </Typography> */}
                    <InventoryTable
                      inventory={filteredInventory}
                      add={updateInventory}
                      remove={updateInventory}
                      DeleteConfirmation={
                        (item) => {
                          handleOpen();
                          setDeleteConfirmation(item);
                        }
                      }
                    />
                </CardContent>
              </AnimatedCard>
            </Grid>

          {/* Camera Dialog */}
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

          {/* Add New Item Dialog */}
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

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={open}
            onClose={handleClose}
          >
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete {deleteConfirmation.charAt(0).toUpperCase() + deleteConfirmation.slice(1)} from
                the inventory?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() =>{
                  handleClose()
                  setDeleteConfirmation("")
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  deleteItem(deleteConfirmation)
                  handleClose()
                }}
                color="error"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Recipe Suggestion Dialog */}
          <GenerateRecipe
            open={openGenerateRecipe}
            onClose={() => setOpenGenerateRecipe(false)}
            inventoryItems={Object.keys(inventory)}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}