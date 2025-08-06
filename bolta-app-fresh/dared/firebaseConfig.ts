// firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Firestore, getFirestore } from "firebase/firestore";
// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApidBC5jBvbZc3EnoQQlmFcmoiOyTnEsM",
  authDomain: "dared-prototype.firebaseapp.com",
  projectId: "dared-prototype",
  storageBucket: "dared-prototype.appspot.com",
  messagingSenderId: "106980213962",
  appId: "1:106980213962:web:0c123c7dc870060a552033",
  measurementId: "G-SF7F52LWNJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app)
