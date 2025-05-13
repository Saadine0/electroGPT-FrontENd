import * as React from 'react';
import { StatusBar, StyleSheet, View, TouchableOpacity } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';  // Import Ionicons

// Screens
import Signup from './Signup';
import Login from './Login';
import Admin from './Admin';
import RepairerHome from './RepairerHome';
import User from './User';
import ProfileScreen from './ProfileScreen';
import Aichat from './Aichat';
import RepairerReq from './RepairerReq';
import RepairersScreen from './RepairerScreen';
import UploadScreen from './UploadScreen';
import SuccessScreen from './SuccessScreen';
import RepairerOffersScreen from './RepairerOffersScreen';

// Stack and Tab Navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Custom Theme
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F7F9FC',
    primary: '#2E5BFF',
    text: '#1E1E1E',
    card: '#ffffff',
  },
};

// CustomTabButton for Aichat
const CustomTabButton = ({ children, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.customButtonContainer}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.customButton}>{children}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  customButtonContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2E5BFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
});

// ✅ MainTabs with Curved Aichat Tab and Icons
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 65,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarActiveTintColor: '#2E5BFF',
        tabBarInactiveTintColor: '#A0A4AF',
      }}
    >
      <Tab.Screen
        name="Home"
        component={User}
        options={{
          headerShown: false, 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Aichat"
        component={Aichat}
        options={{
          headerShown: false, 
          tabBarButton: (props) => <CustomTabButton {...props} />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false, // Hide the header
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ✅ Repairer Tabs with Icons
function RepairerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 65,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarActiveTintColor: '#2E5BFF',
        tabBarInactiveTintColor: '#A0A4AF',
      }}
    >
      <Tab.Screen
        name="Home"
        component={RepairerHome}
        options={{
          headerShown: false, // Hide the header
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false, 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F9FC" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false, // Hide the header globally
          contentStyle: { backgroundColor: '#F7F9FC' },
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Admin" component={Admin} />
        <Stack.Screen name="Repairer" component={RepairerTabs} />
        <Stack.Screen name="RepairerReq" component={RepairerReq} />
        <Stack.Screen name="Repairers" component={RepairersScreen} />
        <Stack.Screen name="Upload" component={UploadScreen} />
        <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
        <Stack.Screen name="RepairerOffersScreen" component={RepairerOffersScreen} />
        <Stack.Screen name="User" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
