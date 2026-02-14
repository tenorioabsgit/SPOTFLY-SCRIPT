import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER: '@spotfly_user',
  PLAYLISTS: '@spotfly_playlists',
  UPLOADED_TRACKS: '@spotfly_uploaded_tracks',
  LIKED_TRACKS: '@spotfly_liked_tracks',
  RECENT_SEARCHES: '@spotfly_recent_searches',
  RECENTLY_PLAYED: '@spotfly_recently_played',
  QUEUE: '@spotfly_queue',
};

export async function saveData<T>(key: string, data: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving data:', e);
  }
}

export async function loadData<T>(key: string): Promise<T | null> {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Error loading data:', e);
    return null;
  }
}

export async function removeData(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Error removing data:', e);
  }
}

export { KEYS };
