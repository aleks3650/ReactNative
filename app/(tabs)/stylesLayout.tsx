import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
    margin: 10,
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "rgba(0,0,0,0.75)",
    color: "white",
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  image: {
    width: 422,
    height: 300,
    marginTop: 2,
    objectFit: "contain",
  },
  buttonTranslate: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "rgba(0,0,0,0.75)",
  },
  result: {
    margin: 10,
    fontSize: 16,
  },
});
