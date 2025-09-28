
import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { DefectType } from '../types';
import { DEFECT_TYPES } from '../data/constants';
import { colors, commonStyles } from '../styles/commonStyles';

interface DefectTypeSelectorProps {
  selectedType: DefectType | null;
  onSelect: (type: DefectType) => void;
}

export const DefectTypeSelector: React.FC<DefectTypeSelectorProps> = ({
  selectedType,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Type de défaillance</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {DEFECT_TYPES.map((type) => (
          <Pressable
            key={type.id}
            style={[
              styles.typeButton,
              selectedType === type.id && styles.selectedTypeButton,
            ]}
            onPress={() => onSelect(type.id)}
            android_ripple={{ color: colors.border }}
          >
            <Text style={styles.typeIcon}>{type.icon}</Text>
            <Text
              style={[
                styles.typeLabel,
                selectedType === type.id && styles.selectedTypeLabel,
              ]}
            >
              {type.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  scrollContainer: {
    paddingRight: 20,
  },
  typeButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedTypeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  selectedTypeLabel: {
    color: colors.surface,
  },
});
