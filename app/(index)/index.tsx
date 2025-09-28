
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useDefects } from '@/hooks/useDefects';
import { DefectCard } from '@/components/DefectCard';
import { currentUser } from '@/data/mockData';

export default function HomeScreen() {
  const { defects, loading } = useDefects();

  const recentDefects = defects
    .sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime())
    .slice(0, 3);

  const criticalDefects = defects.filter(d => d.severity === 'critical').length;
  const validatedDefects = defects.filter(d => d.status === 'validated').length;
  const totalDefects = defects.length;

  const navigateToReport = () => {
    router.push('/report-defect');
  };

  const navigateToMap = () => {
    router.push('/map');
  };

  const navigateToList = () => {
    router.push('/defect-list');
  };

  const navigateToDefectDetail = (defectId: string) => {
    router.push(`/defect-detail?id=${defectId}`);
  };

  return (
    <View style={commonStyles.wrapper}>
      <Stack.Screen
        options={{
          title: 'SmartRoad Inspector',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.surface,
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        <View style={commonStyles.content}>
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={commonStyles.title}>Bonjour, {currentUser.name}</Text>
            <Text style={commonStyles.textSecondary}>
              Inspectez et signalez les défaillances routières
            </Text>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: colors.danger + '20' }]}>
              <Text style={styles.statNumber}>{criticalDefects}</Text>
              <Text style={styles.statLabel}>Critiques</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.success + '20' }]}>
              <Text style={styles.statNumber}>{validatedDefects}</Text>
              <Text style={styles.statLabel}>Validés</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.primary + '20' }]}>
              <Text style={styles.statNumber}>{totalDefects}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsContainer}>
            <Pressable
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={navigateToReport}
              android_ripple={{ color: colors.surface + '20' }}
            >
              <IconSymbol name="camera" size={24} color={colors.surface} />
              <Text style={styles.actionButtonText}>Signaler un défaut</Text>
            </Pressable>

            <View style={styles.actionRow}>
              <Pressable
                style={[styles.secondaryActionButton, { backgroundColor: colors.surface }]}
                onPress={navigateToMap}
                android_ripple={{ color: colors.border }}
              >
                <IconSymbol name="map" size={20} color={colors.primary} />
                <Text style={styles.secondaryActionText}>Carte</Text>
              </Pressable>

              <Pressable
                style={[styles.secondaryActionButton, { backgroundColor: colors.surface }]}
                onPress={navigateToList}
                android_ripple={{ color: colors.border }}
              >
                <IconSymbol name="list.bullet" size={20} color={colors.primary} />
                <Text style={styles.secondaryActionText}>Liste</Text>
              </Pressable>
            </View>
          </View>

          {/* Recent Defects */}
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={commonStyles.subtitle}>Signalements récents</Text>
              <Pressable onPress={navigateToList}>
                <Text style={styles.seeAllText}>Voir tout</Text>
              </Pressable>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={commonStyles.textSecondary}>Chargement...</Text>
              </View>
            ) : recentDefects.length > 0 ? (
              recentDefects.map((defect) => (
                <DefectCard
                  key={defect.id}
                  defect={defect}
                  onPress={() => navigateToDefectDetail(defect.id)}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={commonStyles.textSecondary}>
                  Aucun signalement récent
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeSection: {
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  actionsContainer: {
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryActionText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  recentSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
});
