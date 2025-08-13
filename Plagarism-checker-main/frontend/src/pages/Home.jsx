import React from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Article, UploadFile, CompareArrows, ArrowForward } from '@mui/icons-material';

const featureCards = [
  {
    icon: <Article fontSize="large" color="primary" />,
    title: 'Check Text',
    description: 'Paste your text directly into our editor to quickly check for plagiarism against billions of sources.',
    link: '/text',
  },
  {
    icon: <UploadFile fontSize="large" color="primary" />,
    title: 'Check File',
    description: 'Upload your documents (.txt, .docx, .pdf) to perform a comprehensive plagiarism scan.',
    link: '/file',
  },
  {
    icon: <CompareArrows fontSize="large" color="primary" />,
    title: 'Compare Documents',
    description: 'Compare two separate documents against each other to find similarities and overlapping content.',
    link: '/compare',
  },
];

export default function Home() {
  return (
    <Box>
      {/* Main Hero Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          py: 6,
          textAlign: 'center',
          background: (theme) =>
            `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${
              theme.palette.mode === 'light' ? '#f4f6f8' : '#1a2027'
            } 100%)`,
        }}
      >
        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              background: (theme) =>
                `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Uncover Plagiarism with Confidence
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ mb: 4, maxWidth: { xs: '100%', sm: '700px' }, mx: 'auto' }}
          >
            Our powerful and intuitive tool helps you ensure the originality of your work by checking against a vast database of online sources.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              component={RouterLink}
              to="/text"
              variant="contained"
              size="large"
              startIcon={<Article />}
              aria-label="Check text for plagiarism"
            >
              Check Text
            </Button>
            <Button
              component={RouterLink}
              to="/file"
              variant="outlined"
              size="large"
              startIcon={<UploadFile />}
              aria-label="Check file for plagiarism"
            >
              Check a File
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Feature Cards Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}
        >
          Core Features
        </Typography>
        <Grid container spacing={4}>
          {featureCards.map((card) => (
            <Grid item xs={12} md={4} key={card.title}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 8,
                  },
                }}
                role="region"
                aria-labelledby={`${card.title.replace(/\s/g, '-').toLowerCase()}-title`}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Stack spacing={2} alignItems="center" textAlign="center">
                    {card.icon}
                    <Typography 
                      id={`${card.title.replace(/\s/g, '-').toLowerCase()}-title`} 
                      variant="h5" 
                      component="h3" 
                      sx={{ fontWeight: 600 }}
                    >
                      {card.title}
                    </Typography>
                    <Typography color="text.secondary">{card.description}</Typography>
                  </Stack>
                </CardContent>
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Button
                    component={RouterLink}
                    to={card.link}
                    endIcon={<ArrowForward />}
                    aria-label={`Get started with ${card.title}`}
                  >
                    Get Started
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
