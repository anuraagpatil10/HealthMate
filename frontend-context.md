# HealthMate Frontend Architecture

## Overview
HealthMate is an Electron-based desktop application with a modern React frontend built using Next.js. The frontend is located in the `renderer` directory and follows a component-based architecture with TypeScript support. This application integrates with a RESTful backend API for authentication, data fetching, and real-time communication.

## Technology Stack
- **Framework**: Next.js
- **Language**: TypeScript/JavaScript
- **Styling**: Tailwind CSS
- **Component Library**: Custom UI components
- **State Management**: React Context API
- **Build Tool**: Electron Builder
- **API Communication**: Fetch API, WebSockets (STOMP)
- **Authentication**: JWT-based authentication

## Directory Structure
```
renderer/
├── components/         # Reusable UI components
│   ├── ui/            # Base UI components
│   ├── doctor/        # Doctor-specific components
│   └── patient/       # Patient-specific components
├── pages/             # Next.js pages/routes
│   ├── doctor/        # Doctor pages
│   └── patient/       # Patient pages
├── lib/               # Utility functions and helpers
│   ├── api.js         # API client functions
│   ├── auth.js        # Authentication utilities
│   └── websocket.js   # WebSocket connection manager
├── styles/            # Global styles and CSS
├── public/            # Static assets
└── fonts/             # Custom fonts
```

## Authentication System

### Authentication Flow
- JWT-based authentication with access and refresh tokens
- Tokens stored in secure storage (localStorage with encryption)
- Automatic token refresh on expiration
- Role-based access control (Doctor/Patient)

### Authentication Components
- `login.jsx`: Handles user authentication using `/api/login` endpoint
- `signup.jsx`: Handles user registration using `/api/signup` endpoint
- Auth context provider in `_app.jsx` for global auth state

## Pages and Routes with API Integration

### Authentication Pages
- `login.jsx`: 
  - Consumes: `POST /api/login`
  - Features: Form validation, error handling, credential storage
  - Functionality: Authenticates users and stores JWT tokens

- `signup.jsx`: 
  - Consumes: `POST /api/signup`
  - Features: Multi-step registration form, role selection, validation
  - Functionality: Creates new user accounts and redirects to profile completion

- `_app.jsx`: 
  - Consumes: `POST /api/refresh-token`, `GET /api/user-role`
  - Features: Global auth context provider, token refresh logic
  - Functionality: Maintains authenticated state across the application

### Doctor Pages

- `dashboard.jsx`: 
  - Consumes: `GET /api/doctor/patients` (patient count), various stats APIs
  - Features: Statistics overview, upcoming appointments, recent activities
  - Functionality: Central hub for doctor's daily activities and insights

- `patients.jsx`: 
  - Consumes: `GET /api/doctor/patients`
  - Features: Patient list with search, filtering, and detailed profiles
  - Functionality: Manage and review patient records

- `appointments.jsx`: 
  - Consumes: Appointment-related APIs
  - Features: Calendar view, appointment management, notifications
  - Functionality: Schedule, reschedule, and cancel appointments

- `prescriptions.jsx`: 
  - Consumes: `POST /api/prescriptions`, `GET /api/doctor/prescriptions`
  - Features: Prescription creation form, medication search, prescription history
  - Functionality: Create and manage patient prescriptions

- `lab-results.jsx`: 
  - Consumes: `POST /api/lab-reports/upload`, `GET /api/lab-reports/doctor`, `DELETE /api/lab-reports/{report_id}`
  - Features: Lab report upload, viewing, and management
  - Functionality: Upload and manage patient lab reports

- `messages.jsx`: 
  - Consumes: WebSocket `ws://localhost:8080/chat`, `STOMP /app/send-message`, `GET /api/chat/history/{receiver_id}`
  - Features: Real-time chat, message history, file sharing
  - Functionality: Communicate with patients securely

- `notifications.jsx`: 
  - Consumes: Notification APIs
  - Features: System notifications, appointment alerts, message notifications
  - Functionality: Stay updated on important events

- `profile-settings.jsx`: 
  - Consumes: `GET /api/get-profile` and profile update APIs
  - Features: Profile information management, specialty settings
  - Functionality: Update and maintain doctor profile information

### Patient Pages

- `dashboard.jsx`: 
  - Consumes: Various patient stats APIs
  - Features: Health overview, upcoming appointments, recent prescriptions
  - Functionality: Central hub for patient's health information

