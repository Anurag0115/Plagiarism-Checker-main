// src/components/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button, Tooltip } from '@mui/material';
import { Brightness4, Brightness7, DocumentScanner } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

// A styled button component that knows if it's the active link
const NavButton = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Button
      component={RouterLink}
      to={to}
      sx={{
        color: 'inherit',
        textDecoration: 'none',
        // Style for the active link
        backgroundColor: isActive ? 'primary.dark' : 'transparent',
        '&:hover': {
          backgroundColor: isActive ? 'primary.dark' : 'rgba(255, 255, 255, 0.08)',
        },
      }}
    >
      {children}
    </Button>
  );
};

export default function Navbar({ mode, onToggleTheme }) {
  return (
    // position="sticky" keeps the navbar at the top when scrolling
    <AppBar 
      position="sticky" 
      color="primary" 
      elevation={1} 
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left side of Navbar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <DocumentScanner />
            Smart Plagiarism
          </Typography>
          
          {/* Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, ml: 2 }}>
            <NavButton to="/text">Check Text</NavButton>
            <NavButton to="/file">Check File</NavButton>
            <NavButton to="/compare">Compare</NavButton>
            <NavButton to="/dashboard">Dashboard</NavButton>
          </Box>
        </Box>

        {/* Right side of Navbar (Theme Toggle) */}
        <Box>
          <Tooltip title={`Toggle ${mode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton onClick={onToggleTheme} color="inherit">
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}