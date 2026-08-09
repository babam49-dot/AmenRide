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

// ── Custom Tab Icons (no external icon lib needed) ─────────────────────────

// Home icon: roof triangle + house body
function HomeIcon({ color, size }) {
  const s = size || 24;
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'flex-end' }}>
      {/* Roof */}
      <View style={{
        width: 0, height: 0,
        borderLeftWidth: s * 0.5, borderRightWidth: s * 0.5,
        borderBottomWidth: s * 0.45,
        borderLeftColor: 'transparent', borderRightColor: 'transparent',
        borderBottomColor: color,
        marginBottom: -1,
      }} />
      {/* Body */}
      <View style={{
        width: s * 0.65, height: s * 0.42,
        backgroundColor: color,
        borderBottomLeftRadius: 2, borderBottomRightRadius: 2,
        alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 2,
      }}>
        {/* Door */}
        <View style={{ width: s * 0.22, height: s * 0.26, backgroundColor: '#000', borderRadius: 2, opacity: 0.5 }} />
      </View>
    </View>
  );
}

// Map Pin icon: circle + pointed bottom
function MapPinIcon({ color, size }) {
  const s = size || 24;
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        width: s * 0.52, height: s * 0.52,
        borderRadius: s * 0.26,
        backgroundColor: color,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <View style={{ width: s * 0.2, height: s * 0.2, borderRadius: s * 0.1, backgroundColor: '#000', opacity: 0.5 }} />
      </View>
      {/* Pin tail */}
      <View style={{
        width: 0, height: 0,
        borderLeftWidth: s * 0.13, borderRightWidth: s * 0.13,
        borderTopWidth: s * 0.22,
        borderLeftColor: 'transparent', borderRightColor: 'transparent',
        borderTopColor: color,
        marginTop: -2,
      }} />
    </View>
  );
}

// Car icon: body rect + two wheels
function CarIcon({ color, size }) {
  const s = size || 24;
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
      {/* Cabin */}
      <View style={{
        width: s * 0.55, height: s * 0.22,
        backgroundColor: color,
        borderTopLeftRadius: s * 0.08, borderTopRightRadius: s * 0.08,
        marginBottom: -1,
      }} />
      {/* Body */}
      <View style={{
        width: s * 0.8, height: s * 0.22,
        backgroundColor: color,
        borderRadius: 3,
      }} />
      {/* Wheels row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: s * 0.68, marginTop: 2 }}>
        <View style={{ width: s * 0.18, height: s * 0.18, borderRadius: s * 0.09, backgroundColor: color }} />
        <View style={{ width: s * 0.18, height: s * 0.18, borderRadius: s * 0.09, backgroundColor: color }} />
      </View>
    </View>
  );
}

// Person Circle icon: head + shoulders in circle
function PersonIcon({ color, size }) {
  const s = size || 24;
  return (
    <View style={{
      width: s, height: s, borderRadius: s / 2,
      borderWidth: 2, borderColor: color,
      alignItems: 'center', justifyContent: 'flex-start',
      paddingTop: s * 0.12, overflow: 'hidden',
    }}>
      {/* Head */}
      <View style={{ width: s * 0.32, height: s * 0.32, borderRadius: s * 0.16, backgroundColor: color }} />
      {/* Shoulders arc */}
      <View style={{
        width: s * 0.7, height: s * 0.36,
        borderTopLeftRadius: s * 0.35, borderTopRightRadius: s * 0.35,
        backgroundColor: color, marginTop: s * 0.06,
      }} />
    </View>
  );
}

// Icon map
const ICON_COMPONENTS = {
  Home:     HomeIcon,
  Services: MapPinIcon,
  Driver:   CarIcon,
  Account:  PersonIcon,
};

// Professional Uber-style tab icon
function UberTabIcon({ name, focused }) {
  const IconComp = ICON_COMPONENTS[name] || HomeIcon;
  const iconColor = focused ? '#000000' : '#7C7C7C';
  const size = 22;

  if (focused) {
    return (
      <View style={styles.activePill}>
        <IconComp color={iconColor} size={size - 2} />
      </View>
    );
  }

  return (
    <View style={styles.inactivePill}>
      <IconComp color={iconColor} size={size} />
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
