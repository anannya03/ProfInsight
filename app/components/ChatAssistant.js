'use client';
import { useState } from "react";
import { Box, Stack, TextField, Button } from '@mui/material';

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm the ProfInsight: A Rate My Professor support assistant. How can I help you today?"
    }
  ]);

  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    if (!message.trim()) return;
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: '' }
    ]);
    setMessage('');

    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
        return reader.read().then(processText);
      });
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 64px)', // Full height minus AppBar
        width: '100%',
        padding: '16px',
      }}
    >
      <Stack
        direction="column"
        width={{ xs: '100%', sm: '80%', md: '500px' }}
        height="90%"
        maxHeight="100%"
        border="1px solid"
        borderColor="#3a3a3a"
        p={4}
        spacing={3}
        className="rounded-lg shadow-lg"
        sx={{
          animation: 'fadeIn 1.5s ease',
          backgroundColor: '#24252D',
          borderRadius: '12px',
        }}
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          className="scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-600"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                sx={{
                  bgcolor: message.role === 'assistant' ? '#FFF078' : '#FF4191',
                  color: message.role === 'assistant' ? 'black' : 'white',
                  borderRadius: '8px',
                  p: 2,
                  maxWidth: '75%',
                  fontSize: '0.9rem',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            placeholder="Type your message..."
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
            className="rounded-md shadow-inner text-white"
            InputProps={{
              style: {
                backgroundColor: '#3A3B47',
                borderRadius: '12px',
                color: '#f0f0f0',
              },
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            sx={{
              backgroundColor: '#FF4191',
              '&:hover': {
                backgroundColor: '#E90074',
              },
              borderRadius: '12px',
              fontWeight: '500',
              color: '#FFFFFF',
            }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
