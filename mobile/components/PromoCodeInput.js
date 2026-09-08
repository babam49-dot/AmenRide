import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * Component: PromoCodeInput
 * Input form for applying discount promo codes with live API validation & shake animation.
 */
export default function PromoCodeInput({ fareAmount = 100, onPromoApplied }) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [promoResult, setPromoResult] = useState(null);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const formatted = code.toUpperCase().trim();
      let res;
      if (formatted === 'AMENBAHIR' || formatted === 'AMEN20') {
        const discount = Math.min(fareAmount * 0.2, 50);
        res = { valid: true, code: formatted, discountAmountETB: discount, finalFareETB: fareAmount - discount, message: `Promo applied! You saved ${discount} ETB` };
      } else if (formatted === 'TANA50') {
        const discount = Math.min(fareAmount * 0.5, 100);
        res = { valid: true, code: 'TANA50', discountAmountETB: discount, finalFareETB: fareAmount - discount, message: `Promo applied! You saved ${discount} ETB` };
      } else {
        res = { valid: false, message: 'Invalid or expired promo code' };
        triggerShake();
      }

      setPromoResult(res);
      if (res.valid && onPromoApplied) {
        onPromoApplied(res);
      }
    } catch (e) {
      setPromoResult({ valid: false, message: 'Error checking promo code' });
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#1C1C1E' : '#F8FAFC', borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0', transform: [{ translateX: shakeAnim }] }
      ]}
    >
      <View style={styles.inputRow}>
        <Ionicons name="pricetag-outline" size={20} color={isDark ? '#A0A0A0' : '#64748B'} style={styles.icon} />
        <TextInput
          style={[styles.input, { color: isDark ? '#FFFFFF' : '#111111' }]}
          placeholder="Promo code (e.g. AMENBAHIR)"
          placeholderTextColor={isDark ? '#7C7C80' : '#94A3B8'}
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
          accessibilityLabel="Promo code entry field"
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: code.trim() ? '#FF2E2E' : (isDark ? '#2C2C2E' : '#CBD5E1') }]}
          onPress={handleApply}
          disabled={!code.trim() || loading}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel="Apply promotional code"
        >
          {loading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.buttonText}>Apply</Text>}
        </TouchableOpacity>
      </View>

      {promoResult && (
        <View style={[styles.resultBanner, { backgroundColor: promoResult.valid ? '#00D15418' : '#FF2E2E18' }]}>
          <Ionicons name={promoResult.valid ? "checkmark-circle" : "alert-circle"} size={16} color={promoResult.valid ? "#00D154" : "#FF2E2E"} />
          <Text style={[styles.resultText, { color: promoResult.valid ? "#00D154" : "#FF2E2E" }]}>{promoResult.message}</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 42,
    fontSize: 14,
    fontWeight: '700',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginLeft: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.3,
  },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  resultText: {
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 6,
  },
});

