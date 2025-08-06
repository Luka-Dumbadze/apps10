import { useState, useEffect, useRef } from "react";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import { Platform } from "react-native";
import { auth } from "@/firebaseConfig";
import { savePushTokenToFirestore } from "../api/pushTokenAPI";

export interface PushNotificationState {
  notification?: Notifications.Notification;
  pushToken?: Notifications.DevicePushToken;
  displayChallenge?: (challenge: any) => void;
}

export const usePushNotifications = (
): PushNotificationState => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldShowAlert: true,
      shouldSetBadge: true,
    }),
  });

  const [pushToken, setPushToken] = useState<
    Notifications.DevicePushToken | undefined
  >();
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  async function registerForPushNotificationsAsync() {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (finalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        if (finalStatus !== "granted") {
          alert("Failed To get push token");
        }
      }
      try {
        token = await Notifications.getDevicePushTokenAsync();
      } catch (err) {
        console.log("ERROR WHILE RETRIEVING TOKEN", err);
      } finally {
        if (Platform.OS === "android") {
          Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
          });
        }

        return token;
      }
    } else {
      console.log("Use Physical Device to register");
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setPushToken(token);
        const userId = auth.currentUser?.uid;
        if (userId) {
          savePushTokenToFirestore(userId, token);
        }
      } else {
        console.log("NO TOKEN THEN WE ARE IN ELSE");
      }
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((n) => {
        console.log("NOTIICATION RECIEVED");
        setNotification(n);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((n) => {
        console.log(n);
      });

    // return () => {
    //   Notifications.removeNotificationSubscription(
    //     notificationListener.current!
    //   );
    //   Notifications.removeNotificationSubscription(responseListener.current!);
    // };
  }, []);

  return { pushToken, notification };
};
