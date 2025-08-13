import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
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
  Switch,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Key as KeyIcon,
  Person as PersonIcon,
  PersonOff as PersonOffIcon
} from '@mui/icons-material';
import { userService } from '../../services/userService';
import UserForm from './UserForm';
import PasswordChangeForm from './PasswordChangeForm';
import toast from 'react-hot-toast';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAll({
        page: 0,
        size: 50,
        sortBy: 'createdAt',
        sortDir: 'desc'
      });
      setUsers(response.data.content || response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchUsers();
      return;
    }

    setLoading(true);
    try {
      const response = await userService.search(searchQuery);
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setOpenDialog(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.delete(id);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (selectedUser) {
        await userService.update(selectedUser.id, userData);
        toast.success('User updated successfully');
      } else {
        await userService.create(userData);
        toast.success('User created successfully');
      }
      setOpenDialog(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    }
  };

  const handleChangePassword = (user) => {
    setSelectedUser(user);
    setOpenPasswordDialog(true);
  };

  const handlePasswordChange = async (passwordData) => {
    try {
      await userService.changePassword(selectedUser.id, passwordData);
      toast.success('Password changed successfully');
      setOpenPasswordDialog(false);
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    }
  };

  const handleToggleActiveStatus = async (userId, currentStatus, username) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} user "${username}"?`)) {
      try {
        await userService.toggleActiveStatus(userId);
        toast.success(`User ${action}d successfully`);
        fetchUsers();
      } catch (error) {
        console.error('Error toggling user status:', error);
        toast.error(`Failed to ${action} user`);
      }
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMINISTRATOR': return 'error';
      case 'CHIEF_DENTIST': return 'warning';
      case 'CLINIC_ASSISTANT': return 'info';
      case 'PRINTING_ONLY': return 'default';
      default: return 'default';
    }
  };

  if (loading && users.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading users...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>User Roles:</strong> Administrator (full access), Chief Dentist (clinical management), 
          Clinic Assistant (patient & appointment management), Printing Only (view and print reports)
        </Typography>
      </Alert>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              label="Search users..."
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
              <TableCell>Username</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No users found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {user.username}
                    </Typography>
                  </TableCell>
                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role || 'CLINIC_ASSISTANT'} 
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip 
                        icon={user.active ? <PersonIcon /> : <PersonOffIcon />}
                        label={user.active ? 'Active' : 'Inactive'} 
                        color={user.active ? 'success' : 'error'}
                        size="small"
                      />
                      <Tooltip title={`Click to ${user.active ? 'deactivate' : 'activate'} user`}>
                        <Switch
                          checked={user.active}
                          onChange={() => handleToggleActiveStatus(user.id, user.active, user.username)}
                          color={user.active ? 'success' : 'error'}
                          size="small"
                        />
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit User">
                      <IconButton
                        onClick={() => handleEditUser(user)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Change Password">
                      <IconButton
                        onClick={() => handleChangePassword(user)}
                        color="warning"
                        size="small"
                      >
                        <KeyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete User">
                      <IconButton
                        onClick={() => handleDeleteUser(user.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddUser}
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
          {selectedUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <UserForm
            user={selectedUser}
            onSave={handleSaveUser}
            onCancel={() => setOpenDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Change Password for {selectedUser?.username}
        </DialogTitle>
        <DialogContent>
          <PasswordChangeForm
            onSave={handlePasswordChange}
            onCancel={() => setOpenPasswordDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UserList;
