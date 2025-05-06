// material-ui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

// ==============================|| LOAN REQUEST PAGE ||============================== //

const steps = [
  {
    label: 'Personal Information',
    description: 'Enter your personal details'
  },
  {
    label: 'Loan Details',
    description: 'Specify loan amount and purpose'
  },
  {
    label: 'Employment Information',
    description: 'Provide your employment details'
  },
  {
    label: 'Review & Submit',
    description: 'Review your information and submit'
  }
];

const LoanRequest = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    address: '',
    // Loan Details
    loanAmount: '',
    loanPurpose: '',
    loanTerm: '',
    // Employment Information
    employmentStatus: '',
    monthlyIncome: '',
    employerName: '',
    jobTitle: ''
  });

  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0:
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        break;
      
      case 1:
        if (!formData.loanAmount) newErrors.loanAmount = 'Loan amount is required';
        if (!formData.loanPurpose) newErrors.loanPurpose = 'Loan purpose is required';
        if (!formData.loanTerm) newErrors.loanTerm = 'Loan term is required';
        break;
      
      case 2:
        if (!formData.employmentStatus) newErrors.employmentStatus = 'Employment status is required';
        if (!formData.monthlyIncome) newErrors.monthlyIncome = 'Monthly income is required';
        if (!formData.employerName.trim()) newErrors.employerName = 'Employer name is required';
        if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
        break;
      
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(activeStep)) {
      console.log('Form submitted:', formData);
      setOpenSnackbar(true);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                variant="outlined"
                error={!!errors.fullName}
                helperText={errors.fullName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                variant="outlined"
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                variant="outlined"
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Loan Amount"
                name="loanAmount"
                type="number"
                value={formData.loanAmount}
                onChange={handleChange}
                variant="outlined"
                error={!!errors.loanAmount}
                helperText={errors.loanAmount}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.loanPurpose}>
                <InputLabel>Loan Purpose</InputLabel>
                <Select
                  name="loanPurpose"
                  value={formData.loanPurpose}
                  onChange={handleChange}
                  label="Loan Purpose"
                >
                  <MenuItem value="personal">Personal</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="education">Education</MenuItem>
                  <MenuItem value="home">Home Improvement</MenuItem>
                  <MenuItem value="debt">Debt Consolidation</MenuItem>
                </Select>
                {errors.loanPurpose && (
                  <Typography color="error" variant="caption">
                    {errors.loanPurpose}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.loanTerm}>
                <InputLabel>Loan Term</InputLabel>
                <Select
                  name="loanTerm"
                  value={formData.loanTerm}
                  onChange={handleChange}
                  label="Loan Term"
                >
                  <MenuItem value="12">12 months</MenuItem>
                  <MenuItem value="24">24 months</MenuItem>
                  <MenuItem value="36">36 months</MenuItem>
                  <MenuItem value="48">48 months</MenuItem>
                  <MenuItem value="60">60 months</MenuItem>
                </Select>
                {errors.loanTerm && (
                  <Typography color="error" variant="caption">
                    {errors.loanTerm}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.employmentStatus}>
                <InputLabel>Employment Status</InputLabel>
                <Select
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={handleChange}
                  label="Employment Status"
                >
                  <MenuItem value="employed">Employed</MenuItem>
                  <MenuItem value="self-employed">Self Employed</MenuItem>
                  <MenuItem value="business">Business Owner</MenuItem>
                  <MenuItem value="retired">Retired</MenuItem>
                </Select>
                {errors.employmentStatus && (
                  <Typography color="error" variant="caption">
                    {errors.employmentStatus}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Monthly Income"
                name="monthlyIncome"
                type="number"
                value={formData.monthlyIncome}
                onChange={handleChange}
                variant="outlined"
                error={!!errors.monthlyIncome}
                helperText={errors.monthlyIncome}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Employer Name"
                name="employerName"
                value={formData.employerName}
                onChange={handleChange}
                variant="outlined"
                error={!!errors.employerName}
                helperText={errors.employerName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Job Title"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                variant="outlined"
                error={!!errors.jobTitle}
                helperText={errors.jobTitle}
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Review Your Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Personal Information</Typography>
                <Typography>Name: {formData.fullName}</Typography>
                <Typography>Email: {formData.email}</Typography>
                <Typography>Phone: {formData.phone}</Typography>
                <Typography>Address: {formData.address}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Loan Details</Typography>
                <Typography>Amount: ${formData.loanAmount}</Typography>
                <Typography>Purpose: {formData.loanPurpose}</Typography>
                <Typography>Term: {formData.loanTerm} months</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Employment Information</Typography>
                <Typography>Status: {formData.employmentStatus}</Typography>
                <Typography>Monthly Income: ${formData.monthlyIncome}</Typography>
                <Typography>Employer: {formData.employerName}</Typography>
                <Typography>Job Title: {formData.jobTitle}</Typography>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <MainCard title="Loan Request Application">
      <Box sx={{ maxWidth: '800px', margin: '0 auto', padding: '30px' }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography variant="h6">{step.label}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {step.description}
                </Typography>
              </StepLabel>
              <StepContent>
                <Box sx={{ mb: 2 }}>
                  {renderStepContent(index)}
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={index === steps.length - 1 ? handleSubmit : handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 1 ? 'Submit' : 'Continue'}
                    </Button>
                  </Box>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              All steps completed - your loan request has been submitted successfully!
            </Alert>
            <Button onClick={() => setActiveStep(0)} sx={{ mt: 1, mr: 1 }}>
              Reset
            </Button>
          </Paper>
        )}
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{
            width: '100%',
            backgroundColor: '#4caf50',
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
          icon={<CheckCircleIcon fontSize="inherit" />}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>
              Success!
            </Typography>
            <Typography variant="body2">
              Your loan request has been submitted successfully.
            </Typography>
          </Box>
        </MuiAlert>
      </Snackbar>
    </MainCard>
  );
};

export default LoanRequest; 