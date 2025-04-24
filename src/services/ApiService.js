// src/services/ApiService.js
// Service for handling API requests

import { getApiConfig, createHeaders } from '../config';

/**
 * API Service class to handle all API requests
 */
class ApiService {
  constructor() {
    const { apiUrl } = getApiConfig();
    this.baseUrl = apiUrl;
  }

  /**
   * Register a new user
   * @param {Object} userData - User data including full_name, email, mobile_phone_number
   * @returns {Promise} - API response
   */
  async registerUser(userData) {
    try {
      const response = await fetch(`${this.baseUrl}/v1/users`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(userData)
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'User registration failed');
    }
  }

  /**
   * Confirm a user with temporary password
   * @param {string} userId - User ID
   * @param {Object} confirmData - Confirmation data including email, temporary_password, new_password
   * @returns {Promise} - API response
   */
  async confirmUser(userId, confirmData) {
    try {
      const response = await fetch(`${this.baseUrl}/v1/users/${userId}/confirm`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(confirmData)
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'User confirmation failed');
    }
  }

  /**
   * Confirm MFA setup
   * @param {string} userId - User ID
   * @param {Object} mfaData - MFA data including email, otp
   * @returns {Promise} - API response
   */
  async confirmMfa(userId, mfaData) {
    try {
      const response = await fetch(`${this.baseUrl}/v1/users/${userId}/confirm-mfa`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(mfaData)
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'MFA confirmation failed');
    }
  }

  /**
   * Login user (first step)
   * @param {Object} loginData - Login data including email, password
   * @returns {Promise} - API response
   */
  async login(loginData) {
    try {
      const response = await fetch(`${this.baseUrl}/v1/login`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(loginData)
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Login failed');
    }
  }

  /**
   * Verify MFA to complete login
   * @param {Object} verifyData - Verification data
   * @returns {Promise} - API response
   */
  async verifyMfa(verifyData) {
    try {
      const response = await fetch(`${this.baseUrl}/v1/mfa-verify`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(verifyData)
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'MFA verification failed');
    }
  }

  /**
   * Refresh authentication tokens
   * @param {Object} refreshData - Refresh data including email, refresh_token
   * @returns {Promise} - API response
   */
  async refreshToken(refreshData) {
    try {
      const response = await fetch(`${this.baseUrl}/v1/refresh-token`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(refreshData)
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Token refresh failed');
    }
  }

  /**
   * Get user information using ID token
   * @param {string} idToken - ID token
   * @returns {Promise} - API response
   */
  async getUserInfo(idToken) {
    try {
      const response = await fetch(`${this.baseUrl}/v1/userinfo`, {
        method: 'GET',
        headers: createHeaders(idToken)
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Failed to get user info');
    }
  }

  /**
   * Handle API response
   * @param {Response} response - Fetch API response
   * @returns {Promise} - Parsed response
   */
  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || `Error: ${response.status}`
      };
    }
    
    return data;
  }

  /**
   * Handle API error
   * @param {Error} error - Error object
   * @param {string} defaultMessage - Default error message
   * @returns {Error} - Formatted error
   */
  handleError(error, defaultMessage) {
    console.error('API error:', error);
    
    // Return a formatted error object
    return {
      message: error.message || defaultMessage,
      status: error.status || 500,
      original: error
    };
  }
}

export default new ApiService();
