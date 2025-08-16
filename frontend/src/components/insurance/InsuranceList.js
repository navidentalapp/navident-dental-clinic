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
  Download as DownloadIcon
} from '@mui/icons-material';
import { insuranceService } from '../../services/insuranceService';
import InsuranceForm from './InsuranceForm';
import toast from 'react-hot-toast';

const InsuranceList = () => {
  const [insurances, setInsurances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState(null);

  useEffect(() => {
    fetchInsurances();
  }, []);

  const fetchInsurances = async () => {
    setLoading(true);
    try {
      const response = await insuranceService.getAll({
        page: 0,
        size: 50,
        sortBy: 'createdAt',
        sortDir: 'desc'
      });
      setInsurances(response.data.content || []);
    } catch (error) {
      console.error('Error fetching insurances:', error);
      toast.error('Failed to fetch insurance records');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchInsurances();
      return;
    }

    setLoading(true);
    try {
      const response = await insuranceService.search(searchQuery);
      setInsurances(response.data || []);
    } catch (error) {
      console.error('Error searching insurances:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddInsurance = () => {
    setSelectedInsurance(null);
    setOpenDialog(true);
  };

  const handleEditInsurance = (insurance) => {
    setSelectedInsurance(insurance);
    setOpenDialog(true);
  };

  const handleDeleteInsurance = async (id) => {
    if (window.confirm('Are you sure you want to delete this insurance record?')) {
      try {
        await insuranceService.delete(id);
        toast.success('Insurance record deleted successfully');
        fetchInsurances();
      } catch (error) {
        console.error('Error deleting insurance:', error);
        toast.error('Failed to delete insurance record');
      }
    }
  };

  const handleSaveInsurance = async (insuranceData) => {
    try {
      if (selectedInsurance) {
        await insuranceService.update(selectedInsurance.id, insuranceData);
        toast.success('Insurance record updated successfully');
      } else {
        await insuranceService.create(insuranceData);
        toast.success('Insurance record created successfully');
      }
      setOpenDialog(false);
      fetchInsurances();
    } catch (error) {
      console.error('Error saving insurance:', error);
      toast.error('Failed to save insurance record');
    }
  };

  const handleExportExcel = async (patientId) => {
    try {
      const response = await insuranceService.exportExcel(patientId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'insurance_records.xlsx';
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
      case 'EXPIRED': return 'error';
      case 'CLAIMED': return 'warning';
      case 'APPROVED': return 'info';
      default: return 'default';
    }
  };

  const isExpiringSoon = (policyEndDate) => {
    if (!policyEndDate) return false;
    const endDate = new Date(policyEndDate);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Insurance Management
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              label="Search insurance records..."
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
              <TableCell>Patient ID</TableCell>
              <TableCell>Agency</TableCell>
              <TableCell>Policy Number</TableCell>
              <TableCell>Policy End Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Claim Status</TableCell>
              <TableCell>Claim Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {insurances.map((insurance) => (
              <TableRow 
                key={insurance.id}
                sx={{ 
                  backgroundColor: isExpiringSoon(insurance.policyEndDate) ? '#fff3e0' : 'inherit'
                }}
              >
                <TableCell>{insurance.patientId}</TableCell>
                <TableCell>{insurance.agencyName}</TableCell>
                <TableCell>{insurance.policyNumber}</TableCell>
                <TableCell>
                  <Box>
                    {insurance.policyEndDate}
                    {isExpiringSoon(insurance.policyEndDate) && (
                      <Chip 
                        label="Expiring Soon" 
                        color="warning" 
                        size="small" 
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={insurance.status || 'ACTIVE'} 
                    color={getStatusColor(insurance.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box>
                    {insurance.claimSubmitted && (
                      <Chip 
                        label={insurance.claimApproved ? 'Approved' : 'Submitted'} 
                        color={insurance.claimApproved ? 'success' : 'info'}
                        size="small"
                      />
                    )}
                    {!insurance.claimSubmitted && (
                      <Chip 
                        label="No Claim" 
                        color="default"
                        size="small"
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {insurance.claimAmount && `₹${insurance.claimAmount}`}
                  {insurance.approvedClaimAmount && ` / ₹${insurance.approvedClaimAmount}`}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditInsurance(insurance)}
                    color="primary"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteInsurance(insurance.id)}
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
        onClick={handleAddInsurance}
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
          {selectedInsurance ? 'Edit Insurance Record' : 'Add Insurance Record'}
        </DialogTitle>
        <DialogContent>
          <InsuranceForm
            insurance={selectedInsurance}
            onSave={handleSaveInsurance}
            onCancel={() => setOpenDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default InsuranceList;
