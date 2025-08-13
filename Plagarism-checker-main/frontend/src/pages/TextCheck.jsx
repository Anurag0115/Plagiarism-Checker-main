import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
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
  Stack // <-- added this import
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { CheckCircleOutline, ErrorOutline, ExpandMore, Link as LinkIcon } from '@mui/icons-material';
import api from '../api';

// Helper to determine the color for the score display
const getScoreColor = (score) => {
  if (score >= 70) return 'error';
  if (score >= 30) return 'warning';
  return 'success';
};

// Helper to format the source link for better readability
const formatSourceLink = (url) => {
  try {
    const domain = new URL(url);
    return domain.hostname;
  } catch (e) {
    // If it's not a valid URL, return the original string truncated
    return url.length > 30 ? url.slice(0, 27) + '...' : url;
  }
};

export default function TextCheck() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.post('/api/check/text', { text });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ backgroundColor: '#f4f6f8', minHeight: 'calc(100vh - 64px)', py: 4 }}>
      <Container maxWidth="md">
        {/* --- Input Form Card --- */}
        <Paper elevation={2} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Check Text for Plagiarism
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Paste your content below to scan for potential plagiarism against online sources.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Paste your text here..."
              multiline
              rows={12}
              value={text}
              onChange={(e) => setText(e.target.value)}
              variant="outlined"
              fullWidth
              helperText={`${text.trim().split(/\s+/).filter(Boolean).length} words, ${text.length} characters`}
            />
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                loading={loading}
                disabled={!text.trim()}
              >
                Check for Plagiarism
              </LoadingButton>
            </Box>
          </Box>
        </Paper>

        {/* --- Error Display --- */}
        {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}

        {/* --- Results Display Card --- */}
        {result && (
          <Card variant="outlined" sx={{ p: { xs: 2, md: 3 }, mt: 4, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" component="h2" sx={{ fontWeight: '600', mb: 3 }}>
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
                      <Typography variant="h4" component="div" color="text.primary" sx={{ fontWeight: 'bold' }}>
                        {`${result.score.toFixed(1)}%`}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ mt: 1 }}>Plagiarized</Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleOutline color="success" sx={{ mr: 1.5 }} />
                      <Typography><b>{result.checked}</b> sentences checked</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ErrorOutline color="warning" sx={{ mr: 1.5 }} />
                      <Typography><b>{result.matched}</b> sentences matched</Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>

              {result.matches && result.matches.length > 0 && (
                <Accordion sx={{ mt: 4 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography sx={{ fontWeight: '500' }}>
                      View {result.matches.length} Matched Sources
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {result.matches.slice(0, 20).map((m, i) => (
                        <ListItem key={i} divider>
                          <ListItemIcon>
                            <LinkIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary={
                              <Link href={m.source.url} target="_blank" rel="noreferrer" underline="hover">
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
