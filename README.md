# 🔐 CognitoApi Demo App 
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/) [![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/) [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) [![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://react.dev/)

A modern, responsive React application demonstrating a complete authentication flow using the [CognitoApi](https://cognito-api.com/). This demo includes user registration, email confirmation, MFA setup and verification, JWT-based authentication, and token refresh functionality.

## ✨ Features

- 🔐 **Complete Authentication Flow** - Registration, confirmation, MFA, login
- 📱 **Multi-factor Authentication** - QR code generation for authenticator apps
- 🔑 **JWT Token Management** - Handle ID, access and refresh tokens
- 📊 **Responsive Design** - Works on mobile, tablet, and desktop
- 🌓 **Dark/Light Mode** - Automatic theme detection with manual toggle
- ⚙️ **Environment Configuration** - Easily configurable API endpoints and keys

## 📋 Prerequisites

- 📦 Node.js 18.x or later
- 🧰 npm or yarn
- 🔌 A running instance of the [CognitoApi](https://cognito-api.com/)

## 🏗️ Project Structure

```
cognito-api-react-example-app/
├── public/             # Public assets
│   ├── shield-logo.svg # SVG logo
│   ├── logo192.png     # PWA icon
│   ├── logo512.png     # PWA icon
├── src/                # Source files
│   ├── App.jsx         # Main application component
│   ├── App.css         # Application styles
│   ├── config.js       # Configuration management
│   ├── main.jsx        # Application entry point
│   ├── services/       # Service layer
│   │   └── ApiService.js  # API handling service
├── .env.local          # Environment configuration (not in repo)
├── index.html          # HTML entry point
├── vite.config.js      # Vite configuration
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/CloudinitFrance/cognito-api-react-example-app.git
   cd cognito-api-react-example-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:
   ```
   VITE_API_URL=https://your-api-url.com
   VITE_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. The application will be available at `http://localhost:3000` 🎉

## 🔄 Authentication Flow

This demo app implements a complete authentication flow:

1. ✍️ **Registration**: User provides name, email, and phone number
2. ✅ **Confirmation**: User receives a temporary password via email and sets a new password
3. 🛡️ **MFA Setup**: User scans a QR code with an authenticator app and confirms with an OTP
4. 🔑 **Login**: User logs in with email and password
5. 🔐 **MFA Verification**: User verifies identity using an OTP from their authenticator app
6. 🎯 **Authentication**: Upon successful verification, the user receives JWT tokens and user information
7. 🔄 **Token Refresh**: User can refresh their tokens to maintain authentication

## 🧩 API Integration

The application integrates with the authentication API with the following endpoints:

- 📝 `POST /v1/users` - Register a new user
- ✅ `POST /v1/users/{user_id}/confirm` - Confirm user with temporary password
- 🛡️ `POST /v1/users/{user_id}/confirm-mfa` - Confirm MFA setup
- 🔑 `POST /v1/login` - First step of login
- 🔐 `POST /v1/mfa-verify` - Verify MFA to complete login
- 🔄 `POST /v1/refresh-token` - Refresh authentication tokens
- 👤 `GET /v1/userinfo` - Get user information

## 🎨 Customization

### 🎨 Theming

The application uses CSS variables for theming. You can easily customize the colors by editing the variables in `App.css`:

```css
:root {
  --primary-color: #3b82f6;
  --primary-light: #60a5fa;
  --primary-dark: #2563eb;
  /* ... other variables ... */
}
```

### ⚙️ API Configuration

API endpoints and keys are configured using environment variables. In development, create a `.env.local` file with the following variables:

```
VITE_API_URL=https://your-api-url.com
VITE_API_KEY=your_api_key_here
```

For production, set these environment variables in your hosting environment.

## 📱 Responsive Design

The application is fully responsive and works on devices of all sizes:

- 📱 **Mobile**: Optimized for screens 480px and below
- 📱 **Tablet**: Optimized for screens between 481px and 768px
- 💻 **Desktop**: Optimized for screens 769px and above

## 🌓 Dark Mode

The application supports both light and dark modes:

- 🌙 Automatically detects system preferences
- 🔄 Allows manual toggling with the theme button in the header
- ✨ Smoothly transitions between themes

## 🔒 Security Considerations

- 🔐 All passwords are securely transmitted to the API
- 🛑 The app never stores passwords in local storage
- 🔒 Tokens are kept in memory and not persisted between sessions
- 🛡️ MFA provides an additional layer of security

## ❓ Troubleshooting

If you encounter issues starting the application:

- 📂 Ensure all files are in their correct locations according to the project structure
- 📦 Verify that all dependencies are installed with `npm install`
- 🔍 Check for errors in the browser console
- ⚙️ Make sure your `.env.local` file is properly configured

## 📚 Additional Resources

- [React Documentation](https://react.dev/) - Frontend library
- [Vite Documentation](https://vitejs.dev/) - Build tool
- [JSON Web Tokens](https://jwt.io/) - Authentication tokens
- [TOTP MFA](https://en.wikipedia.org/wiki/Time-based_One-time_Password_algorithm) - Multi-factor authentication

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add some amazing feature'`)
4. 🚀 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔍 Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgements

- ⚛️ [React](https://react.dev/) - UI Library
- ⚡ [Vite](https://vitejs.dev/) - Development Environment
- 🎨 [Lucide Icons](https://lucide.dev/) - Beautiful icons
- 🛡️ [CognitoApi](https://cognito-api.com/) - Core authentication functionality ([GitHub](https://github.com/CloudinitFrance/cognito-api))
- 🟨 [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - Programming Language

---

Made with ❤️ by [Cloudinit](https://github.com/CloudinitFrance)
