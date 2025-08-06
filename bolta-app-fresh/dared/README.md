# Dared - Social Challenge App

Dared is a mobile social application that connects users through daily challenges. Users can complete challenges by posting photo or video proof, which then appears on a shared feed for others to react to and comment on.

## ✨ Features

*   **Daily Challenges**: Receive new challenges every day to complete.
*   **Photo & Video Posts**: Share your challenge completions by uploading images or videos.
*   **Interactive Feed**: Browse a feed of posts from other users, react, and comment.
*   **User Profiles**: View your own profile and the profiles of other users.
*   **Push Notifications**: Get notified about new challenges and interactions on your posts.

## 🚀 Tech Stack

The Dared app is built with a modern, cross-platform, and serverless technology stack.

### Frontend (Mobile App)

*   **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
*   **State Management**: React Context API
*   **Forms**: [Formik](https://github.com/jaredpalmer/formik) & [Yup](https://github.com/jquense/yup)
*   **API Client**: [Axios](https://axios-http.com/)

### Backend (Serverless)

*   **Platform**: [Google Firebase](https://firebase.google.com/)
*   **Serverless Functions**: [Cloud Functions for Firebase](https://firebase.google.com/docs/functions) (Node.js)
*   **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
*   **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore)
*   **Storage**: [Cloud Storage for Firebase](https://firebase.google.com/docs/storage)

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or newer)
*   [Expo CLI](https://docs.expo.dev/get-started/installation/)
*   A [Firebase](https://firebase.google.com/) project

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/dared.git
    cd dared
    ```
    (Replace `your-username` with the actual repository path)

2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```

3.  **Install backend dependencies:**
    ```bash
    cd functions
    npm install
    cd ..
    ```

4.  **Configure Firebase:**

    This project requires a Firebase project to be set up for the backend and client-side to function correctly.

    *   **For the Frontend:**
        1.  Create a web app in your Firebase project.
        2.  Copy your Firebase config object and replace the placeholder content in `firebaseConfig.ts`.
        3.  Download the `google-services.json` file for your Android app from the Firebase console and place it in the root of the project.

    *   **For the Backend (Cloud Functions):**
        1.  In your Firebase project settings, go to the "Service accounts" tab.
        2.  Click "Generate new private key" and download the resulting JSON file.
        3.  Rename this file to match the one referenced in `functions/index.js` or update the code to use your new filename. A common practice is to name it `serviceAccountKey.json`.
        **Important:** Ensure this file is added to your `.gitignore` and never committed to your repository.

### Running the Application

Once the installation and setup are complete, you can run the application using the Expo CLI:

```bash
npm start
```

This will start the Metro bundler. You can then run the app:
*   On an Android emulator/device by pressing `a`.
*   On an iOS simulator/device by pressing `i`.
*   In a web browser by pressing `w`.

## 📂 Project Structure

Here is a brief overview of the key directories in the project:

```
/
├── api/              # API client modules for communicating with the backend
├── app/              # Expo Router file-based routing and screens
├── assets/           # Static assets like images and fonts
├── components/       # Reusable React components
├── constants/        # Shared constants like color schemes
├── functions/        # Firebase Cloud Functions (backend logic)
├── hooks/            # Custom React hooks
├── providers/        # React Context providers for state management
├── firebaseConfig.ts # Firebase configuration for the client app
└── ...
```
