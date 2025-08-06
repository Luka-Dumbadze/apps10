import { getContextUser } from "@/api/profileAPI";
import UserProfile from "@/components/UserProfile";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";

function UserProfileScreen() {
  console.log("HERES JOHNUU")
  const { uid } = useLocalSearchParams();
  const [user, setUser] = useState<ContextUser | null>(null);

  useEffect(() => {
    async function getUser() {
      const user = await getContextUser(uid + "");
      setUser(user);
    }

    getUser();
  }, []);

  return <UserProfile user={user} />;
}

export default UserProfileScreen;
