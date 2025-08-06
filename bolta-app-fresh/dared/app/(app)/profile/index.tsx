import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { Colors } from "@/constants/Colors"; 
import { useAuth } from '@/providers/session';
import ProfileSection from '@/components/ProfileSection';
import { PostDetailModal } from '@/components/PostDetailModal';
import { useFeed } from '@/providers/feed';


function Profile() {
  const {user, signOut, setProfilePicureURL} = useAuth();
    const sortedPosts = user?.usersDoneChallengePosts?.sort((a, b) => {
      if (b.postingTime.seconds !== a.postingTime.seconds) {
        return b.postingTime.seconds - a.postingTime.seconds;
      }
      return b.postingTime.nanoseconds - a.postingTime.nanoseconds;
    });
    const [postModalVisibles, setPostModalVisibles] = useState(() => {
      const postModalVisibles: any = {};
      sortedPosts?.forEach((post) => {
        postModalVisibles[post.submissionId] = false;
      });
      return postModalVisibles;
    });
    const { comment, likeComment, unlikeComment, updateCommentId } = useFeed();
  
  return (
    <SafeAreaView style={styles.container}>
      <ProfileSection user={user} setProfilePicureURL={setProfilePicureURL} />      

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user?.didChallenges.length}</Text>
          <Text style={styles.statLabel}>{(user?.didChallenges.length ?? 0) <= 1 ? "Challenge" : "Challenges"} Completed</Text>
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
        keyExtractor={item => item.submissionId}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: 'gray',
  },
  recentActivityTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
    fontWeight: 'bold',
    marginLeft: 10
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
  logoutButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Profile;
