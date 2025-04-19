import React, { useState, useEffect } from 'react';
import { useApiClient } from '../services/api';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function SafetyPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { makeRequest } = useApiClient();

  useEffect(() => {
    const fetchSafetyItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await makeRequest('/safety?limit=20');
        if (response.success) {
          setItems(response.data);
        } else {
          setError(response.error || 'Failed to fetch safety equipment.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSafetyItems();
  }, [makeRequest]);

  let content;
  if (loading) {
    content = <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  } else if (error) {
    content = <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  } else if (items.length === 0) {
    content = <Typography sx={{ mt: 2 }}>No safety equipment found.</Typography>;
  } else {
    content = (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="safety equipment table">
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Condition</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell>Date Provided</TableCell> 
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item._id}>
                {/* Note: Model uses PascalCase field names */}
                <TableCell>{item.EquipmentName}</TableCell>
                <TableCell>{item.EquipmentType}</TableCell>
                <TableCell>{item.EquipmentCondition}</TableCell>
                <TableCell>{item.EquipmentLocation}</TableCell>
                <TableCell align="right">{item.EquipmentQuantity}</TableCell>
                <TableCell>{item.EquipmentDateProvided ? new Date(item.EquipmentDateProvided).toLocaleDateString() : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Safety Equipment
      </Typography>
      {content}
    </Box>
  );
}

export default SafetyPage; 