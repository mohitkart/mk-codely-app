import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeScreenProp } from "../navigation/AppNavigator";

const HomeScreen = () => {
  const navigation = useNavigation<NativeScreenProp>();

  const handleLogin = () => {
    navigation.replace('Login')
  }

  console.log("Home Rendered")
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Mk-Codely!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
    paddingHorizontal: 30
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
