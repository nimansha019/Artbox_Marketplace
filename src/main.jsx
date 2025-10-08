// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';

// Clean up invalid tokens on app startup
const cleanupInvalidTokens = () => {
  const token = localStorage.getItem('token');
  if (token) {
    // Basic validation to check if token looks like a JWT
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('Removing invalid token from localStorage');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
};

cleanupInvalidTokens();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>   {/* ✅ use AppProvider */}
        <App />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>
);
