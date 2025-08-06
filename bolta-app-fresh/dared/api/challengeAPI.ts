import { db } from "@/firebaseConfig";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { uploadImageAsync } from "./imagesAPI";

export const hasSeenChallenge = async (
  challengeId: string,
  userId: string
): Promise<boolean> => {
  if (challengeId && userId) {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const seenChallenges = userDoc.data().seenChallenges || [];
      if (seenChallenges.includes(challengeId)) {
        return true;
      }
    }

    return false;
  }
  return true;
};

export const markAsSeen = async (userId: string, challengeId: string) => {
  if (userId && challengeId) {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      seenChallenges: arrayUnion(challengeId),
    });
  }
};

export const hasSeenTodaysChallenge = async (
  userId: string
): Promise<boolean> => {
  try {
    const todaysChallengeId = (await getTodaysChallenge())?.challengeId;
    if (!todaysChallengeId) {
      return false;
    }

    const userDocRef = doc(db, "users", userId);

    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return true;
    }
    const userData = userDoc.data();
    const seenChallenges = userData?.seenChallenges || [];
    return seenChallenges.includes(todaysChallengeId);
  } catch (error) {
    console.error(
      "Error checking if the user has seen today's challenge:",
      error
    );
    return true;
  }
};

export async function getTodaysChallenge(): Promise<Challenge | null> {
  try {
    const challengesRef = collection(db, "challenges");

    const q = query(challengesRef, orderBy("createdAt", "desc"), limit(1));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const lastChallenge = querySnapshot.docs[0];
    return {
      challengeId: lastChallenge.id,
      challenge: lastChallenge.data().challenge,
    };
  } catch (error) {
    console.error("Error fetching today's challenge ID:", error);
    return null;
  }
}


export async function submitChallenge(uri: string, userId: string, challengeId: string, caption: string) {
  try {
    const imageUrl = await uploadImageAsync(uri, userId, "submissions");

    const submissionsRef = collection(db, "submissions");

    const docRef = await addDoc(submissionsRef, {
      userId: userId,
      challengeId: challengeId,
      imageUrl: imageUrl,
      createdAt: serverTimestamp(),
      comments: [],
      caption: caption
    });

    const userDocRef = doc(db, "users", userId);

    await updateDoc(userDocRef, {
      didChallenges: arrayUnion(challengeId),
    });

    console.log("Photo submitted and challenge recorded successfully!");

    return docRef.id;
  } catch (error) {
    console.error("Error submitting photo:", error);
  }
}

export const hasDoneTodaysChallenge = async (
  userId: string
): Promise<boolean> => {
  try {
    const todaysChallengeId = (await getTodaysChallenge())?.challengeId;
    if (!todaysChallengeId) {
      return false;
    }
    const userDocRef = doc(db, "users", userId);

    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      return false;
    }

    const userData = userDoc.data();
    const didChallenges = userData?.didChallenges || [];
   return didChallenges.includes(todaysChallengeId + '');
  } catch (error) {
    console.error("Error checking if the user has done today's challenge:", error);
    return false;
  }
};

export const didChallenges = async (doneChallengesIDs: string[], userId: string): Promise<ChallengePost[]> => {
  const challengesDone: ChallengePost[] = [];
  try {
    const submissionsRef = collection(db, "submissions");
    if (doneChallengesIDs.length > 0) {

      const q = query(submissionsRef, where("challengeId", "in", doneChallengesIDs ?? []), where("userId", "==", userId) );

      const querySnapshot = await getDocs(q);
      
      const challengePromises = querySnapshot.docs.map(async (docT) => {
        const data = docT.data();
      
        const challengeRef = doc(db, "challenges", data.challengeId);
        const challengeSnap = await getDoc(challengeRef);
        const challenge = challengeSnap.exists()
          ? challengeSnap.data().challenge
          : "Unknown Challenge";
        const comments: PostComment[] = data.comments
          ? data.comments?.map((comment: CommentDTO) => {
              return {
                uid: comment.uid,
                commentText: comment.text,
                createdAt: comment.createdAt,
                submissionId: docT.id,
                username: comment.userName,
              };
            })
          : [];
      
        const challengePost: ChallengePost = {
          submissionId: docT.id,
          challengeId: data.challengeId,
          challenge: challenge,
          userId: data.userId,
          imageUrl: data.imageUrl,
          username: data.username,
          profilePictureUrl: data.profilePictureURL,
          postingTime: data.createdAt,
          upvotes: data.upvotes,
          downvotes: data.downvotes,
          comments: comments,
          caption: data.caption
        };
      
        return challengePost; 
      });
      
      const challengesDone = await Promise.all(challengePromises);
      
      



      return challengesDone;
    }
  } catch (error) {
    console.error("Error fetching challenges: ", error);
  }

  return []
};