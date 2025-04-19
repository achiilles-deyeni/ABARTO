import React from 'react';
import { Outlet } from 'react-router-dom'; // Outlet renders the matched child route element
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Header from './Header';
import Sidebar from './Sidebar';

const drawerWidth = 240; // Define drawer width here or import from a config file

function Layout() {
  // State for mobile drawer toggle can be added here later

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Header */}
      <Header drawerWidth={drawerWidth} />
      
      {/* Sidebar */}
      <Sidebar drawerWidth={drawerWidth} />
      
      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3, // Padding
          width: { sm: `calc(100% - ${drawerWidth}px)` } // Adjust width based on drawer
        }}
      >
        {/* Toolbar spacer to push content below the fixed AppBar */}
        <Toolbar /> 
        
        {/* Content from child routes will render here */}
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout; 