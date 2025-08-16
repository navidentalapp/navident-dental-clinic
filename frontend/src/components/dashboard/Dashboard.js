import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider
} from '@mui/material';
import {
  People,
  CalendarToday,
  Receipt,
  LocalHospital,
  PersonAdd,
  AttachMoney,
  Assignment,
  Security,
  MedicalServices,
  ManageAccounts // ✅ ADDED MISSING IMPORT
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingBills: 0,
    totalTreatments: 0,
    totalDentists: 0,
    activePrescriptions: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch stats from various endpoints
      const [patients, appointments, bills, dentists] = await Promise.all([
        api.get('/patients?size=1'),
        api.get('/appointments/today'),
        api.get('/bills?size=1'),
        api.get('/dentists?size=1')
      ]);

      setStats({
        totalPatients: patients.data.totalElements || 0,
        todayAppointments: appointments.data?.length || 0,
        pendingBills: bills.data.totalElements || 0,
        totalTreatments: 8, // Mock data
        totalDentists: dentists.data.totalElements || 0,
        activePrescriptions: 15 // Mock data
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const handleStatClick = (path) => {
    navigate(path);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'add-patient':
        navigate('/patients');
        break;
      case 'add-dentist':
        navigate('/dentists');
        break;
      case 'schedule-appointment':
        navigate('/appointments');
        break;
      case 'create-bill':
        navigate('/bills');
        break;
      case 'manage-treatments':
        navigate('/treatments');
        break;
      case 'prescriptions':
        navigate('/prescriptions');
        break;
      case 'finance':
        navigate('/finance');
        break;
      case 'insurance':
        navigate('/insurance');
        break;
      case 'user-management': // ✅ ADDED USER MANAGEMENT CASE
        navigate('/users');
        break;
      default:
        break;
    }
  };

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: <People fontSize="large" />,
      color: '#1976d2',
      path: '/patients'
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: <CalendarToday fontSize="large" />,
      color: '#388e3c',
      path: '/appointments'
    },
    {
      title: 'Pending Bills',
      value: stats.pendingBills,
      icon: <Receipt fontSize="large" />,
      color: '#f57c00',
      path: '/bills'
    },
    {
      title: 'Total Dentists',
      value: stats.totalDentists,
      icon: <LocalHospital fontSize="large" />,
      color: '#d32f2f',
      path: '/dentists'
    },
    {
      title: 'Active Treatments',
      value: stats.totalTreatments,
      icon: <MedicalServices fontSize="large" />,
      color: '#7b1fa2',
      path: '/treatments'
    },
    {
      title: 'Active Prescriptions',
      value: stats.activePrescriptions,
      icon: <Assignment fontSize="large" />,
      color: '#00796b',
      path: '/prescriptions'
    }
  ];

  const quickActions = [
    { icon: <PersonAdd />, text: 'Add New Patient', action: 'add-patient' },
    { icon: <LocalHospital />, text: 'Add New Dentist', action: 'add-dentist' },
    { icon: <CalendarToday />, text: 'Schedule Appointment', action: 'schedule-appointment' },
    { icon: <Receipt />, text: 'Create Bill', action: 'create-bill' },
    { icon: <Assignment />, text: 'Write Prescription', action: 'prescriptions' },
    { icon: <MedicalServices />, text: 'Manage Treatments', action: 'manage-treatments' },
    { icon: <AttachMoney />, text: 'Finance Management', action: 'finance' },
    { icon: <Security />, text: 'Insurance Claims', action: 'insurance' },
    { icon: <ManageAccounts />, text: 'User Management', action: 'user-management' } // ✅ ADDED WITH CORRECT IMPORT
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ cursor: 'pointer', '&:hover': { elevation: 4 } }}
              onClick={() => handleStatClick(card.path)}
            >
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center"
                    sx={{ 
                      backgroundColor: card.color, 
                      color: 'white', 
                      borderRadius: 2, 
                      p: 1, 
                      mr: 2 
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Box>
                    <Typography variant="h4" component="div">
                      {card.value}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {card.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <List>
              {quickActions.map((action, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton onClick={() => handleQuickAction(action.action)}>
                    <ListItemIcon>{action.icon}</ListItemIcon>
                    <ListItemText primary={action.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        
        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Recent patient registrations, appointments, and financial activities will appear here.
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2">• Patient John Doe registered today</Typography>
              <Typography variant="body2">• Dr. Smith has 3 appointments scheduled</Typography>
              <Typography variant="body2">• 2 bills generated this morning</Typography>
              <Typography variant="body2">• Monthly revenue target: 80% achieved</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
