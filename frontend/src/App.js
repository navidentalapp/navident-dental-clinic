import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import HealthCheck from './components/common/HealthCheck'; // ✅ NEW IMPORT
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import PatientList from './components/patients/PatientList';
import DentistList from './components/dentists/DentistList';
import AppointmentList from './components/appointments/AppointmentList';
import BillList from './components/bills/BillList';
import TreatmentList from './components/treatments/TreatmentList';
import PrescriptionList from './components/prescriptions/PrescriptionList';
import FinanceList from './components/finance/FinanceList';
import InsuranceList from './components/insurance/InsuranceList';
import UserList from './components/users/UserList';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* ✅ PUBLIC ROUTES */}
              <Route path="/health" element={<HealthCheck />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* ✅ PROTECTED ROUTES */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <PatientList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dentists"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <DentistList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <AppointmentList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bills"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <BillList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/treatments"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <TreatmentList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/prescriptions"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <PrescriptionList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/finance"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <FinanceList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/insurance"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <InsuranceList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <UserList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
