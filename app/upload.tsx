import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  TextInput,
  Modal,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../src/constants/Colors';
import { Layout } from '../src/constants/Layout';
import { Track } from '../src/types';
import { saveData, loadData, KEYS } from '../src/services/storage';
import { usePlayer } from '../src/contexts/PlayerContext';
import { useAuth } from '../src/contexts/AuthContext';
import TrackRow from '../src/components/TrackRow';

export default function UploadScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { playTrack } = usePlayer();
  const [uploadedTracks, setUploadedTracks] = useState<Track[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTrack, setEditTrack] = useState<Partial<Track>>({});
  const [pendingUri, setPendingUri] = useState('');
  const [pendingName, setPendingName] = useState('');

  useEffect(() => {
    loadUploadedTracks();
  }, []);

  async function loadUploadedTracks() {
    const tracks = await loadData<Track[]>(KEYS.UPLOADED_TRACKS);
    if (tracks) {
      setUploadedTracks(tracks);
    }
  }

  async function pickFile() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/*'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      const fileName = file.name.replace(/\.[^/.]+$/, '');

      setPendingUri(file.uri);
      setPendingName(file.name);
      setEditTrack({
        title: fileName,
        artist: user?.displayName || 'Artista Desconhecido',
        album: 'Meus Uploads',
        genre: 'Outro',
      });
      setShowEditModal(true);
    } catch (e) {
      console.error('Error picking file:', e);
      Alert.alert('Erro', 'Não foi possível selecionar o arquivo');
    }
  }

  async function saveUploadedTrack() {
    if (!editTrack.title?.trim()) {
      Alert.alert('Erro', 'Digite um título para a música');
      return;
    }

    const newTrack: Track = {
      id: 'upload-' + Date.now(),
      title: editTrack.title?.trim() || pendingName,
      artist: editTrack.artist?.trim() || 'Artista Desconhecido',
      album: editTrack.album?.trim() || 'Meus Uploads',
      duration: 0,
      artwork: `https://picsum.photos/seed/upload${Date.now()}/300/300`,
      audioUrl: pendingUri,
      isLocal: true,
      genre: editTrack.genre || 'Outro',
      license: 'Upload pessoal',
      addedAt: Date.now(),
    };

    const updated = [...uploadedTracks, newTrack];
    setUploadedTracks(updated);
    await saveData(KEYS.UPLOADED_TRACKS, updated);

    setShowEditModal(false);
    setPendingUri('');
    setPendingName('');
    setEditTrack({});

    Alert.alert('Sucesso', `"${newTrack.title}" foi adicionada à sua biblioteca!`);
  }

  async function deleteTrack(track: Track) {
    Alert.alert(
      'Remover música',
      `Deseja remover "${track.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            const updated = uploadedTracks.filter(t => t.id !== track.id);
            setUploadedTracks(updated);
            await saveData(KEYS.UPLOADED_TRACKS, updated);
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suas Músicas</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Upload button area */}
      <TouchableOpacity style={styles.uploadArea} onPress={pickFile} activeOpacity={0.8}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.uploadGradient}
        >
          <Ionicons name="cloud-upload" size={40} color={Colors.textPrimary} />
          <Text style={styles.uploadTitle}>Fazer Upload</Text>
          <Text style={styles.uploadSubtitle}>
            MP3, WAV, FLAC, OGG, AAC, M4A
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Uploaded tracks */}
      <View style={styles.trackListHeader}>
        <Text style={styles.sectionTitle}>
          Músicas enviadas ({uploadedTracks.length})
        </Text>
      </View>

      {uploadedTracks.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="musical-notes" size={48} color={Colors.textInactive} />
          <Text style={styles.emptyText}>
            Nenhuma música enviada ainda
          </Text>
          <Text style={styles.emptySubtext}>
            Faça upload das suas músicas para ouvir no Spotfly
          </Text>
        </View>
      ) : (
        <FlatList
          data={uploadedTracks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TrackRow
              track={item}
              trackList={uploadedTracks}
              onOptionsPress={(track) => deleteTrack(track)}
            />
          )}
          contentContainerStyle={styles.trackList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalhes da Música</Text>

            <TextInput
              style={styles.modalInput}
              value={editTrack.title}
              onChangeText={(text) => setEditTrack({ ...editTrack, title: text })}
              placeholder="Título"
              placeholderTextColor={Colors.textInactive}
              autoFocus
            />

            <TextInput
              style={styles.modalInput}
              value={editTrack.artist}
              onChangeText={(text) => setEditTrack({ ...editTrack, artist: text })}
              placeholder="Artista"
              placeholderTextColor={Colors.textInactive}
            />

            <TextInput
              style={styles.modalInput}
              value={editTrack.album}
              onChangeText={(text) => setEditTrack({ ...editTrack, album: text })}
              placeholder="Álbum"
              placeholderTextColor={Colors.textInactive}
            />

            <TextInput
              style={styles.modalInput}
              value={editTrack.genre}
              onChangeText={(text) => setEditTrack({ ...editTrack, genre: text })}
              placeholder="Gênero"
              placeholderTextColor={Colors.textInactive}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowEditModal(false);
                  setPendingUri('');
                  setEditTrack({});
                }}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={saveUploadedTrack}
              >
                <Text style={styles.modalSaveText}>Salvar</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.padding.md,
    paddingVertical: Layout.padding.md,
  },
  backButton: {
    padding: Layout.padding.xs,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  uploadArea: {
    marginHorizontal: Layout.padding.md,
    borderRadius: Layout.borderRadius.lg,
    overflow: 'hidden',
  },
  uploadGradient: {
    alignItems: 'center',
    paddingVertical: Layout.padding.xl,
  },
  uploadTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginTop: Layout.padding.sm,
  },
  uploadSubtitle: {
    color: Colors.textPrimary,
    fontSize: 12,
    opacity: 0.8,
    marginTop: 4,
  },
  trackListHeader: {
    paddingHorizontal: Layout.padding.md,
    paddingTop: Layout.padding.xl,
    paddingBottom: Layout.padding.sm,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: Layout.padding.md,
  },
  emptySubtext: {
    color: Colors.textTertiary,
    fontSize: 13,
    marginTop: Layout.padding.xs,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  trackList: {
    paddingBottom: Layout.padding.xl,
  },
  // Modal
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
  modalSaveButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: Layout.padding.sm,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.primary,
  },
  modalSaveText: {
    color: Colors.background,
    fontSize: 15,
    fontWeight: '700',
  },
});
