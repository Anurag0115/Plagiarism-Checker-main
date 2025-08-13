import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { CompareArrows, SyncAlt, ExpandMore } from '@mui/icons-material';
import api from '../api';

// Helper to determine the color for the score display
const getScoreColor = (score) => {
  if (score >= 70) return 'error';
  if (score >= 30) return 'warning';
  return 'success';
};

export default function Compare() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function handleCompare(e) {
    e.preventDefault();
    if (!text1.trim() || !text2.trim()) return;
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const res = await api.post('/api/compare', { text1, text2 });
      const data = { score: res.data.similarity || res.data.score, ...res.data };
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ backgroundColor: '#f4f6f8', minHeight: 'calc(100vh - 64px)', py: 4 }}>
      <Container maxWidth="lg">
        <Paper elevation={2} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Compare Two Texts
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Paste two different texts below to find their similarity score and identify common phrases.
          </Typography>

          <Box component="form" onSubmit={handleCompare}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Source Text
                </Typography>
                <TextField
                  label="Paste the first text here..."
                  multiline
                  rows={8}
                  value={text1}
                  onChange={(e) => setText1(e.target.value)}
                  variant="outlined"
                  fullWidth
                  helperText={`${text1.trim().split(/\s+/).filter(Boolean).length} words, ${text1.length} characters`}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Comparison Text
                </Typography>
                <TextField
                  label="Paste the second text here..."
                  multiline
                  rows={8}
                  value={text2}
                  onChange={(e) => setText2(e.target.value)}
                  variant="outlined"
                  fullWidth
                  helperText={`${text2.trim().split(/\s+/).filter(Boolean).length} words, ${text2.length} characters`}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                startIcon={<CompareArrows />}
                loading={loading}
                disabled={!text1.trim() || !text2.trim()}
              >
                Compare Texts
              </LoadingButton>
            </Box>
          </Box>
        </Paper>

        {error && (
          <Typography color="error" sx={{ mt: 3, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        {result && (
          <Card variant="outlined" sx={{ p: { xs: 2, md: 3 }, mt: 4, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" component="h2" sx={{ fontWeight: '600', mb: 3 }}>
                Comparison Report
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
                      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                        {`${result.score.toFixed(1)}%`}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Similarity
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                  {result.matches && result.matches.length > 0 ? (
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography sx={{ fontWeight: '500' }}>
                          View {result.matches.length} Common Phrases
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List dense>
                          {result.matches.map((match, i) => (
                            <ListItem key={i} divider>
                              <ListItemIcon>
                                <SyncAlt fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary={`"${match.ngram || match.text}"`} />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  ) : (
                    <Typography color="text.secondary">
                      No significant overlapping phrases were found between the two texts.
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}
