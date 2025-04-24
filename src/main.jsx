import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

// Check if user prefers dark mode
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Apply dark mode to root element if needed
if (prefersDarkMode) {
  document.documentElement.classList.add('dark-mode');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
