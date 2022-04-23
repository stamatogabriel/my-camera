import { useCallback, useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";

import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Camera } from "expo-camera";

export default function App() {
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [capture, setCapture] = useState<any | null>(null);
  const camRef = useRef<any | null>(null);

  const handlePermission = useCallback(async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  }, []);

  const handleTakePicture = useCallback(async () => {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      setCapture(data.uri);
      setOpen(true);
    }
  }, [camRef]);

  const handleChangetype = useCallback(() => {
    if (type === Camera.Constants.Type.back)
      return setType(Camera.Constants.Type.front);
    if (type === Camera.Constants.Type.front)
      return setType(Camera.Constants.Type.back);
  }, [type]);

  useEffect(() => {
    handlePermission();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>Acesso negado</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera type={type} style={styles.camera} ref={camRef}>
        <View style={styles.contentButton}>
          <TouchableOpacity
            style={styles.buttonFlip}
            onPress={handleChangetype}
          >
            <FontAwesome name="exchange" size={23} color="red"></FontAwesome>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonCamera}
            onPress={handleTakePicture}
          >
            <FontAwesome name="camera" size={23} color="white"></FontAwesome>
          </TouchableOpacity>
        </View>
      </Camera>
      <Modal animationType="slide" transparent={true} visible={open}>
        <View style={styles.contentModal}>
          <TouchableOpacity
            onPress={() => setOpen(false)}
            style={styles.closeModal}
          >
            <FontAwesome name="close" size={50} color="#fff"></FontAwesome>
          </TouchableOpacity>
          <Image source={{ uri: capture }} style={styles.imgPhoto} />
        </View>
      </Modal>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  contentButton: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  buttonFlip: {
    position: "absolute",
    bottom: 50,
    left: 30,
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "#fff",
    margin: 20,
    padding: 10,
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  buttonCamera: {
    position: "absolute",
    bottom: 50,
    right: 30,
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "red",
    margin: 20,
    padding: 10,
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  contentModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    margin: 20,
  },
  imgPhoto: {
    width: "100%",
    height: 400,
  },
  closeModal: {
    position: "absolute",
    top: 10,
    left: 2,
    margin: 10,
  },
});
