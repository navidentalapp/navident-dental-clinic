import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Box,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider
} from '@mui/material';
import { patientService } from '../../services/patientService';

const INSURANCE_AGENCIES = [
  'LIC of India',
  'HDFC ERGO',
  'ICICI Lombard',
  'Bajaj Allianz',
  'New India Assurance',
  'Oriental Insurance',
  'United India Insurance',
  'National Insurance',
  'Star Health Insurance',
  'Max Bupa',
  'Apollo Munich',
  'Religare',
  'Other'
];

const INSURANCE_STATUSES = ['ACTIVE', 'EXPIRED', 'CLAIMED', 'APPROVED'];

const InsuranceForm = ({ insurance, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    agencyName: '',
    policyNumber: '',
    policyEndDate: '',
    active: true,
    claimSubmitted: false,
    claimApproved: false,
    claimAmount: '',
    approvedClaimAmount: '',
    status: 'ACTIVE',
    treatmentDescription: ''
  });

  const [patients, setPatients] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPatients();
    
    if (insurance) {
      setFormData({
        patientId: insurance.patientId || '',
        agencyName: insurance.agencyName || '',
        policyNumber: insurance.policyNumber || '',
        policyEndDate: insurance.policyEndDate || '',
        active: insurance.active !== false,
        claimSubmitted: insurance.claimSubmitted || false,
        claimApproved: insurance.claimApproved || false,
        claimAmount: insurance.claimAmount || '',
        approvedClaimAmount: insurance.approvedClaimAmount || '',
        status: insurance.status || 'ACTIVE',
        treatmentDescription: insurance.treatmentDescription || ''
      });
    }
  }, [insurance]);

  const fetchPatients = async () => {
    try {
      const response = await patientService.getAll({ size: 100 });
      setPatients(response.data.content || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

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
    
    if (!formData.patientId) newErrors.patientId = 'Patient is required';
    if (!formData.agencyName) newErrors.agencyName = 'Agency name is required';
    if (!formData.policyNumber.trim()) newErrors.policyNumber = 'Policy number is required';
    if (!formData.policyEndDate) newErrors.policyEndDate = 'Policy end date is required';
    
    if (formData.claimSubmitted && !formData.claimAmount) {
      newErrors.claimAmount = 'Claim amount is required when claim is submitted';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const submitData = {
        ...formData,
        claimAmount: formData.claimAmount ? parseFloat(formData.claimAmount) : null,
        approvedClaimAmount: formData.approvedClaimAmount ? parseFloat(formData.approvedClaimAmount) : null
      };
      onSave(submitData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {/* Basic Insurance Information */}
        <Grid item xs={12}>
          <Typography variant="h6">Insurance Information</Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Patient"
            value={formData.patientId}
            onChange={(e) => handleChange('patientId', e.target.value)}
            error={!!errors.patientId}
            helperText={errors.patientId}
            required
          >
            {patients.map((patient) => (
              <MenuItem key={patient.id} value={patient.id}>
                {patient.firstName} {patient.lastName} - {patient.mobileNumber}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Insurance Agency"
            value={formData.agencyName}
            onChange={(e) => handleChange('agencyName', e.target.value)}
            error={!!errors.agencyName}
            helperText={errors.agencyName}
            required
          >
            {INSURANCE_AGENCIES.map((agency) => (
              <MenuItem key={agency} value={agency}>
                {agency}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Policy Number"
            value={formData.policyNumber}
            onChange={(e) => handleChange('policyNumber', e.target.value)}
            error={!!errors.policyNumber}
            helperText={errors.policyNumber}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Policy End Date"
            type="date"
            value={formData.policyEndDate}
            onChange={(e) => handleChange('policyEndDate', e.target.value)}
            error={!!errors.policyEndDate}
            helperText={errors.policyEndDate}
            InputLabelProps={{ shrink: true }}
            required
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
            {INSURANCE_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
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
            label="Active Policy"
          />
        </Grid>

        {/* Claim Information */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Claim Information</Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.claimSubmitted}
                onChange={(e) => handleChange('claimSubmitted', e.target.checked)}
                color="primary"
              />
            }
            label="Claim Submitted"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.claimApproved}
                onChange={(e) => handleChange('claimApproved', e.target.checked)}
                color="success"
                disabled={!formData.claimSubmitted}
              />
            }
            label="Claim Approved"
          />
        </Grid>
        
        {formData.claimSubmitted && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Claim Amount"
                type="number"
                value={formData.claimAmount}
                onChange={(e) => handleChange('claimAmount', e.target.value)}
                error={!!errors.claimAmount}
                helperText={errors.claimAmount}
                InputProps={{ startAdornment: '₹' }}
              />
            </Grid>
            
            {formData.claimApproved && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Approved Claim Amount"
                  type="number"
                  value={formData.approvedClaimAmount}
                  onChange={(e) => handleChange('approvedClaimAmount', e.target.value)}
                  InputProps={{ startAdornment: '₹' }}
                />
              </Grid>
            )}
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Treatment Description"
                value={formData.treatmentDescription}
                onChange={(e) => handleChange('treatmentDescription', e.target.value)}
                multiline
                rows={3}
                placeholder="Description of treatment for which claim is submitted"
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
              {insurance ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InsuranceForm;
