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

function ChemicalPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { makeRequest } = useApiClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await makeRequest('/chemicals?limit=20');
        
        // Flexible data handling
        const data = Array.isArray(response?.data) ? response.data : 
                     Array.isArray(response) ? response : [];
                     
        setItems(data);

      } catch (err) {
        console.error('Error fetching chemicals:', err);
        setError(
          err.response?.data?.message || err.message || 'Failed to fetch chemicals'
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
        Chemicals
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
            <Table stickyHeader aria-label="chemical table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>CAS Number</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Expiry Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No chemicals found.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow hover key={item._id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.casNumber}</TableCell>
                      <TableCell>{item.supplier}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>
                        {item.expiryDate
                          ? new Date(item.expiryDate).toLocaleDateString()
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

export default ChemicalPage;