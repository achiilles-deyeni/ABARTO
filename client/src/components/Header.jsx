import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu'; // Example icon

// Receive drawerWidth and handleDrawerToggle as props if sidebar is toggleable
function Header({ drawerWidth = 240 }) { 
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        width: { sm: `calc(100% - ${drawerWidth}px)` }, // Adjust width to not overlap drawer on larger screens
        ml: { sm: `${drawerWidth}px` }, // Margin left same as drawer width on larger screens
      }}
    >
      <Toolbar>
        {/* Example: IconButton to toggle drawer on mobile - functionality added later */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          // onClick={handleDrawerToggle} // Add handler later
          sx={{ mr: 2, display: { sm: 'none' } }} // Only show on small screens
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          ABARTO Inventory Management
        </Typography>
        {/* Add User Menu/Logout button here later */}
      </Toolbar>
    </AppBar>
  );
}

export default Header; 