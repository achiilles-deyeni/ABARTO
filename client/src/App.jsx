import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// Define the base URL for your API
const API_BASE_URL = 'http://localhost:3000/api'; // Adjust port if needed

function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching --- 
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true); // Start loading
      setError(null); // Reset error

      try {
        // TODO: Add authentication token here when needed
        const response = await fetch(`${API_BASE_URL}/products?limit=10`); // Fetch first 10 products
        
        if (!response.ok) {
          // Handle HTTP errors (e.g., 404, 500)
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();

        if (result.success) {
          setProducts(result.data); // Assuming the API returns { success: true, data: [...] }
        } else {
          // Handle API-specific errors (e.g., { success: false, error: '...' })
          throw new Error(result.error || 'Failed to fetch products');
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false); // Stop loading regardless of success/failure
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // --- Rendering Logic --- 
  let content;
  if (isLoading) {
    content = <p>Loading products...</p>;
  } else if (error) {
    content = <p style={{ color: 'red' }}>Error fetching products: {error}</p>;
  } else if (products.length === 0) {
    content = <p>No products found.</p>;
  } else {
    content = (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}> {/* Use MongoDB's _id as the key */}
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.price?.toFixed(2)}</td> {/* Optional chaining and formatting */}
              <td>{product.quantity}</td>
              <td>{product.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <>
      <h1>ABARTO Inventory Management</h1>
      
      {/* Remove the default Vite content */} 
      {/* 
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      */}

      <div className="product-list">
        <h2>Product List</h2>
        {content}
      </div>
    </>
  )
}

export default App
