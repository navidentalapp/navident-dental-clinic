import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Alert,
  FormControlLabel,
  Switch,
  Card,
  CardContent
} from '@mui/material';

const USER_ROLES = [
  { value: 'ADMINISTRATOR', label: 'Administrator', description: 'Full system access including user management' },
  { value: 'CHIEF_DENTIST', label: 'Chief Dentist', description: 'Clinical management and reporting access' },
  { value: 'CLINIC_ASSISTANT', label: 'Clinic Assistant', description: 'Patient and appointment management' },
  { value: 'PRINTING_ONLY', label: 'Printing Only', description: 'View and print reports only' }
];

const UserForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    role: 'CLINIC_ASSISTANT',
    active: true,
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || 'CLINIC_ASSISTANT',
        active: user.active !== false,
        password: '',
        confirmPassword: ''
      });
    }
  }, [user]);

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

  const validate = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.role) newErrors.role = 'Role is required';
    
    // Password validation for new users only
    if (!user) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirm password is required';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const submitData = { ...formData };
      if (user) {
        // Remove password fields for updates (use separate password change)
        delete submitData.password;
        delete submitData.confirmPassword;
      }
      onSave(submitData);
    }
  };

  const selectedRole = USER_ROLES.find(role => role.value === formData.role);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">User Information</Typography>
        </Grid>
        
        {user && (
          <Grid item xs={12}>
            <Alert severity="info">
              To change password, use the "Change Password" button from the user list.
            </Alert>
          </Grid>
        )}
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Username"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            error={!!errors.username}
            helperText={errors.username || 'Unique identifier for login'}
            disabled={!!user} // Don't allow username changes for existing users
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Role"
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            error={!!errors.role}
            helperText={errors.role}
            required
          >
            {USER_ROLES.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                {role.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        {selectedRole && (
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  <strong>Role Description:</strong> {selectedRole.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            error={!!errors.firstName}
            helperText={errors.firstName}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            error={!!errors.lastName}
            helperText={errors.lastName}
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email || 'Used for notifications and account recovery'}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.active}
                onChange={(e) => handleChange('active', e.target.checked)}
                color="success"
              />
            }
            label={
              <Box>
                <Typography variant="body1">
                  User Active Status
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {formData.active ? 'User can login to the system' : 'User cannot login (account disabled)'}
                </Typography>
              </Box>
            }
          />
        </Grid>

        {!user && (
          <>
            <Grid item xs={12}>
              <Typography variant="h6">Set Initial Password</Typography>
              <Typography variant="body2" color="textSecondary">
                The user can change this password after first login
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                error={!!errors.password}
                helperText={errors.password || 'Minimum 6 characters'}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                required
              />
            </Grid>
          </>
        )}
        
        <Grid item xs={12}>
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
            >
              {user ? 'Update User' : 'Create User'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserForm;
