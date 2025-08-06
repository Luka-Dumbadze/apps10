import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import Feather from "@expo/vector-icons/Feather";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useAuth } from "@/providers/session";
import { useRouter } from "expo-router";
import { submitChallenge } from "@/api/challengeAPI";
import { AntDesign } from "@expo/vector-icons";

export default function ChallengeCamera() {
  const { user, setDidTodaysChallenge, addChallengeAsDone } = useAuth();
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("")
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function clearImage() {
    setImage("");
  }

  async function handleSubmitPhoto() {
    Keyboard.dismiss();
    setLoading(true);
    try {
      await submitChallenge(
        image,
        user?.uid ?? "",
        user?.challenge?.challengeId as string,
        caption
      );
      setDidTodaysChallenge(true);
      addChallengeAsDone(user?.challenge?.challengeId as string);
      router.replace({
        pathname: "/(app)",
      });
    } catch (error) {
      console.error("Error submitting photo:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function takePicture() {
    if (cameraReady) {
      const options = {
        quality: 0.5,
        base64: false,
        exif: false,
        skipProcessing: false,
      };

      cameraRef.current
        ?.takePictureAsync(options)
        .then(async (photo) => {
          if (facing === "front") {
            photo = await manipulateAsync(
              photo?.uri || "",
              [{ rotate: 180 }, { flip: FlipType.Vertical }],
              { compress: 1, format: SaveFormat.PNG }
            );
          }
          if (photo?.uri) {
            setImage(photo.uri);
            //   // Fetch the file size
            // fetch(photo.uri)
            //   .then((response) => response.blob())
            //   .then((blob) => {
            //     console.log(`Image file size: ${blob.size} bytes`);
            //   })
            //   .catch((error) => console.error("Error fetching image size:", error));
          }
        })
        .catch((error) => console.error(error));
    }
  }
  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#28a745" />
          <Text style={styles.loadingText}>Submitting...</Text>
        </View>
      ) : image ? (
        <View style={{ flex: 1, backgroundColor: "black", paddingTop: 60, paddingBottom: 40 }}>
          <TouchableOpacity style={{
            position: 'absolute',
            left: 30,
            top: 70,
            zIndex: 219,
            opacity: 0.7,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: 20,
            padding: 5
          }} onPress={clearImage}>
              <Feather name="x" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={{
              position: 'absolute',
              right: 30,
              top: 70,
              zIndex: 219,
              opacity: 0.7,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              borderRadius: 20,
              padding: 5
            }} onPress={handleSubmitPhoto}>
              <AntDesign name="arrowright" size={30} color="white" />
            </TouchableOpacity>
          <Image source={{ uri: image }} style={{ flex: 1, marginHorizontal: 'auto',  marginBottom: 20, borderRadius: 10, width: '90%'}} />
          
          {/* TextInput for Caption */}
          <TextInput
            style={styles.captionInput}
            placeholder="Enter a caption..."
            placeholderTextColor="#ccc"
            onChangeText={setCaption}
          />
      
          {/* <View
            style={{
              position: "absolute",
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              gap: 60,
              left: "50%",
              bottom: 10,
              transform: [{ translateX: -94 }],
            }}
          >
            
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitPhoto}>
              <Feather name="arrow-right-circle" size={64} color="white" />
            </TouchableOpacity>
          </View> */}
        </View>
      ) : (
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
          onCameraReady={() => {
            setCameraReady(true);
          }}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 15,
                ...styles.button,
              }}
              onPress={toggleCameraFacing}
            >
              <Fontisto
                name="spinner-refresh"
                size={22}
                color="white"
                style={{
                  transform: [{ rotate: "70deg" }],
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 100,
                  width: 60,
                  height: 60,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  loadingText: {
    color: "#28a745",
    fontSize: 18,
    marginTop: 10,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 250,
  },
  closeButton: {
    
  },
  submitButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 50,
    fontWeight: "bold",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  captionInput: {
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
  },
});
