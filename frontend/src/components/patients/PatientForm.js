import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Box,
  Chip,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select
} from '@mui/material';

const GENDERS = ['M', 'F', 'Other'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const COMMON_ALLERGIES = ['Penicillin', 'Aspirin', 'Latex', 'Nuts', 'Shellfish', 'Dairy'];

const PatientForm = ({ patient, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    gender: '',
    bloodGroup: '',
    dateOfBirth: '',
    allergies: [],
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India'
    }
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (patient) {
      setFormData({
        firstName: patient.firstName || '',
        lastName: patient.lastName || '',
        email: patient.email || '',
        mobileNumber: patient.mobileNumber || '',
        gender: patient.gender || '',
        bloodGroup: patient.bloodGroup || '',
        dateOfBirth: patient.dateOfBirth || '',
        allergies: patient.allergies || [],
        address: {
          street: patient.address?.street || '',
          city: patient.address?.city || '',
          state: patient.address?.state || '',
          postalCode: patient.address?.postalCode || '',
          country: patient.address?.country || 'India'
        }
      });
    }
  }, [patient]);

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be 10 digits';
    }
    if (!formData.gender) newErrors.gender = 'Gender is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const handleAllergyChange = (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      allergies: typeof value === 'string' ? value.split(',') : value
    }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12}>
          <h3>Personal Information</h3>
        </Grid>
        
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
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Mobile Number"
            value={formData.mobileNumber}
            onChange={(e) => handleChange('mobileNumber', e.target.value)}
            error={!!errors.mobileNumber}
            helperText={errors.mobileNumber}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            select
            label="Gender"
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            error={!!errors.gender}
            helperText={errors.gender}
            required
          >
            {GENDERS.map((gender) => (
              <MenuItem key={gender} value={gender}>
                {gender}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            select
            label="Blood Group"
            value={formData.bloodGroup}
            onChange={(e) => handleChange('bloodGroup', e.target.value)}
          >
            {BLOOD_GROUPS.map((group) => (
              <MenuItem key={group} value={group}>
                {group}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Allergies</InputLabel>
            <Select
              multiple
              value={formData.allergies}
              onChange={handleAllergyChange}
              input={<OutlinedInput label="Allergies" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {COMMON_ALLERGIES.map((allergy) => (
                <MenuItem key={allergy} value={allergy}>
                  {allergy}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Address Information */}
        <Grid item xs={12}>
          <h3>Address Information</h3>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Street Address"
            value={formData.address.street}
            onChange={(e) => handleChange('address.street', e.target.value)}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            value={formData.address.city}
            onChange={(e) => handleChange('address.city', e.target.value)}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="State"
            value={formData.address.state}
            onChange={(e) => handleChange('address.state', e.target.value)}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Postal Code"
            value={formData.address.postalCode}
            onChange={(e) => handleChange('address.postalCode', e.target.value)}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Country"
            value={formData.address.country}
            onChange={(e) => handleChange('address.country', e.target.value)}
          />
        </Grid>
        
        {/* Action Buttons */}
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
              {patient ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientForm;
