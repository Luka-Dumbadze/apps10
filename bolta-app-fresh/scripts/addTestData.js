// scripts/addTestData.js
// Run this script to add test rewards to your Firestore database
// Usage: node scripts/addTestData.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Your Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Test rewards data
const testRewards = [
  {
    partnerName: "Starbucks",
    rewardTitle: "$5 Coffee Gift Card",
    rewardDescription: "Enjoy a $5 gift card to use at any Starbucks location. Perfect for your morning coffee!",
    boltCost: 50,
    logoUrl: "https://via.placeholder.com/100x100?text=Starbucks",
    category: "Food & Drinks",
    isActive: true,
    stockCount: 100,
    expiryDays: 365,
    termsAndConditions: "Valid at participating locations. Cannot be combined with other offers.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    partnerName: "Amazon",
    rewardTitle: "$10 Amazon Gift Card",
    rewardDescription: "Get a $10 Amazon gift card to use on millions of products. Free shipping included!",
    boltCost: 100,
    logoUrl: "https://via.placeholder.com/100x100?text=Amazon",
    category: "Shopping",
    isActive: true,
    stockCount: 50,
    expiryDays: 730,
    termsAndConditions: "Valid for Amazon.com purchases only. Cannot be resold.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    partnerName: "Netflix",
    rewardTitle: "1 Month Netflix Subscription",
    rewardDescription: "Enjoy one month of Netflix premium streaming. Watch thousands of movies and shows!",
    boltCost: 150,
    logoUrl: "https://via.placeholder.com/100x100?text=Netflix",
    category: "Entertainment",
    isActive: true,
    stockCount: 25,
    expiryDays: 30,
    termsAndConditions: "For new users only. Auto-renewal may apply.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    partnerName: "McDonald's",
    rewardTitle: "Free Big Mac Meal",
    rewardDescription: "Enjoy a free Big Mac meal including fries and a drink at participating McDonald's locations.",
    boltCost: 75,
    logoUrl: "https://via.placeholder.com/100x100?text=McDonalds",
    category: "Food & Drinks",
    isActive: true,
    stockCount: 200,
    expiryDays: 60,
    termsAndConditions: "Valid at participating locations. Must present coupon code.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    partnerName: "Spotify",
    rewardTitle: "3 Months Spotify Premium",
    rewardDescription: "Get 3 months of ad-free music streaming with Spotify Premium. Download and listen offline!",
    boltCost: 120,
    logoUrl: "https://via.placeholder.com/100x100?text=Spotify",
    category: "Entertainment",
    isActive: true,
    stockCount: 75,
    expiryDays: 90,
    termsAndConditions: "For new premium users only. Auto-renewal applies after trial.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
];

async function addTestData() {
  try {
    console.log('Adding test rewards to Firestore...');
    
    for (const reward of testRewards) {
      const docRef = await addDoc(collection(db, 'rewards'), reward);
      console.log(`Added reward: ${reward.rewardTitle} (ID: ${docRef.id})`);
    }
    
    console.log('✅ All test rewards added successfully!');
    console.log('You can now see rewards in your marketplace.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding test data:', error);
    process.exit(1);
  }
}

addTestData();