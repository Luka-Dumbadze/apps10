import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Button,
  TouchableOpacity,
  Platform,
} from "react-native";

export const ChallengeModal = ({
  isVisible,
  challenge,
  onClose,
}: {
  isVisible: boolean;
  challenge: string;
  onClose: any;
}) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => false}
        >
          <Text style={styles.challengeText}>{challenge}</Text>
          <TouchableOpacity style={styles.circleButton} onPress={onClose}>
            <Text style={{
              color: 'white',
              fontSize: 21
            }}>Close</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
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
      },
    }),
  },
});
