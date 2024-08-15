import React, { useState, useRef } from 'react';
import { Camera } from 'react-camera-pro';
import { Button, Box, Typography, TextField, Input } from '@mui/material';
import Image from 'next/image';
// import axios from 'axios';

const CameraComponent = ({ onDetection, inventoryItems, mode }) => {
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const captureImage = async () => {
    setError(null);
    const imageSrc = camera.current.takePhoto();
    setImage(imageSrc);
    setDetecting(true);
  
    try {
      const response = await fetch('/api/object-detection', {
        method: 'POST',
        image: imageSrc, 
        inventoryItems: inventoryItems
      });
      const detectedObject = response.data.detectedObject;
      console.log(response)
      console.log(detectedObject)
      
      if (mode === 'add_new' && detectedObject === 'none') {
        setError('No food item detected. Please try again or enter the name manually.');
      } else {
        onDetection(detectedObject);
      }
    } catch (error) {
      console.error('Error detecting object:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(`Server error: ${error.response.data.error}`);
      } else {
        setError('An error occurred while detecting the object');
      }
    } finally {
      setDetecting(false);
    }
  };

  const handleManualAdd = () => {
    if (newItemName.trim()) {
      onDetection(newItemName.trim());
    } else {
      setError('Please enter a name for the new item.');
    }
  };

  return (
    <Box borderRadius={60} sx={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      <Box borderRadius={60} sx={{ position: 'relative', paddingTop: '75%', overflow: 'hidden' }}>
        <Camera borderRadius={60}  ref={camera} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
      </Box>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={captureImage} 
        disabled={detecting} 
        fullWidth 
        sx={{ mt: 2 }}
      >
        {detecting ? 'Detecting...' : 'Capture and Detect'}
      </Button>
      {image && (
        <Box borderRadius={60} mt={2}>
          <Image src={image} alt="Captured" style={{ maxWidth: '100%' }} />
        </Box>
      )}
      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}
      {mode === 'add_new' && (
        <Box mt={2}>
          <Input
            fullWidth
            label="New Item Name"
            variant="soft"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleManualAdd}
            fullWidth
          >
            Add Manually
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CameraComponent;