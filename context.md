# HealthMate - Project Context

## Overview
HealthMate is a desktop application built using Electron and Next.js, designed to facilitate healthcare management and patient-doctor interactions. The application provides separate interfaces for doctors and patients, with features for appointment management, medical records, and communication.

## Technology Stack

### Core Technologies
- **Electron**: Powers the desktop application
- **Next.js**: React framework for the frontend
- **React**: UI library
- **TypeScript**: For type-safe code
- **TailwindCSS**: For styling

### Key Dependencies
- **Axios**: HTTP client for API communication
- **@radix-ui**: UI component library
- **electron-store**: Local data persistence
- **date-fns**: Date manipulation
- **react-toastify**: Notification system

## Project Structure

```
healthmate/
├── app/                    # Main application code
│   ├── background.js      # Electron main process
│   ├── preload.js         # Electron preload script
│   ├── doctor/            # Doctor-specific features
│   ├── patient/           # Patient-specific features
│   ├── login/             # Authentication
│   └── signup/            # User registration
├── main/                  # Electron main process code
│   ├── api/               # API handlers
│   │   ├── doctor/        # Doctor-specific API handlers
│   │   ├── patient/       # Patient-specific API handlers
│   │   ├── login.js       # Authentication
│   │   ├── signup.js      # User registration
│   │   └── ...
│   └── utils/             # Utility functions
│       └── apiClient.js   # API client for external backend
├── renderer/              # Frontend rendering code
├── resources/             # Static resources
└── dist/                  # Build output
```

## Features

### Authentication
- User registration and login
- Role-based access (Doctor/Patient)
- Secure authentication using JWT tokens

### Doctor Features
- Appointment management
- Patient records access
- Medical history tracking
- Treatment planning

### Patient Features
- Appointment booking
- Medical history viewing
- Doctor search and selection
- Health records management

## Development

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Run in development mode:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

### Environment Variables
The application uses a `.env` file for configuration:
- API_BASE_URL: URL of the external backend server

## Architecture

### Frontend
- Next.js for routing and page rendering
- React components with TypeScript
- TailwindCSS for styling
- Radix UI for accessible components

### Backend
- External REST API server
- Electron for desktop application features
- Local storage for offline capabilities

### Data Flow
1. User authentication through external API
2. Role-based routing to doctor/patient interfaces
3. Real-time data synchronization
4. Local data persistence for offline access

## Security Considerations
- Secure authentication flow with JWT tokens
- Encrypted data transmission
- Role-based access control
- Secure local storage

## Future Considerations
- Offline mode enhancements
- Real-time chat features
- Advanced analytics
- Mobile application support 