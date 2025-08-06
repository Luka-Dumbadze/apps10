import { createUserWithEmailAndPassword, User } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";

export async function getCurrentUser(): Promise<RegisteredUser | null> {
  const currentUser: User | null = auth.currentUser;

  if (currentUser) {
    const uid = currentUser.uid;
    try {
      const userDocRef = doc(db, "users", uid);
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        return {
          uid: uid,
          email: docSnapshot.data().email,
          username: docSnapshot.data().username,
        };
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  return null;
}

export async function createUserDocument(user: RegisteredUser) {
  try {
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      username: user.username,
      seenChallenges: []
    });

  } catch (error) {
    console.error("Error creating user document:", error);
  }
}

export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCredential.user.uid;
    return uid;
  } catch (error) {
    console.log("Error During Registration:", (error as FirebaseError).code);
    return null;
  }
};

export async function isUsernameTaken(username: string): Promise<boolean> {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking username:", error);
    return false;
  }
}
export async function isEmailTaken(email: string): Promise<boolean> {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
}
