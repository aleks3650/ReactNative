import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import {
  Button,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Tesseract from "tesseract.js";
import { styles } from "./stylesLayout";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [text, setText] = useState<string | null>("Will be sth");
  const [loading, setLoading] = useState<boolean>(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  function cleanText(text: string): string {
    return text
      .replace(/[^\w\s.,!?]/g, "") // Usuwa niechciane znaki
      .split("\n") // Dzieli tekst na linie
      .filter((line) => line.trim().length >= 3) // Filtruje linie z mniej niż trzema znakami
      .join(" "); // Łączy linie z powrotem w jeden ciąg znaków
  }

  async function translateText(
    text: string,
    targetLang: string
  ): Promise<string> {
    if (!text) {
      console.error("No text to translate");
      return "No text to translate";
    }
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=en|${targetLang}`
      );
      const data = await response.json();
      if (data.responseData.translatedText) {
        return data.responseData.translatedText;
      } else {
        console.error("Translation error:", data);
        return "Translation error";
      }
    } catch (error) {
      console.error("Error during translation:", error);
      return "Translation error";
    }
  }

  async function takePicture() {
    if (!cameraRef.current) {
      console.error("Camera reference is not available");
      return;
    }
    setLoading(true);
    const photoData = await cameraRef.current.takePictureAsync();
    if (!photoData) {
      console.error("Unable to take picture");
      setLoading(false);
      return;
    }
    setPhoto(photoData.uri);

    try {
      const result = await Tesseract.recognize(photoData.uri, "eng", {
        logger: (m) => console.log(m),
      });
      const cleanedText = cleanText(result.data.text);
      console.log(cleanedText);

      // Check if the text is in Polish
      const isPolish = /[ąćęłńóśźż]/i.test(cleanedText);
      const targetLang = isPolish ? "en" : "pl";

      const translatedText = await translateText(cleanedText, targetLang);
      console.log(translatedText);
      setText(translatedText);
    } catch (error) {
      console.error("Error during OCR processing:", error);
    } finally {
      setLoading(false);
    }
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Text style={styles.result}>{text}</Text>
      )}
      {photo && <Image source={{ uri: photo }} style={styles.image} />}
    </View>
  );
}
