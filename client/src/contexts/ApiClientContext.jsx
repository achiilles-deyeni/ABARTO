import React, { createContext, useContext, useCallback, useMemo } from 'react';

// Create the context
const ApiClientContext = createContext(null);

// Create a provider component
export function ApiClientProvider({ children }) {
  // Base URL for the API - adjust if needed (e.g., from environment variables)
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  // The core request function
  const makeRequest = useCallback(async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`Making request to: ${options.method || 'GET'} ${url}`); // Log requests

    // Default headers
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json', // Added Accept header
      // Add other default headers if needed, e.g., Authorization
    };

    // Retrieve token from storage (example using localStorage)
    const token = localStorage.getItem('authToken');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    // Ensure body is stringified if present
    if (config.body && typeof config.body !== 'string') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);

      // Handle No Content or Not Modified before attempting JSON parse
      if (response.status === 204 || response.status === 304) {
        console.log(`Response from ${url}: Status ${response.status} (No Content/Not Modified)`);
        // Return null or an empty object/array as appropriate for these statuses
        // Returning null might be safest if downstream checks for truthiness
        return null; 
      }

      let responseData = null;
      const contentType = response.headers.get("content-type");
      
      // Attempt to parse JSON only if content-type indicates JSON
      if (contentType && contentType.indexOf("application/json") !== -1) {
        try {
          responseData = await response.json();
        } catch (jsonError) {
          // Handle JSON parsing error even if content-type was set
          console.error(`JSON parse error from ${url}:`, jsonError);
          if (!response.ok) {
            // If response failed AND JSON parsing failed, throw a generic error
             throw new Error(`HTTP error ${response.status} with invalid JSON body.`);
          } else {
            // If response was OK but JSON parsing failed (unexpected)
             throw new Error('Received invalid JSON response for successful request.');
          }
        }
      } else if (response.ok) {
          // Handle successful responses (2xx) that are NOT JSON
          console.warn(`Received non-JSON response (Content-Type: ${contentType}) from ${url}`);
          // Decide how to handle this - returning null or throwing an error might be options
          // For now, let's throw the specific error users were seeing
          throw new Error('Received non-JSON response for successful request.');
      }
      // else: if !response.ok and not JSON, error handling below will catch it

      console.log(`Response from ${url}: Status ${response.status}`, responseData);

      if (!response.ok) {
        const message = responseData?.message || responseData?.error || `HTTP error! status: ${response.status}`;
        const error = new Error(message);
        error.response = {
            data: responseData, // Contains parsed JSON error body if available
            status: response.status,
            headers: response.headers
        };
        throw error;
      }
      
      // Return the parsed data for successful JSON responses
      return responseData; 

    } catch (error) {
       // Log the pre-structured error or create a new one for network errors
       console.error(`API request failed: ${options.method || 'GET'} ${url}`, error);
       if (!error.response) {
           // Ensure network errors or fetch config errors are thrown as Error instances
           throw new Error(error.message || 'Network error or invalid request configuration.');
       }
       throw error; // Re-throw the structured error
    }
  }, [API_BASE_URL]); // Dependency array includes base URL in case it could change

  // Value provided by the context
  const value = useMemo(() => ({
    makeRequest,
  }), [makeRequest]);

  return (
    <ApiClientContext.Provider value={value}>
      {children}
    </ApiClientContext.Provider>
  );
}

// Create a custom hook to use the ApiClient context
export function useApiClient() {
  const context = useContext(ApiClientContext);
  if (context === null) {
    throw new Error('useApiClient must be used within an ApiClientProvider');
  }
  return context;
} 