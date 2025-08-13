// src/App.jsx
import React, { useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import createAppTheme from './theme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TextCheck from './pages/TextCheck';
import FileCheck from './pages/FileCheck';
import Compare from './pages/Compare';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [mode, setMode] = useState(() => localStorage.getItem('theme') || 'light');

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const toggleTheme = () => {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    localStorage.setItem('theme', next);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        {/* The Box component provides a consistent root for styling */}
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar mode={mode} onToggleTheme={toggleTheme} />
          {/* By removing the padding here, pages like the Dashboard can control their own background and layout fully */}
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/text" element={<TextCheck />} />
              <Route path="/file" element={<FileCheck />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}