# HealthMate Backend APIs Documentation

## Authentication APIs

### `POST /api/login`
Authenticates a user with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "created_at": "2025-01-01T00:00:00Z"
    },
    "session": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  },
  "role": "patient"
}
```

### `POST /api/signup`
Registers a new user account.

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phoneNumber": "1234567890",
  "gender": "Male",
  "role": "patient"
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "email": "newuser@example.com",
      "created_at": "2025-04-09T10:15:30Z"
    }
  }
}
```

### `GET /api/user-role`
Retrieves the authenticated user's role.

**Request:**
```
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "role": "patient"
}
```

### `POST /api/refresh-token`
Refreshes access token using a valid refresh token.

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Profile Management APIs

### `GET /api/get-profile`
Fetches authenticated user's profile.

**Request:**
```
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Patient):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.doe@example.com",
  "full_name": "John Doe",
  "phone_number": "1234567890",
  "gender": "Male",
  "role": "patient",
  "date_of_birth": "1995-07-20",
  "profile_completed": false
}
```

**Response (Doctor):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "email": "dr.smith@example.com",
  "full_name": "Dr. Smith",
  "phone_number": "9876543210",
  "gender": "Male",
  "role": "doctor",
  "date_of_birth": "1980-05-15",
  "speciality": "Cardiologist",
  "clinic_name": "Smith Medical Center",
  "profile_completed": false
}
```

## Doctor-Patient Connection APIs

### `GET /api/doctors`
Returns all doctors (for patients).

**Request:**
```
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "doctors": [
    {
      "doctor_id": "550e8400-e29b-41d4-a716-446655440001",
      "full_name": "Dr. John Smith",
      "email": "john.smith@example.com",
      "phone_number": "+1234567890",
      "gender": "Male",
      "speciality": "Cardiologist",
      "clinic_name": "City Heart Clinic"
    },
    {
      "doctor_id": "660e8400-e29b-41d4-a716-446655440002",
      "full_name": "Dr. Jane Doe",
      "email": "jane.doe@example.com",
      "phone_number": "+9876543210",
      "gender": "Female",
      "speciality": "Dermatologist",
      "clinic_name": "Skin Care Center"
    }
  ]
}
```

### `GET /api/doctor/patients`
Returns patients who booked with the doctor.

**Request:**
```
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "patients": [
    {
      "patient_id": "b3c4d5e6-e29b-41d4-a716-446655440003",
      "full_name": "John Doe",
      "email": "john.doe@example.com",
      "phone_number": "+1234567890",
      "gender": "Male",
      "dob": "1995-06-15"
    },
    {
      "patient_id": "c4d5e6f7-e29b-41d4-a716-446655440004",
      "full_name": "Alice Brown",
      "email": "alice.brown@example.com",
      "phone_number": "+9876543210",
      "gender": "Female",
      "dob": "1998-11-23"
    }
  ]
}
```

## Prescription Management APIs

### `POST /api/prescriptions`
Doctors can add prescriptions for patients.

**Request:**
```
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Body:
{
  "patient_id": "b3c4d5e6-e29b-41d4-a716-446655440003",
  "medicines": [
    {
      "name": "Paracetamol 500mg",
      "dosage": "1 tablet",
      "frequency": "Twice a day",
      "duration": "5 days",
      "instructions": "Take after meals"
    },
    {
      "name": "Amoxicillin 250mg",
      "dosage": "1 capsule",
      "frequency": "Three times a day",
      "duration": "7 days",
      "instructions": "Take with water"
    }
  ],
  "notes": "Drink plenty of water and get adequate rest."
}
```

**Response:**
```json
{
  "message": "Prescription added successfully",
  "prescription_id": "e1f2g3h4-e29b-41d4-a716-446655440005"
}
```

### `GET /api/patient/prescriptions`
Returns all prescriptions for a patient.

**Request:**
```
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "prescriptions": [
    {
      "doctor_id": "550e8400-e29b-41d4-a716-446655440001",
      "doctor_name": "Dr. Smith",
      "prescriptions": [
        {
          "prescription_id": "e1f2g3h4-e29b-41d4-a716-446655440005",
          "prescribed_at": "2025-04-01T15:00:00Z",
          "medicines": [
            {
              "name": "Paracetamol 500mg",
              "dosage": "1 tablet",
              "frequency": "Twice a day",
              "duration": "5 days",
              "instructions": "Take after meals"
            },
            {
              "name": "Amoxicillin 250mg",
              "dosage": "1 capsule",
              "frequency": "Three times a day",
              "duration": "7 days",
              "instructions": "Take with water"
            }
          ],
          "notes": "Drink plenty of water and get adequate rest."
        }
      ]
    }
  ]
}
```

### `GET /api/doctor/prescriptions`
Returns all prescriptions issued by a doctor.

**Request:**
```
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "prescriptions": [
    {
      "patient_id": "b3c4d5e6-e29b-41d4-a716-446655440003",
      "patient_name": "John Doe",
      "prescriptions": [
        {
          "prescription_id": "e1f2g3h4-e29b-41d4-a716-446655440005",
          "prescribed_at": "2025-04-01T15:00:00Z",
          "medicines": [
            {
              "name": "Paracetamol 500mg",
              "dosage": "1 tablet",
              "frequency": "Twice a day",
              "duration": "5 days",
              "instructions": "Take after meals"
            },
            {
              "name": "Amoxicillin 250mg",
              "dosage": "1 capsule",
              "frequency": "Three times a day",
              "duration": "7 days",
              "instructions": "Take with water"
            }
          ],
          "notes": "Drink plenty of water and get adequate rest."
        }
      ]
    }
  ]
}
```

## Lab Reports APIs

### `POST /api/lab-reports/upload`
Doctors can upload lab reports for patients.

**Request:**
```
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "multipart/form-data"
}

