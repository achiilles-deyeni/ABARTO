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

function EmployeePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { makeRequest } = useApiClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await makeRequest('/employees?limit=20');
        
        // Flexible data handling
        const data = Array.isArray(response?.data) ? response.data : 
                     Array.isArray(response) ? response : [];
                     
        setItems(data);

      } catch (err) {
        console.error('Error fetching employees:', err);
        setError(
          err.response?.data?.message || err.message || 'Failed to fetch employees'
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
        Employees
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
            <Table stickyHeader aria-label="employee table">
              <TableHead>
                <TableRow>
                  {/* Adjust TableCell names based on your Employee model */}
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Hire Date</TableCell>
                  {/* Add other relevant headers based on your model */}
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center"> {/* Adjust colSpan based on number of columns */}
                      No employees found.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow hover key={item._id}> {/* Assuming _id is the unique key */}
                      <TableCell>{`${item.firstName} ${item.lastName}`}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.phone}</TableCell>
                      <TableCell>{item.department}</TableCell>
                      <TableCell>{item.position}</TableCell>
                      <TableCell>
                        {item.hireDate
                          ? new Date(item.hireDate).toLocaleDateString()
                          : 'N/A'}
                      </TableCell>
                      {/* Render other data cells corresponding to headers */}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Optional: Add Pagination Controls here if needed */}
        </Paper>
      )}
    </Box>
  );
}

export default EmployeePage; 