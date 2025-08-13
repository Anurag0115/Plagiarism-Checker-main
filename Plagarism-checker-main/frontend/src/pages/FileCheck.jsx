import React, { useState, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  UploadFile,
  CheckCircleOutline,
  ErrorOutline,
  ExpandMore,
  Link as LinkIcon,
  Description,
} from '@mui/icons-material';
import api from '../api';

// Helper for chip color based on score
const getScoreColor = (score) => {
  if (score >= 70) return 'error';
  if (score >= 30) return 'warning';
  return 'success';
};

// Shortens URL for display
const formatSourceLink = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return url.length > 30 ? url.slice(0, 27) + '...' : url;
  }
};

export default function FileCheck() {
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleDragEvents = (e, over) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(over);
  };

  const handleDrop = (e) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files.length) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a file first.');
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await api.post('/api/check/file', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f4f6f8', minHeight: 'calc(100vh - 64px)', py: 4 }}>
      <Container maxWidth="md">
        <Paper elevation={2} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Check a Document
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Upload a file (.txt, .docx, .pdf) to perform a comprehensive plagiarism scan.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            aria-label="File upload and plagiarism check form"
          >
            <Box
              sx={{
                border: '2px dashed',
                borderColor: isDragOver ? 'primary.main' : 'grey.400',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragOver ? 'action.hover' : 'transparent',
                transition: 'border-color 0.3s, background-color 0.3s',
                userSelect: 'none',
              }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => handleDragEvents(e, true)}
              onDragLeave={(e) => handleDragEvents(e, false)}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              aria-describedby="file-upload-description"
            >
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept=".txt,.doc,.docx,.pdf"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
              />
              <UploadFile sx={{ fontSize: 50, color: 'grey.600', mb: 1 }} />
              <Typography>Drag & drop a file here, or click to select</Typography>
              <Typography
                id="file-upload-description"
                variant="body2"
                color="text.secondary"
              >
                Max file size: 10MB
              </Typography>
            </Box>

            {file && (
              <Chip
                icon={<Description />}
                label={file.name}
                onDelete={() => setFile(null)}
                sx={{ mt: 2 }}
                color="primary"
                aria-label={`Selected file: ${file.name}`}
              />
            )}

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                loading={loading}
                disabled={!file}
                aria-disabled={!file}
              >
                Check File
              </LoadingButton>
            </Box>
          </Box>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }} role="alert" aria-live="assertive">
            {error}
          </Alert>
        )}

        {result && (
          <Card variant="outlined" sx={{ p: { xs: 2, md: 3 }, mt: 4, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
                Analysis Report
              </Typography>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress
                      variant="determinate"
                      value={result.score}
                      size={120}
                      thickness={4}
                      color={getScoreColor(result.score)}
                      aria-label={`Plagiarism score: ${result.score.toFixed(1)} percent`}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                        {`${result.score.toFixed(1)}%`}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Plagiarized
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleOutline color="success" sx={{ mr: 1.5 }} />
                      <Typography>
                        <b>{result.checked}</b> sentences checked
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ErrorOutline color="warning" sx={{ mr: 1.5 }} />
                      <Typography>
                        <b>{result.matched}</b> sentences matched
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>

              {result.matches?.length > 0 && (
                <Accordion sx={{ mt: 4 }}>
                  <AccordionSummary expandIcon={<ExpandMore />} aria-controls="matched-sources-content" id="matched-sources-header">
                    <Typography sx={{ fontWeight: 500 }}>
                      View {result.matches.length} Matched Source
                      {result.matches.length > 1 ? 's' : ''}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails id="matched-sources-content">
                    <List dense>
                      {result.matches.slice(0, 20).map((m, i) => (
                        <ListItem key={i} divider>
                          <ListItemIcon>
                            <LinkIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Link
                                href={m.source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="hover"
                              >
                                {formatSourceLink(m.source.url)}
                              </Link>
                            }
                            secondary={`"${m.ngram}"`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              )}
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}