Form Data: {
  "patient_id": "b3c4d5e6-e29b-41d4-a716-446655440003",
  "file": [PDF file]
}
```

**Response:**
```json
{
  "message": "Lab report uploaded successfully",
  "file_url": "https://xyz.supabase.co/storage/v1/object/public/lab-reports/report_123.pdf"
}
```

### `GET /api/lab-reports/patient`
Patients can fetch their lab reports.

**Request:**
```
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "lab_reports": [
    {
      "report_id": "123e4567-e89b-12d3-a456-426614174000",
      "doctor_name": "Dr. John Smith",
      "file_url": "https://xyz.supabase.co/storage/v1/object/public/lab-reports/report_123.pdf",
      "uploaded_at": "2025-04-01T14:30:00Z"
    }
  ]
}
```

### `GET /api/lab-reports/doctor`
Doctors can view reports they've uploaded.

**Request:**
```
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "lab_reports": [
    {
      "report_id": "123e4567-e89b-12d3-a456-426614174000",
      "patient_name": "John Doe",
      "file_url": "https://xyz.supabase.co/storage/v1/object/public/lab-reports/report_123.pdf",
      "uploaded_at": "2025-04-01T14:30:00Z"
    }
  ]
}
```

### `DELETE /api/lab-reports/{report_id}`
Doctors can delete reports they've uploaded.

**Request:**
```
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "message": "Lab report deleted successfully"
}
```

## Chat APIs

### WebSocket Connection
```
ws://localhost:8080/chat
```

### `STOMP /app/send-message`
Sends a message to another user.

**Request (via STOMP protocol):**
```json
{
  "sender_id": "550e8400-e29b-41d4-a716-446655440000",
  "receiver_id": "550e8400-e29b-41d4-a716-446655440001",
  "message": "Hello doctor, I have a question.",
  "file_url": null
}
```

**Response (via STOMP subscription):**
```json
{
  "message_id": "msg-uuid",
  "sender_id": "550e8400-e29b-41d4-a716-446655440000",
  "receiver_id": "550e8400-e29b-41d4-a716-446655440001",
  "message": "Hello doctor, I have a question.",
  "file_url": null,
  "timestamp": "2025-04-02T14:30:00Z"
}
```

### `STOMP /user/queue/messages`
Subscription endpoint for receiving messages.

### `GET /api/chat/history/{receiver_id}`
Retrieves chat history.

**Request:**
```
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "messages": [
    {
      "message_id": "msg-uuid-1",
      "sender_id": "550e8400-e29b-41d4-a716-446655440000",
      "receiver_id": "550e8400-e29b-41d4-a716-446655440001",
      "message": "Hello doctor, I have a question.",
      "file_url": null,
      "timestamp": "2025-04-02T14:30:00Z"
    },
    {
      "message_id": "msg-uuid-2",
      "sender_id": "550e8400-e29b-41d4-a716-446655440001",
      "receiver_id": "550e8400-e29b-41d4-a716-446655440000",
      "message": "Sure, what is your concern?",
      "file_url": null,
      "timestamp": "2025-04-02T14:31:00Z"
    }
  ]
}
```

## Authentication Flow
All secure endpoints require an `Authorization` header with a valid Bearer token obtained through login or token refresh. The standard format is:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## File Storage
Lab reports and chat attachments use Supabase storage, with file URLs following the pattern:
```
https://xyz.supabase.co/storage/v1/object/public/bucket-name/file-path
```