- `doctors.jsx`: 
  - Consumes: `GET /api/doctors`
  - Features: Doctor directory, search, filtering, doctor profiles
  - Functionality: Find and connect with healthcare providers

- `appointments.jsx`: 
  - Consumes: Appointment booking APIs
  - Features: Appointment scheduling, doctor availability, appointment history
  - Functionality: Book, modify, and track medical appointments

- `prescriptions.jsx`: 
  - Consumes: `GET /api/patient/prescriptions`
  - Features: Prescription list, medication details, reminder settings
  - Functionality: View and manage prescribed medications

- `lab-results.jsx`: 
  - Consumes: `GET /api/lab-reports/patient`
  - Features: Lab report viewing, history, and download options
  - Functionality: Access and review personal lab test results

- `messages.jsx`: 
  - Consumes: WebSocket `ws://localhost:8080/chat`, `STOMP /app/send-message`, `GET /api/chat/history/{receiver_id}`
  - Features: Real-time chat with doctors, message history, file sharing
  - Functionality: Communicate with healthcare providers

- `notifications.jsx`: 
  - Consumes: Notification APIs
  - Features: Health reminders, appointment notifications, prescription alerts
  - Functionality: Stay informed about health-related events

- `profile-settings.jsx`: 
  - Consumes: `GET /api/get-profile` and profile update APIs
  - Features: Personal information management, health preferences
  - Functionality: Update and maintain patient profile information

## API Integration

### API Client
The application includes a custom API client (`lib/api.js`) that handles:
- Authentication header inclusion
- Token refresh on 401 errors
- Request/response handling
- Error management and reporting

Example implementation:
```javascript
// API call wrapper with authentication
async function fetchWithAuth(endpoint, options = {}) {
  const token = getAccessToken();
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    if (response.status === 401) {
      // Token expired, attempt refresh
      const refreshed = await refreshToken();
      if (refreshed) {
        return fetchWithAuth(endpoint, options);
      } else {
        // Refresh failed, redirect to login
        redirectToLogin();
      }
    }
    
    return await response.json();
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
```

### WebSocket Integration
Real-time chat functionality is implemented using WebSockets with STOMP protocol:
- Connection management in `lib/websocket.js`
- Automatic reconnection on connection loss
- Message queueing during offline periods
- Delivery notifications

Example implementation:
```javascript
// WebSocket connection with STOMP
function initializeWebSocketConnection() {
  const socket = new SockJS('ws://localhost:8080/chat');
  const stompClient = Stomp.over(socket);
  
  stompClient.connect({}, 
    frame => {
      // Subscribe to personal message queue
      stompClient.subscribe(`/user/queue/messages`, message => {
        const receivedMessage = JSON.parse(message.body);
        addMessageToChat(receivedMessage);
      });
    },
    error => {
      console.error('STOMP error', error);
      setTimeout(initializeWebSocketConnection, 5000); // Reconnect
    }
  );
  
  return stompClient;
}
```

## UI Components with API Integration

### Form Components with Validation
- Input validation based on API requirements
- Error handling for API responses
- Loading states during API calls

### Data Display Components
- Data fetching and pagination for API results
- Sorting and filtering supported by backend APIs
- Optimistic UI updates before API confirmation

### Notification System
- Real-time notifications through WebSockets
- Local notifications for reminders
- Toast notifications for API operation results

## Security Features

### Authentication Security
- JWT token secure storage
- Token refresh mechanism
- CSRF protection
- Session timeout handling

### Data Protection
- Secure form submission
- Sensitive data handling
- File upload security

## Error Handling
- Comprehensive error handling for API failures
- Offline mode capabilities
- Retry mechanisms for failed operations
- User-friendly error messages

## Data Flow Architecture
1. **Authentication Flow**:
   - User credentials → `/api/login` → JWT tokens → Secure storage
   - On app start → Check token → Auto refresh if needed

2. **Data Fetching Flow**:
   - Component mount → API request → Loading state → Data display
   - Includes caching strategies and pagination

3. **Real-time Communication Flow**:
   - WebSocket connection → STOMP subscription → Message reception
   - Message composition → STOMP send → Delivery confirmation

## Best Practices Implemented
1. Component-based architecture
2. TypeScript for type safety
3. Responsive design principles
4. Accessibility considerations
5. Performance optimization
6. Code splitting and lazy loading
7. Error boundary implementation
8. Form validation
9. State management
10. Security practices
11. API error handling
12. Offline support strategies

## Pages and Routes

### Authentication Pages
- `