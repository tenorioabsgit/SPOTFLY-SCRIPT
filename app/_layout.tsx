import React from 'react';
import { Stack } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/contexts/AuthContext';
import { PlayerProvider } from '../src/contexts/PlayerContext';
import { LanguageProvider } from '../src/contexts/LanguageContext';
import { Colors } from '../src/constants/Colors';

const MAX_APP_WIDTH = 900;

export default function RootLayout() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <PlayerProvider>
          <StatusBar style="light" />
          <View style={styles.outerContainer}>
            <View style={styles.appContainer}>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: Colors.background },
                  animation: 'slide_from_right',
                }}
              >
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="player"
                  options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                  }}
                />
                <Stack.Screen name="playlist/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="upload" options={{ headerShown: false }} />
              </Stack>
            </View>
          </View>
        </PlayerProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? MAX_APP_WIDTH : undefined,
  },
});
