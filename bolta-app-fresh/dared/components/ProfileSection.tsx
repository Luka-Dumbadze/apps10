import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { launchImageLibraryAsync, MediaTypeOptions, requestMediaLibraryPermissionsAsync } from 'expo-image-picker';
import { submitProfilePicture } from "@/api/profileAPI";

function ProfileSection({ user, setProfilePicureURL }: { user: ContextUser | null, setProfilePicureURL: (profilePictureURL: string) => void }) {
  const [loading, setLoading] = useState(false);

  const onUpload = async () => {
    setLoading(true); 

    try {
      await requestMediaLibraryPermissionsAsync();
      const result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        const newURL = await submitProfilePicture(result.assets[0].uri, user?.uid ?? '');
        setProfilePicureURL(newURL ?? '');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.profilePictureContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="white" style={styles.loadingIndicator} />
        ) : (
          <>
            {user?.profilePictureUrl ? (
              <Image
                source={{ uri: user.profilePictureUrl }}
                style={styles.profilePicture}
              />
            ) : (
              <Ionicons name="person-circle-outline" size={100} color="white" />
            )}

            <TouchableOpacity style={styles.uploadButton} onPress={onUpload}>
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </>
        )}
      </View>

      <Text style={styles.userName}>{user?.username}</Text>
      <Text style={styles.userBio}>{user?.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  uploadButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 30,
    height: 30,
    backgroundColor: Colors.background,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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

export default ProfileSection;
