import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  CalendarToday,
  Receipt,
  LocalHospital,
  Assignment,
  AccountBalance,
  Security,
  ExitToApp,
  ManageAccounts, // ✅ NEW ICON FOR USER MANAGEMENT
  MedicalServices
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Patients', icon: <People />, path: '/patients' },
  { text: 'Dentists', icon: <LocalHospital />, path: '/dentists' }, // ✅ FIXED
  { text: 'Appointments', icon: <CalendarToday />, path: '/appointments' },
  { text: 'Bills', icon: <Receipt />, path: '/bills' },
  { text: 'Treatments', icon: <MedicalServices />, path: '/treatments' },
  { text: 'Prescriptions', icon: <Assignment />, path: '/prescriptions' },
  { text: 'Finance', icon: <AccountBalance />, path: '/finance' },
  { text: 'Insurance', icon: <Security />, path: '/insurance' },
  { text: 'User Management', icon: <ManageAccounts />, path: '/users' }, // ✅ NEW MENU ITEM
];

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ✅ FILTER MENU ITEMS BASED ON USER ROLE
  const getFilteredMenuItems = () => {
    const userRole = user?.role || user?.authorities?.[0]?.authority?.replace('ROLE_', '');
    
    if (userRole === 'ADMINISTRATOR') {
      return menuItems; // Admins see all menu items
    }
    
    // Non-admin users don't see User Management
    return menuItems.filter(item => item.path !== '/users');
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          NAVIDENT
        </Typography>
      </Toolbar>
      <List>
        {getFilteredMenuItems().map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => handleNavigation(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon><ExitToApp /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dental Clinic Management
          </Typography>
          <Typography variant="body2">
            Welcome, {user?.username}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
