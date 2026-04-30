API Endpoints
=============

Patients  (/api/patients)
--------------------------
GET  /api/patients/        Returns all patients in the database.
GET  /api/patients/:id     Returns a single patient by their ID.

Glucose  (/api/glucose)
------------------------
GET  /api/glucose/latest          Returns the most recent glucose reading across all patients.
GET  /api/glucose/:patientId      Returns all glucose readings for a specific patient.
POST /api/glucose/                Creates a new glucose reading.

Notifications  (/api/notifications)
------------------------------------
POST /api/notifications/registerFCMToken                  Registers a device FCM token to enable push notifications.
POST /api/notifications/sendNotification                  Sends a manually specified push notification.
POST /api/notifications/sendComposedNotification          Sends an auto-composed notification based on current patient state.
POST /api/notifications/sendComposedNotification/:bg      Sends an auto-composed notification using the provided blood glucose value.

Settings  (/api/settings)
--------------------------
GET  /api/settings/getSettings/:patientId                 Returns the current alert/threshold settings for a patient.
GET  /api/settings/getSettingsByTime/:patientId/:time     Returns the settings that were active for a patient at a given time.
POST /api/settings/updateSettings                         Updates alert/threshold settings for a patient.

Dexcom Auth  (/dexcom/auth)
----------------------------
GET  /dexcom/auth/login       Redirects to the Dexcom OAuth login page to begin authorization.
GET  /dexcom/auth/callback    Handles the OAuth callback and stores the access/refresh tokens.

Dexcom API  (/dexcom/api)
--------------------------
GET  /dexcom/api/bg           Fetches the latest blood glucose reading from the Dexcom sandbox API.
GET  /dexcom/api/dataRange    Returns the available date range of CGM data from Dexcom.
