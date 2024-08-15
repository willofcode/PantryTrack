"use client";

import DrawerAppBar from "@/components/navbar";
import { Box} from '@mui/material';
import Dashboard from "./tracking";



export default function TrackerPage() {
    return (
        <Box >
            <DrawerAppBar/>
            <Dashboard/>
        </Box>
    );
}
