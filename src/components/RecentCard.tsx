import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { Layout } from '../constants/Layout';

interface RecentCardProps {
  title: string;
  artwork: string;
  onPress: () => void;
}

export default function RecentCard({ title, artwork, onPress }: RecentCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: artwork }} style={styles.artwork} />
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Layout.borderRadius.sm,
    flex: 1,
    margin: Layout.padding.xs,
    overflow: 'hidden',
    height: 56,
  },
  artwork: {
    width: 56,
    height: 56,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
    paddingHorizontal: Layout.padding.sm,
  },
});
