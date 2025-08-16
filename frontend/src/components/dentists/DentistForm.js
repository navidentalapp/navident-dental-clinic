import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Box,
  FormControlLabel,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  Alert,
  Typography // ✅ ADDED MISSING IMPORT
} from '@mui/material';

const SPECIALIZATIONS = [
  'General Dentistry', 'Orthodontics', 'Endodontics', 'Periodontics', 
  'Oral Surgery', 'Prosthodontics', 'Pediatric Dentistry', 'Cosmetic Dentistry',
  'Oral Pathology', 'Dental Implants'
];

const DentistForm = ({ dentist, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    licenseNumber: '',
    email: '',
    mobileNumber: '',
    specializations: [],
    active: true,
    chiefDentist: false,
    qualification: '',
    experienceYears: '',
    consultationFee: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (dentist) {
      setFormData({
        firstName: dentist.firstName || '',
        lastName: dentist.lastName || '',
        licenseNumber: dentist.licenseNumber || '',
        email: dentist.email || '',
        mobileNumber: dentist.mobileNumber || '',
        specializations: dentist.specializations || [],
        active: dentist.active !== false,
        chiefDentist: dentist.chiefDentist || false,
        qualification: dentist.qualification || '',
        experienceYears: dentist.experienceYears || '',
        consultationFee: dentist.consultationFee || ''
      });
    }
  }, [dentist]);

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

  const handleSpecializationChange = (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      specializations: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
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
    if (formData.specializations.length === 0) {
      newErrors.specializations = 'At least one specialization is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const submitData = {
        ...formData,
        experienceYears: formData.experienceYears ? parseInt(formData.experienceYears) : null
      };
      onSave(submitData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12}>
          <Typography variant="h6">Personal Information</Typography>
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
            label="License Number"
            value={formData.licenseNumber}
            onChange={(e) => handleChange('licenseNumber', e.target.value)}
            error={!!errors.licenseNumber}
            helperText={errors.licenseNumber}
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

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Qualification"
            value={formData.qualification}
            onChange={(e) => handleChange('qualification', e.target.value)}
            placeholder="e.g., BDS, MDS"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Experience (Years)"
            type="number"
            value={formData.experienceYears}
            onChange={(e) => handleChange('experienceYears', e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Consultation Fee"
            value={formData.consultationFee}
            onChange={(e) => handleChange('consultationFee', e.target.value)}
            placeholder="e.g., ₹500"
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.specializations}>
            <InputLabel>Specializations</InputLabel>
            <Select
              multiple
              value={formData.specializations}
              onChange={handleSpecializationChange}
              input={<OutlinedInput label="Specializations" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {SPECIALIZATIONS.map((spec) => (
                <MenuItem key={spec} value={spec}>
                  {spec}
                </MenuItem>
              ))}
            </Select>
            {errors.specializations && (
              <p style={{ color: '#d32f2f', fontSize: '0.75rem', margin: '3px 14px 0' }}>
                {errors.specializations}
              </p>
            )}
          </FormControl>
        </Grid>

        {/* Status and Role */}
        <Grid item xs={12}>
          <Typography variant="h6">Status & Role</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.active}
                onChange={(e) => handleChange('active', e.target.checked)}
                color="primary"
              />
            }
            label="Active"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.chiefDentist}
                onChange={(e) => handleChange('chiefDentist', e.target.checked)}
                color="warning"
              />
            }
            label="Chief Dentist"
          />
          {formData.chiefDentist && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              Making this dentist the Chief Dentist will remove the title from any other dentist.
            </Alert>
          )}
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
              {dentist ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DentistForm;
