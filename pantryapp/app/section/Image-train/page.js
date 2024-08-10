import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import { loadModel, loadImage } from "@/api/image-processing";
import { Box, Container, Button, Typography } from "@mui/material";

export default function Home() {
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);

  const handleAnalyzeClick = async () => {
    const fileInput = document.getElementById("image-upload");
    const imageFile = fileInput.files[0];

    if (!imageFile) {
      alert("Please upload an image file.");
      return;
    }

    try {
      const image = await loadImage(imageFile);
      const predictions = await model.classify(image);
      setPredictions(predictions);
    } catch (error) {
      console.error('Error analyzing the image:', error);
    }
  };

    const handleModelLoad = async () => {
        try {
        const model = await loadModel();
        setModel(model);
        } catch (error) {
        console.error('Error loading the model:', error);
        }
    };

    return (
        <Box>
            <Container>
                <Head>
                    <Typography
                        variant="h2"
                    >
                        AI-Powered Web Application
                    </Typography>
                        <Box>
                            <Typography
                                variant="h4"
                            >
                                AI-Powered Web Application
                                Using Next.js and TensorFlow.js to show some AI model.
                            </Typography>
                            <Box>
                                <Input 
                                    type="file" 
                                    id="image-upload" 
                                />
                                <Button
                                 onClick={handleAnalyzeClick}
                                 >
                                    Analyze Image
                                </Button>
                            </Box>
                            <Box>
                                {predictions.length > 0 && (
                                    <ul>
                                    {predictions.map((pred, index) => (
                                        <li key={index}>
                                        {pred.className}: {(pred.probability * 100).toFixed(2)}%
                                        </li>
                                    ))}
                                    </ul>
                                )}
                            </Box>
                        </Box>
                </Head>
            </Container>
        </Box>
    )
};
