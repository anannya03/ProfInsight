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
                padding: '8px 16px',
            }}
        >
            <Toolbar                
                sx={{
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    justifyContent: { xs: 'center', sm: 'space-between' },
                    width: '100%',
                }}
            >
                <Link href="/" passHref>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            marginBottom: { xs: 2, sm: 0 },
                            justifyContent: { xs: 'center', sm: 'flex-start' },
                            width: { xs: '100%', sm: 'auto' },
                        }}
                    >
                        <img src="/Logo.png" alt="Logo" style={{ height: '40px', marginRight: '8px' }} />
                        <Typography
                            sx={{
                                color: '#FFFFFF',
                                fontWeight: 'bold',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            ProfInsight
                        </Typography>
                    </Box>
                </Link>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'row', sm: 'row' },
                        alignItems: 'center',
                        justifyContent: { xs: 'center', sm: 'flex-end' },
                        width: { xs: '100%', sm: 'auto' },
                        paddingBottom: { xs: '4px', sm: 'auto' },
                    }}
                >
                    <Button
                        startIcon={<RateReviewIcon />}
                        variant="outlined"
                        sx={{
                            marginRight: 2,
                            borderColor: '#f0f0f0',
                            color: '#f0f0f0',
                            fontWeight: 'bold',
                            fontSize: { xs: '0.75rem', sm: '1rem' },
                            '&:hover': {
                                borderColor: '#ffffff',
                                backgroundColor: '#4a4a4a',
                            },
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
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
                            fontSize: { xs: '0.75rem', sm: '1rem' },
                            '&:hover': {
                                backgroundColor: '#E90074',
                            },
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
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