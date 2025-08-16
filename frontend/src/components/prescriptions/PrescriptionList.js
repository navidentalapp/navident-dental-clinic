import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Fab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import { prescriptionService } from '../../services/prescriptionService';
import PrescriptionForm from './PrescriptionForm';
import toast from 'react-hot-toast';

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const response = await prescriptionService.getAll({
        page: 0,
        size: 50,
        sortBy: 'prescriptionDate',
        sortDir: 'desc'
      });
      setPrescriptions(response.data.content || []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error('Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchPrescriptions();
      return;
    }

    setLoading(true);
    try {
      const response = await prescriptionService.search(searchQuery);
      setPrescriptions(response.data || []);
    } catch (error) {
      console.error('Error searching prescriptions:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPrescription = () => {
    setSelectedPrescription(null);
    setOpenDialog(true);
  };

  const handleEditPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setOpenDialog(true);
  };

  const handleDeletePrescription = async (id) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      try {
        await prescriptionService.delete(id);
        toast.success('Prescription deleted successfully');
        fetchPrescriptions();
      } catch (error) {
        console.error('Error deleting prescription:', error);
        toast.error('Failed to delete prescription');
      }
    }
  };

  const handleSavePrescription = async (prescriptionData) => {
    try {
      if (selectedPrescription) {
        await prescriptionService.update(selectedPrescription.id, prescriptionData);
        toast.success('Prescription updated successfully');
      } else {
        await prescriptionService.create(prescriptionData);
        toast.success('Prescription created successfully');
      }
      setOpenDialog(false);
      fetchPrescriptions();
    } catch (error) {
      console.error('Error saving prescription:', error);
      toast.error('Failed to save prescription');
    }
  };

  const handleGeneratePdf = async (prescriptionId) => {
    try {
      const response = await prescriptionService.generatePdf(prescriptionId);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(url);
      toast.success('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('PDF generation failed');
    }
  };

  const handleExportExcel = async () => {
    try {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      const endDate = today.toISOString().split('T');
      
      const response = await prescriptionService.exportExcel(startDate, endDate);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'prescriptions.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Export successful');
    } catch (error) {
      console.error('Error exporting:', error);
      toast.error('Export failed');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'COMPLETED': return 'info';
      case 'EXPIRED': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Prescriptions
        </Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleExportExcel}
          sx={{ mr: 1 }}
        >
          Export Excel
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              label="Search prescriptions..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              sx={{ flexGrow: 1 }}
            />
            <IconButton onClick={handleSearch} color="primary">
              <SearchIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Dentist</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Diagnosis</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Follow-up</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prescriptions.map((prescription) => (
              <TableRow key={prescription.id}>
                <TableCell>{prescription.patientName}</TableCell>
                <TableCell>{prescription.dentistName}</TableCell>
                <TableCell>{prescription.prescriptionDate}</TableCell>
                <TableCell>{prescription.diagnosis}</TableCell>
                <TableCell>
                  <Chip 
                    label={prescription.status || 'ACTIVE'} 
                    color={getStatusColor(prescription.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={prescription.requiresFollowUp ? 'Required' : 'Not Required'} 
                    color={prescription.requiresFollowUp ? 'warning' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditPrescription(prescription)}
                    color="primary"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeletePrescription(prescription.id)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleGeneratePdf(prescription.id)}
                    color="info"
                    size="small"
                  >
                    <PdfIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddPrescription}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <AddIcon />
      </Fab>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedPrescription ? 'Edit Prescription' : 'Add Prescription'}
        </DialogTitle>
        <DialogContent>
          <PrescriptionForm
            prescription={selectedPrescription}
            onSave={handleSavePrescription}
            onCancel={() => setOpenDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PrescriptionList;
