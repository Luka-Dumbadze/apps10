import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { PostDetailModal } from "./PostDetailModal";
import { useFeed } from "@/providers/feed";

function UserProfile({ user }: { user: ContextUser | null }) {
  if (user) {
    const sortedPosts = user?.usersDoneChallengePosts?.sort((a, b) => {
      if (b.postingTime.seconds !== a.postingTime.seconds) {
        return b.postingTime.seconds - a.postingTime.seconds;
      }
      return b.postingTime.nanoseconds - a.postingTime.nanoseconds;
    });
    const [postModalVisibles, setPostModalVisibles] = useState(() => {
      const postModalVisibles: any = {};
      sortedPosts.forEach((post) => {
        postModalVisibles[post.submissionId] = false;
      });
      return postModalVisibles;
    });
    const { comment, likeComment, unlikeComment, updateCommentId } = useFeed();

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profilePictureContainer}>
            <>
              {user?.profilePictureUrl ? (
                <Image
                  source={{ uri: user.profilePictureUrl }}
                  style={styles.profilePicture}
                />
              ) : (
                <Ionicons
                  name="person-circle-outline"
                  size={100}
                  color="white"
                />
              )}
            </>
          </View>

          <Text style={styles.userName}>{user?.username}</Text>
          <Text style={styles.userBio}>{user?.email}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.didChallenges.length}</Text>
            <Text style={styles.statLabel}>
              {(user?.didChallenges.length ?? 0) <= 1
                ? "Challenge"
                : "Challenges"}{" "}
              Completed
            </Text>
          </View>
        </View>

        <Text style={styles.recentActivityTitle}>Recent Activity</Text>
        <FlatList
          data={sortedPosts}
          renderItem={({ item }) => (
            <>
              <TouchableOpacity
                onPress={() => {
                  setPostModalVisibles({
                    ...postModalVisibles,
                    [item.submissionId]: true,
                  });
                }}
                style={styles.postContainer}
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.postImage}
                />
              </TouchableOpacity>
              <PostDetailModal
                visible={postModalVisibles[item.submissionId]}
                post={item}
                user={user}
                comment={comment}
                likeComment={likeComment}
                unlikeComment={unlikeComment}
                updateCommentId={updateCommentId}
                onClose={() => {
                  setPostModalVisibles({
                    ...postModalVisibles,
                    [item.submissionId]: false,
                  });
                }}
              ></PostDetailModal>
            </>
          )}
          horizontal={true}
          keyExtractor={(item) => item.submissionId}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <ActivityIndicator size="large" color="white" />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "gray",
  },
  recentActivityTitle: {
    fontSize: 18,
    color: "white",
    marginBottom: 10,
    fontWeight: "bold",
    marginLeft: 10,
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  profilePictureContainer: {
    position: "relative",
    width: 100,
    height: 100,
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    marginBottom: 10,
  },
  flatListContent: {
    paddingHorizontal: 10,
  },
  postContainer: {
    marginRight: 10,
  },
  postImage: {
    width: 150,
    height: 200,
    borderRadius: 10,
  },
  userName: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  userBio: {
    fontSize: 16,
    color: "gray",
  },
});

export default UserProfile;
