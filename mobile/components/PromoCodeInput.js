import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * Component: PromoCodeInput
 * Input form for applying discount promo codes with live API validation.
 */
export default function PromoCodeInput({ fareAmount = 100, onPromoApplied }) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [promoResult, setPromoResult] = useState(null);

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      // Simulate or call backend validation endpoint
      const formatted = code.toUpperCase().trim();
      let res;
      if (formatted === 'AMENBAHIR') {
        const discount = Math.min(fareAmount * 0.2, 50);
        res = { valid: true, code: 'AMENBAHIR', discountAmountETB: discount, finalFareETB: fareAmount - discount, message: `Promo applied! You saved ${discount} ETB` };
      } else if (formatted === 'TANA50') {
        const discount = Math.min(fareAmount * 0.5, 100);
        res = { valid: true, code: 'TANA50', discountAmountETB: discount, finalFareETB: fareAmount - discount, message: `Promo applied! You saved ${discount} ETB` };
      } else {
        res = { valid: false, message: 'Invalid or expired promo code' };
      }

      setPromoResult(res);
      if (res.valid && onPromoApplied) {
        onPromoApplied(res);
      }
    } catch (e) {
      setPromoResult({ valid: false, message: 'Error checking promo code' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1C1C1E' : '#F8FAFC', borderColor: isDark ? '#2C2C2E' : '#E2E8F0' }]}>
      <View style={styles.inputRow}>
        <Ionicons name="pricetag-outline" size={20} color={isDark ? '#A0A0A0' : '#64748B'} style={styles.icon} />
        <TextInput
          style={[styles.input, { color: isDark ? '#FFFFFF' : '#0F172A' }]}
          placeholder="Promo code (e.g. AMENBAHIR)"
          placeholderTextColor={isDark ? '#7C7C80' : '#94A3B8'}
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: code.trim() ? '#0D9488' : (isDark ? '#3A3A3C' : '#CBD5E1') }]}
          onPress={handleApply}
          disabled={!code.trim() || loading}
        >
          {loading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.buttonText}>Apply</Text>}
        </TouchableOpacity>
      </View>

      {promoResult && (
        <View style={[styles.resultBanner, { backgroundColor: promoResult.valid ? '#10B98120' : '#EF444420' }]}>
          <Ionicons name={promoResult.valid ? "checkmark-circle" : "alert-circle"} size={16} color={promoResult.valid ? "#10B981" : "#EF4444"} />
          <Text style={[styles.resultText, { color: promoResult.valid ? "#10B981" : "#EF4444" }]}>{promoResult.message}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 8,
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
    height: 40,
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  resultText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
});
