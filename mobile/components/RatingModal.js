import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const RATING_TAGS = ['Smooth Drive', 'Polite Driver', 'Clean Vehicle', 'Great Route', 'Punctual'];

export default function RatingModal({ visible, onClose, onSubmit, driverName = 'Driver' }) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState('');

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
    container: { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' },
    title: { color: isDark ? '#F8FAFC' : '#0F172A' },
    subtitle: { color: isDark ? '#94A3B8' : '#64748B' },
    input: { backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', borderColor: isDark ? '#334155' : '#E2E8F0' },
    cancelBtn: { backgroundColor: isDark ? '#334155' : '#F1F5F9' },
    cancelText: { color: isDark ? '#CBD5E1' : '#64748B' },
    tagPill: { backgroundColor: isDark ? '#0F172A' : '#F1F5F9', borderColor: isDark ? '#334155' : '#E2E8F0' },
    tagText: { color: isDark ? '#CBD5E1' : '#475569' },
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, dynamicStyles.container]}>
          <Text style={[styles.title, dynamicStyles.title]}>Rate your trip with {driverName}</Text>
          <Text style={[styles.subtitle, dynamicStyles.subtitle]}>How was your ride experience?</Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Text style={[styles.star, star <= rating && styles.starActive]}>★</Text>
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
          />

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.cancelBtn, dynamicStyles.cancelBtn]} onPress={onClose}>
              <Text style={[styles.cancelText, dynamicStyles.cancelText]}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
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
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 6,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  star: {
    fontSize: 36,
    color: '#CBD5E1',
    marginHorizontal: 4,
  },
  starActive: {
    color: '#F59E0B',
  },
  tagsHeader: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tagPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagPillActive: {
    backgroundColor: '#CCFBF1',
    borderColor: '#0D9488',
  },
  tagText: {
    fontSize: 12,
  },
  tagTextActive: {
    color: '#0F766E',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    height: 70,
    textAlignVertical: 'top',
    fontSize: 14,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  cancelText: {
    fontWeight: '600',
  },
  submitBtn: {
    flex: 2,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#0D9488',
  },
  submitText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
