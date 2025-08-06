import { db } from "@/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { fetchFeed, refreshFeed } from "@/api/feedAPI";
import { DocumentData } from "firebase/firestore";

enum VoteType {
  UPVOTE = "UPVOTE",
  DOWNVOTE = "DOWNVOTE",
  UNVOTE = "UNVOTE",
}

const FeedContext = createContext({
  posts: null as ChallengePost[] | null,
  allPostsLoaded: false,
  loading: false,
  refreshing: false,
  load: () => {},
  refresh: () => {},
  vote: (voteType: VoteType, uid: string, submissionId: string) => {},
  unvote: (uid: string, submissionId: string) => {},
  comment: (
    commentId: string,
    commentText: string,
    uid: string,
    submissionId: string,
    userName: string
  ) => {},
  updateCommentId: (commentId: string, temporaryId: string) => {},
  likeComment: (commentId: string, uid: string) => {},
  unlikeComment: (commentId: string, uid: string) => {},
});

export function useFeed() {
  return useContext(FeedContext);
}

export function FeedProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<ChallengePost[]>([]);
  const [allPostsLoaded, setAllPostsLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const listenersRef = useRef<{ [key: string]: () => void }>({});
  const profilePictureListenersRef = useRef<{ [key: string]: () => void }>({});
  const submissionsListenerRef = useRef<() => void>(() => () => {});

  const syncPostChanges = (submissionId: string) => {
    if (listenersRef.current[submissionId]) return;

    const submissionRef = doc(db, "submissions", submissionId);
    const unsubscribe = onSnapshot(submissionRef, async (docSnapshot) => {
      if (docSnapshot.exists()) {
        const updatedData = docSnapshot.data();
        const userRef = doc(db, "users", updatedData.userId);
        const userSnap = await getDoc(userRef);
        const challengeRef = doc(db, "challenges", updatedData.challengeId);
        const challengeSnap = await getDoc(challengeRef);
        const challenge = challengeSnap.exists()
          ? challengeSnap.data().challenge
          : "Unknown Challenge";
        const commentsSet: PostComment[] = updatedData.comments?.map(
          (comment: CommentDTO) => {
            return {
              uid: comment.uid,
              commentId: comment.commentId,
              likes: comment.likes,
              commentText: comment.text,
              createdAt: comment.createdAt,
              submissionId: submissionId,
              username: comment.userName,
            };
          }
        );
        const challengePost: ChallengePost = {
          submissionId: submissionId,
          challengeId: updatedData.challengeId,
          challenge: challenge,
          userId: updatedData.userId,
          imageUrl: updatedData.imageUrl,
          username: userSnap.exists() ? userSnap.data().username : "Unknown",
          profilePictureUrl: userSnap?.data()?.profilePictureURL ?? "",
          postingTime: updatedData.createdAt,
          upvotes: updatedData.upvotes || [],
          downvotes: updatedData.downvotes || [],
          comments: commentsSet,
          caption: updatedData.caption
        };
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.submissionId === submissionId
              ? { ...post, ...challengePost }
              : post
          )
        );
      }
    });

    listenersRef.current[submissionId] = unsubscribe;
  };

  const syncProfilePicture = (uid: string) => {
    if (profilePictureListenersRef.current[uid]) return;

    const userRef = doc(db, "users", uid);
    const unsubscribe = onSnapshot(userRef, (userSnap) => {
      if (userSnap.exists()) {
        const updatedUserData = userSnap.data();
        const newProfilePictureUrl = updatedUserData.profilePictureURL ?? "";

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.userId === uid
              ? { ...post, profilePictureUrl: newProfilePictureUrl }
              : post
          )
        );
      }
    });

    profilePictureListenersRef.current[uid] = unsubscribe;
  };

  const listenToSubmissions = () => {
    const submissionsRef = collection(db, "submissions");
    const q = query(submissionsRef, orderBy("createdAt", "desc"));
    let isIntialLoad = true;
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const promises = querySnapshot.docChanges().map(async (change) => {
        if (change.type === "added" && !isIntialLoad) {
          const docSnapshot = change.doc;
          if (docSnapshot.exists()) {
            const updatedData = docSnapshot.data();
            const userRef = doc(db, "users", updatedData.userId);
            const challengeRef = doc(db, "challenges", updatedData.challengeId);

            const [userSnap, challengeSnap] = await Promise.all([
              getDoc(userRef),
              getDoc(challengeRef),
            ]);

            const challenge = challengeSnap.exists()
              ? challengeSnap.data().challenge
              : "Unknown Challenge";
            const commentsSet: PostComment[] =
              updatedData.comments.length > 0
                ? updatedData.comments?.map((comment: CommentDTO) => {
                    return {
                      uid: comment.uid,
                      likes: comment.likes,
                      commentId: comment.commentId,
                      commentText: comment.text,
                      createdAt: comment.createdAt,
                      submissionId: docSnapshot.id,
                      username: comment.userName,
                    };
                  })
                : [];
            const challengePost: ChallengePost = {
              submissionId: docSnapshot.id,
              challengeId: updatedData.challengeId,
              challenge: challenge,
              userId: updatedData.userId,
              imageUrl: updatedData.imageUrl,
              username: userSnap.exists()
                ? userSnap.data().username
                : "Unknown",
              profilePictureUrl: userSnap?.data()?.profilePictureURL ?? "",
              postingTime: updatedData.createdAt,
              upvotes: updatedData.upvotes || [],
              downvotes: updatedData.downvotes || [],
              comments: commentsSet,
              caption: updatedData.caption
            };
            console.log(
              challengePost,
              "FROM LISTENEEEEEEEEEEEEEEEEEEEEEEEEEEER"
            );
            syncProfilePicture(updatedData.userId);
            syncPostChanges(docSnapshot.id);
            return challengePost;
          }
        }
      });
      let newPosts = await Promise.all(promises);
      let newNewPosts: ChallengePost[] = [];
      newPosts.forEach((post) => {
        if (post) {
          if (
            !newNewPosts.some((el) => el.submissionId === post.submissionId)
          ) {
            newNewPosts.push(post);
          }
        }
      });
      if (newPosts && newPosts.length > 0) {
        setPosts((prevPosts) => {
          const combinedPosts = [...newNewPosts, ...prevPosts];

          const uniquePostsMap = new Map(
            combinedPosts.map((post) => [post.submissionId, post])
          );

          const uniquePosts = Array.from(uniquePostsMap.values());

          return uniquePosts;
        });
      }
      isIntialLoad = false;
    });

    submissionsListenerRef.current = unsubscribe;
  };

  useEffect(() => {
    load();
    listenToSubmissions();
  }, []);

  const load = async () => {
    if (loading || allPostsLoaded) return;
    setLoading(true);
    try {
      const {
        posts: newPosts,
      } = await fetchFeed(posts.length > 0 ? posts[posts.length - 1].submissionId : '');
      if (newPosts.length > 0) {
        setPosts((prevPosts) => {
          const updatedPosts = [...prevPosts, ...newPosts];
          newPosts.forEach((post) => {
            syncPostChanges(post.submissionId);
            syncProfilePicture(post.userId);
          });
          return updatedPosts;
        });
      } else {
        setAllPostsLoaded(true);
      }
    } catch (error) {
      console.error("Error loading feed:", error);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const { posts: newPosts } =
        await refreshFeed();

      if (newPosts.length > 0) {
        setPosts(newPosts);
      }

    } catch (error) {
      console.log(error, "Error while refreshing");
    } finally {
      setRefreshing(false);
    }
  };

  const vote = (voteType: VoteType, uid: string, submissionId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.submissionId === submissionId) {
          let upvotes = [...post.upvotes];
          let downvotes = [...post.downvotes];

          if (voteType === VoteType.UPVOTE) {
            if (!upvotes.includes(uid)) {
              upvotes = [...upvotes, uid];
              downvotes = downvotes.filter((id) => id !== uid);
            }
          } else if (voteType === VoteType.DOWNVOTE) {
            if (!downvotes.includes(uid)) {
              downvotes = [...downvotes, uid];
              upvotes = upvotes.filter((id) => id !== uid);
            }
          }

          return {
            ...post,
            upvotes,
            downvotes,
          };
        }
        return post;
      })
    );
  };

  // Add the unvote function
  const unvote = (uid: string, submissionId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.submissionId === submissionId) {
          return {
            ...post,
            upvotes: post.upvotes.filter((id) => id !== uid),
            downvotes: post.downvotes.filter((id) => id !== uid),
          };
        }
        return post;
      })
    );
  };

  const comment = (
    commentId: string,
    commentText: string,
    uid: string,
    submissionId: string,
    userName: string
  ) => {
    const newComment: PostComment = {
      commentId: commentId,
      uid,
      commentText: commentText,
      username: userName,
      submissionId: submissionId,
      createdAt: new Date(),
      likes: [],
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.submissionId === submissionId) {
          const updatedComments = [...post.comments, newComment];
          return {
            ...post,
            comments: updatedComments,
          };
        }
        return post;
      })
    );
  };

  const updateCommentId = (commentId: string, temporaryId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.comments) {
          return {
            ...post,
            comments: post.comments.map((comment) =>
              comment.commentId === temporaryId
                ? { ...comment, commentId }
                : comment
            ),
          };
        }
        return post;
      })
    );
  };

  const likeComment = (commentId: string, uid: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        console.log("CHILL HERE");
        if (post.comments) {
          console.log("CHILL HERE TOO", post.comments);
          return {
            ...post,
            comments: post.comments.map((comment) =>
              comment.commentId === commentId
                ? { ...comment, likes: [...comment.likes, uid] }
                : comment
            ),
          };
        }
        return post;
      })
    );
  };

  const unlikeComment = (commentId: string, uid: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.comments) {
          return {
            ...post,
            comments: post.comments.map((comment) =>
              comment.commentId === commentId
                ? {
                    ...comment,
                    likes: comment.likes.filter((id) => id !== uid),
                  }
                : comment
            ),
          };
        }
        return post;
      })
    );
  };

  return (
    <FeedContext.Provider
      value={{
        posts,
        allPostsLoaded,
        loading,
        load,
        refresh,
        refreshing,
        updateCommentId,
        vote,
        unvote,
        comment,
        likeComment,
        unlikeComment,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
}
