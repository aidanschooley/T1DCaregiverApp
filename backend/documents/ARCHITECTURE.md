# GlucoseCare Backend Architecture

**Version:** 1.0  
**Last Updated:** April 2026  
**Authors:** Aidan Schooley, Sarah Winne

---

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [JITAI Framework Implementation](#jitai-framework-implementation)
4. [Directory Structure](#directory-structure)
5. [Core Components](#core-components)
6. [Data Flow](#data-flow)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [External Integrations](#external-integrations)
10. [Deployment](#deployment)

---

## Overview

GlucoseCare is a context-aware, just-in-time adaptive notification system designed to support caregivers of children with Type 1 Diabetes. The backend implements the JITAI (Just-in-Time Adaptive Intervention) framework to reduce caregiver alarm fatigue while maintaining patient safety.

### Key Goals

- **Reduce Alarm Fatigue:** Smart notification filtering based on priority and context
- **Improve Sleep Quality:** Context-aware notifications that minimize nighttime interruptions
- **Provide Decision Support:** ADA protocol-based suggestions to reduce caregiver decision fatigue
- **Maintain Safety:** P0/P1 alerts always get through, regardless of context

### Technology Stack

- **Runtime:** Node.js + Express.js
- **Database:** PostgreSQL (via Supabase)
- **Push Notifications:** Firebase Cloud Messaging (FCM)
- **External API:** Dexcom CGM API
- **Language:** JavaScript (ES6+)

---

## System Architecture

### High-Level Architecture

```
┌─────────────┐
│   Dexcom    │ Every 5 minutes
│  CGM Device │────────────────┐
└─────────────┘                │
                               ▼
                    ┌──────────────────┐
                    │  Webhook Handler │
                    └──────────────────┘
                               │
                               ▼
                    ┌──────────────────────────┐
                    │  JITAI Processing Layer  │
                    │  ┌────────────────────┐  │
                    │  │ Safety Detection   │  │ P0-P4 Priority
                    │  └────────────────────┘  │
                    │           ↓              │
                    │  ┌────────────────────┐  │
                    │  │ Event Classifier   │  │ 11 Event Types
                    │  └────────────────────┘  │
                    │           ↓              │
                    │  ┌────────────────────┐  │
                    │  │ Context Analyzer   │  │ Time, Availability
                    │  └────────────────────┘  │
                    │           ↓              │
                    │  ┌────────────────────┐  │
                    │  │ Personalization    │  │ ADA Protocols
                    │  └────────────────────┘  │
                    │           ↓              │
                    │  ┌────────────────────┐  │
                    │  │ Notification       │  │ Compose Message
                    │  │ Composer           │  │
                    │  └────────────────────┘  │
                    └──────────────────────────┘
                               │
                               ▼
                    ┌──────────────────┐
                    │  Supabase DB     │
                    │  (Save Reading)  │
                    └──────────────────┘
                               │
                               ▼
                    ┌──────────────────┐
                    │ Notification     │
                    │ Router           │
                    └──────────────────┘
                               │
                               ▼
                    ┌──────────────────┐
                    │   Firebase FCM   │
                    └──────────────────┘
                               │
                               ▼
                    ┌──────────────────┐
                    │  Caregiver's     │
                    │  Mobile Device   │
                    └──────────────────┘
```

### Layered Architecture

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Routes, Controllers, Middleware)      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Business Logic Layer            │
│    (Services - JITAI Components)        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Data Access Layer               │
│         (Models, Database)              │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         External Services               │
│  (Dexcom API, Firebase, Supabase)      │
└─────────────────────────────────────────┘
```

---

## JITAI Framework Implementation

The backend implements all six components of the JITAI framework as described in our research paper.

### 1. Distal Outcome
**Goal:** Reduced caregiver alarm fatigue and improved sleep quality

**Measurement:**
- Post-study surveys (caregiver mental health, sleep quality)
- Comparative analysis vs. standard CGM alerts

### 2. Proximal Outcomes
**Short-term measurable goals:**
- Faster alert response time
- Reduced dismissal rate
- Reduced dismissal without action

**Tracked in Database:**
- `notification.response_time_seconds`
- `notification.dismissed_at`
- `notification.dismissed_without_action`

### 3. Decision Points
**When:** Every 5 minutes when Dexcom sends a new blood glucose reading

**Implementation:**
- Webhook endpoint: `POST /api/cgm/webhook`
- Triggered automatically by Dexcom API
- Each reading passes through JITAI pipeline

### 4. Tailoring Variables
**Data used to make decisions:**

| Variable | Source | Purpose |
|----------|--------|---------|
| BG Value | Dexcom reading | Safety classification (P0-P4) |
| BG Trend | Dexcom reading | Event detection (trending low) |
| Alert Type | Dexcom reading | Context for classification |
| Alert State | Dexcom reading | Is this ongoing or new? |
| Time of Day | System timestamp | Night vs day notification strategy |
| History (60 min) | Database query | Repeated event detection |
| Caregiver Availability | `caregiver_time` table | Routing priority |

### 5. Intervention Options
**Three notification types:**

| Type | When Used | Behavior |
|------|-----------|----------|
| **CRITICAL** | P0, P1 priority | Loud, interruptive, bypasses DND |
| **INFORMATIVE** | P2, P3 during day | Standard notification |
| **PASSIVE** | P4, non-critical at night | Quiet, non-interruptive |

### 6. Decision Rules
**Logic flow:**

```
IF blood_glucose < 54 THEN
    priority = P0
    always_alert = TRUE
    
IF priority = P0 OR P1 THEN
    notification_type = CRITICAL
    
IF priority = P2/P3 AND time = night THEN
    notification_type = PASSIVE
    
IF event = critical_low THEN
    suggestion = 15/15_rule
```

**Implementation:** `services/CGMProcessingService.js`

---

## Directory Structure

```
backend/
├── config/                     # Configuration & connections
│   ├── database.js            # Supabase connection
│   ├── dexcom.js              # Dexcom API credentials
│   ├── firebase.js            # Firebase FCM setup
│   └── environment.js         # Environment variable validation
│
├── constants/                  # Fixed values & rules
│   ├── priorities.js          # P0-P4 priority system
│   ├── events.js              # 11 event type definitions
│   └── suggestions.js       # ADA treatment protocols
│
├── models/                     # Database models
│   ├── Patient.js
│   ├── Caregiver.js
│   ├── CGMReading.js
│   ├── Notification.js
│   ├── CaregiverAction.js
│   ├── CaregiverTime.js
│   ├── PatientCaregiver.js
│   └── PatientGlucoseSettings.js
│
├── services/                   # Business logic
│   ├── jitai/                 # JITAI framework components
│   │   ├── SafetyDetectionLayer.js      # P0-P4 classification
│   │   ├── EventClassifier.js           # Event type detection
│   │   ├── PersonalizationEngine.js     # Suggestion generation
│   │   └── CGMProcessingService.js      # Main orchestrator
│   │
│   ├── notification/          # Notification handling
│   │   ├── NotificationComposer.js      # Build notifications
│   │   ├── NotificationRouter.js        # Route to caregivers
│   │   └── FirebaseMessaging.js         # Send via FCM
│   │
│   ├── context/               # Context awareness
│   │   ├── TimeContext.js               # Time analysis
│   │   └── CaregiverAvailability.js     # Availability checking
│   │
│   └── dexcom/                # Dexcom integration
│       ├── DexcomAPIService.js
│       └── DexcomAuthService.js
│
├── controllers/                # HTTP request handlers
│   ├── cgm/
│   │   ├── webhookController.js         # Receives Dexcom data
│   │   └── readingController.js         # Reading queries
│   │
│   ├── notification/
│   │   └── notificationController.js    # Notification management
│   │
│   ├── caregiver/
│   │   ├── caregiverController.js
│   │   ├── availabilityController.js
│   │   └── actionController.js
│   │
│   └── patient/
│       └── patientController.js
│
├── middleware/                 # Request interceptors
│   ├── auth.js                # Authentication
│   ├── validation.js          # Input validation
│   └── errorHandler.js        # Error handling
│
├── routes/                     # API endpoint definitions
│   ├── index.js               # Main router
│   ├── cgm.routes.js
│   ├── notification.routes.js
│   ├── caregiver.routes.js
│   └── patient.routes.js
│
├── workers/                    # Background processes
│   └── cgmDataProcessor.js    # Continuous processing
│
├── utils/                      # Helper functions
│   ├── logger.js              # Logging
│   ├── validator.js           # Validation helpers
│   └── dateTime.js            # Date/time utilities
│
├── tests/                      # Test files
│   ├── unit/
│   ├── integration/
│   └── fixtures/
│
├── app.js                      
├── server.js                   # Application entry point
├── package.json                # Dependencies
├── .env                        # Environment variables (not in git)
└── .gitignore                  # Git ignore rules
```

---

## Core Components

### Safety Detection Layer
**File:** `services/jitai/SafetyDetectionLayer.js`

**Purpose:** Classify blood glucose readings into priority levels (P0-P4)

**Based on:**
- P0: < 54 mg/dL (ADA Level 2 Hypoglycemia)
- P1: 54-69 mg/dL (ADA Level 1 Hypoglycemia)
- P2: > 250 mg/dL (Severe Hyperglycemia)
- P3: 180-250 mg/dL (Mild Hyperglycemia)
- P4: 70-180 mg/dL (In Range)

**Output:**
```javascript
{
  level: 'P1',
  description: 'Low - Level 1 Hypoglycemia',
  alwaysAlert: true,
  interruptive: true
}
```

---

### Event Classifier
**File:** `services/jitai/EventClassifier.js`

**Purpose:** Identify which of 11 event types is occurring

**Event Types:**

**Hypoglycemia (BG < 70):**
1. Critical Low (< 54)
2. Nocturnal Low (< 70 at night)
3. Standard Low (< 70)
4. Repeated Unresolved Low (≥3 in 60 min)
5. Trending Low (>70 but falling rapidly)

**Hyperglycemia (BG > 180):**
6. Severe High (> 250)
7. Mild High (180-250)
8. Repeated Unresolved High (≥3 > 250 in 60 min)
9. Repeated Unresolved Mild (≥3 in 180-250 range in 60 min)

**Goal Range (70-180):**
10. Recovering (returning to range after low)
11. In Range (stable)

**Input:**
- Current reading
- Past 60 minutes of readings
- Time context

**Output:**
```javascript
{
  eventType: 2,
  eventName: 'Nocturnal Low',
  eventDescription: 'Overnight low (< 70 mg/dL)'
}
```

---

### Personalization Engine
**File:** `services/jitai/PersonalizationEngine.js`

**Purpose:** Generate personalized suggestions using ADA protocols

**Protocols:**
- **15/15 Rule:** For hypoglycemia
- **Glucagon Protocol:** For severe hypoglycemia when patient can't swallow
- **Conservative Hyperglycemia:** For high blood glucose

**Output:**
```javascript
{
  title: '15/15 Rule',
  description: 'Give 15g fast-acting carbs, wait 15 min, recheck',
  steps: [
    'Give 15 grams of fast-acting carbohydrates',
    'Wait 15 minutes',
    'Recheck blood glucose',
    'If still below 70 mg/dL, repeat'
  ],
  protocolCode: '15_15_RULE'
}
```

---

### Notification Composer
**File:** `services/notification/NotificationComposer.js`

**Purpose:** Build complete notification with all components

**Determines:**
- Notification type (Critical/Informative/Passive)
- Title and message
- Whether to include encouragement

**Output:**
```javascript
{
  type: 'CRITICAL',
  title: '⚠️ Low Blood Sugar Alert',
  message: "Tommy's blood glucose is 62 mg/dL (Overnight low)",
  suggestion: { ... },
  encouragement: null,
  isInterruptive: true
}
```

---

### CGM Processing Service
**File:** `services/CGMProcessingService.js`

**Purpose:** Orchestrate entire JITAI pipeline

**Process:**
1. Receive CGM reading
2. Analyze time context
3. Classify priority (Safety Layer)
4. Classify event type (Event Classifier)
5. Generate suggestion (Personalization Engine)
6. Compose notification (Notification Composer)
7. Determine if should notify

**This is the main entry point for JITAI processing.**

---

## Data Flow

### End-to-End Flow: Dexcom Reading → Caregiver Notification

```
1. DEXCOM SENDS DATA (every 5 minutes)
   └─→ POST /api/cgm/webhook
       {
         value: 62,
         trend: "SingleDown",
         timestamp: "2026-04-16T02:00:00Z",
         alertType: "low",
         alertState: "active"
       }

2. MIDDLEWARE VALIDATION
   └─→ middleware/validation.js
       ✓ Valid BG value (20-600)
       ✓ Valid trend
       ✓ Valid timestamp

3. WEBHOOK CONTROLLER
   └─→ controllers/cgm/webhookController.js
       - Extract reading data
       - Get patient info from database
       - Get recent readings (past 60 min)

4. JITAI PROCESSING PIPELINE
   └─→ services/CGMProcessingService.js
   
   Step 1: Time Context
   └─→ services/context/TimeContext.js
       Output: { isNightTime: true, timeCategory: 'NIGHT' }
   
   Step 2: Safety Detection
   └─→ services/jitai/SafetyDetectionLayer.js
       Input: BG = 62
       Output: { level: 'P1', alwaysAlert: true }
   
   Step 3: Event Classification
   └─→ services/jitai/EventClassifier.js
       Input: reading + recent readings + time context
       Output: { eventType: 2, eventName: 'Nocturnal Low' }
   
   Step 4: Personalization
   └─→ services/jitai/PersonalizationEngine.js
       Input: event + priority
       Output: { title: '15/15 Rule', steps: [...] }
   
   Step 5: Notification Composition
   └─→ services/notification/NotificationComposer.js
       Input: all above data
       Output: Complete notification object

5. DATABASE SAVE
   └─→ models/CGMReading.js
       Save reading with priority & event type
   
   └─→ models/Notification.js
       Save notification record

6. NOTIFICATION ROUTING
   └─→ services/notification/NotificationRouter.js
       - Get patient's caregivers
       - Check availability
       - Order by priority
       - For P0/P1: notify everyone

7. SEND NOTIFICATION
   └─→ services/notification/FirebaseMessaging.js
       - Format for FCM
       - Set priority (high for Critical)
       - Send push notification

8. CAREGIVER RECEIVES
   └─→ Mobile device gets push notification
       Title: "⚠️ Low Blood Sugar Alert"
       Body: "Tommy's blood glucose is 62 mg/dL"
       Actions: View Details, Dismiss
```

---

## Database Schema

### Tables

**1. patient**
- Stores patient information
- Links to Dexcom user ID

**2. caregiver**
- Stores caregiver information
- Contains FCM token for push notifications

**3. patient_caregiver**
- Many-to-many relationship
- Links patients to caregivers
- Stores relationship type (mother, father, etc.)

**4. cgm_reading**
- Stores every blood glucose reading
- Includes Dexcom data + our classifications
- Fields: `value`, `trend`, `priority`, `event_type`

**5. notification**
- Stores all notifications sent
- Tracks response metrics
- Fields: `type`, `dismissed_at`, `response_time_seconds`, `dismissed_without_action`

**6. caregiver_action**
- Logs actions taken in response to alerts
- Used to measure dismissal without action rate

**7. caregiver_time**
- Stores availability schedules
- Used for context-aware routing

**8. patient_glucose_settings**
- Custom thresholds per patient
- Allows personalization of P0-P4 ranges

### Key Relationships

```
patient ←─────→ patient_caregiver ←─────→ caregiver
   │                                          │
   │                                          │
   ↓                                          ↓
cgm_reading                            notification
                                             │
                                             ↓
                                      caregiver_action
```

---

## API Endpoints

### CGM Endpoints

```
POST   /api/cgm/webhook
       Receive blood glucose data from Dexcom
       Auth: Dexcom webhook signature
       Body: { value, trend, timestamp, alertType, alertState }

GET    /api/cgm/readings/:patientId
       Get recent readings for a patient
       Auth: Required
       Query: ?minutes=60
       
GET    /api/cgm/readings/:patientId/range
       Get readings by date range
       Auth: Required
       Query: ?startDate=...&endDate=...
```

### Notification Endpoints

```
GET    /api/notifications/:caregiverId
       Get all notifications for a caregiver
       Auth: Required
       Query: ?limit=50
       
GET    /api/notifications/:caregiverId/unread
       Get unread notifications
       Auth: Required
       
PUT    /api/notifications/:notificationId/dismiss
       Mark notification as dismissed
       Auth: Required
       Body: { withAction: true/false }
```

### Caregiver Endpoints

```
GET    /api/caregivers/:caregiverId
       Get caregiver information
       Auth: Required
       
PUT    /api/caregivers/:caregiverId
       Update caregiver information
       Auth: Required
       
GET    /api/caregivers/:caregiverId/availability
       Get availability schedule
       Auth: Required
       
PUT    /api/caregivers/:caregiverId/availability
       Update availability schedule
       Auth: Required
```

### Patient Endpoints

```
GET    /api/patients/:patientId
       Get patient information
       Auth: Required
       
GET    /api/patients/:patientId/caregivers
       Get all caregivers for a patient
       Auth: Required
```

---

## External Integrations

### Dexcom API

**Purpose:** Receive real-time blood glucose data

**Integration Method:** Webhook (push)
- Dexcom calls our endpoint every 5 minutes
- We receive readings in real-time

**Authentication:** OAuth 2.0
- User grants permission via Dexcom login
- We receive access token
- Token used for API requests

**Endpoints Used:**
- `/v3/users/self/egvs` - Get glucose readings
- `/v3/users/self/dataRange` - Get available data range

**Configuration:** `config/dexcom.js`

---

### Firebase Cloud Messaging (FCM)

**Purpose:** Send push notifications to mobile devices

**Integration Method:** Firebase Admin SDK

**Features Used:**
- Push notifications to iOS and Android
- Critical alerts (bypass Do Not Disturb)
- Custom notification channels
- Priority levels

**Configuration:** `config/firebase.js`

---

### Supabase (PostgreSQL)

**Purpose:** Database storage

**Integration Method:** Supabase JavaScript client

**Features Used:**
- PostgreSQL database
- Real-time subscriptions (future)
- Row-level security
- Auto-generated REST API

**Configuration:** `config/database.js`

---

## Deployment

### Environment Variables Required

```
# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# Dexcom API
DEXCOM_CLIENT_ID=your-client-id
DEXCOM_CLIENT_SECRET=your-client-secret
DEXCOM_REDIRECT_URI=https://your-domain.com/auth/dexcom/callback

# Server
PORT=3000
NODE_ENV=production

# Authentication
JWT_SECRET=your-jwt-secret

# Firebase
FIREBASE_PROJECT_ID=your-project-id
```

### Running the Application

**Development:**
```bash
npm install
npm run dev
```

**Production:**
```bash
npm install --production
npm start
```

**Testing:**
```bash
npm test
npm run test:coverage
```

### Deployment Platforms

Recommended platforms:
- **Heroku** - Easy deployment
- **AWS EC2** - More control
- **Google Cloud Run** - Serverless
- **DigitalOcean App Platform** - Simple and affordable

---

## Security Considerations

### Authentication
- JWT tokens for API requests
- Dexcom OAuth 2.0 for CGM data access
- Row-level security in Supabase

### Data Protection
- HTTPS only in production
- Environment variables for secrets
- No sensitive data in logs
- HIPAA considerations (PHI handling)

### Webhook Security
- Validate Dexcom webhook signatures
- Rate limiting on endpoints
- Input validation on all requests

---

## Performance Considerations

### Response Time Goals
- Webhook processing: < 500ms
- API requests: < 200ms
- Notification delivery: < 2 seconds

### Scalability
- Stateless design (can run multiple instances)
- Database connection pooling
- Background worker for async processing
- Caching for frequently accessed data

---

## Monitoring & Logging

### Logging
- Winston logger for structured logging
- Log levels: error, warn, info, debug
- Logs stored in files and console

### Metrics to Track
- Alert response time (proximal outcome)
- Dismissal rate (proximal outcome)
- Notification delivery success rate
- API endpoint response times
- Database query performance

---

## Future Enhancements

### Planned Features
1. **Machine Learning:** Predictive low alerts
2. **Multi-language Support:** Spanish, etc.
3. **Caregiver Insights Dashboard:** Analytics on patterns
4. **Integration with Insulin Pumps:** Closed-loop suggestions
5. **Voice Commands:** Siri/Google Assistant integration

### Research Extensions
1. Measure long-term outcomes (6-month study)
2. Compare with control group (standard CGM alerts)
3. Survey caregiver mental health metrics
4. Analyze patterns in dismissed alerts

---

## References

### ADA Standards
- American Diabetes Association. Standards of Medical Care in Diabetes—2024
- Hypoglycemia classification levels
- Treatment protocols

### JITAI Framework
- Nahum-Shani et al. (2018). Just-in-Time Adaptive Interventions (JITAIs) in Mobile Health

### Related Work
- CaNoE Framework (Context-Aware Notifications for Elderly)
- CGM Alarm Fatigue Literature Review

---

## Contact

**Project Authors:**
- Aidan Schooley - aidan.schooley27@houghton.edu
- Sarah Winne - sarah.winne27@houghton.edu

**Institution:** Houghton University

**Research Period:** March - May 2026

---

*This architecture document describes the GlucoseCare backend as implemented for the IEEE conference paper "GlucoseCare: A Context-Aware Just-in-Time Adaptive Notification System for Caregivers of Children with Type 1 Diabetes"*