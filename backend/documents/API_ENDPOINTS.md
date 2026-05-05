# API Endpoints

## Patients (`/api/patients`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients/` | Returns all patients in the database. |
| GET | `/api/patients/:id` | Returns a single patient by their ID. |

## Glucose (`/api/glucose`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/glucose/latest` | Returns the most recent glucose reading across all patients. |
| GET | `/api/glucose/:patientId` | Returns all glucose readings for a specific patient. |
| POST | `/api/glucose/` | Creates a new glucose reading. |

## Alerts (`/api/alerts`)

Alerts represent clinical events — a blood glucose reading that crossed a threshold. An alert is logged to the database regardless of whether the push notification was successfully delivered. FCM push delivery is also managed under this prefix.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alerts/:patientId` | Returns alert history for a patient. |
| POST | `/api/alerts/` | Logs a triggered alert manually. |
| PATCH | `/api/alerts/:id/acknowledge` | Marks an alert as seen/handled by the caregiver. |
| GET | `/api/alerts/notifications/:id` | Returns unacknowledged alerts for a caregiver to display as notifications. |
| POST | `/api/alerts/registerFCMToken` | Registers a device FCM token to enable push notifications. |
| POST | `/api/alerts/sendNotification` | Sends a manually specified push notification. |
| POST | `/api/alerts/sendComposedNotification` | Logs an alert and sends an auto-composed notification based on current patient state. |
| POST | `/api/alerts/sendComposedNotification/:bg` | Logs an alert and sends an auto-composed notification using the provided blood glucose value. |

## Settings (`/api/settings`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings/getSettings/:patientId` | Returns the current alert/threshold settings for a patient. |
| GET | `/api/settings/getSettingsByTime/:patientId/:time` | Returns the settings that were active for a patient at a given time. |
| POST | `/api/settings/updateSettings` | Updates alert/threshold settings for a patient. |

## Dexcom Auth (`/dexcom/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dexcom/auth/login` | Redirects to the Dexcom OAuth login page to begin authorization. |
| GET | `/dexcom/auth/callback` | Handles the OAuth callback and stores the access/refresh tokens. |

## Dexcom API (`/dexcom/api`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dexcom/api/bg` | Fetches the latest blood glucose reading from the Dexcom sandbox API. |
| GET | `/dexcom/api/dataRange` | Returns the available date range of CGM data from Dexcom. |

---

## Needed

### Auth (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Creates a new caregiver account. |
| POST | `/api/auth/login` | Authenticates a caregiver and returns a JWT. |
| POST | `/api/auth/logout` | Invalidates the current session/token. |

### Patient Management (`/api/patients`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/patients/` | Creates a new patient. |
| PATCH | `/api/patients/:id` | Updates patient info. |
| DELETE | `/api/patients/:id` | Removes a patient. |

### Actions (`/api/actions`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/actions/:patientId` | Returns logged caregiver actions for a patient. |
| POST | `/api/actions/` | Logs a caregiver action (e.g. insulin dose, carb intake). |

### JITAI (`/api/jitai`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/jitai/evaluate/:patientId` | Runs the full JITAI pipeline: classify event, compose, and send notification. |
