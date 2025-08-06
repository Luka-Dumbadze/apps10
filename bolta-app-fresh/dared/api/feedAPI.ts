import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  doc,
  getDoc,
  DocumentData,
  endBefore,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";

export async function fetchFeed(lastId: string): Promise<{
  posts: ChallengePost[];
}> {
  console.log("CALLED");
  try {
    let submissionsQuery = query(
      collection(db, "submissions"),
      orderBy("createdAt", "desc")
    );

    const submissionSnapshots = await getDocs(submissionsQuery);
    let submissions: ChallengePost[] = [];

    for (const submissionDoc of submissionSnapshots.docs) {
      const submissionData = submissionDoc.data();
      const userRef = doc(db, "users", submissionData.userId);
      const userSnap = await getDoc(userRef);
      const challengeRef = doc(db, "challenges", submissionData.challengeId);
      const challengeSnap = await getDoc(challengeRef);
      const challenge = challengeSnap.exists()
        ? challengeSnap.data().challenge
        : "Unknown Challenge";

      const comments: PostComment[] = submissionData.comments
        ? submissionData.comments.map((comment: CommentDTO) => {
            return {
              commentId: comment.commentId,
              likes: comment.likes,
              uid: comment.uid,
              commentText: comment.text,
              createdAt: comment.createdAt,
              submissionId: submissionDoc.id,
              username: comment.userName,
            };
          })
        : [];

      const challengePost: ChallengePost = {
        submissionId: submissionDoc.id,
        challengeId: submissionData.challengeId,
        challenge: challenge,
        userId: submissionData.userId,
        imageUrl: submissionData.imageUrl,
        username: userSnap.exists() ? userSnap.data().username : "Unknown",
        profilePictureUrl: userSnap?.data()?.profilePictureURL ?? "",
        postingTime: submissionData.createdAt,
        upvotes: submissionData.upvotes || [],
        downvotes: submissionData.downvotes || [],
        comments: comments,
        caption: submissionData.caption,
      };

      submissions.push(challengePost);
    }
    if (lastId && submissions[submissions.length - 1].submissionId === lastId) {
      submissions = [];
    }
    return {
      posts: submissions,
    };
  } catch (error) {
    console.error("Error fetching feed:", error);
    throw error;
  }
}

export async function refreshFeed(): Promise<{ posts: ChallengePost[] }> {
  try {
    let submissionsQuery = query(
      collection(db, "submissions"),
      orderBy("createdAt", "desc")
    );

    const testSnap = await getDocs(submissionsQuery);
    console.log(testSnap.docs[0].data(), "DSJAINVJFDNSNVGJSNDJGNVJ");

    const submissionSnapshots = await getDocs(submissionsQuery);
    const submissions: ChallengePost[] = [];

    for (const submissionDoc of submissionSnapshots.docs) {
      const submissionData = submissionDoc.data();
      const userRef = doc(db, "users", submissionData.userId);
      const userSnap = await getDoc(userRef);
      const challengeRef = doc(db, "challenges", submissionData.challengeId);
      const challengeSnap = await getDoc(challengeRef);
      const challenge = challengeSnap.exists()
        ? challengeSnap.data().challenge
        : "Unknown Challenge";

      const comments: PostComment[] = submissionData.comments
        ? submissionData.comments.map((comment: CommentDTO) => {
            return {
              commentId: comment.commentId,
              likes: comment.likes,
              uid: comment.uid,
              commentText: comment.text,
              createdAt: comment.createdAt,
              submissionId: submissionDoc.id,
              username: comment.userName,
            };
          })
        : [];

      const challengePost: ChallengePost = {
        submissionId: submissionDoc.id,
        challengeId: submissionData.challengeId,
        challenge: challenge,
        userId: submissionData.userId,
        imageUrl: submissionData.imageUrl,
        username: userSnap.exists() ? userSnap.data().username : "Unknown",
        profilePictureUrl: userSnap?.data()?.profilePictureURL ?? "",
        postingTime: submissionData.createdAt,
        upvotes: submissionData.upvotes || [],
        downvotes: submissionData.downvotes || [],
        comments: comments,
        caption: submissionData.caption,
      };

      submissions.push(challengePost);
    }

    return {
      posts: submissions,
    };
  } catch (error) {
    console.error("Error refreshing feed:", error);
    throw error;
  }
}
