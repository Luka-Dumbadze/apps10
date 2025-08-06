import { db } from "@/firebaseConfig";
import { uploadImageAsync } from "./imagesAPI";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { didChallenges } from "./challengeAPI";

export async function submitProfilePicture(uri: string, userId: string) {
  try {
    const imageURL = await uploadImageAsync(uri, userId, "profilePictures");

    const userDocRef = doc(db, "users", userId);

    updateDoc(userDocRef, {
      profilePictureURL: imageURL,
    });

    return imageURL;
  } catch (err) {
    console.log("ERROR UPLOADING PROFILE PICTURE URL", err)
  }
}


export async function getContextUser(uid: string): Promise<ContextUser | null> {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.error("User does not exist:", uid);
      return null;
    }

    const userData = userDoc.data();

    const usersDoneChallengePosts = await didChallenges(userData.didChallenges, uid);

    const contextUser: ContextUser = {
      uid: uid,
      email: userData.email || "",
      challenge: null, 
      username: userData.username || "",
      seenChallenges: userData.seenChallenges || [],
      didChallenges: userData.didChallenges || [],
      hasDoneTodays: userData.hasDoneTodays || false,
      usersDoneChallengePosts: usersDoneChallengePosts ?? [],
      seenTodays: userData.seenTodays || false,
      profilePictureUrl: userData.profilePictureURL || "",
      votes: userData.votes || [],
    };

    return contextUser;

  } catch (err) {
    console.error("Error fetching context user:", err);
    return null;
  }
}