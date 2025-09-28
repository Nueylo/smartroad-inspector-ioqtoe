
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function MapScreen() {
  return (
    <View style={commonStyles.wrapper}>
      <Stack.Screen
        options={{
          title: 'Carte des défauts',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.surface,
          headerTitleStyle: { fontWeight: '600' },
        }}
      />
      
      <View style={[commonStyles.container, commonStyles.center]}>
        <View style={styles.messageContainer}>
          <IconSymbol name="map" size={64} color={colors.textSecondary} />
          <Text style={styles.title}>Carte non disponible</Text>
          <Text style={styles.message}>
            Les cartes react-native-maps ne sont pas supportées dans Natively pour le moment.
          </Text>
          <Text style={styles.submessage}>
            Cette fonctionnalité sera disponible dans une future version de l'application.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  submessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
