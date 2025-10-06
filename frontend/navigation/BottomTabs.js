import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ServicesScreen from "../screens/ServicesScreen";
import PinterestScreen from "../screens/PinterestScreen";
import AccountScreen from "../screens/AccountScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Услуги") iconName = "list";
          else if (route.name === "Pinterest") iconName = "images";
          else if (route.name === "Аккаунт") iconName = "person";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Услуги" component={ServicesScreen} />
      <Tab.Screen name="Pinterest" component={PinterestScreen} />
      <Tab.Screen name="Аккаунт" component={AccountScreen} />
    </Tab.Navigator>
  );
}