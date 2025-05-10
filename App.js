import * as React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ✅ Tabs for repairer
function RepairerTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={RepairerHome} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ✅ Tabs for user
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={User} />
      <Tab.Screen name="Aichat" component={Aichat} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F9FC" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
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
