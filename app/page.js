'use client';
import { useState } from 'react';
import { Box, Typography, Modal, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import AddProfessorModal from './components/AddProfessorModal';
import Header from './components/Header';
import ChatIcon from '@mui/icons-material/Chat';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const goToChat = () => {
    router.push('/chat');
  };

  const goToSearch = () => {
    router.push('/search');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FF4191 0%, #333842 50%, #000000 100%)', backgroundSize: '200% 200%', animation: 'gradient 10s ease infinite' }}>
      {isModalOpen && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(4px)',
            zIndex: 10,
          }}
        />
      )}
      <Header onAddProfessorClick={openModal} onChatAssistantClick={goToChat} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 64px)',
          paddingBottom: '64px',
          color: 'white',            
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 'bold', textAlign: 'center',  fontSize: { xs: '3rem', sm: '4rem'} }}>
          Revolutionize Your Professor Experience
        </Typography>
        <Typography variant="h5" sx={{ marginTop: 4, textAlign: 'center', color: "#FFF078", animation: 'fadeIn 3s ease-in-out infinite alternate' }}>
          Chat Assistant · Add Professors · Smart Search
        </Typography>

        {/* Feature Icons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            width: '80%',
            marginTop: '64px',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <IconButton onClick={goToChat} sx={{ color: '#FFF078', fontSize: '3rem', '&:hover': { color: '#FF4191' } }}>
              <ChatIcon fontSize="inherit" />
            </IconButton>
            <Typography variant="body1" sx={{ marginTop: '8px' }}>
              Chat Assistant
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <IconButton onClick={openModal} sx={{ color: '#FFF078', fontSize: '3rem', '&:hover': { color: '#FF4191' } }}>
              <AddCircleIcon fontSize="inherit" />
            </IconButton>
            <Typography variant="body1" sx={{ marginTop: '8px' }}>
              Add Professors
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <IconButton onClick={goToSearch} sx={{ color: '#FFF078', fontSize: '3rem', '&:hover': { color: '#FF4191' } }}>
              <SearchIcon fontSize="inherit" />
            </IconButton>
            <Typography variant="body1" sx={{ marginTop: '8px' }}>
              Smart Search
            </Typography>
          </Box>
        </Box>
      </Box>

      <Modal open={isModalOpen} onClose={closeModal}>
        <Box>
          <AddProfessorModal closeModal={closeModal} />
        </Box>
      </Modal>

      {/* CSS for Animation */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </Box>
  );
}
