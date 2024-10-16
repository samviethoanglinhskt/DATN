import React, { useState } from 'react';
import { Grid, Box, TextField, Button, Typography, IconButton } from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material';
import 'src/assets/css/register.css'; // Add custom styles here

const Register = () => {
    const [isSignIn, setIsSignIn] = useState(true);

    // Function to toggle between sign-in and sign-up
    const toggleForm = () => {
        setIsSignIn(!isSignIn);
    };

    return (
        <Grid container className={`container1 ${isSignIn ? 'sign-in1' : 'sign-up1'}`}>
            {/* Left Section: Animated background and text */}
            <Grid
                item
                xs={12}
                md={6}
                className={`background1 ${isSignIn ? 'move-left1' : 'move-right1'}`} // Update classes for movement
            >
                <Typography variant="h3" fontWeight="bold">
                    {isSignIn ? 'Welcome' : 'Join with us'}
                </Typography>
            </Grid>

            {/* Right Section: Sign in / Sign up forms */}
            <Grid
                item
                xs={12}
                md={6}
                className={`form-container1 ${isSignIn ? 'form-sign-in1' : 'form-sign-up1'}`}
                sx={{ paddingLeft: isSignIn ? 0 : '2rem' }} // Add left padding for sign-up
            >

                <Box
                    sx={{
                        width: '100%',
                        maxWidth: '400px',
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '10px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    {isSignIn ? (
                        <Box>
                            <Typography variant="h4" gutterBottom>
                                Sign In
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    fullWidth
                                    placeholder="Username"
                                    InputProps={{
                                        startAdornment: (
                                            <IconButton>
                                                <AccountCircle />
                                            </IconButton>
                                        ),
                                    }}
                                />
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    fullWidth
                                    type="password"
                                    placeholder="Password"
                                    InputProps={{
                                        startAdornment: (
                                            <IconButton>
                                                <Lock />
                                            </IconButton>
                                        ),
                                    }}
                                />
                            </Box>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ backgroundColor: '#4EA685', color: 'white', mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Typography>
                                <b>Forgot password?</b>
                            </Typography>
                            <Typography>
                                Don't have an account?{' '}
                                <b className="pointer" style={{ cursor: 'pointer' }} onClick={toggleForm}>
                                    Sign up here
                                </b>
                            </Typography>
                        </Box>
                    ) : (
                        <Box>
                            <Typography variant="h4" gutterBottom>
                                Sign Up
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    fullWidth
                                    placeholder="Username"
                                    InputProps={{
                                        startAdornment: (
                                            <IconButton>
                                                <AccountCircle />
                                            </IconButton>
                                        ),
                                    }}
                                />
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    fullWidth
                                    placeholder="Email"
                                    InputProps={{
                                        startAdornment: (
                                            <IconButton>
                                                <AccountCircle />
                                            </IconButton>
                                        ),
                                    }}
                                />
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    fullWidth
                                    type="password"
                                    placeholder="Password"
                                    InputProps={{
                                        startAdornment: (
                                            <IconButton>
                                                <Lock />
                                            </IconButton>
                                        ),
                                    }}
                                />
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    fullWidth
                                    type="password"
                                    placeholder="Confirm password"
                                    InputProps={{
                                        startAdornment: (
                                            <IconButton>
                                                <Lock />
                                            </IconButton>
                                        ),
                                    }}
                                />
                            </Box>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ backgroundColor: '#4EA685', color: 'white', mb: 2 }}
                            >
                                Sign Up
                            </Button>
                            <Typography>
                                Already have an account?{' '}
                                <b className="pointer" style={{ cursor: 'pointer' }} onClick={toggleForm}>
                                    Sign in here
                                </b>
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Grid>
        </Grid>
    );
};

export default Register;
