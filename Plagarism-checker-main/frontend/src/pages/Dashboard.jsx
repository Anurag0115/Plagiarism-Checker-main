import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip,
  Skeleton,
  Alert,
  AlertTitle
} from '@mui/material';
import api from '../api';

// Helper function to determine the color and label of the score chip
const getScoreChipProps = (score) => {
  const scoreValue = parseFloat(score);
  if (scoreValue >= 70) {
    return { color: 'error', label: `${scoreValue.toFixed(1)}%` };
  }
  if (scoreValue >= 30) {
    return { color: 'warning', label: `${scoreValue.toFixed(1)}%` };
  }
  return { color: 'success', label: `${scoreValue.toFixed(1)}%` };
};

// Skeleton loader for the table
const TableSkeleton = () => (
  <Box sx={{ mt: 3 }}>
    {[...Array(5)].map((_, index) => (
      <Skeleton key={index} variant="rectangular" height={52} sx={{ mb: 1, borderRadius: 1 }} />
    ))}
  </Box>
);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // To prevent state update if component unmounts during fetch

    api.get('/api/dashboard')
      .then(response => {
        if (isMounted) {
          setData(response.data);
          setError(null);
        }
      })
      .catch(err => {
        console.error("Failed to fetch dashboard data:", err);
        if (isMounted) {
          setError("Could not load recent checks. Please try again later.");
          setData(null);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const renderContent = () => {
    if (loading) {
      return <TableSkeleton />;
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      );
    }

    if (data?.recent?.length === 0) {
      return (
        <Alert severity="info" sx={{ mt: 3 }}>
          <AlertTitle>No Checks Found</AlertTitle>
          You haven't performed any plagiarism checks yet.
        </Alert>
      );
    }

    return (
      <TableContainer sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ '& .MuiTableCell-root': { fontWeight: 'bold', backgroundColor: 'grey.100' } }}>
              <TableCell>Type</TableCell>
              <TableCell>Similarity Score</TableCell>
              <TableCell>Date Checked</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.recent.map((r, i) => (
              <TableRow key={i} hover>
                <TableCell sx={{ textTransform: 'capitalize' }}>{r.type}</TableCell>
                <TableCell>
                  <Chip {...getScoreChipProps(r.score)} />
                </TableCell>
                <TableCell>
                  {r.timestamp
                    ? new Date(r.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  <Box
                    component="pre"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      backgroundColor: 'grey.200',
                      padding: '8px 12px',
                      borderRadius: 1,
                      maxHeight: '100px',
                      overflowY: 'auto',
                      fontFamily: 'monospace',
                      fontSize: '0.8rem'
                    }}
                  >
                    {JSON.stringify(r.detail, null, 2)}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ backgroundColor: '#f4f6f8', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Recent Checks
          </Typography>
          {renderContent()}
        </Paper>
      </Container>
    </Box>
  );
}
