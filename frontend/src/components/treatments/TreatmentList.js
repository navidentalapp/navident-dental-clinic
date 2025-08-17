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
  Search as SearchIcon
} from '@mui/icons-material';
import { treatmentService } from '../../services/treatmentService';
import TreatmentForm from './TreatmentForm';
import toast from 'react-hot-toast';

const TreatmentList = () => {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState(null);

  useEffect(() => {
    fetchTreatments();
  }, []);

  const fetchTreatments = async () => {
    setLoading(true);
    try {
      const response = await treatmentService.getAll({
        page: 0,
        size: 50,
        sortBy: 'treatmentName',
        sortDir: 'asc'
      });
      setTreatments(response.data.content || []);
    } catch (error) {
      console.error('Error fetching treatments:', error);
      toast.error('Failed to fetch treatments');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchTreatments();
      return;
    }

    setLoading(true);
    try {
      const response = await treatmentService.search(searchQuery);
      setTreatments(response.data || []);
    } catch (error) {
      console.error('Error searching treatments:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTreatment = () => {
    setSelectedTreatment(null);
    setOpenDialog(true);
  };

  const handleEditTreatment = (treatment) => {
    setSelectedTreatment(treatment);
    setOpenDialog(true);
  };

  const handleDeleteTreatment = async (id) => {
    if (window.confirm('Are you sure you want to delete this treatment?')) {
      try {
        await treatmentService.delete(id);
        toast.success('Treatment deleted successfully');
        fetchTreatments();
      } catch (error) {
        console.error('Error deleting treatment:', error);
        toast.error('Failed to delete treatment');
      }
    }
  };

  const handleSaveTreatment = async (treatmentData) => {
    try {
      if (selectedTreatment) {
        await treatmentService.update(selectedTreatment.id, treatmentData);
        toast.success('Treatment updated successfully');
      } else {
        await treatmentService.create(treatmentData);
        toast.success('Treatment created successfully');
      }
      setOpenDialog(false);
      fetchTreatments();
    } catch (error) {
      console.error('Error saving treatment:', error);
      toast.error('Failed to save treatment');
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Treatments
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              label="Search treatments..."
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
              <TableCell>Treatment Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Available for Booking</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {treatments.map((treatment) => (
              <TableRow key={treatment.id}>
                <TableCell>{treatment.treatmentName}</TableCell>
                <TableCell>{treatment.category}</TableCell>
                <TableCell>{treatment.description}</TableCell>
                <TableCell>
                  <Chip 
                    label={treatment.availableForBooking ? 'Available' : 'Not Available'} 
                    color={treatment.availableForBooking ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditTreatment(treatment)}
                    color="primary"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteTreatment(treatment.id)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
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
        onClick={handleAddTreatment}
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
          {selectedTreatment ? 'Edit Treatment' : 'Add Treatment'}
        </DialogTitle>
        <DialogContent>
          <TreatmentForm
            treatment={selectedTreatment}
            onSave={handleSaveTreatment}
            onCancel={() => setOpenDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TreatmentList;
