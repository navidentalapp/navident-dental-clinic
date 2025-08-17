import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import { patientService } from '../../services/patientService';
import toast from 'react-hot-toast';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await patientService.getById(id);
      setPatient(response.data);
    } catch (error) {
      console.error('Error fetching patient:', error);
      toast.error('Failed to fetch patient details');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePdf = async () => {
    try {
      const response = await patientService.generatePdf(id);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(url);
      toast.success('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('PDF generation failed');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!patient) return <div>Patient not found</div>;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/patients')}
        >
          Back to Patients
        </Button>
        <Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            sx={{ mr: 1 }}
            onClick={() => navigate(`/patients/${id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            startIcon={<PdfIcon />}
            onClick={handleGeneratePdf}
          >
            Generate PDF
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {patient.firstName} {patient.lastName}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{patient.email}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Mobile Number
                  </Typography>
                  <Typography variant="body1">{patient.mobileNumber}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Gender
                  </Typography>
                  <Chip 
                    label={patient.gender} 
                    color={patient.gender === 'M' ? 'primary' : 'secondary'}
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Blood Group
                  </Typography>
                  <Typography variant="body1">{patient.bloodGroup}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Date of Birth
                  </Typography>
                  <Typography variant="body1">{patient.dateOfBirth}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Address
              </Typography>
              <Typography variant="body1">
                {patient.address?.street}<br />
                {patient.address?.city}, {patient.address?.state} {patient.address?.postalCode}<br />
                {patient.address?.country}
              </Typography>

              {patient.allergies && patient.allergies.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Allergies
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {patient.allergies.map((allergy, index) => (
                      <Chip key={index} label={allergy} color="warning" size="small" />
                    ))}
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <List>
                <ListItem button onClick={() => navigate(`/appointments/new?patient=${id}`)}>
                  <ListItemText primary="Schedule Appointment" />
                </ListItem>
                <ListItem button onClick={() => navigate(`/prescriptions/new?patient=${id}`)}>
                  <ListItemText primary="Create Prescription" />
                </ListItem>
                <ListItem button onClick={() => navigate(`/bills/new?patient=${id}`)}>
                  <ListItemText primary="Generate Bill" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientDetail;
