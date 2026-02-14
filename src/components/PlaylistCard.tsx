import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Playlist } from '../types';
import { Colors } from '../constants/Colors';
import { Layout } from '../constants/Layout';

interface PlaylistCardProps {
  playlist: Playlist;
  size?: 'small' | 'medium' | 'large';
  showDescription?: boolean;
}

export default function PlaylistCard({ playlist, size = 'medium', showDescription = false }: PlaylistCardProps) {
  const router = useRouter();
  const cardSize = size === 'small' ? 120 : size === 'medium' ? 150 : 180;

  return (
    <TouchableOpacity
      style={[styles.container, { width: cardSize }]}
      onPress={() => router.push(`/playlist/${playlist.id}`)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: playlist.artwork }}
        style={[styles.artwork, { width: cardSize, height: cardSize }]}
      />
      <Text style={styles.title} numberOfLines={2}>
        {playlist.title}
      </Text>
      {showDescription && (
        <Text style={styles.description} numberOfLines={2}>
          {playlist.description}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: Layout.padding.sm,
  },
  artwork: {
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.surfaceElevated,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: Layout.padding.sm,
    lineHeight: 18,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
});
