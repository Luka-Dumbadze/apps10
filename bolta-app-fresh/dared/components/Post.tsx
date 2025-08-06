import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
  Button,
  SafeAreaView,
  Share,
  Platform,
} from "react-native";
import { PostDetailModal } from "./PostDetailModal";
import AntDesign from "@expo/vector-icons/AntDesign";
import { voteOnPost } from "@/api/postActionsAPI";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { formatTimestamp } from "@/utils/formatTimeStamp";

enum VoteType {
  UPVOTE = "UPVOTE",
  DOWNVOTE = "DOWNVOTE",
  UNVOTE = "UNVOTE"
}

function Post({
  item,
  styles,
  currentUser,
  vote,
  unvote,
  comment,
  updateCommentId,
  likeComment,
  unlikeComment
}: {
  item: ChallengePost;
  styles: any;
  currentUser: ContextUser | null;
  vote: (voteType: VoteType, uid: string, submissionId: string) => void;
  unvote: (uid: string, submissionId: string) => void;
  comment: (
    commentId: string,
    commentText: string,
    uid: string,
    submissionId: string,
    userName: string
  ) => void;
  updateCommentId: (commentId: string, temporaryId: string) => void;
  likeComment: (commentId: string, uid: string) => void,
  unlikeComment: (commentId: string, uid: string) => void,
}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const router = useRouter();

  const upvoted = item.upvotes.includes(currentUser?.uid ?? "");

  const handleVote = (voteType: VoteType, upvoted: boolean) => {
    if (upvoted) {
      unvote(currentUser?.uid?? "", item.submissionId);
      voteOnPost(voteType, currentUser?.uid?? "", item.submissionId);
    } else {
      vote(voteType, currentUser?.uid ?? "", item.submissionId);
      voteOnPost(voteType, currentUser?.uid ?? "", item.submissionId);
    }
  };

  const toggleChallengeModal = () => {
    setShowChallengeModal(!showChallengeModal);
  };

  return (
    <View style={styles.postContainer}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/otherprofile/[uid]",
              params: {
                uid: item.userId,
              },
            });
          }}
          style={styles.postInfoContainer}
        >
          {!item.profilePictureUrl ? (
            <Ionicons name="person-circle-outline" size={35} color="white" />
          ) : (
            <Image
              source={{ uri: item.profilePictureUrl }}
              style={styles.profileImage}
            />
          )}
          <View style={styles.userInfo}>
            <Text style={styles.usernameText}>{item.username}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={1}>
          <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
        </TouchableOpacity>

        <View style={modalStyles.voteCommentContainer}>
          <TouchableOpacity
            style={{
              paddingHorizontal: 5,
              paddingTop: 5,
            }}
            onPress={() =>
              handleVote(upvoted ? VoteType.UNVOTE : VoteType.UPVOTE, upvoted)
            }
          >
            {upvoted ? (
              <AntDesign name="heart" size={32} color="red" />
            ) : (
              <AntDesign name="hearto" size={32} color="white" />
            )}
            <Text style={{ textAlign: "center", color: "white" }}>
              {item.upvotes.length}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <FontAwesome5 name="comment-alt" size={30} color="white" />
            <Text style={{ textAlign: "center", color: "white" }}>
              {item.comments.length}
            </Text>
          </TouchableOpacity>
        </View>

        <PostDetailModal
          visible={isModalVisible}
          updateCommentId={updateCommentId}
          onClose={() => setModalVisible(false)}
          post={item}
          user={currentUser}
          comment={comment}
          unlikeComment={unlikeComment}
          likeComment={likeComment}
        />

        <Modal
          visible={showChallengeModal}
          transparent={true}
          animationType="slide"
          onRequestClose={toggleChallengeModal}
        >
          <SafeAreaView style={modalStyles.modalContainer}>
            <View style={modalStyles.modalContent}>
              <Text style={modalStyles.challengeText}>{item.challenge}</Text>
              <Button
                title="Close"
                onPress={toggleChallengeModal}
                color={Colors.background}
              />
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
       <View style={modalStyles.captionContainer}>
          <Text style={modalStyles.captionUsername}>{item.username}</Text>
          <Text style={modalStyles.captionText}>{item.caption}</Text>
        </View>
        <Text style={{
          color: "white",
          paddingLeft: 10,
          opacity: 0.6,
          paddingTop: 5
        }}>{formatTimestamp(item.postingTime)}</Text>
    </View>
  );
}

export default Post;

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 20,
    ...Platform.select({
      ios: { paddingTop: 20 },
      android: { paddingTop: 0 },
    }),
  },
  modalContent: {
    width: "85%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 15,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  challengeText: {
    color: "black",
    fontSize: 22,
    marginBottom: 20,
    textAlign: "center",
  },
  voteCommentContainer: {
    position: "absolute",
    bottom: 15,
    gap: 15,
    right: 5,
    alignItems: "center",
  },
  captionContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    flexDirection: "row", 
    flexWrap: "wrap",
    alignItems: "flex-start", 
  },
  captionUsername: {
    fontWeight: "bold",
    color: "white",
    flexShrink: 0,  
    fontSize: 16,
    marginRight: 10
  },
  captionText: {
    color: "white",
    flexShrink: 1,
    flex: 1,              
    fontSize: 16,
  },
});
