import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Box,
  FormControlLabel,
  Checkbox
} from '@mui/material';

const TREATMENT_CATEGORIES = [
  'General Dentistry',
  'Cosmetic Dentistry', 
  'Orthodontics',
  'Oral Surgery',
  'Periodontics',
  'Endodontics',
  'Prosthodontics',
  'Pediatric Dentistry',
  'Emergency Treatment'
];

const TreatmentForm = ({ treatment, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    treatmentName: '',
    category: '',
    description: '',
    availableForBooking: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (treatment) {
      setFormData({
        treatmentName: treatment.treatmentName || '',
        category: treatment.category || '',
        description: treatment.description || '',
        availableForBooking: treatment.availableForBooking !== false
      });
    }
  }, [treatment]);

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
    
    if (!formData.treatmentName.trim()) newErrors.treatmentName = 'Treatment name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Treatment Name"
            value={formData.treatmentName}
            onChange={(e) => handleChange('treatmentName', e.target.value)}
            error={!!errors.treatmentName}
            helperText={errors.treatmentName}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Category"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            error={!!errors.category}
            helperText={errors.category}
            required
          >
            {TREATMENT_CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.availableForBooking}
                onChange={(e) => handleChange('availableForBooking', e.target.checked)}
                color="primary"
              />
            }
            label="Available for Booking"
          />
        </Grid>
        
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
              {treatment ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TreatmentForm;
