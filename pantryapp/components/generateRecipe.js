import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  CircularProgress,
  Alert,
} from '@mui/material';

const GenerateRecipe = ({ open, onClose, inventoryItems }) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleCheckboxChange = (item) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(item)
        ? prevSelectedItems.filter((i) => i !== item)
        : [...prevSelectedItems, item]
    );
  };

  const getGenerateRecipe = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Sending request with ingredients:', selectedItems);
      const response = await fetch('/api/recipe-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: selectedItems }),
      });
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Received data:', data);
      setRecipe(data.recipe);
    } catch (error) {
      console.error('Error fetching recipe suggestion:', error.message);
      setError(`Failed to get recipe suggestion: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle variant={'h'} style={{ fontFamily: 'PT Sans' }}>Recipe Generator</DialogTitle>
      <DialogContent>
        <Typography variant="h6" style={{ fontFamily: 'PT Sans' }} gutterBottom>
          Available Ingredients:
        </Typography>
        <List dense>
          {inventoryItems.map((item) => (
            <ListItem key={item} onClick={() => handleCheckboxChange(item)}>
              <Checkbox
                checked={selectedItems.includes(item)}
                onChange={() => handleCheckboxChange(item)}
                color="primary"
              />
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : recipe ? (
          <>
            <Typography variant="h6" style={{ fontFamily: 'PT Sans', fontWeight: 'bold' }} gutterBottom>
              {recipe.name}
            </Typography>
            <Typography variant="subtitle1" style={{ fontFamily: 'PT Sans', fontWeight: 'bold' }} gutterBottom>
              Ingredients:
            </Typography>
            <List dense>
              {recipe.ingredients.map((ingredient, index) => (
                <ListItem key={index}>
                  <ListItemText primary={ingredient} />
                </ListItem>
              ))}
            </List>
            <Typography variant="subtitle1" style={{ fontFamily: 'PT Sans', fontWeight: 'bold' }} gutterBottom>
              Instructions:
            </Typography>
            <List dense>
              {recipe.steps.map((step, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${step}`} />
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <Typography>
            Click Get Recipe Suggestion to generate a recipe.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={getGenerateRecipe} color="primary" disabled={loading}>
          Get Recipe Suggestion
        </Button>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenerateRecipe;
