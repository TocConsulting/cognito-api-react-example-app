// src/config.js
// Configuration management for the application

/**
 * Get the API configuration from environment variables
 * with fallback to default values for development
 */
export const getApiConfig = () => {
  return {
    // API base URL - defaults to development URL if not set
    apiUrl: import.meta.env.VITE_API_URL || '',
    
    // API key for authentication
    apiKey: import.meta.env.VITE_API_KEY || '',
  };
};

/**
 * Get environment name for conditional behavior
 */
export const getEnvironment = () => {
  return import.meta.env.MODE || 'development';
};

/**
 * Check if we're in production mode
 */
export const isProduction = () => {
  return getEnvironment() === 'production';
};

/**
 * Create headers with API key and optional authorization
 */
export const createHeaders = (token = null) => {
  const { apiKey } = getApiConfig();
  
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export default {
  getApiConfig,
  getEnvironment,
  isProduction,
  createHeaders
};
