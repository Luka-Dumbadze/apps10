import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useAuth } from "../../providers/session";
import { Colors } from "@/constants/Colors";
import { usePushNotifications } from "@/hooks/usePushNotificationState";
import { ChallengeModal } from "@/components/ChallengeModal";
import { useFeed } from "@/providers/feed";
import { Navbar } from "@/components/NavBar";
import Post from "@/components/Post";

function ensureUniquePosts(posts: ChallengePost[]): ChallengePost[] {
  const seen = new Set<string>();
  return posts.filter(post => {
    if (seen.has(post.submissionId)) {
      return false; // Duplicate found, skip this post
    } else {
      seen.add(post.submissionId); // Add submissionId to the Set
      return true; // Unique post, keep it
    }
  });
}

export default function Index() {
  const { user, setHasSeenTodays, setDidTodaysChallenge } = useAuth();
  usePushNotifications();
  const {
    posts,
    allPostsLoaded,
    loading,
    load,
    refreshing,
    refresh,
    vote,
    unvote,
    updateCommentId,
    comment,
    likeComment,
    unlikeComment,
  } = useFeed();

  const renderItem = ({ item }: { item: ChallengePost }) => {
    return (
      <Post
        item={item}
        styles={styles}
        currentUser={user}
        vote={vote}
        comment={comment}
        unvote={unvote}
        updateCommentId={updateCommentId}
        likeComment={likeComment}
        unlikeComment={unlikeComment}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <ChallengeModal
          isVisible={!user?.seenTodays}
          challenge={user?.challenge?.challenge ?? ""}
          onClose={() => {
            setDidTodaysChallenge(false);
            setHasSeenTodays(user?.challenge?.challengeId ?? "", true);
          }}
        />
        {user?.seenTodays && (
          <FlatList
            data={ensureUniquePosts(posts ?? [])}
            renderItem={renderItem}
            keyExtractor={(item) => item.submissionId}
            onEndReached={allPostsLoaded ? null : load}
            onEndReachedThreshold={3.5}
            ListFooterComponent={
              loading ? (
                <ActivityIndicator size="large" color="white" />
              ) : allPostsLoaded ? (
                <Text
                  style={{ color: "white", textAlign: "center", padding: 10 }}
                >
                  No more posts
                </Text>
              ) : null
            }
            onRefresh={refresh}
            refreshing={refreshing}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
const screenWidth = Dimensions.get("window").width;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  postContainer: {
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: "black",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 23,
  },
  postInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
    marginLeft: 5,
  },
  usernameText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  timeText: {
    color: "white",
    fontSize: 12,
  },
  postImage: {
    width: "100%",
    height: screenWidth * 1.25, // Adjust the aspect ratio as needed
    resizeMode: "cover",
  },
  postActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    alignItems: "center",
  },
  voteText: {
    color: "white",
    marginLeft: 5,
  },
  commentsText: {
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  modalImage: {
    width: screenWidth,
    height: screenWidth * 1.25,
    resizeMode: "cover",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 32,
  },
  commentsList: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 10,
  },
  commentContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  commentUsername: {
    color: "white",
    fontWeight: "bold",
  },
  commentText: {
    color: "white",
  },
  commentTime: {
    color: "#888",
    fontSize: 12,
    marginTop: 5,
    textAlign: "right",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  commentInput: {
    flex: 1,
    color: "white",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
  },
});
