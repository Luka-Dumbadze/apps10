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
      allow write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
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

## Common Issues

- **Firebase projectId error**: Make sure all Firebase environment variables are set in `.env.local`
- **AsyncStorage warning**: This is now properly configured with React Native persistence
- **Expo scheme warning**: Added scheme configuration to `app.json`
- **Firebase permissions error**: Set up proper Firestore security rules as shown above