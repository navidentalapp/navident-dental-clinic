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
  Fab,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { financeService } from '../../services/financeService';
import FinanceForm from './FinanceForm';
import toast from 'react-hot-toast';

const FinanceList = () => {
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFinance, setSelectedFinance] = useState(null);

  useEffect(() => {
    fetchFinances();
  }, [categoryFilter]);

  const fetchFinances = async () => {
    setLoading(true);
    try {
      const response = await financeService.getAll({
        page: 0,
        size: 50,
        sortBy: 'transactionDate',
        sortDir: 'desc',
        category: categoryFilter
      });
      setFinances(response.data.content || []);
    } catch (error) {
      console.error('Error fetching finances:', error);
      toast.error('Failed to fetch finance records');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchFinances();
      return;
    }

    setLoading(true);
    try {
      const response = await financeService.search(searchQuery);
      setFinances(response.data || []);
    } catch (error) {
      console.error('Error searching finances:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFinance = () => {
    setSelectedFinance(null);
    setOpenDialog(true);
  };

  const handleEditFinance = (finance) => {
    setSelectedFinance(finance);
    setOpenDialog(true);
  };

  const handleDeleteFinance = async (id) => {
    if (window.confirm('Are you sure you want to delete this finance record?')) {
      try {
        await financeService.delete(id);
        toast.success('Finance record deleted successfully');
        fetchFinances();
      } catch (error) {
        console.error('Error deleting finance:', error);
        toast.error('Failed to delete finance record');
      }
    }
  };

  const handleSaveFinance = async (financeData) => {
    try {
      if (selectedFinance) {
        await financeService.update(selectedFinance.id, financeData);
        toast.success('Finance record updated successfully');
      } else {
        await financeService.create(financeData);
        toast.success('Finance record created successfully');
      }
      setOpenDialog(false);
      fetchFinances();
    } catch (error) {
      console.error('Error saving finance:', error);
      toast.error('Failed to save finance record');
    }
  };

  const handleExportExcel = async () => {
    try {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      const endDate = today.toISOString().split('T');
      
      const response = await financeService.exportExcel(startDate, endDate);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'finance_records.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Export successful');
    } catch (error) {
      console.error('Error exporting:', error);
      toast.error('Export failed');
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'REVENUE': return 'success';
      case 'EXPENSE': return 'error';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Finance Management
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
              label="Search transactions..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              sx={{ flexGrow: 1 }}
            />
            <TextField
              select
              label="Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="REVENUE">Revenue</MenuItem>
              <MenuItem value="EXPENSE">Expense</MenuItem>
            </TextField>
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
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {finances.map((finance) => (
              <TableRow key={finance.id}>
                <TableCell>{finance.transactionDate}</TableCell>
                <TableCell>
                  <Chip 
                    label={finance.category} 
                    color={getCategoryColor(finance.category)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{finance.type}</TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    color={finance.category === 'REVENUE' ? 'success.main' : 'error.main'}
                  >
                    ₹{finance.amount}
                  </Typography>
                </TableCell>
                <TableCell>{finance.vendorName}</TableCell>
                <TableCell>{finance.description}</TableCell>
                <TableCell>
                  <Chip 
                    label={finance.status || 'COMPLETED'} 
                    color={getStatusColor(finance.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditFinance(finance)}
                    color="primary"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteFinance(finance.id)}
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
        onClick={handleAddFinance}
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
          {selectedFinance ? 'Edit Finance Record' : 'Add Finance Record'}
        </DialogTitle>
        <DialogContent>
          <FinanceForm
            finance={selectedFinance}
            onSave={handleSaveFinance}
            onCancel={() => setOpenDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default FinanceList;
