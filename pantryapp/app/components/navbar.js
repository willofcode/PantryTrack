import React from 'react'
import { Link } from next/link
import { AppBar, Toolbar, Typography, Button } from '@mui/material'

function navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Demo
        </Typography>
        <Button color="inherit" component={Link} href="/inventory">
          Sign In
        </Button>
      </Toolbar >   
    </AppBar>
  )
}

export default navbar