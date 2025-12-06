import React from "react";
import { View, StyleSheet } from "react-native";
import SnippetDashboard from "./SnippetDashboard";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
       <SnippetDashboard/>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
