# T1D Caregiver App - API Endpoints Documentation

## Base URL
```
http://localhost:3000
https://t1dcaregiverapp.onrender.com/
```

## Health Check

### GET /
Health check endpoint to verify the API is running.

**Response:**
```json
"Api running"
```

---

## Patients API

### GET /api/patients
Retrieve all patients from the database.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Patient Name",
    "email": "patient@example.com",
    ...
  }
]
```

---

### GET /api/patients/:id
Retrieve a specific patient by ID.

**Parameters:**
- `id` (string, required): Patient ID

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Patient Name",
    "email": "patient@example.com",
    ...
  }
]

```
## Dexcom Authentication API

### GET /dexcom/auth/login
Initiates the Dexcom OAuth 2.0 login flow. Redirects to Dexcom's authorization endpoint.

**Response:**
- Redirects to Dexcom authorization URL
- Stores OAuth state in session for validation


### GET /dexcom/auth/callback
OAuth 2.0 callback endpoint for Dexcom authentication. Handles the authorization code exchange and token storage.

**Query Parameters:**
- `code` (string): Authorization code from Dexcom
- `state` (string): State parameter for CSRF protection
- `error` (string, optional): Error code if authorization failed

**Response (200 OK):**
```
Successfully Got Token
```


## Dexcom API

### GET /dexcom/api/dataRange
Retrieve the data range of available glucose readings from Dexcom.


**Response (200 OK):**
```json
{
  "dataRange": {
    "egvs": {
      "firstRecordTime": "2024-04-15T08:00:00Z",
      "lastRecordTime": "2024-04-15T10:30:00Z"
    }
  }
}


### GET /dexcom/api/bg
Fetch the latest blood glucose data from Dexcom and store it in the database.


**Response (200 OK):**
```json
{
  "records": [
    {
      "systemTime": "2024-04-15T10:30:00Z",
      "displayTime": "2024-04-15T10:30:00Z",
      "value": 120,
      "trend": "FLAT",
      "trendRate": 0
    }
  ]
}
``


GET /history
Past hour for the graph

GET /Suggestion
Get Current Suggestion

Get /Encouragement










