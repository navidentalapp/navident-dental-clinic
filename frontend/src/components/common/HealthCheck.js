import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CircularProgress,
  Chip,
  Alert
} from '@mui/material';
import api from '../../services/api';

const HealthCheck = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/health');
      setHealth(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Health check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Checking system health...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        System Health Check
      </Typography>
      
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">System Unavailable</Typography>
          <Typography variant="body2">Error: {error}</Typography>
        </Alert>
      ) : (
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="h6">Status:</Typography>
              <Chip 
                label={health?.status || 'UNKNOWN'} 
                color={health?.status === 'UP' ? 'success' : 'error'}
              />
            </Box>
            
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="h6">Database:</Typography>
              <Chip 
                label={health?.database || 'UNKNOWN'} 
                color={health?.database === 'UP' ? 'success' : 'error'}
              />
            </Box>
            
            <Typography variant="body2" color="textSecondary">
              <strong>Application:</strong> {health?.application}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Version:</strong> {health?.version}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Timestamp:</strong> {health?.timestamp}
            </Typography>
            
            {health?.database_error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Database Error: {health.database_error}
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default HealthCheck;
// This file is used to configure the API client for the application.