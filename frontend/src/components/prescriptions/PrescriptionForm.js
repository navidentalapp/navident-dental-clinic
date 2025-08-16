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
import { patientService } from '../../services/patientService';
import { dentistService } from '../../services/dentistService';

const PRESCRIPTION_STATUSES = ['ACTIVE', 'COMPLETED', 'EXPIRED'];

const PrescriptionForm = ({ prescription, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    dentistId: '',
    dentistName: '',
    prescriptionDate: new Date().toISOString().split('T')[0],
    diagnosis: '',
    medications: '',
    notes: '',
    requiresFollowUp: false,
    status: 'ACTIVE'
  });

  const [patients, setPatients] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPatients();
    fetchDentists();
    
    if (prescription) {
      setFormData({
        patientId: prescription.patientId || '',
        patientName: prescription.patientName || '',
        dentistId: prescription.dentistId || '',
        dentistName: prescription.dentistName || '',
        prescriptionDate: prescription.prescriptionDate || new Date().toISOString().split('T')[0],
        diagnosis: prescription.diagnosis || '',
        medications: prescription.medications || '',
        notes: prescription.notes || '',
        requiresFollowUp: prescription.requiresFollowUp || false,
        status: prescription.status || 'ACTIVE'
      });
    }
  }, [prescription]);

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
      const response = await dentistService.getAll({ size: 100 });
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
    
    if (!formData.patientId) newErrors.patientId = 'Patient is required';
    if (!formData.dentistId) newErrors.dentistId = 'Dentist is required';
    if (!formData.diagnosis.trim()) newErrors.diagnosis = 'Diagnosis is required';
    if (!formData.medications.trim()) newErrors.medications = 'Medications are required';
    
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
            label="Prescription Date"
            type="date"
            value={formData.prescriptionDate}
            onChange={(e) => handleChange('prescriptionDate', e.target.value)}
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
            {PRESCRIPTION_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Diagnosis"
            value={formData.diagnosis}
            onChange={(e) => handleChange('diagnosis', e.target.value)}
            error={!!errors.diagnosis}
            helperText={errors.diagnosis}
            multiline
            rows={2}
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Medications"
            value={formData.medications}
            onChange={(e) => handleChange('medications', e.target.value)}
            error={!!errors.medications}
            helperText={errors.medications}
            multiline
            rows={3}
            placeholder="List all prescribed medications with dosage and instructions"
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            multiline
            rows={2}
            placeholder="Additional notes or instructions"
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.requiresFollowUp}
                onChange={(e) => handleChange('requiresFollowUp', e.target.checked)}
                color="primary"
              />
            }
            label="Requires Follow-up"
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
              {prescription ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PrescriptionForm;
