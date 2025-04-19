import React, { useState, useEffect } from 'react';
import {
  CircularProgress,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Box,
} from '@mui/material';
import { useApiClient } from '../contexts/ApiClientContext.jsx';

function RawMaterialPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { makeRequest } = useApiClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await makeRequest('/materials?limit=20');
        
        // Flexible data handling
        const data = Array.isArray(response?.data) ? response.data : 
                     Array.isArray(response) ? response : [];
                     
        setItems(data);
        
      } catch (err) {
        console.error('Error fetching raw materials:', err);
        setError(
          err.response?.data?.message || err.message || 'Failed to fetch raw materials'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [makeRequest]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Raw Materials
      </Typography>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {!loading && !error && (
        <Paper sx={{ mt: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="raw material table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell>Date Provided</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No raw materials found.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow hover key={item._id}>
                      <TableCell>{item.Name}</TableCell>
                      <TableCell>{item.Source}</TableCell>
                      <TableCell align="right">{item.Quantity}</TableCell>
                      <TableCell align="right">{item.price}</TableCell>
                      <TableCell>
                        {item.dateProvided
                          ? new Date(item.dateProvided).toLocaleDateString()
                          : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}

export default RawMaterialPage; 