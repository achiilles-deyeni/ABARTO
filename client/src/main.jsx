import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { ApiClientProvider } from './contexts/ApiClientContext.jsx'

// Define a basic theme (can be customized later)
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Example primary color (Material UI Blue)
    },
    secondary: {
      main: '#dc004e', // Example secondary color (Material UI Pink)
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstarts an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <ApiClientProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ApiClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
