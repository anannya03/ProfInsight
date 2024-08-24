'use client';
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Typography, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#1A2130',
    color: '#FFFFFF',
    padding: theme.spacing(3),
    borderRadius: '12px',
    minWidth: '500px',
    maxHeight: '150vh',
    minHeight: '500px',
    height: 'auto',
    overflowY: 'auto',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  paddingBottom: theme.spacing(2),
  fontSize: '1.5rem',
  fontWeight: 'bold',
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiTextField-root': {
    backgroundColor: '#2C2F3A',
    borderRadius: '8px',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#4a4a4a',
      },
      '&:hover fieldset': {
        borderColor: '#FFF078',
      },
    },
  },
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  '& .MuiButton-root': {
    borderRadius: '8px',
    fontWeight: 'bold',
  },
}));

export default function AddProfessorModal({ closeModal }) {
  const [profPage, setProfPage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleUrlSubmit = async (url) => {
    setSubmitting(true); // Start the "Submitting..." state
    setLoading(true); // Start loading

    console.log('Submitting URL:', url);

    const isValidUrl = /^https:\/\/www\.ratemyprofessors\.com\/professor\/\d+$/.test(url);
    if (!isValidUrl) {
      alert('Invalid RateMyProfessor URL.');
      setLoading(false);
      setSubmitting(false); // Stop the "Submitting..." state
      return;
    }

    try {
      const response = await fetch('/api/addModal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profPage: url }),
      });

      const result = await response.json();
      console.log('Submission Response:', result);

      if (response.ok) {
        setProfPage('');
        alert('Professor page added');
        closeModal(); // Close modal after successful submission
      } else {
        console.log('Error:', result.error);
        setProfPage('');
        alert('Professor page not added: ' + result.error);
      }
    } catch (error) {
      console.error('Error during submission:', error);
      setProfPage('');
      alert('Professor page not added');
    } finally {
      setLoading(false);
      setSubmitting(false); // Stop the "Submitting..." state
    }
  };

  return (
    <StyledDialog open onClose={closeModal}>
      <StyledDialogTitle sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        <IconButton
          aria-label="close"
          onClick={closeModal}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#FFF078',
          }}
        >
          <CloseIcon />
        </IconButton>
        <img
          src="/Logo.png"
          alt="ProfInsight Logo"
          style={{
            height: '50px',
            marginBottom: '8px',
            animation: 'bounce 1.5s infinite',
          }}
        />
        Add a Professor
      </StyledDialogTitle>
      <StyledDialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
          padding: '24px 32px',
        }}
      >
        <Typography sx={{ marginBottom: 3, color: '#B0B3B8', fontSize: '1rem', textAlign: 'center' }}>
          Can't find the professor you're looking for? Add their RateMyProfessor link to unlock the full potential of ProfInsight.
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          label="Professor Page URL"
          fullWidth
          variant="outlined"
          InputLabelProps={{
            style: { color: '#FFF078' },
          }}
          InputProps={{
            style: { color: '#FFFFFF' },
          }}
          value={profPage}
          onChange={(e) => setProfPage(e.target.value)}
          sx={{
            marginBottom: 2,
          }}
        />
        {submitting && <Typography sx={{ color: '#FFF078', marginTop: 2 }}>Submitting...</Typography>}
      </StyledDialogContent>
      <StyledDialogActions sx={{ justifyContent: 'center', padding: '16px 24px' }}>
        <Button onClick={closeModal} sx={{ backgroundColor: '#4a4a4a', color: '#fff', '&:hover': { backgroundColor: '#333333' }, padding: '8px 24px' }}>
          Cancel
        </Button>
        <Button onClick={() => handleUrlSubmit(profPage)} sx={{ backgroundColor: '#FF4191', color: '#fff', '&:hover': { backgroundColor: '#E90074' }, padding: '8px 24px', marginLeft: '16px' }} disabled={loading}>
          Submit
        </Button>
      </StyledDialogActions>
    </StyledDialog>
  );
}
