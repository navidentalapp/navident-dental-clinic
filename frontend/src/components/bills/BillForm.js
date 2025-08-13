import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Box
} from '@mui/material';
import { patientService } from '../../services/patientService';
import api from '../../services/api';

const PAYMENT_STATUSES = ['PAID', 'PENDING', 'CANCELLED'];

const BillForm = ({ bill, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    billId: '',
    patientId: '',
    patientName: '',
    dentistId: '',
    dentistName: '',
    billDate: new Date().toISOString().split('T')[0],
    amountDue: '',
    amountPaid: '0',
    dueDate: '',
    paymentStatus: 'PENDING'
  });

  const [patients, setPatients] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPatients();
    fetchDentists();
    
    if (bill) {
      setFormData({
        billId: bill.billId || '',
        patientId: bill.patientId || '',
        patientName: bill.patientName || '',
        dentistId: bill.dentistId || '',
        dentistName: bill.dentistName || '',
        billDate: bill.billDate || '',
        amountDue: bill.amountDue || '',
        amountPaid: bill.amountPaid || '0',
        dueDate: bill.dueDate || '',
        paymentStatus: bill.paymentStatus || 'PENDING'
      });
    } else {
      // Generate bill ID for new bills
      setFormData(prev => ({
        ...prev,
        billId: `BILL-${Date.now()}`
      }));
    }
  }, [bill]);

  const fetchPatients = async () => {
    try {
      const response = await patientService.getAll({ size: 100 });
      setPatients(response.data.content || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchDentists = async () => {
    try {
      const response = await api.get('/dentists', { params: { size: 100 } });
      setDentists(response.data.content || []);
    } catch (error) {
      console.error('Error fetching dentists:', error);
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

  const handlePatientChange = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    setFormData(prev => ({
      ...prev,
      patientId,
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : ''
    }));
  };

  const handleDentistChange = (dentistId) => {
    const dentist = dentists.find(d => d.id === dentistId);
    setFormData(prev => ({
      ...prev,
      dentistId,
      dentistName: dentist ? `${dentist.firstName} ${dentist.lastName}` : ''
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.billId.trim()) newErrors.billId = 'Bill ID is required';
    if (!formData.patientId) newErrors.patientId = 'Patient is required';
    if (!formData.dentistId) newErrors.dentistId = 'Dentist is required';
    if (!formData.amountDue || parseFloat(formData.amountDue) <= 0) {
      newErrors.amountDue = 'Valid amount due is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const submitData = {
        ...formData,
        amountDue: parseFloat(formData.amountDue),
        amountPaid: parseFloat(formData.amountPaid) || 0
      };
      onSave(submitData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Bill ID"
            value={formData.billId}
            onChange={(e) => handleChange('billId', e.target.value)}
            error={!!errors.billId}
            helperText={errors.billId}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Bill Date"
            type="date"
            value={formData.billDate}
            onChange={(e) => handleChange('billDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Patient"
            value={formData.patientId}
            onChange={(e) => handlePatientChange(e.target.value)}
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
            label="Dentist"
            value={formData.dentistId}
            onChange={(e) => handleDentistChange(e.target.value)}
            error={!!errors.dentistId}
            helperText={errors.dentistId}
            required
          >
            {dentists.map((dentist) => (
              <MenuItem key={dentist.id} value={dentist.id}>
                Dr. {dentist.firstName} {dentist.lastName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Amount Due"
            type="number"
            value={formData.amountDue}
            onChange={(e) => handleChange('amountDue', e.target.value)}
            error={!!errors.amountDue}
            helperText={errors.amountDue}
            InputProps={{ startAdornment: '₹' }}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Amount Paid"
            type="number"
            value={formData.amountPaid}
            onChange={(e) => handleChange('amountPaid', e.target.value)}
            InputProps={{ startAdornment: '₹' }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Payment Status"
            value={formData.paymentStatus}
            onChange={(e) => handleChange('paymentStatus', e.target.value)}
          >
            {PAYMENT_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
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
              {bill ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BillForm;
