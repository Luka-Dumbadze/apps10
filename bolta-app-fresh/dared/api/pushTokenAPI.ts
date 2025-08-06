import { db } from "@/firebaseConfig";
import * as Notifications from "expo-notifications";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const savePushTokenToFirestore = async (userId: string, token: Notifications.DevicePushToken) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists() || userDoc.data().pushToken !== token) {
        await setDoc(userRef, { pushToken: token }, { merge: true });
      }
    } catch (error) {
      console.error("Error saving push token:", error);
    }
};