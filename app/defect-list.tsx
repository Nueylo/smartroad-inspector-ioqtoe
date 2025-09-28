
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useDefects } from '@/hooks/useDefects';
import { DefectCard } from '@/components/DefectCard';
import { DefectSeverity, DefectStatus } from '@/types';
import { currentUser } from '@/data/mockData';

type FilterType = 'all' | DefectSeverity | DefectStatus;

export default function DefectListScreen() {
  const { defects, validateDefect } = useDefects();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filters: { id: FilterType; label: string; count: number }[] = [
    { id: 'all', label: 'Tous', count: defects.length },
    { id: 'critical', label: 'Critiques', count: defects.filter(d => d.severity === 'critical').length },
    { id: 'reported', label: 'Signalés', count: defects.filter(d => d.status === 'reported').length },
    { id: 'validated', label: 'Validés', count: defects.filter(d => d.status === 'validated').length },
  ];

  const getFilteredDefects = () => {
    switch (activeFilter) {
      case 'all':
        return defects;
      case 'critical':
      case 'high':
      case 'moderate':
      case 'low':
        return defects.filter(d => d.severity === activeFilter);
      case 'reported':
      case 'validated':
      case 'in_progress':
      case 'resolved':
      case 'rejected':
        return defects.filter(d => d.status === activeFilter);
      default:
        return defects;
    }
  };

  const filteredDefects = getFilteredDefects()
    .sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime());

  const navigateToDefectDetail = (defectId: string) => {
    router.push(`/defect-detail?id=${defectId}`);
  };

  const handleValidateDefect = async (defectId: string) => {
    await validateDefect(defectId, currentUser.id);
  };

  const canValidate = (defect: any) => {
    return (
      defect.status === 'reported' &&
      defect.reportedBy !== currentUser.id &&
      !defect.validations.includes(currentUser.id)
    );
  };

  return (
    <View style={commonStyles.wrapper}>
      <Stack.Screen
        options={{
          title: 'Liste des défauts',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.surface,
          headerTitleStyle: { fontWeight: '600' },
        }}
      />
      
      <View style={commonStyles.container}>
        {/* Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map((filter) => (
            <Pressable
              key={filter.id}
              style={[
                styles.filterButton,
                activeFilter === filter.id && styles.activeFilterButton,
              ]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter.id && styles.activeFilterText,
                ]}
              >
                {filter.label}
              </Text>
              <View
                style={[
                  styles.filterBadge,
                  activeFilter === filter.id && styles.activeFilterBadge,
                ]}
              >
                <Text
                  style={[
                    styles.filterBadgeText,
                    activeFilter === filter.id && styles.activeFilterBadgeText,
                  ]}
                >
                  {filter.count}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Defects List */}
        <ScrollView 
          style={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={commonStyles.content}>
            {filteredDefects.length > 0 ? (
              filteredDefects.map((defect) => (
                <DefectCard
                  key={defect.id}
                  defect={defect}
                  onPress={() => navigateToDefectDetail(defect.id)}
                  showValidateButton={canValidate(defect)}
                  onValidate={() => handleValidateDefect(defect.id)}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <IconSymbol name="exclamationmark.triangle" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyTitle}>Aucun défaut trouvé</Text>
                <Text style={styles.emptyText}>
                  Aucun défaut ne correspond aux critères sélectionnés.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filtersContainer: {
    maxHeight: 60,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filtersContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  activeFilterText: {
    color: colors.surface,
  },
  filterBadge: {
    backgroundColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  activeFilterBadge: {
    backgroundColor: colors.surface + '30',
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  activeFilterBadgeText: {
    color: colors.surface,
  },
  listContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
