import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/Settings";
import ScreenRecordingScreen from "../screens/ScreenRecordingScreen";
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Profile:undefined; // example with params
  EditProfile:undefined;
  Settings:undefined;
  ScreenRecording:undefined;
};

export type NativeScreenProp = NativeStackNavigationProp<RootStackParamList, "Home">;

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="ScreenRecording" component={ScreenRecordingScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
