"use client";

import DrawerAppBar from "@/components/navbar";
import InventoryTracker from "./tracklist";
import { Box, Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';



export default function TrackerPage() {
    return (
        <Box >
            <DrawerAppBar/>
            <InventoryTracker/>
        </Box>
    );
}
