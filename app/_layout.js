import React from "react";
import {
  createNativeStackNavigator,
  TransitionPresets,
} from "@react-navigation/native-stack";
import HomeScreen from "./index";
import ChatScreen from "./chat";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();
const isAndroid = true;

export default function HomeScreenNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        headerShown: false,
      }}
    >

      <Stack.Screen name="index" component={HomeScreen} />
      <Stack.Screen
        name="chat"
        component={ChatScreen}
        screenOptions={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}
