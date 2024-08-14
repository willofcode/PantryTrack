"use client";

import DrawerAppBar from "@/components/navbar";
import { Box, Button } from '@mui/material';
import Dashboard from "./tracking";



export default function TrackerPage() {
    return (
        <Box >
            <DrawerAppBar/>
            <Dashboard/>
        </Box>
    );
}
