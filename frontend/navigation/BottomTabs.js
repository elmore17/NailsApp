import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ServicesScreen from "../screens/ServicesScreen";
import PinterestScreen from "../screens/PinterestScreen";
import AccountScreen from "../screens/AccountScreen";
import MyRecordsScreen from "../screens/MyRecordsScreen"; 
import FavoritesScreen from "../screens/FavoritesScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const AccountStack = createNativeStackNavigator();

function AccountStackScreen() {
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen 
        name="AccountMain" 
        component={AccountScreen}
        options={{ headerShown: false }}
      />
      <AccountStack.Screen 
        name="MyRecords" 
        component={MyRecordsScreen}
        options={{ 
          title: 'Мои записи',
          headerStyle: {
            backgroundColor: '#ACCBFA',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <AccountStack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: "Избранное",
          headerStyle: { backgroundColor: "#ACCBFA" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
    </AccountStack.Navigator>
  );
}

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
      <Tab.Screen name="Аккаунт" component={AccountStackScreen} />
    </Tab.Navigator>
  );
}