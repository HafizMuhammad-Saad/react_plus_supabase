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
import { DataGrid } from '@mui/x-data-grid';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { supabase } from '../../service/supabase';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { AccessTime, CheckCircleOutline, CancelOutlined } from '@mui/icons-material';

// ==============================|| LOAN REQUESTS PAGE ||============================== //

const LoanRequests = () => {
  // This would typically come from an API

  const { user } = useAuth();

  const [loanReq, setLoanReq] = useState([]);

  const navigate = useNavigate();

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

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'full_name',
      headerName: 'Full name',
      width: 150,
      editable: false
    },
    {
      field: 'amount',
      headerName: 'Loan amount',
      width: 150,
      type: Number,
      valueFormatter: (params) => `$${params}`
    },
    {
      field: 'purpose',
      headerName: 'Purpose',
      width: 110,
      editable: false
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 160,
      renderCell: (params) => {
        const statusColor = getStatusColor(params.value);
        return (
          <Chip
            label={params.value}
            color={statusColor}
            icon={statusColor === 'success' ? <CheckCircleOutline /> : statusColor === 'error' ? <CancelOutlined /> : <AccessTime />}
            variant="filled"
            sx={{
              backgroundColor: `${statusColor}.light`,
              color: `${statusColor}.contrastText`,
              fontWeight: 600,
              textTransform: 'capitalize',
              borderWidth: 2,
              '& .MuiChip-label': {
                px: 1.5
              }
            }}
          />
        );
      },
      sortable: false,
      filterable: true,
      editable: false,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 160,
      editable: false,
      renderCell: (params) => (
        <Button
          sx={{
            display: 'flex',
            gap: 1,
            py: 1.9,
            textTransform: 'none',
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
          onClick={() => handleViewLoan(params.row.id)}
        >
          <IconEye size={20} />
          View Details
        </Button>
      ),
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center'
    }
  ];

  async function fetchLoanRequests() {
    try {
      // const {data: {user}} = await supabase.auth.getUser()
      // console.log(user);

      const { data, error } = await supabase.from('loan_requests').select('*').eq('user_id', user.id);
      if (error) throw error;
      if (data) {
        setLoanReq(data || []);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchLoanRequests();
  }, []);

  const handleViewLoan = (loanId) => {
    navigate(`/loan-requests/${loanId}`);
  };

  return (
    <MainCard title="Loan Requests">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">All Loan Requests</Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1">Total Loan Requests: {loanReq.length}</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/loan-request/create')}>
          Create New Loan Request
        </Button>
      </Box>

      {/* <TableContainer component={Paper}>
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
                <TableCell>{request.id.slice(2, 4)}</TableCell>
                <TableCell>{request.full_name}</TableCell>
                <TableCell>${request.amount.toLocaleString()}</TableCell>
                <TableCell>{request.purpose}</TableCell>
                <TableCell>
                  <Chip label={request.status} color={getStatusColor(request.status)} size="small" />
                </TableCell>
                <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button sx={{ display: 'flex', gap: 1 }} onClick={() => handleViewLoan(request.id)}>
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
      </TableContainer> */}
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={loanReq}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5
              }
            }
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </MainCard>
  );
};

export default LoanRequests;
