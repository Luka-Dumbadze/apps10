import React, { useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";

export const ChallengesBar = ({
  challenge,
  challengeDone,
}: {
  challenge: Challenge | null;
  challengeDone: boolean;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  if (!challenge) return <Text style={{ color: "white" }}>Loading...</Text>;

  return (
    <View>
      {challengeDone ? <Entypo name="check" size={32} color="white" /> : <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>
          <MaterialCommunityIcons name="lightning-bolt" size={32} color="white" />
        </Text>
      </TouchableOpacity>
}
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => false}>
            <Text style={styles.challengeText}>{challenge.challenge}</Text>

            {challengeDone ? (
              <Text>You Have Already Done The Dare</Text>
            ) : (
              <TouchableOpacity
                style={styles.circleButton}
                onPress={() => {
                  setModalVisible(false);
                  router.push({
                    pathname: "/(app)/camera",
                  });
                }}
              >
                <Feather name="camera" size={32} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 10,
    alignItems: "center",
    borderColor: "white",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    flex: 1,
    justifyContent: "center", 
    alignItems: "center", 
    width: "80%",
    padding: 20,
    borderRadius: 10,
    marginBottom: 100,
  },
  challengeText: {
    color: "white",
    fontSize: 32,
    marginBottom: 20,
    textAlign: "center",
  },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    position: "absolute", 
    ...Platform.select({
      android: {
        bottom: -70,
      },
      ios: {
        bottom: -40,
      }
    }) 
  },
});
