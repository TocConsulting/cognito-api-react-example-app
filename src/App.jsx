import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, ChevronLeft, Shield, User, Mail, Phone, Key, LogIn, LogOut, Lock } from 'lucide-react';
import './App.css';
import { getApiConfig } from './config';

function App() {
  const [currentStep, setCurrentStep] = useState('register');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  
  // User data
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  // Authentication data
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationSession, setVerificationSession] = useState('');
  const [tokens, setTokens] = useState({
    idToken: '',
    accessToken: '',
    refreshToken: ''
  });
  const [userInfo, setUserInfo] = useState(null);
  
  // Get API configuration from environment variables
  const { apiUrl, apiKey } = getApiConfig();
  
  // Initialize dark mode from user preference
  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDarkMode);
    
    // Apply dark mode if needed
    if (prefersDarkMode) {
      document.documentElement.classList.add('dark-mode');
    }
  }, []);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark-mode');
  };
  
  const resetMessages = () => {
    setError('');
    setSuccess('');
  };
  
  const handleBackButton = () => {
    resetMessages();
    
    // Handle going back based on current step
    switch (currentStep) {
      case 'confirm':
        setCurrentStep('register');
        break;
      case 'mfa-setup':
        setCurrentStep('confirm');
        break;
      case 'mfa-verify':
        setCurrentStep('login');
        break;
      case 'authenticated':
        // Logout
        setTokens({
          idToken: '',
          accessToken: '',
          refreshToken: ''
        });
        setUserInfo(null);
        setCurrentStep('login');
        break;
      default:
        // Do nothing for other steps
        break;
    }
  };
  
  // Register a new user
  const handleRegister = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    
    try {
      const response = await fetch(`${apiUrl}/v1/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          mobile_phone_number: phoneNumber
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUserId(data.user_id);
        setSuccess('User registered successfully! Check your email for the temporary password.');
        setCurrentStep('confirm');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Confirm user with temporary password
  const handleConfirmUser = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    
    try {
      const response = await fetch(`${apiUrl}/v1/users/${userId}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          email: email,
          temporary_password: tempPassword,
          new_password: newPassword
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setQrCodeUrl(data.qr_code_secret_url);
        setSuccess('User confirmed! Set up MFA with the QR code below.');
        setCurrentStep('mfa-setup');
        setPassword(newPassword); // Save password for later login
      } else {
        setError(data.message || 'Confirmation failed');
      }
    } catch (err) {
      setError('Confirmation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Confirm MFA setup
  const handleConfirmMfa = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    
    try {
      const response = await fetch(`${apiUrl}/v1/users/${userId}/confirm-mfa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          email: email,
          otp: otpCode
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('MFA confirmed successfully! You can now log in.');
        setCurrentStep('login');
        setOtpCode('');
      } else {
        setError(data.message || 'MFA confirmation failed');
      }
    } catch (err) {
      setError('MFA confirmation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Login (first step)
  const handleLogin = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    
    try {
      const response = await fetch(`${apiUrl}/v1/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setVerificationSession(data.verification_session);
        setSuccess('Enter the MFA code from your authenticator app');
        setCurrentStep('mfa-verify');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Verify MFA to complete login
  const handleVerifyMfa = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    
    try {
      const response = await fetch(`${apiUrl}/v1/mfa-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          email: email,
          verification_type: 'SOFTWARE_TOKEN_MFA',
          verification_session: verificationSession,
          otp_code: otpCode
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTokens({
          idToken: data.id_token,
          accessToken: data.access_token,
          refreshToken: data.refresh_token
        });
        setSuccess('Login successful!');
        setCurrentStep('authenticated');
        setOtpCode('');
        
        // Get user info using the id_token
        getUserInfo(data.id_token);
      } else {
        setError(data.message || 'MFA verification failed');
      }
    } catch (err) {
      setError('MFA verification failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Refresh tokens
  const handleRefreshToken = async () => {
    resetMessages();
    setLoading(true);
    
    try {
      const response = await fetch(`${apiUrl}/v1/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          email: email,
          refresh_token: tokens.refreshToken
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTokens({
          idToken: data.id_token,
          accessToken: data.access_token,
          refreshToken: data.refresh_token
        });
        setSuccess('Tokens refreshed successfully!');
        
        // Get updated user info with new id_token
        getUserInfo(data.id_token);
      } else {
        setError(data.message || 'Token refresh failed');
      }
    } catch (err) {
      setError('Token refresh failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Get user info
  const getUserInfo = async (idToken) => {
    try {
      const response = await fetch(`${apiUrl}/v1/userinfo`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'x-api-key': apiKey
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUserInfo(data);
      }
    } catch (err) {
      console.error('Failed to get user info:', err);
    }
  };
  
  // Switch to login form
  const switchToLogin = () => {
    resetMessages();
    setCurrentStep('login');
  };
  
  // Switch to register form
  const switchToRegister = () => {
    resetMessages();
    setCurrentStep('register');
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-container">
          <Shield size={32} className="logo-icon" />
          <h1>CognitoApi Demo</h1>
        </div>
        
        <button 
          className="theme-toggle" 
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </header>
      
      <main className="App-main">
        {(currentStep !== 'register' && currentStep !== 'login') && (
          <button className="back-button" onClick={handleBackButton}>
            <ChevronLeft size={16} />
            {currentStep === 'authenticated' ? 'Logout' : 'Back'}
          </button>
        )}
        
        {error && (
          <div className="message error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="message success-message">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}
        
        {currentStep === 'register' && (
          <div className="form-container">
            <h2><User size={20} /> Register New User</h2>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name:</label>
                <div className="input-with-icon">
                  <User size={18} />
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <div className="input-with-icon">
                  <Mail size={18} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number:</label>
                <div className="input-with-icon">
                  <Phone size={18} />
                  <input
                    id="phoneNumber"
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </div>
              
              <button type="submit" className="primary-button" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
              
              <div className="form-footer">
                Already have an account? <button type="button" className="text-button" onClick={switchToLogin}>Log In</button>
              </div>
            </form>
          </div>
        )}
        
        {currentStep === 'confirm' && (
          <div className="form-container">
            <h2><Key size={20} /> Confirm User</h2>
            <form onSubmit={handleConfirmUser}>
              <div className="form-group">
                <label htmlFor="tempPassword">Temporary Password (from email):</label>
                <div className="input-with-icon">
                  <Key size={18} />
                  <input
                    id="tempPassword"
                    type="password"
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">New Password:</label>
                <div className="input-with-icon">
                  <Lock size={18} />
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <button type="submit" className="primary-button" disabled={loading}>
                {loading ? 'Confirming...' : 'Confirm User'}
              </button>
            </form>
          </div>
        )}
        
        {currentStep === 'mfa-setup' && (
          <div className="form-container">
            <h2><Shield size={20} /> Set Up MFA</h2>
            <div className="qr-container">
              <p>Scan this QR code with your authenticator app:</p>
              <img src={qrCodeUrl} alt="MFA QR Code" className="qr-code" />
            </div>
            
            <form onSubmit={handleConfirmMfa}>
              <div className="form-group">
                <label htmlFor="otpCode">Enter OTP Code:</label>
                <div className="input-with-icon">
                  <Lock size={18} />
                  <input
                    id="otpCode"
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                    autoComplete="off"
                    required
                  />
                </div>
              </div>
              
              <button type="submit" className="primary-button" disabled={loading}>
                {loading ? 'Confirming MFA...' : 'Confirm MFA'}
              </button>
            </form>
          </div>
        )}
        
        {currentStep === 'login' && (
          <div className="form-container">
            <h2><LogIn size={20} /> Login</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="loginEmail">Email:</label>
                <div className="input-with-icon">
                  <Mail size={18} />
                  <input
                    id="loginEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="loginPassword">Password:</label>
                <div className="input-with-icon">
                  <Lock size={18} />
                  <input
                    id="loginPassword"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <button type="submit" className="primary-button" disabled={loading}>
                {loading ? 'Logging in...' : 'Log In'}
              </button>
              
              <div className="form-footer">
                Don't have an account? <button type="button" className="text-button" onClick={switchToRegister}>Register</button>
              </div>
            </form>
          </div>
        )}
        
        {currentStep === 'mfa-verify' && (
          <div className="form-container">
            <h2><Shield size={20} /> Verify MFA</h2>
            <form onSubmit={handleVerifyMfa}>
              <div className="form-group">
                <label htmlFor="verifyOtpCode">Enter OTP Code from Authenticator App:</label>
                <div className="input-with-icon">
                  <Lock size={18} />
                  <input
                    id="verifyOtpCode"
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                    autoComplete="off"
                    required
                  />
                </div>
              </div>
              
              <button type="submit" className="primary-button" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify MFA'}
              </button>
            </form>
          </div>
        )}
        
        {currentStep === 'authenticated' && (
          <div className="authenticated-container">
            <h2><CheckCircle size={24} className="success-icon" /> Authenticated!</h2>
            
            <div className="token-info">
              <h3>Tokens:</h3>
              <div className="token-item">
                <span className="token-label">ID Token:</span>
                <span className="token-value">{tokens.idToken.substring(0, 20)}...</span>
              </div>
              <div className="token-item">
                <span className="token-label">Access Token:</span>
                <span className="token-value">{tokens.accessToken.substring(0, 20)}...</span>
              </div>
              <div className="token-item">
                <span className="token-label">Refresh Token:</span>
                <span className="token-value">{tokens.refreshToken.substring(0, 20)}...</span>
              </div>
              
              <button
                onClick={handleRefreshToken}
                className="refresh-button"
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh Tokens'}
              </button>
            </div>
            
            {userInfo && (
              <div className="user-info">
                <h3>User Info:</h3>
                <pre>{JSON.stringify(userInfo, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </main>
      
      <footer className="App-footer">
        <p>CognitoApi Demo App &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
