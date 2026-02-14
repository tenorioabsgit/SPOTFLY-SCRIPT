import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/Colors';
import { Layout } from '../../src/constants/Layout';
import { Playlist, Track } from '../../src/types';
import { defaultPlaylists } from '../../src/data/mockData';
import { saveData, loadData, KEYS } from '../../src/services/storage';
import { useAuth } from '../../src/contexts/AuthContext';

type FilterType = 'all' | 'playlists' | 'artists' | 'downloaded';
type SortType = 'recent' | 'alphabetical' | 'creator';
type ViewType = 'list' | 'grid';

export default function LibraryScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [playlists, setPlaylists] = useState<Playlist[]>(defaultPlaylists);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('recent');
  const [viewType, setViewType] = useState<ViewType>('list');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  useEffect(() => {
    loadPlaylists();
  }, []);

  async function loadPlaylists() {
    const saved = await loadData<Playlist[]>(KEYS.PLAYLISTS);
    if (saved && saved.length > 0) {
      setPlaylists([...defaultPlaylists, ...saved]);
    }
  }

  async function createPlaylist() {
    if (!newPlaylistName.trim()) {
      Alert.alert('Erro', 'Digite um nome para a playlist');
      return;
    }
    const newPlaylist: Playlist = {
      id: 'playlist-user-' + Date.now(),
      title: newPlaylistName.trim(),
      description: newPlaylistDesc.trim(),
      artwork: `https://picsum.photos/seed/${Date.now()}/300/300`,
      trackIds: [],
      createdBy: user?.displayName || 'Você',
      isPublic: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const userPlaylists = playlists.filter(p => !p.id.startsWith('playlist-') || p.id.startsWith('playlist-user-'));
    const updatedUserPlaylists = [...userPlaylists, newPlaylist];
    await saveData(KEYS.PLAYLISTS, updatedUserPlaylists);
    setPlaylists([...defaultPlaylists, ...updatedUserPlaylists]);
    setNewPlaylistName('');
    setNewPlaylistDesc('');
    setShowCreateModal(false);
  }

  function getSortedPlaylists(): Playlist[] {
    let filtered = [...playlists];
    if (filter === 'playlists') {
      filtered = playlists.filter(p => p.createdBy === user?.displayName || p.createdBy === 'Você');
    }

    switch (sortBy) {
      case 'alphabetical':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      case 'creator':
        return filtered.sort((a, b) => a.createdBy.localeCompare(b.createdBy));
      case 'recent':
      default:
        return filtered.sort((a, b) => b.updatedAt - a.updatedAt);
    }
  }

  function renderListItem({ item }: { item: Playlist }) {
    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => router.push(`/playlist/${item.id}`)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: item.artwork }} style={styles.listArtwork} />
        <View style={styles.listInfo}>
          <Text style={styles.listTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.listMeta}>
            <Text style={styles.listType}>Playlist</Text>
            <Text style={styles.listDot}> · </Text>
            <Text style={styles.listCreator}>{item.createdBy}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function renderGridItem({ item }: { item: Playlist }) {
    return (
      <TouchableOpacity
        style={styles.gridItem}
        onPress={() => router.push(`/playlist/${item.id}`)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: item.artwork }} style={styles.gridArtwork} />
        <Text style={styles.gridTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  }

  const sortedPlaylists = getSortedPlaylists();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileRow}>
          <Image
            source={{ uri: user?.photoUrl || 'https://i.pravatar.cc/40' }}
            style={styles.avatar}
          />
          <Text style={styles.headerTitle}>Sua Biblioteca</Text>
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => setShowCreateModal(true)}
          >
            <Ionicons name="add" size={28} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {(['all', 'playlists', 'downloaded'] as FilterType[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === f && styles.filterChipTextActive,
              ]}
            >
              {f === 'all'
                ? 'Tudo'
                : f === 'playlists'
                ? 'Playlists'
                : 'Baixados'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sort and View Toggle */}
      <View style={styles.sortRow}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => {
            const sorts: SortType[] = ['recent', 'alphabetical', 'creator'];
            const current = sorts.indexOf(sortBy);
            setSortBy(sorts[(current + 1) % sorts.length]);
          }}
        >
          <Ionicons name="swap-vertical" size={18} color={Colors.textPrimary} />
          <Text style={styles.sortText}>
            {sortBy === 'recent'
              ? 'Recentes'
              : sortBy === 'alphabetical'
              ? 'A-Z'
              : 'Criador'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setViewType(viewType === 'list' ? 'grid' : 'list')
          }
        >
          <Ionicons
            name={viewType === 'list' ? 'grid' : 'list'}
            size={22}
            color={Colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* Playlist List */}
      <FlatList
        key={viewType}
        data={sortedPlaylists}
        keyExtractor={(item) => item.id}
        renderItem={viewType === 'list' ? renderListItem : renderGridItem}
        numColumns={viewType === 'grid' ? 2 : 1}
        contentContainerStyle={[
          styles.listContainer,
          viewType === 'grid' && styles.gridContainer,
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <TouchableOpacity
            style={styles.likedSongsItem}
            activeOpacity={0.7}
          >
            <View style={styles.likedSongsArtwork}>
              <Ionicons name="heart" size={24} color={Colors.textPrimary} />
            </View>
            <View style={styles.listInfo}>
              <Text style={styles.listTitle}>Músicas Curtidas</Text>
              <View style={styles.listMeta}>
                <Ionicons name="pin" size={12} color={Colors.primary} />
                <Text style={styles.listType}> Playlist · Spotfly</Text>
              </View>
            </View>
          </TouchableOpacity>
        }
        ListFooterComponent={
          <View style={{ height: Layout.miniPlayerHeight + 80 }} />
        }
      />

      {/* Logout button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          Alert.alert('Sair', 'Deseja sair da sua conta?', [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Sair',
              style: 'destructive',
              onPress: async () => {
                await signOut();
                router.replace('/(auth)/login');
              },
            },
          ]);
        }}
      >
        <Ionicons name="log-out-outline" size={20} color={Colors.textSecondary} />
      </TouchableOpacity>

      {/* Create Playlist Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Playlist</Text>

            <TextInput
              style={styles.modalInput}
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              placeholder="Nome da playlist"
              placeholderTextColor={Colors.textInactive}
              autoFocus
            />

            <TextInput
              style={[styles.modalInput, styles.modalInputDesc]}
              value={newPlaylistDesc}
              onChangeText={setNewPlaylistDesc}
              placeholder="Descrição (opcional)"
              placeholderTextColor={Colors.textInactive}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowCreateModal(false);
                  setNewPlaylistName('');
                  setNewPlaylistDesc('');
                }}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCreateButton}
                onPress={createPlaylist}
              >
                <Text style={styles.modalCreateText}>Criar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.padding.md,
    paddingTop: Layout.padding.md,
    paddingBottom: Layout.padding.sm,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: Layout.padding.sm,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginLeft: Layout.padding.md,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Layout.padding.md,
    paddingVertical: Layout.padding.sm,
    gap: Layout.padding.sm,
  },
  filterChip: {
    paddingHorizontal: Layout.padding.md,
    paddingVertical: Layout.padding.sm,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.surfaceLight,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterChipText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: Colors.background,
    fontWeight: '700',
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.padding.md,
    paddingVertical: Layout.padding.sm,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
    marginLeft: Layout.padding.xs,
  },
  listContainer: {
    paddingHorizontal: 0,
  },
  gridContainer: {
    paddingHorizontal: Layout.padding.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.padding.sm,
    paddingHorizontal: Layout.padding.md,
  },
  listArtwork: {
    width: 56,
    height: 56,
    borderRadius: Layout.borderRadius.sm,
    backgroundColor: Colors.surfaceElevated,
  },
  listInfo: {
    flex: 1,
    marginLeft: Layout.padding.sm,
  },
  listTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  listMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  listType: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  listDot: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  listCreator: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  gridItem: {
    flex: 1,
    margin: Layout.padding.xs,
    maxWidth: '50%',
  },
  gridArtwork: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.surfaceElevated,
  },
  gridTitle: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: Layout.padding.sm,
  },
  likedSongsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.padding.sm,
    paddingHorizontal: Layout.padding.md,
  },
  likedSongsArtwork: {
    width: 56,
    height: 56,
    borderRadius: Layout.borderRadius.sm,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 16,
    padding: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    padding: Layout.padding.xl,
  },
  modalContent: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.padding.lg,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Layout.padding.lg,
  },
  modalInput: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: Layout.borderRadius.sm,
    paddingHorizontal: Layout.padding.md,
    paddingVertical: 14,
    color: Colors.textPrimary,
    fontSize: 15,
    marginBottom: Layout.padding.md,
    borderWidth: 1,
    borderColor: Colors.inactive,
  },
  modalInputDesc: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Layout.padding.sm,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: Layout.padding.sm,
    borderRadius: Layout.borderRadius.round,
    borderWidth: 1,
    borderColor: Colors.inactive,
  },
  modalCancelText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  modalCreateButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: Layout.padding.sm,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.primary,
  },
  modalCreateText: {
    color: Colors.background,
    fontSize: 15,
    fontWeight: '700',
  },
});
