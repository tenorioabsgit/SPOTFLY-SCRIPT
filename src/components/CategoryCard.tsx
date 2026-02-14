import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { Layout } from '../constants/Layout';

interface CategoryCardProps {
  name: string;
  color: string;
  onPress: () => void;
}

export default function CategoryCard({ name, color, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1.4,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.padding.sm,
    margin: Layout.padding.xs,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    minWidth: 100,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});
