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
    Button,
    Snackbar,
    Alert
  } from '@mui/material';
  import { IconEye } from '@tabler/icons-react';
  // project imports
  import MainCard from 'ui-component/cards/MainCard';
import { supabase } from '../../../service/supabase';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import CustomSnackbar from './Snackbar';
import LoanDetailModal from './LoanModal';
import { useAuth } from '../../../contexts/AuthContext';
// import LoanDetail from '/views/loan-detail'

  

// project imports
// import EarningCard from './EarningCard';
// import PopularCard from './PopularCard';
// import TotalOrderLineChartCard from './TotalOrderLineChartCard';
// import TotalIncomeDarkCard from '../../../ui-component/cards/TotalIncomeDarkCard';
// import TotalIncomeLightCard from '../../../ui-component/cards/TotalIncomeLightCard';
// import TotalGrowthBarChart from './TotalGrowthBarChart';

import { gridSpacing } from 'store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// ==============================|| DEFAULT DASHBOARD ||============================== //

export default function Admin() {
  const [isLoading, setLoading] = useState(true);
  const [loanReq, setLoanReq] = useState([])
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar open/close

  const [snackbarMessage, setSnackbarMessage] = useState(''); // State for Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // State for Snackbar severity

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null); // To store the loan data for the modal

  const {user} = useAuth()


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

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  async function fetchLoanRequests() {
  
  
  
    try {

      // console.log(user);
      

      const {data, error} = await supabase.from('loan_requests').select('*')
      if (error) throw error
      if(data) {
        setLoanReq(data || [])
}       
    } catch (error) {
      console.log(error);
      
    }

     
  }

  const updateStatus = async (id, status, full_name) => {
      const {error} = await supabase.from('loan_requests').update({status, full_name}).eq('id',id)
      
      if (error) {
          console.log(error);
        
        } else {
            setSnackbarMessage(`Loan request ${full_name} status updated to ${status}`);
            setSnackbarSeverity(status === 'approved' ? 'success' : 'error');
            const updatedLoan = loanReq.find(req => req.id === id);
            if (selectedLoan && selectedLoan.id === id && updatedLoan) {
                setSelectedLoan(updatedLoan); // Update modal content if it's open for this loan
            }
            fetchLoanRequests();
        }
        setSnackbarOpen(true); // Open the snackbar

    }
    
      useEffect(() => {
        fetchLoanRequests()
      }, [])

    //   const handleViewLoan = (loanId) => {
    //     // <customModal />
    //     navigate(`/loan-requests/${loanId}`);
    //   };

    const handleViewLoan = (loan) => {
        setSelectedLoan(loan); // Set the loan data
        setModalOpen(true); // Open the modal
      };

      const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedLoan(null); // Clear selected loan data when closing
      };
    

const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
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
              <TableCell sx={{display: 'flex', alignItems: 'center', justifyContent: 'start', gap: 1}}>

              <Button
                      variant="outlined" // Or 'contained', 'text' as needed
                      size="small"
                      color="primary"
                      startIcon={<IconEye size={20} />} // Use startIcon prop for the icon
                      onClick={() => handleViewLoan(request)} // Pass the whole request object
                    >
                      View Details
                    </Button>
              {/* <IconButton size="small" color="primary">
                    <IconEye size={20} />
                  </IconButton> */}
                  {/* Approve Button */}
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => updateStatus(request.id, 'approved', request.full_name)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => updateStatus(request.id, 'rejected', request.full_name)}
                  >
                    Reject
                  </Button>
                  
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleCloseSnackbar}
      />

{selectedLoan && ( // Only render the modal component if a loan is selected
          <LoanDetailModal
              open={modalOpen}
              loan={selectedLoan} // Pass the selected loan data
              onClose={handleCloseModal} // Pass the close handler
          />
      )}
  </MainCard>
  );
}


  // ==============================|| LOAN REQUESTS PAGE ||============================== //
  

  
  
  
  
  
  
    
  
  
  