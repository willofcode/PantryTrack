"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  ThemeProvider,
  CssBaseline,
  InputAdornment
} from "@mui/material";
import { collection, query, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { firestore } from "../../../firebase";
import SearchIcon from "@mui/icons-material/Search";
import CameraComponent from "../../../components/camera";
import { PieChart, BarChart } from "@mui/x-charts";
import { motion } from "framer-motion";
import GenerateRecipe from "../../../components/generateRecipe";
import { StyledTableContainer, StyledTableCell, StyledButton, ActionButton, customTheme } from "@/components/styledcomponents";


const AnimatedCard = motion(Card);

export default function Dashboard() {
  const [inventory, setInventory] = useState([]);
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openCamera, setOpenCamera] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [openNewItemDialog, setOpenNewItemDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    item: null,
  });
  const [openGenerateRecipe, setOpenGenerateRecipe] = useState(false);
  const [cameraMode, setCameraMode] = useState('');
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    const inventory = query(collection(firestore, 'pantry'));
    const Snapshot = await getDocs(inventory);
    const inventoryList = [];
    Snapshot.forEach((doc) => {
        inventoryList.push({ name: doc.id, ...doc.data() || 0 });
    });
    setInventory(inventoryList);
    setLoading(false);
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredInventory = inventory.filter(({ name }) =>
    name && name.toLowerCase().includes(searchQuery.toLowerCase())
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
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              Inventory Dashboard
            </Typography>
          </Box>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search items..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ mb: 4 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Grid container spacing={4}>
            {/* Inventory Overview Chart */}
            <Grid item xs={12} md={6}>
              <AnimatedCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom color="secondary.main">
                    Inventory Overview
                  </Typography>
                  <PieChart
                    series={[
                      {
                        data: Object.entries(inventory).map(
                          ([name, quantity]) => ({
                            id: name,
                            value: quantity,
                            label: name,
                          })
                        ),
                        innerRadius: 30,
                        paddingAngle: 2,
                        cornerRadius: 5,
                        highlightScope: {
                          faded: "global",
                          highlighted: "item",
                        },
                        faded: { innerRadius: 30, additionalRadius: -30 },
                      },
                    ]}
                    width={500}
                    height={300}
                    colors={[
                      customTheme.palette.primary.main,
                      customTheme.palette.secondary.main,
                      customTheme.palette.error.main,
                    ]}
                  />
                </CardContent>
              </AnimatedCard>
            </Grid>

            {/* Top Items Chart */}
            <Grid item xs={12} md={6}>
              <AnimatedCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom color="secondary.main">
                    Top 5 Items
                  </Typography>
                  <BarChart
                    xAxis={[
                      {
                        scaleType: "band",
                        data: Object.keys(inventory).slice(0, 5),
                      },
                    ]}
                    series={[
                      {
                        data: Object.values(inventory).slice(0, 5),
                        color: customTheme.palette.primary.main,
                      },
                    ]}
                    width={500}
                    height={300}
                  />
                </CardContent>
              </AnimatedCard>
            </Grid>

            {/* Inventory Table */}
            <Grid item xs={12}>
              <AnimatedCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom color="secondary.main">
                    Inventory List
                  </Typography>
                  <StyledTableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Item</StyledTableCell>
                          <StyledTableCell align="right">
                            Quantity
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            Modify
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredInventory.map(({name, quantity}) => (
                          <TableRow key={name}>
                            <StyledTableCell component="th" scope="row">
                              {name}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {quantity}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              <ActionButton
                                onClick={() => updateInventory(item, 1)}
                              >
                                <AddIcon />
                              </ActionButton>
                              <ActionButton
                                onClick={() => updateInventory(item, -1)}
                              >
                                <RemoveIcon />
                              </ActionButton>
                              <ActionButton
                                onClick={() =>
                                  setDeleteConfirmation({ open: true, item })
                                }
                              >
                                <DeleteIcon />
                              </ActionButton>
                            </StyledTableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </StyledTableContainer>
                </CardContent>
              </AnimatedCard>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box mt={4} display="flex" justifyContent="center" gap={2}>
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
            <StyledButton
              variant="outlined"
              color="primary"
              startIcon={<RestaurantIcon />}
              onClick={() => setOpenGenerateRecipe(true)}
            >
              Suggest Recipe
            </StyledButton>
          </Box>

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

          {/* Delete Confirmation Dialog */}
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