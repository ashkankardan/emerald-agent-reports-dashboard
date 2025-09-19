# Emerald Agent Reports Dashboard

A role‑based React + Firebase application for collecting and managing agent reports and enrollments, with admin tooling for review, search, exports, and verification. The project also includes Firebase Cloud Functions for IP allow‑listing, Twilio notifications, temporary document links, and scheduled Firestore backups.

> **Stack**: React (CRA), Firebase Hosting, Cloud Functions (Node 18), Firestore, Algolia Search, EmailJS, XLSX exports, styled‑components.

---

## Table of Contents

* [Features](#features)
* [Screens & Roles](#screens--roles)
* [Architecture](#architecture)
* [Directory Structure](#directory-structure)
* [Getting Started](#getting-started)
* [Environment Variables](#environment-variables)

  * [Frontend (`REACT_APP_*`)](#frontend-react_app_)
  * [Cloud Functions runtime config](#cloud-functions-runtime-config)
* [Firebase Setup](#firebase-setup)
* [Development Scripts](#development-scripts)
* [Cloud Functions](#cloud-functions)
* [Data Model (Firestore)](#data-model-firestore)
* [Algolia & EmailJS Configuration](#algolia--emailjs-configuration)
* [Exporting & Reports](#exporting--reports)
* [Deployment](#deployment)

---

## Features

* **Role‑based access**: `agent`, `admin`, `super-admin` workflows and views.
* **Agent reporting**: dynamic forms to submit daily/weekly reports and enrollment activity.
* **Admin console**: review & update reports, inline edits, bulk actions, and status flows.
* **Search & filter**: Algolia‑powered search by name and other fields in the admin view.
* **Exports**: one‑click export to **XLSX** (via `xlsx` + `file-saver`).
* **Verification links**: generate temporary access links and deliver via Email/SMS.
* **IP allow‑listing**: block/allow app access by IP (checked at startup via `REACT_APP_CHECK_IP_URL`).
* **Scheduled backups**: daily Firestore export to GCS via a scheduled Cloud Function.
* **Twilio integration**: functions to receive call details / agent assignment and to send notifications.
* **Styled UI**: `styled-components`‑based design system with modular, reusable components.

## Screens & Roles

* **Login / Signup** (`/login`, `/signup`)
* **Agent dashboard** (`/agent`): create/update your own reports and enrollments, see progress.
* **Admin dashboard** (`/admin`): manage all reports, run searches, exports, and verifications.
* **Enrollments view** (`/enrollments`): enrollment metrics and breakdowns.
* **Progress view** (`/progress`): aggregate statistics (day/week) with helper hooks.

> Routing is handled via **react-router-dom** (v6).

## Architecture

```
React (CRA) SPA
  ├─ Auth / Role context (localStorage persistence)
  ├─ Feature modules: Reports, Enrollments, Progress, Admin tools
  ├─ Integrations: Algolia (search), EmailJS (email send), XLSX (export)
  └─ Axios check → REACT_APP_CHECK_IP_URL (IP allow‑listing)

Firebase
  ├─ Hosting (serves CRA build)
  ├─ Firestore (users, reports, enrollments, tempLinks, etc.)
  └─ Cloud Functions (Node 18)
      ├─ receiveCallDetails (https)
      ├─ receiveAssignedAgent (https)
      ├─ checkIP (https) — used by the app to gate access
      ├─ searchByName (https) — supports admin search
      ├─ generateTempURL (https) / updateAndDeleteDocTempURL (https)
      ├─ checkPinAndFetchDocument (https)
      ├─ addPhoneSuffixToReports (https)
      ├─ deleteExpiredDocs (pubsub, every 3 minutes)
      └─ scheduledFirestoreExport (pubsub, daily)
```

## Directory Structure

```
.
├─ functions/                 # Firebase Cloud Functions (Node 18)
│   ├─ index.js               # All exported functions
│   ├─ package.json
│   └─ ...
├─ public/                    # CRA public assets
├─ src/
│   ├─ assets/img/            # Logos & images
│   ├─ components/            # UI components (reports, modals, stats, etc.)
│   ├─ contexts/              # user-context, view-context
│   ├─ helpers/               # formatting & calculations
│   ├─ hooks/                 # custom hooks (enrolled amount, logout, etc.)
│   ├─ layouts/               # wrappers and layout styles
│   ├─ pages/                 # route pages (Agent, Admin, Enrollments, Progress, ...)
│   ├─ App.js                 # routes
│   ├─ index.js               # CRA entry point
│   └─ index.css
├─ firebase.json              # Hosting + Functions config
├─ .firebaserc                # Default project alias
├─ package.json               # CRA app pkg
└─ README.md                  # (this file)
```

## Getting Started

1. **Install** (node ≥ 18 recommended for parity with Functions):

   ```bash
   npm install
   cd functions && npm install && cd ..
   ```
2. **Set environment variables** (see next section) for both frontend and functions.
3. **Run the app**:

   ```bash
   npm start
   ```
4. **Emulate / serve Functions** (optional):

   ```bash
   cd functions
   npm run serve
   ```

## Environment Variables

### Frontend (`REACT_APP_*`)

Create a `.env` at the project root:

```
REACT_APP_CHECK_IP_URL=<https endpoint of checkIP function>
REACT_APP_SECURED_URL=<base url for secured endpoints if used>

# Algolia
REACT_APP_ALGOLIA_APP_ID=<your app id>
REACT_APP_ALGOLIA_API_KEY=<search‑only api key>
REACT_APP_ALGOLIA_INDEX=<index name>

# EmailJS
REACT_APP_EMAILJS_SERVICE_ID=<service id>
REACT_APP_EMAILJS_TEMPLATE_ID=<template id>
REACT_APP_EMAILJS_PUBLIC_KEY=<public key>
```

> CRA only exposes variables prefixed with `REACT_APP_` to the browser.

### Cloud Functions runtime config

Set with `firebase functions:config:set` and **deploy**:

```bash
# Twilio (used by functions)
firebase functions:config:set twilio.sid="<sid>" twilio.token="<token>"

# Project id used by scheduled backups (if referenced as functions.config().project.id)
firebase functions:config:set project.id="<your-firebase-project-id>"

# (Optional) other config keys your functions rely on
# e.g., allowed IP/cidr, bucket, auth pins, etc.
```

Read configs with `functions.config()` in code. To inspect:

```bash
firebase functions:config:get
```

## Firebase Setup

1. **Create a Firebase project** and enable:

   * **Firestore** (Native mode)
   * **Hosting**
   * **Cloud Functions** (Node 18)
2. **Initialize** (already included): `.firebaserc`, `firebase.json`.
3. **Set Functions config** (above) and deploy:

   ```bash
   npm run build
   firebase deploy --only hosting,functions
   ```
4. **(Optional) Schedules**: Pub/Sub schedules (e.g., `scheduledFirestoreExport`) are created on first deploy.

## Development Scripts

```json
{
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
```

Functions scripts:

```json
{
  "serve": "firebase emulators:start --only functions",
  "deploy": "firebase deploy --only functions",
  "logs": "firebase functions:log"
}
```

## Cloud Functions

> Located in `functions/index.js` (Node 18). Key exports (names inferred from code):

* **`checkIP`** *(HTTPS)*: validates requester IP/allow‑list. The frontend calls this via `REACT_APP_CHECK_IP_URL` during app initialization to gate access.
* **`receiveCallDetails`** *(HTTPS)*: ingests call metadata (e.g., from a dialer/integration); looks up matching user by `viciUsername` and stores/updates related records.
* **`receiveAssignedAgent`** *(HTTPS)*: assigns/updates the agent for a lead/call.
* **`searchByName`** *(HTTPS)*: search utility for admin (complements client‑side Algolia usage).
* **`generateTempURL`** *(HTTPS)*: creates a one‑time/expiring document URL (e.g., for verification), persists in Firestore.
* **`checkPinAndFetchDocument`** *(HTTPS)*: validates a PIN and returns the associated document payload.
* **`updateAndDeleteDocTempURL`** *(HTTPS)*: housekeeping for temporary links (update status, then delete).
* **`addPhoneSuffixToReports`** *(HTTPS)*: mass‑update utility to normalize phone suffix data in report docs.
* **`deleteExpiredDocs`** *(Scheduled: every 3 minutes)*: removes expired temporary docs/links.
* **`scheduledFirestoreExport`** *(Scheduled: daily)*: exports Firestore to the default GCS bucket using the Admin SDK / Firestore Admin client. Requires the project/bucket to be correctly configured.

> **Twilio**: The Functions code initializes `twilio` using `functions.config().twilio.{sid,token}`. Ensure the credentials are set. If SMS/voice webhooks are used, map them to the appropriate HTTPS function URLs.

## Data Model (Firestore)

> Collections are inferred from usage in code; confirm/adjust to match your production data.

* `users` — user records including `role` (`agent` | `admin` | `super-admin`), `viciUsername`, contact info.
* `reports` — agent report docs; includes daily/weekly stats, amounts, status fields; used by AdminReports.
* `enrollments` — enrollment activity summarized per user/date with derived fields like `dayCount`, `dayAmount`, `weekAmount`.
* `tempLinks` / `verifications` — temporary link/PIN records with `expiresAt` timestamps.

Some code computes aggregates (e.g., day/week amounts) on the client using helper hooks/utilities; scheduled functions handle cleanup and backups.

## Algolia & EmailJS Configuration

* **Algolia**: Create an index (e.g., name matches `REACT_APP_ALGOLIA_INDEX`), set searchable attributes (name, phone, email as needed). Use a **Search‑Only API Key** in the frontend.
* **EmailJS**: Create a service + template. Add the `REACT_APP_EMAILJS_*` variables. The app posts to `https://api.emailjs.com/api/v1.0/email/send` to deliver verification links.

## Exporting & Reports

* Admin reports view can export the current filtered dataset to **Excel** using `xlsx` and **downloads** the file via `file-saver`.
* Sorting helpers (`src/helpers/index.js`) support ordering by `dayCount`, `dayAmount`, `weekAmount`, etc.

## Deployment

1. Build the SPA:

   ```bash
   npm run build
   ```
2. Deploy Hosting & Functions:

   ```bash
   firebase deploy --only hosting,functions
   ```
3. Confirm scheduled tasks and set proper **roles** for any service accounts used by Firestore export (Storage Admin, Datastore Import Export Admin).

