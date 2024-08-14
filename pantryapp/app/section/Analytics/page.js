"use client";

import DrawerAppBar from "@/components/navbar";
import { Box, Button } from '@mui/material';
import AnalyticsPage from "./analytics";



export default function TrackerPage() {
    return (
        <Box >
            <DrawerAppBar/>
            <AnalyticsPage/>
        </Box>
    );
}
