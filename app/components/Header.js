'use client';
import Link from 'next/link';
import { AppBar, Box, Button, Typography, Toolbar } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import RateReviewIcon from '@mui/icons-material/RateReview';

export default function Header({ onAddProfessorClick, onChatAssistantClick }) {
  return (
    <AppBar 
      position="static"
      sx={{
        background: 'linear-gradient(90deg, #0c0c0c 0%, #1A2130 90%)',
        boxShadow: 'none',
        padding: '0 24px',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
      {/* <Link href="/" passHref>
        <Typography
          sx={{ display: 'flex', alignItems: 'center', color: '#FFFFFF', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer' }}
        >
          <img src="/Logo.png" alt="Logo" style={{ height: '40px', marginRight: '8px' }} />
          ProfInsight
        </Typography>
        </Link> */}
        <Link href="/" passHref>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <img src="/Logo.png" alt="Logo" style={{ height: '40px', marginRight: '8px' }} />
            <Typography sx={{ color: '#FFFFFF', fontWeight: 'bold', textDecoration: 'none' }}>
              ProfInsight
            </Typography>
          </Box>
        </Link>
        <Box>
          <Button
            startIcon={<RateReviewIcon />}
            variant="outlined"
            sx={{
              marginRight: 2,
              borderColor: '#f0f0f0',
              color: '#f0f0f0',
              fontWeight: 'bold',
              '&:hover': {
                borderColor: '#ffffff',
                backgroundColor: '#4a4a4a',
              },
            }} 
            onClick={onAddProfessorClick}
          >
            Add a Professor
          </Button>
          <Button
            startIcon={<ChatIcon />}
            variant="contained"
            sx={{
              fontWeight: 'bold',
              backgroundColor: '#FF4191',
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#E90074',
              },
            }}
            onClick={onChatAssistantClick}
          >
            Chat Assistant
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
