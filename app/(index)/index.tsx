
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { DefectCard } from '@/components/DefectCard';
import { colors, commonStyles } from '@/styles/commonStyles';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { useDefects } from '@/hooks/useDefects';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/button';
import React from 'react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  authSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  quickActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    ...commonStyles.shadow,
  },
  actionIcon: {
    marginBottom: 5,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  defectsList: {
    paddingHorizontal: 20,
    gap: 15,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    gap: 15,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default function HomeScreen() {
  const { defects, loading } = useDefects();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const navigateToReport = () => {
    if (!isAuthenticated) {
      router.push('/auth/sign-in');
      return;
    }
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

  const navigateToAuth = () => {
    router.push('/auth/sign-in');
  };

  if (authLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.emptyText}>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'SmartRoad Inspector', headerShown: false }} />
        
        <View style={styles.authContainer}>
          <IconSymbol name="road.lanes" size={80} color={colors.primary} />
          <Text style={styles.authTitle}>Welcome to SmartRoad Inspector</Text>
          <Text style={styles.authSubtitle}>
            Help improve road safety by reporting and tracking road defects in your community.
          </Text>
          
          <View style={{ gap: 15, width: '100%' }}>
            <Button onPress={navigateToAuth}>
              Sign In
            </Button>
            <Button 
              variant="outline" 
              onPress={() => router.push('/auth/sign-up')}
            >
              Create Account
            </Button>
          </View>
          
          <Pressable onPress={navigateToMap} style={{ marginTop: 20 }}>
            <Text style={styles.seeAllText}>View Public Map</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const recentDefects = defects.slice(0, 3);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'SmartRoad Inspector', headerShown: false }} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Welcome back, {user?.name || 'Inspector'}!
          </Text>
          <Text style={styles.subtitle}>
            {user?.type === 'admin' ? 'Administrator' : 
             user?.type === 'approved' ? 'Approved Inspector' : 
             'Community Member'}
          </Text>
        </View>

        <View style={styles.quickActions}>
          <Pressable style={styles.actionButton} onPress={navigateToReport}>
            <IconSymbol 
              name="plus.circle.fill" 
              size={32} 
              color={colors.primary} 
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>Report Defect</Text>
          </Pressable>

          <Pressable style={styles.actionButton} onPress={navigateToMap}>
            <IconSymbol 
              name="map.fill" 
              size={32} 
              color={colors.success} 
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>View Map</Text>
          </Pressable>

          <Pressable style={styles.actionButton} onPress={navigateToList}>
            <IconSymbol 
              name="list.bullet" 
              size={32} 
              color={colors.warning} 
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>All Reports</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Reports</Text>
          <Pressable onPress={navigateToList}>
            <Text style={styles.seeAllText}>See All</Text>
          </Pressable>
        </View>

        <View style={styles.defectsList}>
          {loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Loading reports...</Text>
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
            <View style={styles.emptyState}>
              <IconSymbol name="exclamationmark.triangle" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyText}>
                No defect reports yet.{'\n'}
                Be the first to report a road issue!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
