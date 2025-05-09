import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Chip, Link, Button, Divider, Stack } from '@mui/material';
import { ArrowBack, Person, Email, Phone, Home, Work, Description, MonetizationOn, Timelapse, VerifiedUser } from '@mui/icons-material';
import {CircularProgress} from '@mui/material';
import { useTheme } from '@mui/material/styles'; // Import useTheme hook

import { supabase } from '../../service/supabase';
// Function to determine chip color based on status (can reuse from LoanRequestsTable)
const getStatusColor = (status) => {
  switch (status) {
    case 'Approved':
      return 'success';
    case 'Rejected':
      return 'error';
    case 'Pending':
    default:
      return 'warning';
  }
};

const LoanDetail = () => {
  const { id } = useParams(); // Get the dynamic 'id' from the URL
  const [loan, setLoan] = useState(null);
  const theme = useTheme(); // Access the theme object
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoanDetail = async () => {
      setLoading(true);
      setError(null); // Clear previous errors

      if (!id) {
        setError(new Error('Loan ID is missing.'));
        setLoading(false);
        return;
      }

      console.log(`Fetching details for loan ID: ${id}`);
      try {
        const { data, error: supabaseError } = await supabase
          .from('loan_requests')
          .select('*') // Select all columns for the detail view
          .eq('id', id) // Filter by the loan ID from the URL
          .single(); // Expecting a single row

        if (supabaseError) {
          console.error('Error fetching loan detail:', supabaseError);
          setError(supabaseError);
          setLoan(null); // Clear data on error
        } else if (data) {
          console.log('Loan detail fetched successfully:', data);
          setLoan(data);
        } else {
          // If data is null but no error, it means no record was found
          setError(new Error(`Loan request with ID ${id} not found.`));
          setLoan(null);
        }
      } catch (err) {
        console.error('An unexpected error occurred while fetching loan detail:', err);
        setError(err);
        setLoan(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanDetail();
  }, [id]); // Re-fetch whenever the ID in the URL changes

  // --- Render States ---

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading loan details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Error loading loan details: {error.message}</Alert>
      </Box>
    );
  }

  // If loan is null after loading and no error, it means not found
  if (!loan) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Loan request not found.</Alert>
      </Box>
    );
  }

  // --- Render Loan Details ---

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBack />} variant="outlined" sx={{ mb: 3 }} onClick={() => window.history.back()}>
        Back
      </Button>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={3}>
          {/* Main Sections Container */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3,
              flexWrap: 'wrap'
            }}
          >
            {/* Personal Details Column */}
            <SectionContainer title="Personal Information" icon={<Person />} color={theme.palette.primary.main}>
              <DetailItem label="Full Name" value={loan?.full_name} />
              <DetailItem label="Email" value={loan?.email} icon={<Email fontSize="small" />} />
              <DetailItem label="Phone" value={loan?.phone} icon={<Phone fontSize="small" />} />
              <DetailItem label="Address" value={loan?.address} icon={<Home fontSize="small" />} />
            </SectionContainer>

            {/* Employment Details Column */}
            <SectionContainer title="Employment Details" icon={<Work />} color={theme.palette.secondary.main}>
              <DetailItem label="Employer Name" value={loan?.employerName} />
              <DetailItem label="Job Title" value={loan?.jobTitle} />
              <DetailItem label="Employment Status" value={loan?.employmentStatus} />
              <DetailItem label="Monthly Income" value={loan?.monthlyIncome} />
            </SectionContainer>

            {/* Loan Details Column */}
            <SectionContainer title="Loan Information" icon={<MonetizationOn />} color={theme.palette.success.main}>
              <DetailItem label="Loan Amount" value={`$${loan?.amount?.toLocaleString()}`} />
              <DetailItem label="Purpose" value={loan?.purpose} />
              <DetailItem label="Term" value={`${loan?.term} months`} />
              <DetailItem label="Status">
                <Chip
                  label={loan?.status}
                  color={loan?.status === 'approved' ? 'success' : loan?.status === 'pending' ? 'warning' : 'error'}
                  variant="outlined"
                />
              </DetailItem>
            </SectionContainer>

            {/* Documents Column */}
            <SectionContainer title="Documents" icon={<Description />} color={theme.palette.info.main}>
              <DocumentLink label="ID Proof" url={loan?.id_proof_url} />
              <DocumentLink label="Income Proof" url={loan?.income_proof_url} />
              <DocumentLink label="Address Proof" url={loan?.address_proof_url} />
            </SectionContainer>
          </Box>

          <Divider />

          {/* Timestamps Row */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="space-between">
            <DetailItem label="Created At" value={new Date(loan?.created_at).toLocaleString()} icon={<Timelapse fontSize="small" />} />
            <DetailItem label="Updated At" value={new Date(loan?.updated_at).toLocaleString()} icon={<VerifiedUser fontSize="small" />} />
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

// Reusable Section Container Component
const SectionContainer = ({ title, icon, color, children }) => (
  <Box
    sx={{
      flex: 1,
      minWidth: 300,
      p: 2,
      borderRadius: 1,
      border: `1px solid ${color}20`,
      backgroundColor: `${color}08`
    }}
  >
    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color }}>
      {React.cloneElement(icon, { sx: { mr: 1 } })}
      {title}
    </Typography>
    <Stack spacing={1.5}>{children}</Stack>
  </Box>
);

// Detail Item Component remains the same
const DetailItem = ({ label, value, children, icon }) => (
  <Stack direction="row" spacing={2} alignItems="center">
    {icon && React.cloneElement(icon, { sx: { color: 'text.secondary' } })}
    <Typography variant="body1" sx={{ minWidth: 120, fontWeight: 500 }}>
      {label}:
    </Typography>
    {children || (
      <Typography variant="body1" color="text.secondary">
        {value || 'N/A'}
      </Typography>
    )}
  </Stack>
);

// Document Link Component remains the same
const DocumentLink = ({ label, url }) => (
  <DetailItem label={label}>
    {url ? (
      <Link href={url} target="_blank" rel="noopener noreferrer" sx={{ cursor: 'pointer' }}>
        View Document
      </Link>
    ) : (
      <Typography variant="body1" color="text.secondary">
        Not Available
      </Typography>
    )}
  </DetailItem>
);

// };

export default LoanDetail;
