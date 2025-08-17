import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Box
} from '@mui/material';

const CATEGORIES = ['REVENUE', 'EXPENSE'];
const REVENUE_TYPES = [
  'Consultation Fee',
  'Treatment Fee',
  'Surgery Fee',
  'Emergency Treatment',
  'Follow-up Fee',
  'Other Income'
];

const EXPENSE_TYPES = [
  'Medical Supplies',
  'Equipment Purchase',
  'Equipment Maintenance',
  'Rent',
  'Utilities',
  'Staff Salary',
  'Marketing',
  'Insurance',
  'Laboratory Costs',
  'Other Expenses'
];

const STATUSES = ['PENDING', 'COMPLETED', 'CANCELLED'];

const FinanceForm = ({ finance, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    transactionDate: new Date().toISOString().split('T')[0],
    category: 'EXPENSE',
    type: '',
    amount: '',
    vendorName: '',
    description: '',
    status: 'COMPLETED'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (finance) {
      setFormData({
        transactionDate: finance.transactionDate || new Date().toISOString().split('T')[0],
        category: finance.category || 'EXPENSE',
        type: finance.type || '',
        amount: finance.amount || '',
        vendorName: finance.vendorName || '',
        description: finance.description || '',
        status: finance.status || 'COMPLETED'
      });
    }
  }, [finance]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear type when category changes
    if (field === 'category') {
      setFormData(prev => ({
        ...prev,
        type: ''
      }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      onSave(submitData);
    }
  };

  const getTypeOptions = () => {
    return formData.category === 'REVENUE' ? REVENUE_TYPES : EXPENSE_TYPES;
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Transaction Date"
            type="date"
            value={formData.transactionDate}
            onChange={(e) => handleChange('transactionDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
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
            {CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Type"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            error={!!errors.type}
            helperText={errors.type}
            required
          >
            {getTypeOptions().map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            error={!!errors.amount}
            helperText={errors.amount}
            InputProps={{ startAdornment: '₹' }}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Vendor/Source Name"
            value={formData.vendorName}
            onChange={(e) => handleChange('vendorName', e.target.value)}
            placeholder={formData.category === 'REVENUE' ? 'Patient/Insurance' : 'Vendor/Supplier'}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            {STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={3}
            placeholder="Detailed description of the transaction"
            required
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
              {finance ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinanceForm;
