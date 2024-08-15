'use client'

import React from "react";
import { firestore } from "@/firebase";
import {  BarChart } from "@mui/x-charts";
import { motion } from "framer-motion";
import { useState, useEffect } from 'react'
import { Grid, Card, CardContent, Container, Box, Typography, TextField, MenuItem, FormControl, Select, InputLabel, ThemeProvider, createTheme, CssBaseline, } from '@mui/material';
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
import AnalyticTable from "@/components/Analytictable";


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
  // const [open, setOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc') // default to ascending
  const [openGenerateRecipe, setOpenGenerateRecipe] = useState(false);

  const fetchInventory = async () => {
    const snapshot = query(collection(firestore, "pantry"))
    const docs = await getDocs(snapshot)
    const inventoryData = [];
    docs.forEach((doc) => {
      const data = doc.data();
      console.log('Raw date:', data.date); // Log the date to see its format
  
      let itemDate;
      if (data.date && !isNaN(new Date(data.date).getTime())) {
        itemDate = new Date(data.date).toISOString().split('T')[0];
      } else {
        console.warn('Invalid date format:', data.date);
        itemDate = null;
      }
  
      inventoryData.push({
        name: doc.id,
        quantity: data.quantity,
        date: itemDate, 
      });
    });
  
    setInventory(inventoryData);
  }
  
  console.log(inventory);

  useEffect(() => {
    fetchInventory()
  }, [])

  const names = Array.isArray(inventory) ? inventory.map(({ name }) => name) : [];
  const quantities = Array.isArray(inventory) ? inventory.map(({ quantity }) => quantity) : [];

  // Filter and Sort inventory based on search query, sort option, and order
  const filteredInventory = Object.values(inventory).filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).sort((a, b) => {
      let comparison = 0

      if (sortOption === 'name') {
        if (a.name && b.name) {
          comparison = a.name.localeCompare(b.name);
        } else {
          comparison = 0
        } 
      } else if (sortOption === 'quantity') {
        comparison = a.quantity - b.quantity;
      } else if (sortOption === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
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
            <Typography variant="h4" component="h1" fontWeight="bold" style={{ color: "#0096FF", fontFamily: 'PT Sans' }}>
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
                  <MenuItem value="date">Date</MenuItem>
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
                Generate Recipe
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

                <Grid item xs={12} md={10}>
                  <AnimatedCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary.main" style={{ fontFamily: 'PT Sans' }}>
                        Pantry Inventory Overview
                      </Typography>
                      <BarChart
                        xAxis={[
                          {
                            scaleType: "band",
                            data: names,
                          },
                        ]}
                        series={[
                          {
                            data: quantities,
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
             <Grid 
              item xs={12}  
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
                    <AnalyticTable
                      inventory={filteredInventory}
                    />
                </CardContent>
              </AnimatedCard>
            </Grid>
          <GenerateRecipe
            open={openGenerateRecipe}
            onClose={() => setOpenGenerateRecipe(false)}
            inventoryItems={names}
          />
          </Box>
          </Box>
        </Container>
    </ThemeProvider>
  )
} 


