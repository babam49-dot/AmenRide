import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const RATING_TAGS = ['ደስ የሚል ጉዞ (Smooth Drive)', 'ትህትና ያለው (Polite Driver)', 'ንጹህ መኪና (Clean Vehicle)', 'ፈጣን መንገድ (Great Route)', 'በሰዓቱ (Punctual)'];

export default function RatingModal({ visible, onClose, onSubmit, driverName = 'Driver' }) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState('');

  const starScales = useRef([1, 2, 3, 4, 5].map(() => new Animated.Value(1))).current;

  const handleStarPress = (index) => {
    setRating(index + 1);
    Animated.sequence([
      Animated.spring(starScales[index], {
        toValue: 1.4,
        useNativeDriver: true,
        friction: 4,
      }),
      Animated.spring(starScales[index], {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
      }),
    ]).start();
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = () => {
    onSubmit({ rating, tags: selectedTags, comment });
    onClose();
  };

  const dynamicStyles = {
    container: { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' },
    title: { color: isDark ? '#FFFFFF' : '#111111' },
    subtitle: { color: isDark ? '#94A3B8' : '#64748B' },
    input: { backgroundColor: isDark ? '#2C2C2E' : '#F8FAFC', color: isDark ? '#FFFFFF' : '#111111', borderColor: isDark ? '#3A3A3C' : '#E2E8F0' },
    cancelBtn: { backgroundColor: isDark ? '#2C2C2E' : '#F1F5F9' },
    cancelText: { color: isDark ? '#94A3B8' : '#64748B' },
    tagPill: { backgroundColor: isDark ? '#2C2C2E' : '#F1F5F9', borderColor: isDark ? '#3A3A3C' : '#E2E8F0' },
    tagText: { color: isDark ? '#CBD5E1' : '#475569' },
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, dynamicStyles.container]}>
          <Text style={[styles.title, dynamicStyles.title]}>Rate your trip with {driverName}</Text>
          <Text style={[styles.subtitle, dynamicStyles.subtitle]}>How was your ride experience?</Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star, idx) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleStarPress(idx)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`Rate ${star} out of 5 stars`}
              >
                <Animated.Text style={[styles.star, star <= rating && styles.starActive, { transform: [{ scale: starScales[idx] }] }]}>
                  ★
                </Animated.Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.tagsHeader, dynamicStyles.title]}>Quick Feedback</Text>
          <View style={styles.tagsContainer}>
            {RATING_TAGS.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tagPill, dynamicStyles.tagPill, active && styles.tagPillActive]}
                  onPress={() => toggleTag(tag)}
                  activeOpacity={0.85}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: active }}
                  accessibilityLabel={`Feedback tag: ${tag}`}
                >
                  <Text style={[styles.tagText, dynamicStyles.tagText, active && styles.tagTextActive]}>{tag}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TextInput
            style={[styles.input, dynamicStyles.input]}
            placeholder="Add additional comments (optional)..."
            placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
            value={comment}
            onChangeText={setComment}
            multiline
            accessibilityLabel="Additional comment feedback box"
          />

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.cancelBtn, dynamicStyles.cancelBtn]}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Skip rating"
            >
              <Text style={[styles.cancelText, dynamicStyles.cancelText]}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel="Submit rating feedback"
            >
              <Text style={styles.submitText}>Submit Rating</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    borderRadius: 22,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 6,
    fontWeight: '500',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 18,
  },
  star: {
    fontSize: 38,
    color: '#CBD5E1',
    marginHorizontal: 6,
  },
  starActive: {
    color: '#FFCC00',
  },
  tagsHeader: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tagPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  tagPillActive: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FF2E2E',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tagTextActive: {
    color: '#FF2E2E',
    fontWeight: '800',
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 12,
    height: 72,
    textAlignVertical: 'top',
    fontSize: 14,
    marginBottom: 18,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 14,
    marginRight: 8,
  },
  cancelText: {
    fontWeight: '800',
    fontSize: 14,
  },
  submitBtn: {
    flex: 2,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#FF2E2E',
    marginLeft: 8,
  },
  submitText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.3,
  },
});

