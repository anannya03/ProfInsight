import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, styled } from '@mui/material';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: theme.palette.background.paper,  // Use theme colors for consistency
    color: theme.palette.text.primary,
    borderRadius: '15px',  // Rounded corners like your example
    padding: '20px',
    maxWidth: '500px',
  },
  '& .MuiButton-root': {
    margin: theme.spacing(1),
  }
}));

const CustomModal = ({ open, handleClose, handleConfirm, location, setLocation }) => {
  return (
    <StyledDialog open={open} onClose={handleClose}>
      <DialogTitle>{"Change Your Location"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="location"
          label="Location"
          type="text"
          fullWidth
          variant="outlined"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirm} color="primary">Confirm</Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default CustomModal;
