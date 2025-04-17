import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';

// Import Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory'; // Products
import PeopleIcon from '@mui/icons-material/People'; // Employees
import ScienceIcon from '@mui/icons-material/Science'; // Chemicals
import ConstructionIcon from '@mui/icons-material/Construction'; // Materials (Raw)
import SafetyCheckIcon from '@mui/icons-material/SafetyCheck'; // Safety Equipment
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'; // Machinery Parts
import WarehouseIcon from '@mui/icons-material/Warehouse'; // Industrial Supplies
import StorefrontIcon from '@mui/icons-material/Storefront'; // Wholesale Orders
import SecurityIcon from '@mui/icons-material/Security'; // Security Logs
import AssessmentIcon from '@mui/icons-material/Assessment'; // Reports
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'; // Admins
import SearchIcon from '@mui/icons-material/Search'; // Global Search

// Receive drawerWidth as prop
function Sidebar({ drawerWidth = 240 }) {
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Global Search', icon: <SearchIcon />, path: '/search' }, // Add Search
    { text: 'Products', icon: <InventoryIcon />, path: '/products' },
    { text: 'Employees', icon: <PeopleIcon />, path: '/employees' },
    { text: 'Raw Materials', icon: <ConstructionIcon />, path: '/materials' },
    { text: 'Chemicals', icon: <ScienceIcon />, path: '/chemicals' },
    { text: 'Safety Equip.', icon: <SafetyCheckIcon />, path: '/safety' },
    { text: 'Machinery Parts', icon: <PrecisionManufacturingIcon />, path: '/machinery' },
    { text: 'Supplies', icon: <WarehouseIcon />, path: '/supplies' },
    { text: 'Wholesale', icon: <StorefrontIcon />, path: '/wholesale' },
    { text: 'Security Logs', icon: <SecurityIcon />, path: '/security' },
    { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
    { text: 'Admins', icon: <AdminPanelSettingsIcon />, path: '/admins' },
  ];

  const drawerContent = (
    <div>
      <Toolbar /> {/* Necessary spacer to align content below AppBar */} 
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            {/* Use RouterLink with ListItemButton's component prop */}
            <ListItemButton component={RouterLink} to={item.path} >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {/* Optional second list for settings, logout etc. */}
    </div>
  );

  return (
    <Drawer
      variant="permanent" // Or "temporary" for mobile toggle
      sx={{
        display: { xs: 'none', sm: 'block' }, // Hide on extra small screens
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
      open // Permanent drawer is always open
    >
      {drawerContent}
    </Drawer>
    // Add a temporary drawer for mobile later
  );
}

export default Sidebar; 