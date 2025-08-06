import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Image, Platform } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Colors } from "@/constants/Colors";
import { ChallengesBar } from "./ChallengesBar";
import { useAuth } from "@/providers/session";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export function Navbar() {
  const { user } = useAuth();
  const router = useRouter()

  const handleProfilePress = () => {
    router.push({
        pathname: "/(app)/profile"
    })
  };


  return (

    <TouchableWithoutFeedback>
      <View style={styles.navbar}>
        <ChallengesBar
          challenge={user?.challenge ?? null}
          challengeDone={user?.hasDoneTodays ?? false}
        />

        <Text style={{
          color: "white",
          fontSize: 24
        }}>Dared</Text>

        <TouchableOpacity style={styles.profileContainer} onPress={handleProfilePress}>
          {user?.profilePictureUrl ? <Image
                source={{ uri: user.profilePictureUrl }}
                style={styles.profilePicture}
              /> : <Ionicons name="person-circle-outline" size={50} color="white" />}
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 15,
    ...Platform.select({
      ios: { paddingTop: 0 },
      android: { marginTop: 38 },
      
    }),
  },
  profileContainer: {
    position: "relative",
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});
    