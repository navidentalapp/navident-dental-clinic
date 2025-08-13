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
  PictureAsPdf as PdfIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { dentistService } from '../../services/dentistService';
import DentistForm from './DentistForm';
import toast from 'react-hot-toast';

const DentistList = () => {
  const [dentists, setDentists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDentist, setSelectedDentist] = useState(null);

  useEffect(() => {
    fetchDentists();
  }, []);

  const fetchDentists = async () => {
    try {
      const response = await dentistService.getAll({
        page: 0,
        size: 50,
        sortBy: 'createdAt',
        sortDir: 'desc'
      });
      setDentists(response.data.content || []);
    } catch (error) {
      console.error('Error fetching dentists:', error);
      toast.error('Failed to fetch dentists');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchDentists();
      return;
    }

    try {
      const response = await dentistService.search(searchQuery);
      setDentists(response.data || []);
    } catch (error) {
      console.error('Error searching dentists:', error);
      toast.error('Search failed');
    }
  };

  const handleAddDentist = () => {
    setSelectedDentist(null);
    setOpenDialog(true);
  };

  const handleEditDentist = (dentist) => {
    setSelectedDentist(dentist);
    setOpenDialog(true);
  };

  const handleDeleteDentist = async (id) => {
    if (window.confirm('Are you sure you want to delete this dentist?')) {
      try {
        await dentistService.delete(id);
        toast.success('Dentist deleted successfully');
        fetchDentists();
      } catch (error) {
        console.error('Error deleting dentist:', error);
        toast.error('Failed to delete dentist');
      }
    }
  };

  const handleSaveDentist = async (dentistData) => {
    try {
      if (selectedDentist) {
        await dentistService.update(selectedDentist.id, dentistData);
        toast.success('Dentist updated successfully');
      } else {
        await dentistService.create(dentistData);
        toast.success('Dentist created successfully');
      }
      setOpenDialog(false);
      fetchDentists();
    } catch (error) {
      console.error('Error saving dentist:', error);
      toast.error('Failed to save dentist');
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await dentistService.exportExcel();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'dentists.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Export successful');
    } catch (error) {
      console.error('Error exporting:', error);
      toast.error('Export failed');
    }
  };

  const handleGeneratePdf = async (dentistId) => {
    try {
      const response = await dentistService.generatePdf(dentistId);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(url);
      toast.success('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('PDF generation failed');
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Dentists
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
              label="Search dentists..."
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
              <TableCell>Name</TableCell>
              <TableCell>License</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Specializations</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dentists.map((dentist) => (
              <TableRow key={dentist.id}>
                <TableCell>
                  Dr. {dentist.firstName} {dentist.lastName}
                </TableCell>
                <TableCell>{dentist.licenseNumber}</TableCell>
                <TableCell>{dentist.email}</TableCell>
                <TableCell>{dentist.mobileNumber}</TableCell>
                <TableCell>
                  {dentist.specializations?.slice(0, 2).map((spec, index) => (
                    <Chip 
                      key={index}
                      label={spec} 
                      size="small" 
                      variant="outlined"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={dentist.active ? 'Active' : 'Inactive'} 
                    color={dentist.active ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {dentist.chiefDentist && (
                    <Chip 
                      icon={<StarIcon />}
                      label="Chief Dentist" 
                      color="warning"
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditDentist(dentist)}
                    color="primary"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteDentist(dentist.id)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleGeneratePdf(dentist.id)}
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
        onClick={handleAddDentist}
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
          {selectedDentist ? 'Edit Dentist' : 'Add Dentist'}
        </DialogTitle>
        <DialogContent>
          <DentistForm
            dentist={selectedDentist}
            onSave={handleSaveDentist}
            onCancel={() => setOpenDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DentistList;
