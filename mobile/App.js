import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

// Import Screens
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import DriverScreen from './screens/DriverScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Icon map: tab name → Ionicons icon names (filled & outline)
const TAB_ICONS = {
  Home:     { active: 'home',          inactive: 'home-outline' },
  Services: { active: 'map',           inactive: 'map-outline' },
  Driver:   { active: 'car-sport',     inactive: 'car-sport-outline' },
  Account:  { active: 'person-circle', inactive: 'person-circle-outline' },
};

// Professional Uber-style vector icon with active white pill
function UberTabIcon({ name, focused }) {
  const iconSet = TAB_ICONS[name] || { active: 'ellipse', inactive: 'ellipse-outline' };
  const iconName = focused ? iconSet.active : iconSet.inactive;
  const iconColor = focused ? '#000000' : '#7C7C7C';

  if (focused) {
    return (
      <View style={styles.activePill}>
        <Ionicons name={iconName} size={20} color={iconColor} />
      </View>
    );
  }

  return (
    <View style={styles.inactivePill}>
      <Ionicons name={iconName} size={22} color={iconColor} />
    </View>
  );
}

function TabNavigator() {
  const { t } = useLanguage();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <UberTabIcon name={route.name} focused={focused} />,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#7C7C7C',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t('welcome')?.includes('WELCOME') ? 'Home' : 'መነሻ' }} />
      <Tab.Screen name="Services" component={MapScreen} options={{ tabBarLabel: t('welcome')?.includes('WELCOME') ? 'Services' : 'ታክሲዎች' }} />
      <Tab.Screen name="Driver" component={DriverScreen} options={{ tabBarLabel: t('welcome')?.includes('WELCOME') ? 'Driver' : 'አሽከርካሪ' }} />
      <Tab.Screen name="Account" component={SettingsScreen} options={{ tabBarLabel: t('welcome')?.includes('WELCOME') ? 'Account' : 'መለያ' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={TabNavigator} />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#1F1F1F',
    height: Platform.OS === 'ios' ? 86 : 68,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  activePill: {
    width: 44,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactivePill: {
    width: 40,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
