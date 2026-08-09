import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

// Import Screens
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import DriverScreen from './screens/DriverScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Uber Signature Tab Bar Icon
function UberTabIcon({ name, focused }) {
  let symbol;

  if (name === 'Home') symbol = '🏠';
  else if (name === 'Services') symbol = '🚗';
  else if (name === 'Driver') symbol = '🚖';
  else if (name === 'Account') symbol = '👤';

  if (focused) {
    return (
      <View style={styles.activePill}>
        <Text style={styles.activeSymbol}>{symbol}</Text>
      </View>
    );
  }

  return (
    <View style={styles.inactivePill}>
      <Text style={styles.inactiveSymbol}>{symbol}</Text>
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
  activeSymbol: {
    fontSize: 16,
  },
  inactivePill: {
    width: 40,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
  },
  inactiveSymbol: {
    fontSize: 16,
  },
});
