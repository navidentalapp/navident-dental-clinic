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
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import { billService } from '../../services/billService';
import BillForm from './BillForm';
import toast from 'react-hot-toast';

const BillList = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const response = await billService.getAll({
        page: 0,
        size: 50,
        sortBy: 'billDate',
        sortDir: 'desc'
      });
      setBills(response.data.content || []);
    } catch (error) {
      console.error('Error fetching bills:', error);
      toast.error('Failed to fetch bills');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchBills();
      return;
    }

    setLoading(true);
    try {
      const response = await billService.search(searchQuery);
      setBills(response.data || []);
    } catch (error) {
      console.error('Error searching bills:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBill = () => {
    setSelectedBill(null);
    setOpenDialog(true);
  };

  const handleEditBill = (bill) => {
    setSelectedBill(bill);
    setOpenDialog(true);
  };

  const handleDeleteBill = async (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await billService.delete(id);
        toast.success('Bill deleted successfully');
        fetchBills();
      } catch (error) {
        console.error('Error deleting bill:', error);
        toast.error('Failed to delete bill');
      }
    }
  };

  const handleSaveBill = async (billData) => {
    try {
      if (selectedBill) {
        await billService.update(selectedBill.id, billData);
        toast.success('Bill updated successfully');
      } else {
        await billService.create(billData);
        toast.success('Bill created successfully');
      }
      setOpenDialog(false);
      fetchBills();
    } catch (error) {
      console.error('Error saving bill:', error);
      toast.error('Failed to save bill');
    }
  };

  const handleGeneratePdf = async (billId) => {
    try {
      const response = await billService.generatePdf(billId);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(url);
      toast.success('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('PDF generation failed');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Bills
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              label="Search bills..."
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
              <TableCell>Bill ID</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Dentist</TableCell>
              <TableCell>Bill Date</TableCell>
              <TableCell>Amount Due</TableCell>
              <TableCell>Amount Paid</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell>{bill.billId}</TableCell>
                <TableCell>{bill.patientName}</TableCell>
                <TableCell>{bill.dentistName}</TableCell>
                <TableCell>{bill.billDate}</TableCell>
                <TableCell>₹{bill.amountDue}</TableCell>
                <TableCell>₹{bill.amountPaid}</TableCell>
                <TableCell>
                  <Chip 
                    label={bill.paymentStatus} 
                    color={getStatusColor(bill.paymentStatus)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditBill(bill)}
                    color="primary"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteBill(bill.id)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleGeneratePdf(bill.id)}
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
        onClick={handleAddBill}
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
          {selectedBill ? 'Edit Bill' : 'Add Bill'}
        </DialogTitle>
        <DialogContent>
          <BillForm
            bill={selectedBill}
            onSave={handleSaveBill}
            onCancel={() => setOpenDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default BillList;
