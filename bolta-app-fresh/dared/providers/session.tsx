import React, { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,

} from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { collection, doc, getDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import { didChallenges, hasSeenTodaysChallenge, markAsSeen } from "@/api/challengeAPI"; // Import the function you've defined
import { getTodaysChallenge } from "@/api/challengeAPI";

const AuthContext = createContext({
  user: null as ContextUser | null,
  signIn: async (email: string, password: string) => {},
  signOut: async () => {},
  loading: true,
  setHasSeenTodays: async (challengeId: string, seen: boolean) => {},
  setTodaysChallenge: (challenge: Challenge | null) => {},
  setDidTodaysChallenge: (did: boolean) => {},
  addChallengeAsDone: (challengeId: string) => {},
  setProfilePicureURL: (profilePictureURL: string) => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ContextUser | null>(null);
  const [loading, setLoading] = useState(true);


  const listenToNewChallengeAddition = () => {
    const challengesRef = collection(db, "challenges");
    const q = query(challengesRef, orderBy("createdAt", "desc"));
    let isInitialLoad = true;
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" && !isInitialLoad) {
          const newChallenge = change.doc.data();
          newChallenge.challengeId = change.doc.id;
          
          setTodaysChallenge({
            challenge: newChallenge.challenge,
            challengeId: newChallenge.challengeId,
          })

          setHasSeenTodays(newChallenge.challengeId ?? "", false);
          
        }
      });

      isInitialLoad = false;
    });

    return unsubscribe; 
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            const todaysChallenge = await getTodaysChallenge();
            const seenTodaysChallenge = await hasSeenTodaysChallenge(
              firebaseUser.uid
            );
            const hasDoneTodays = userData.didChallenges?.includes(
              todaysChallenge?.challengeId
            );
            const usersDoneChallengePosts = await didChallenges(userData.didChallenges ?? [], firebaseUser.uid)
            const enhancedUser: ContextUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              challenge: todaysChallenge,
              seenTodays: seenTodaysChallenge,
              username: userData.username || "",
              usersDoneChallengePosts: usersDoneChallengePosts,
              seenChallenges: userData.seenChallenges || [],
              didChallenges: userData.didChallenges || [],
              profilePictureUrl: userData.profilePictureURL,
              hasDoneTodays: !!hasDoneTodays,
              votes: userData.votes || []
            };

            setUser(enhancedUser);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Auth state change error:", error);
        setLoading(false);
      }
    );

    const unsubscribeChallengeListener = listenToNewChallengeAddition();

    return () => {
      unsubscribeAuth(); 
      unsubscribeChallengeListener(); 
    };;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const setHasSeenTodays = async (challengeId: string, seen: boolean) => {
    if (seen) {
      if (user?.uid) {
        await markAsSeen(user.uid, challengeId);
      }
    }
     
    setUser((prevUser) =>
      prevUser
        ? {
            ...prevUser,
            seenChallenges: seen ? [...prevUser.seenChallenges, challengeId] : prevUser.seenChallenges,
            seenTodays: seen,
          }
        : null
    );
  };

  const setTodaysChallenge = (challenge: Challenge | null) => {
    setUser((prevUser) =>
      prevUser
       ? {...prevUser, challenge }
        : null
    );
  }
  const setProfilePicureURL = (profilePictureUrl: string) => {
    setUser((prevUser) =>
      prevUser
       ? {...prevUser, profilePictureUrl }
        : null
    );
  }

  const setDidTodaysChallenge = (did: boolean) => {
    setUser((prevUser) =>
      prevUser
       ? {...prevUser, hasDoneTodays: did }
        : null
    );
  }

  const addChallengeAsDone = async (challengeId: string) => {
    console.log(challengeId, "FROM SESSION")
    if (user?.uid) {
      setUser((prevUser) =>
        prevUser
          ? {
              ...prevUser,
              didChallenges: [...prevUser.didChallenges, challengeId],
            }
          : null
      );
      const usersDoneChallengePosts = await didChallenges([challengeId], user.uid)
      console.log(usersDoneChallengePosts, "FROM ADD CHALLENGES AS DONE", [challengeId])
      setUser((prevUser) =>
        prevUser
         ? {...prevUser, usersDoneChallengePosts: [...usersDoneChallengePosts, ...prevUser.usersDoneChallengePosts ] }
          : null
      );
    }
  };
  

  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut, setHasSeenTodays, loading, setTodaysChallenge, setDidTodaysChallenge, setProfilePicureURL, addChallengeAsDone}}
    >
      {children}
    </AuthContext.Provider>
  );
}
