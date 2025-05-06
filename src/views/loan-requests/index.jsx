// material-ui
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import { IconEye } from '@tabler/icons-react';
// project imports
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| LOAN REQUESTS PAGE ||============================== //

const LoanRequests = () => {
  // This would typically come from an API
  const loanRequests = [
    {
      id: 1,
      fullName: 'John Doe',
      loanAmount: 5000,
      loanPurpose: 'Personal',
      status: 'Pending',
      date: '2024-03-20'
    },
    {
      id: 2,
      fullName: 'Jane Smith',
      loanAmount: 10000,
      loanPurpose: 'Business',
      status: 'Approved',
      date: '2024-03-19'
    },
    {
      id: 3,
      fullName: 'Mike Johnson',
      loanAmount: 7500,
      loanPurpose: 'Education',
      status: 'Rejected',
      date: '2024-03-18'
    }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <MainCard title="Loan Requests">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          All Loan Requests
        </Typography>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Loan Amount</TableCell>
              <TableCell>Purpose</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loanRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.fullName}</TableCell>
                <TableCell>${request.loanAmount.toLocaleString()}</TableCell>
                <TableCell>{request.loanPurpose}</TableCell>
                <TableCell>
                  <Chip 
                    label={request.status} 
                    color={getStatusColor(request.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{request.date}</TableCell>
                <TableCell>
                  <IconButton size="small" color="primary">
                    <IconEye size={20} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
};

export default LoanRequests;
