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

const APPOINTMENT_STATUSES = ['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
];

const AppointmentForm = ({ appointment, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    dentistId: '',
    dentistName: '',
    appointmentDate: '',
    appointmentTime: '',
    status: 'SCHEDULED',
    notes: ''
  });

  const [patients, setPatients] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPatients();
    fetchDentists();
    
    if (appointment) {
      setFormData({
        patientId: appointment.patientId || '',
        patientName: appointment.patientName || '',
        dentistId: appointment.dentistId || '',
        dentistName: appointment.dentistName || '',
        appointmentDate: appointment.appointmentDate || '',
        appointmentTime: appointment.appointmentTime || '',
        status: appointment.status || 'SCHEDULED',
        notes: appointment.notes || ''
      });
    }
  }, [appointment]);

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
    
    // Clear error when user starts typing
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
    if (!formData.appointmentDate) newErrors.appointmentDate = 'Date is required';
    if (!formData.appointmentTime) newErrors.appointmentTime = 'Time is required';
    
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
            label="Appointment Date"
            type="date"
            value={formData.appointmentDate}
            onChange={(e) => handleChange('appointmentDate', e.target.value)}
            error={!!errors.appointmentDate}
            helperText={errors.appointmentDate}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Appointment Time"
            value={formData.appointmentTime}
            onChange={(e) => handleChange('appointmentTime', e.target.value)}
            error={!!errors.appointmentTime}
            helperText={errors.appointmentTime}
            required
          >
            {TIME_SLOTS.map((time) => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            {APPOINTMENT_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
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
              {appointment ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AppointmentForm;
