# BOLTA App

A React Native app built with Expo and Firebase.

## Setup Instructions

### 1. Firebase Configuration

1. Create a Firebase project at https://console.firebase.google.com/
2. Copy `.env.example` to `.env.local`
3. Fill in your Firebase configuration values in `.env.local`
4. Set up Firestore database with the following security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to rewards collection
    match /rewards/{document} {
      allow read: if true;
      allow write: if true; // TEMPORARY: Remove this in production
    }
    
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to create redemptions
    match /redemptions/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Test Data

```bash
node scripts/addTestData.js
```

### 4. Start the App

```bash
npm start
```

## Quick Setup for Development

### Option 1: Temporary Development Rules (Easiest)
```bash
# Run the setup guide
node scripts/setupFirestore.js

# After setting up Firestore rules, add test data
node scripts/addTestData.js

# Start the app
npm start
```

### Option 2: Production-Ready Setup
Use the Firebase Admin SDK (requires service account key):
```bash
node scripts/addTestDataAdmin.js
```

## Common Issues

### 🔥 Firebase Permissions Error
- **Problem**: `7 PERMISSION_DENIED: Missing or insufficient permissions`
- **Solution**: Run `node scripts/setupFirestore.js` and follow the instructions to set up Firestore rules

### 👤 User Document Not Found Error
- **Problem**: `User document not found in Firestore`
- **Solution**: Fixed automatically - user documents are now created on first login

### 📱 AsyncStorage Version Warning
- **Problem**: `@react-native-async-storage/async-storage@1.24.0 - expected version: 2.1.2`
- **Solution**: Already updated to correct version, warning may persist due to Firebase dependencies

### 🔗 Expo Linking Warning
- **Problem**: `Linking requires a build-time setting 'scheme'`
- **Solution**: Already fixed with scheme configuration in `app.json`

### 🔑 Firebase Configuration Error
- **Problem**: `"projectId" not provided in firebase.initializeApp`
- **Solution**: Make sure all Firebase environment variables are set in `.env.local`