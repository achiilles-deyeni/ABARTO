import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductPage from './pages/ProductPage';
import EmployeePage from './pages/EmployeePage';
import RawMaterialPage from './pages/RawMaterialPage';
import ChemicalPage from './pages/ChemicalPage';
import SafetyPage from './pages/SafetyPage';

import './App.css';

function App() {
  // Basic routing setup
  // Authentication context/state will be added later

  return (
    <Router>
      <Routes>
        {/* Login page stands alone, no main layout */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes using the main Layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            {/* Index route for the layout (defaults to Dashboard) */}
            <Route index element={<DashboardPage />} />
            
            {/* Add Product Route */}
            <Route path="products" element={<ProductPage />} />
            <Route path="employees" element={<EmployeePage />} />
            <Route path="materials" element={<RawMaterialPage />} />
            <Route path="chemicals" element={<ChemicalPage />} />
            <Route path="safety" element={<SafetyPage />} />
            
            {/* Add other application routes here */}
            {/* Example: */}
            {/* <Route path="employees" element={<EmployeePage />} /> */}
            
            {/* Catch-all for non-matched routes within the layout */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Route>
        </Route>

        {/* Optional: A catch-all for routes outside the main layout */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}

      </Routes>
    </Router>
  );
}

export default App;
