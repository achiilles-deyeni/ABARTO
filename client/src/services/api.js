import { useAuth } from '../context/AuthContext'; // Assuming AuthContext exports useAuth

// Define the base URL for your API
const API_BASE_URL = 'http://localhost:3000/api'; // Ensure this matches your server port

/**
 * A utility function for making authenticated API calls.
 * Automatically adds the Authorization header with the JWT token.
 *
 * @param {string} endpoint - The API endpoint (e.g., '/products')
 * @param {string} [method='GET'] - The HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param {object|null} [body=null] - The request body for POST/PUT/PATCH
 * @param {string|null} [token=null] - Explicitly pass token, or it will try to get from AuthContext
 * @returns {Promise<object>} - The JSON response from the API
 * @throws {Error} - Throws an error if the fetch fails or API returns an error status
 */

 // We need a wrapper component or hook to use useAuth here effectively.
 // Let's create a hook.

 export const useApiClient = () => {
    const { token, logout } = useAuth(); // Get token and logout from context

    const makeRequest = async (endpoint, method = 'GET', body = null) => {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            method,
            headers,
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, config);

            // If unauthorized, token might be expired/invalid, logout user
            if (response.status === 401) {
                logout();
                // Optionally redirect to login or throw a specific error
                throw new Error('Unauthorized - Logging out');
            }

            const data = await response.json();

            if (!response.ok) {
                // Throw error with message from API if available
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            if (!data.success) {
                // Handle API-specific errors where success is false
                throw new Error(data.error || 'API request failed');
            }
            
            return data; // Return the full successful API response { success: true, data: ..., ... }

        } catch (error) {
            console.error(`API call failed: ${method} ${endpoint}`, error);
            // Re-throw the error so components can handle it
            throw error;
        }
    };

    return { makeRequest };
 };

 // Example of a standalone function (less ideal as it can't use useAuth hook directly)
 /*
 export const callApi = async (endpoint, method = 'GET', body = null, token) => {
    // ... implementation similar to makeRequest but needs token passed in ...
 };
 */ 