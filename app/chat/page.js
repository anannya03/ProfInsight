'use client';
import { useState } from 'react';
import { Box , Modal} from '@mui/material';
import Header from '../components/Header';
import ChatAssistant from '../components/ChatAssistant';
import AddProfessorModal from '../components/AddProfessorModal';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const goToChat = () => {
    router.push('/chat');
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Box sx={{ backgroundColor: '#000000', minHeight: '100vh' }}>
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
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 64px)',
          padding: '16px',
        }}
      >
        <ChatAssistant />
      </Box>
      <Modal open={isModalOpen} onClose={closeModal}>
        <Box>
          <AddProfessorModal closeModal={closeModal} />
        </Box>
      </Modal>
    </Box>
  );
}
