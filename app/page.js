'use client'
import { useState } from "react";
import { AppBar, Box, Button, Stack, TextField, Typography, Toolbar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import RateReviewIcon from '@mui/icons-material/RateReview';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm the ProfInsight: A Rate My Professor support assistant. How can I help you today?"
    }
  ])

  const [message, setMessage] = useState('')
  const [modalOpen, setModalOpen] = useState(false);
  const [profPage, setProfPage] = useState('');

  const sendMessage = async () => {
    if (!message.trim()) return;
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: '' }
    ])
    setMessage('')

    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let result = ''

      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
        return reader.read().then(processText)
      })
    })
  }


  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const [loading, setLoading] = useState(false);

const handleUrlSubmit = async (url) => {
   setLoading(true);  // Start loading
   console.log("Submitting URL:", url);

   const isValidUrl = /^https:\/\/www\.ratemyprofessors\.com\/professor\/\d+$/.test(url);
   if (!isValidUrl) {
       alert('Invalid RateMyProfessor URL.');
       setLoading(false);
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
       alert("Professor page added");
     } else {
       console.log("Error:", result.error);
       setProfPage('');
       alert("Professor page not added: " + result.error);
     }
   } catch (error) {
     console.error('Error during submission:', error);
     setProfPage('');
     alert("Professor page not added");
   } finally {
     setLoading(false);  // Stop loading
   }
};


  // const handleUrlSubmit = async (url) => {
  //   console.log("Submitting URL:", url); // Log the URL being submitted
  //   try {
  //     const response = await fetch('/api/addModal', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ profPage: url }),
  //     });

  //     const result = await response.json();
  //     console.log('Submission Response:', result);  // Log the submission response
      
  //   //   if (!response.body) {
  //   //     setProfPage('')
  //   //     alert("Professor page not added")
  //   //     throw new Error('Response body is null')
  //   //   } else {
  //   //     console.log("success")
  //   //     setProfPage('')
  //   //     alert("Professor page added")
  //   //   }
  //   // } catch {
  //   //   console.log("error")
  //   //   setProfPage('')
  //   //   alert("Professor page not added")
  //   // } 
  //   if (response.ok) {
  //     setProfPage('');
  //     alert("Professor page added");
  //   } else {
  //     console.log("Error:", result.error);
  //     setProfPage('');
  //     alert("Professor page not added: " + result.error);
  //   }
  // } catch (error) {
  //   console.error('Error during submission:', error);  // Log errors during submission
  //   setProfPage('');
  //   alert("Professor page not added");
  // } 
  // };

  return (
    <Box
      className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden"
      sx={{ 
        backgroundColor: '#000000', 
        overflow: 'hidden', 
        fontFamily: 'Inter, sans-serif' 
      }}
    >
      <AppBar 
        position="static"
        sx={{
          background: 'linear-gradient(90deg, #333842 0%, #1A2130 90%)',
          boxShadow: 'none',
          padding: '0 24px',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            sx={{ display: 'flex', alignItems: 'center', color: '#FFFFFF', fontWeight: 'bold' }}
          >
            <img src="/Logo.png" alt="Logo" style={{ height: '40px', marginRight: '16px' }} />
            ProfInsight
          </Typography>
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
              }} onClick={handleModalOpen}
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
            >
              Chat Assistant
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

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
      <Dialog open={modalOpen} onClose={handleModalClose}>
        <DialogTitle>Submit a Professor Page for Review</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Professor Page URL"
            fullWidth
            variant="outlined"
            value={profPage}
            onChange={(e) => setProfPage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => { handleUrlSubmit(profPage); handleModalClose(); }} color="primary" disabled={loading} >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
