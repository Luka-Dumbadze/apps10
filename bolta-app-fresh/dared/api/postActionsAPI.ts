import { db } from "@/firebaseConfig";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  FieldValue,
  serverTimestamp,
  collection,
  addDoc,
} from "firebase/firestore";

enum VoteType {
  UPVOTE = "UPVOTE",
  DOWNVOTE = "DOWNVOTE",
  UNVOTE = "UNVOTE"
}

export async function reactComment(commentId: string, uid: string, liked: boolean) {
  const commentRef = doc(db, 'comments', commentId);
  try {
    const commentDoc = await getDoc(commentRef);

    if (!commentDoc.exists()) {
      console.error(`Comment with ID ${commentId} does not exist.`);
      return;
    }

    const commentData = commentDoc.data();

     if (liked) {
      await updateDoc(commentRef, {
        likes: arrayRemove(uid), 
      });
      console.log(`User ${uid} unliked comment with ID ${commentId}.`);
    } else {
      await updateDoc(commentRef, {
        likes: arrayUnion(uid),
      });
      console.log(`User ${uid} liked comment with ID ${commentId}.`);
    }


  } catch (e) {
    console.error("Error Updating Comments Likes", e)
  }
}


export async function voteOnPost(
  voteType: VoteType,
  uid: string,
  submissionId: string
) {
  const submissionRef = doc(db, "submissions", submissionId);
  const userRef = doc(db, "users", uid);
  const votesCollection = collection(db, "votes"); 

  try {
    const submissionDoc = await getDoc(submissionRef);
    if (!submissionDoc.exists()) {
      console.error(`Submission with ID ${submissionId} does not exist.`);
      return;
    }

    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      console.error(`User with ID ${uid} does not exist.`);
      return;
    }

    const submissionData = submissionDoc.data();
    const userData = userDoc.data();

    const upvotes: string[] = submissionData.upvotes || [];
    const downvotes: string[] = submissionData.downvotes || [];
    const userVotes: Vote[] = userData.votes || [];

    let updates: Partial<Record<"upvotes" | "downvotes", FieldValue>> = {};
    let userVoteUpdates: Vote[] = [...userVotes];

    if (voteType === VoteType.UPVOTE) {
      if (!upvotes.includes(uid)) {
        updates.downvotes = arrayRemove(uid);
        updates.upvotes = arrayUnion(uid);

        userVoteUpdates = userVoteUpdates.filter(
          (vote) => vote.submissionId !== submissionId
        );
        userVoteUpdates.push({ submissionId, voteType: VoteType.UPVOTE });
      }
    } else if (voteType === VoteType.DOWNVOTE) {
      if (!downvotes.includes(uid)) {
        updates.upvotes = arrayRemove(uid);
        updates.downvotes = arrayUnion(uid);

        userVoteUpdates = userVoteUpdates.filter(
          (vote) => vote.submissionId !== submissionId
        );
        userVoteUpdates.push({ submissionId, voteType: VoteType.DOWNVOTE });
      }
    } else if (voteType === VoteType.UNVOTE) {
      if (upvotes.includes(uid)) {
        updates.upvotes = arrayRemove(uid);
      }
      if (downvotes.includes(uid)) {
        updates.downvotes = arrayRemove(uid);
      }

      userVoteUpdates = userVoteUpdates.filter(
        (vote) => vote.submissionId !== submissionId
      );
    }

    await updateDoc(submissionRef, updates);
    await updateDoc(userRef, {
      votes: userVoteUpdates,
    });

    await addDoc(votesCollection, {
      submissionId,
      userId: uid,
      voteType,
      createdAt: serverTimestamp(),
      submissionOwnerId: submissionData.userId, 
    });

    console.log(
      `Successfully ${voteType.toLowerCase()}d submission with ID ${submissionId}`
    );
  } catch (error) {
    console.error("Error voting on post:", error);
  }
}



export async function addComment(
    submissionId: string,
    userId: string,
    commentText: string,
    userName: string
  ) {
    const submissionRef = doc(db, "submissions", submissionId);
    const userRef = doc(db, "users", userId);
    const commentsCollection = collection(db, "comments");
  
    try {
      const submissionDoc = await getDoc(submissionRef);
      if (!submissionDoc.exists()) {
        console.error(`Submission with ID ${submissionId} does not exist.`);
        return;
      }
  
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        console.error(`User with ID ${userId} does not exist.`);
        return;
      }
  
      const submissionData = submissionDoc.data();

      const res = await addDoc(commentsCollection, {
        submissionId, 
        userId,
        userName,
        text: commentText,
        createdAt: serverTimestamp(),
        likes: [],
        submissionOwnerId: submissionData.userId, 
      });

      const newComment: CommentDTO = {
        likes: [],
        commentId: res.id,
        uid: userId,
        text: commentText,
        userName: userName,
        createdAt: new Date(), 
      };
  
      await updateDoc(submissionRef, {
        comments: arrayUnion(newComment),
      });
  
      const newWrittenComment = {
        submissionId: submissionId,
        comment: commentText,
      };
  
      await updateDoc(userRef, {
        writtenComments: arrayUnion(newWrittenComment),
      });


  
      console.log(
        `Successfully added comment to submission with ID ${submissionId}`
      );
      console.log(`Successfully added comment to user's writtenComments field`);
      return res.id;
      
    } catch (error) {
      console.error("Error adding comment to post:", error);
    }
  }
  
  