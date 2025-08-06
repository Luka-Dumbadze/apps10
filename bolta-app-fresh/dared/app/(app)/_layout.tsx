import React from "react";
import { Text, View } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../providers/session";
import { FeedProvider } from "@/providers/feed";

export default function AppLayout() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <View
        style={{
          backgroundColor: "#000000",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white" }}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return <Redirect href={"/auth/login"} />;
  }

  return (
    <FeedProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </FeedProvider>
  );
}
