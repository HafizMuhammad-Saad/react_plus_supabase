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
  Typography,
  Button
} from '@mui/material';
import { IconEye } from '@tabler/icons-react';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { supabase } from '../../service/supabase';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

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
  const {user} = useAuth()

  const [loanReq, setLoanReq] = useState([])

  const navigate = useNavigate()



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

  async function fetchLoanRequests() {



    try {

      // const {data: {user}} = await supabase.auth.getUser()
      // console.log(user);
      

      const {data, error} = await supabase.from('loan_requests').select('*').eq('user_id', user.id)
      if (error) throw error
      if(data) {
        setLoanReq(data || [])
}       
    } catch (error) {
      console.log(error);
      
    }

     
  }

  useEffect(() => {
    fetchLoanRequests()
  }, [])

  const handleViewLoan = (loanId) => {
    // <customModal />
    navigate(`/loan-detail/${loanId}`);
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
            {loanReq.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id.slice(2,4)}</TableCell>
                <TableCell>{request.full_name}</TableCell>
                <TableCell>${request.amount.toLocaleString()}</TableCell>
                <TableCell>{request.purpose}</TableCell>
                <TableCell>
                  <Chip 
                    label={request.status} 
                    color={getStatusColor(request.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button sx={{display: 'flex', gap: 1}} onClick={() => handleViewLoan(request.id)}>
                  <IconButton size="small" color="primary">
                    <IconEye size={20} />
                  </IconButton>
                    Veiw Details
                  </Button>
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
