import React, { useState, useEffect } from 'react';
import { useApiClient } from '../contexts/ApiClientContext.jsx';
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

function ProductPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { makeRequest } = useApiClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await makeRequest('/products?limit=20');
        
        const data = Array.isArray(response?.data) ? response.data : 
                     Array.isArray(response) ? response : [];
                     
        setItems(data);

      } catch (err) { 
        console.error('Error fetching products:', err);
        setError(
          err.response?.data?.message || err.message || 'Failed to fetch products'
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
        Products
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
            <Table stickyHeader aria-label="product table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow hover key={item._id}>
                      <TableCell component="th" scope="row">
                        {item.name}
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell align="right">{item.price?.toFixed(2)}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
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

export default ProductPage; 