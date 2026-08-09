import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

// Import Screens
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import DriverScreen from './screens/DriverScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Custom Professional Tab Icon Component
function TabIcon({ name, focused }) {
  let symbol;
  let labelColor = focused ? '#FF9500' : '#64748B';

  if (name === 'Home') symbol = focused ? '🏠' : '🏚️';
  else if (name === 'Map') symbol = focused ? '📍' : '🗺️';
  else if (name === 'Driver') symbol = focused ? '🚗' : '🚕';
  else if (name === 'Settings') symbol = focused ? '⚙️' : '🔧';

  if (focused) {
    return (
      <View style={styles.activePillContainer}>
        <LinearGradient
          colors={['rgba(255, 149, 0, 0.25)', 'rgba(255, 107, 0, 0.1)']}
          style={styles.activePill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.activeIconText}>{symbol}</Text>
          <View style={styles.glowDot} />
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.inactiveIconContainer}>
      <Text style={styles.inactiveIconText}>{symbol}</Text>
    </View>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarActiveTintColor: '#FF9500',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Map" component={MapScreen} options={{ tabBarLabel: 'Map & Route' }} />
      <Tab.Screen name="Driver" component={DriverScreen} options={{ tabBarLabel: 'Driver Portal' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'Settings' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0B0F19',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    height: Platform.OS === 'ios' ? 84 : 68,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 8,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  activePillContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    width: 48,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.4)',
    position: 'relative',
  },
  activeIconText: {
    fontSize: 18,
  },
  glowDot: {
    position: 'absolute',
    bottom: -3,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF9500',
  },
  inactiveIconContainer: {
    width: 40,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
  },
  inactiveIconText: {
    fontSize: 17,
  },
});
