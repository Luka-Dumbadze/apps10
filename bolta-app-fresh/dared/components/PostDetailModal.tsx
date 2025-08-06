import React, { useState } from "react";
import { formatTimestamp, formatTimestampJS } from "@/utils/formatTimeStamp";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import {
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import { addComment, reactComment } from "@/api/postActionsAPI";

export const PostDetailModal = ({
  visible,
  onClose,
  post,
  user,
  comment,
  updateCommentId,
  likeComment,
  unlikeComment,
}: {
  visible: boolean;
  onClose: () => void;
  post: ChallengePost;
  user: ContextUser | null;
  comment: (
    commentId: string,
    commentText: string,
    uid: string,
    submissionId: string,
    userName: string
  ) => void;
  updateCommentId: (commentId: string, temporaryId: string) => void;
  likeComment: (commentId: string, uid: string) => void;
  unlikeComment: (commentId: string, uid: string) => void;
}) => {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    const t = Math.random();
    if (newComment) {
      comment(
        t + "",
        newComment,
        user?.uid ?? "",
        post.submissionId,
        user?.username ?? ""
      );
      addComment(
        post.submissionId,
        user?.uid ?? "",
        newComment,
        user?.username ?? ""
      ).then((res) => {
        updateCommentId(res ?? "", t + "");
      });
      setNewComment("");
    }
  };

  const renderComment = ({ item }: { item: PostComment }) => {
    const liked = item.likes?.includes(user?.uid ?? "");
    return (
      <View style={styles.commentContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              width: "90%",
            }}
          >
            <Text style={styles.commentUsername}>{item.username}</Text>
            <Text style={styles.commentText}>{item.commentText}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (liked) {
                unlikeComment(item.commentId, user?.uid ?? "");
                reactComment(item.commentId, user?.uid ?? "", true);
              } else {
                likeComment(item.commentId, user?.uid ?? "");
                reactComment(item.commentId, user?.uid ?? "", false);
              }
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            {liked ? (
              <AntDesign name="heart" size={24} color="red" />
            ) : (
              <AntDesign name="hearto" size={24} color="white" />
            )}
            <Text
              style={{
                textAlign: "center",
                color: "white",
              }}
            >
              {item.likes ? item.likes?.length : 0}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.commentTime}>
          {item.createdAt instanceof Date
            ? formatTimestampJS(item.createdAt)
            : formatTimestamp(item.createdAt)}
        </Text>
      </View>
    );
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <SafeAreaView style={styles.modalContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
          <Image source={{ uri: post.imageUrl }} style={styles.modalImage} />
          <Text style={styles.usernameText}>{post.username}</Text>
          <Text style={styles.timeText}>
            {formatTimestamp(post.postingTime)}
          </Text>

          <FlatList
            data={post.comments}
            renderItem={renderComment}
            keyExtractor={(_, i) => i + ""}
            style={styles.commentsList}
            contentContainerStyle={styles.commentsContainer}
          />

          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Add a comment..."
              placeholderTextColor="#888"
            />
            <TouchableOpacity
              onPress={handleAddComment}
              style={styles.sendButton}
              disabled={!newComment}
            >
              <Ionicons name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};
const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black", // Set background color to black
    width: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 5,
    zIndex: 32,
  },
  modalImage: {
    width: screenWidth - 70, // Adjust width based on screen size
    height: (screenWidth - 70) * 1.2,
    resizeMode: "cover",
    marginHorizontal: 35,
    marginTop: 10, // Reduce the top margin to bring the image closer to the top
    marginBottom: 10, // Reduce the bottom margin to bring the content closer
    borderRadius: 20, // Keep the rounded corners
  },
  usernameText: {
    color: "white",
    fontSize: 16, 
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 5, 
  },
  timeText: {
    color: "white",
    fontSize: 12, 
    textAlign: "center",
    marginBottom: 10,
  },
  commentsText: {
    color: "white",
    fontSize: 14, 
    marginBottom: 10,
    textAlign: "center",
  },
  commentsList: {
    flex: 1,
    width: "100%",
  },
  commentsContainer: {
    paddingHorizontal: 10,
    flexGrow: 1,
    width: screenWidth,
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
    marginTop: 5,
    width: "90%",
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
    marginBottom: Platform.OS === "android" ? 20 : 0,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Ensure this is also dark
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
