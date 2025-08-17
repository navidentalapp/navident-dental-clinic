import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  LinearProgress
} from '@mui/material';

const PasswordChangeForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: 'default' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const strength = {
      0: { label: 'Very Weak', color: 'error' },
      1: { label: 'Weak', color: 'error' },
      2: { label: 'Fair', color: 'warning' },
      3: { label: 'Good', color: 'info' },
      4: { label: 'Strong', color: 'success' },
      5: { label: 'Very Strong', color: 'success' }
    };
    
    return { score: (score / 5) * 100, ...strength[score] };
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        await onSave({ password: formData.newPassword });
      } finally {
        setLoading(false);
      }
    }
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="body2">
              Choose a strong password for better security. The user will be able to change this password after logging in.
            </Typography>
          </Alert>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={formData.newPassword}
            onChange={(e) => handleChange('newPassword', e.target.value)}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            required
          />
          
          {formData.newPassword && (
            <Box sx={{ mt: 1 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="caption">Password Strength:</Typography>
                <Typography variant="caption" color={passwordStrength.color}>
                  {passwordStrength.label}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={passwordStrength.score}
                color={passwordStrength.color}
                sx={{ mt: 0.5 }}
              />
            </Box>
          )}
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PasswordChangeForm;
