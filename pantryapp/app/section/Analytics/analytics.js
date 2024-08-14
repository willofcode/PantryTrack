'use client'

import React from "react";
import { firestore } from "@/firebase";
import SearchIcon from "@mui/icons-material/Search";
import CameraComponent from "@/components/camera";
import { styled } from "@mui/material/styles";
import { PieChart, BarChart } from "@mui/x-charts";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect } from 'react'
import { Grid, Card, CardContent, Container, Box, Stack, Typography, Button, Modal, TextField, MenuItem, Paper, FormControl, Select, InputLabel, ThemeProvider, createTheme, CssBaseline, } from '@mui/material';
import {
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
  collection
} from 'firebase/firestore';
import GenerateRecipe from "@/components/generateRecipe";
import { darkPalette, lightPalette, StyledButton} from "@/components/styledcomponents";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";


// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'white',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
//   display: 'flex',
//   flexDirection: 'column',
//   gap: 3,
// }

const AnimatedCard = motion(Card);

export default function AnalyticsPage() {
  const [inventory, setInventory] = useState({})
  const [open, setOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false);
  const [itemName, setItemName] = useState('')
  const [itemQuantity, setItemQuantity] = useState('')
  const [itemDate, setitemDate] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc') // default to ascending
  const [openGenerateRecipe, setOpenGenerateRecipe] = useState(false);

  const fetchInventory = async () => {
    const snapshot = query(collection(firestore, "pantry"))
    const docs = await getDocs(snapshot)
    const inventoryData = [];
    docs.forEach((doc) => {
      inventoryData.push({ name: doc.id, quantity: doc.data().quantity, date: doc.data().date })
    })
    setInventory(inventoryData)
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  const addNewItem = async (item) => {
    const newItem = {
      name: item,
      quantity: Number(itemQuantity),
      itemDate: itemDate
    }

    setInventory(prevInventory => {
      const existingItem = prevInventory.find(i => i.name === item)
      if (existingItem) {
        return prevInventory.map(i => i.name === item
          ? { ...i, quantity: i.quantity + newItem.quantity }
          : i)
      } else {
        return [newItem, ...prevInventory]
      }
    })

    const docRef = doc(collection(firestore, "pantry"), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { ...newItem, quantity: quantity + newItem.quantity })
    } else {
      await setDoc(docRef, newItem)
    }

    await fetchInventory()
  }

  const increaseItemQuantityOptimistic = async (item) => {
    setInventory(prevInventory => (
      prevInventory.map(item => item.name === item ? { ...i, quantity: i.quantity + 1 } : i)
    ))

    const docRef = doc(collection(firestore, "pantry"), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    }

    await fetchInventory()
  }

  const removeItemOptimistic = async (item) => {
    setInventory(prevInventory => 
      prevInventory
        .map(i => i.name === item ? { ...i, quantity: i.quantity - 1 } : i)
        .filter(i => i.quantity > 0)
    )

    const docRef = doc(collection(firestore, "pantry"), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }

    await fetchInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // Filter and Sort inventory based on search query, sort option, and order
  const filteredInventory = Object.values(inventory).filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).sort((a, b) => {
      let comparison = 0

      if (sortOption === 'name') {
        if (a.name && b.name) {
          console.log(a);
          console.log(b);
          comparison = a.name.localeCompare(b.name);
        } else {
          comparison = 0
        } 
      } else if (sortOption === 'quantity') {
        comparison = a.quantity - b.quantity;
      } else if (sortOption === 'itemDate') {
        comparison = new Date(a.itemDate) - new Date(b.itemDate);
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

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

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
        <Container
          maxWidth="lg"
        >
          <Box my={4}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            <Typography variant="h4" fontWeight="bold">
              Analytics Dashboard
            </Typography>
            <TextField
                label="Search Items"
                placeholder="Search items..."
                variant="outlined"
                style={{ width: '300px', fontFamily: 'PT Sans' }} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
          </Box>

          <Box
            display="flex"
            flexDirection={"column"}
            justifyContent={"center"}
            my={4}
            gap={2}
          >
            <Box            
                fullWidth
                display={'flex'}
                justifyContent={'space-between'}
                alignItems="center" 
                sx={{
                  px: 'auto',
                }}
            >
              <FormControl variant="outlined" style={{ width: '150px', fontFamily: 'Roboto' }}>
                <InputLabel id="sort-by-label" style={{ color: "#0096FF", fontFamily: 'PT Sans' }}>Sort By</InputLabel>
                <Select
                  labelId="sort-by-label"
                  id="sort-by"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  label="Sort By"
                  
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="quantity">Quantity</MenuItem>
                  <MenuItem value="itemDate">Date</MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="outlined" style={{ width: '150px', fontFamily: 'PT Sans' }}>
                <InputLabel id="sort-order-label" style={{ color: "#0096FF", fontFamily: 'PT Sans' }}>Order</InputLabel>
                <Select
                  labelId="sort-order-label"
                  id="sort-order"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  label="Order"
                  inputProps={{ style: { color: "#0096FF", fontFamily: 'PT Sans' } }}
                  style={{ fontFamily: 'PT Sans' }}
                  
                >
                  <MenuItem value="asc" style={{ fontFamily: 'PT Sans' }}>Ascending</MenuItem>
                  <MenuItem value="desc" style={{ fontFamily: 'PT Sans' }}>Descending</MenuItem>
                </Select>
              </FormControl>

              <StyledButton
                variant="outlined"
                color="primary"
                startIcon={<RestaurantIcon />}
                onClick={() => setOpenGenerateRecipe(true)}
              >
                Suggest Recipe
              </StyledButton>
            </Box>
            
           <Grid 
            display={'flex'} 
            flexDirection={'column'} 
            justifyContent={'center'}
            spacing={2}>
                {/* Inventory Overview Chart 
                <Grid item xs={12} md={10} >
                  <AnimatedCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CardContent >
                      <Typography variant="h6" gutterBottom color="secondary.main">
                        Inventory Overview
                      </Typography>
                      <PieChart flexDirection={'flex-wrap'}
                        series={[
                          {
                            data: Object.entries(inventory).map(
                              ([name, quantity]) => ({
                                id: name,
                                value: quantity,
                                arcLabels: { skipAngle: 10 },
                              })
                            ),
                            innerRadius: 10,
                            paddingAngle: 2,
                            cornerRadius: 5,
                            highlightScope: {
                              faded: "global",
                              highlighted: "item",
                            },
                            faded: { innerRadius: 30, additionalRadius: -30 },
                          },
                        ]}
                        minwidth={300}
                        height={300}
                        colors={[
                          customTheme.palette.primary.main,
                          customTheme.palette.secondary.main,
                          customTheme.palette.error.main,
                        ]}
                      />
                    </CardContent>
                  </AnimatedCard>
                </Grid> */}

                {/* Top Items Chart */}
                <Grid item xs={12} md={10}>
                  <AnimatedCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary.main">
                        Inventory Overview
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
                        minwidth={300}
                        height={300}
                      />
                    </CardContent>
                  </AnimatedCard>
                </Grid>
              </Grid>

          <Box 
            component={Paper} 
            border={'1px solid'} 
            alignItems={"center"}
            mt={2} >
              <Grid container justifyContent={'space-evenly'} alignItems={"center"}>
                <Grid item>
                  <typography textAlign={'center'}>
                    Item
                  </typography>
                </Grid>
                <Grid item>
                  <typography  textAlign={'center'}>
                    Quantity
                  </typography>
                </Grid>
                <Grid item>
                  <typography textAlign={'center'}>
                    Date added
                  </typography>
                </Grid>
              </Grid>
            <Stack height="400px" overflow={'auto'}>
              {filteredInventory.map(({ name, quantity, itemDate }) => (
                <Box
                  key={name}
                  width="100%"
                  minHeight="80px"
                  display={'flex'}
                  justifyContent={'space-evenly'}
                  alignItems={'center'}
                  sx={{
                    borderBottom: '1px solid #000000', // Add a border between rows
                  }}
                >
                  <Grid container justifyContent={'center'} alignItems="center"> 
                    <Grid item xs={4}>
                      <Typography variant={'h6'} textAlign={'center'}>
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant={'h6'} textAlign={'center'}>
                        {quantity}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant={'h6'} textAlign={'center'}>
                        {itemDate || 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                  {/* <Box display="flex" gap={2}>
                    <Button variant="contained" onClick={() => increaseItemQuantityOptimistic(name)}
                      style={{ borderRadius: '50%' }}>
                      <AddIcon/>
                    </Button>
                    <Button variant="contained" onClick={() => removeItemOptimistic(name)}
                      style={{ borderRadius: '50%' }}>
                      <RemoveIcon/>
                    </Button>
                  </Box> */}
                </Box>
              ))}
            </Stack>
          </Box>
          <GenerateRecipe
            open={openGenerateRecipe}
            onClose={() => setOpenGenerateRecipe(false)}
            inventoryItems={Object.keys(inventory)}
          />
          </Box>
          </Box>
        </Container>
    </ThemeProvider>
  )
} 


