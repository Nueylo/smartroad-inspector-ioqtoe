
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { DefectDimensions } from '../types';
import { colors, commonStyles } from '../styles/commonStyles';

interface DimensionInputProps {
  dimensions: DefectDimensions;
  onUpdate: (dimensions: DefectDimensions) => void;
}

export const DimensionInput: React.FC<DimensionInputProps> = ({
  dimensions,
  onUpdate,
}) => {
  const updateDimension = (field: keyof DefectDimensions, value: string) => {
    const numValue = parseFloat(value) || 0;
    const updatedDimensions = { ...dimensions, [field]: numValue };
    
    // Auto-calculate surface area
    if (field === 'length' || field === 'width') {
      updatedDimensions.surface = updatedDimensions.length * updatedDimensions.width;
    }
    
    onUpdate(updatedDimensions);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dimensions</Text>
      
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Longueur (cm)</Text>
          <TextInput
            style={commonStyles.input}
            value={dimensions.length.toString()}
            onChangeText={(value) => updateDimension('length', value)}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Largeur (cm)</Text>
          <TextInput
            style={commonStyles.input}
            value={dimensions.width.toString()}
            onChangeText={(value) => updateDimension('width', value)}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Profondeur (cm)</Text>
          <TextInput
            style={commonStyles.input}
            value={dimensions.depth.toString()}
            onChangeText={(value) => updateDimension('depth', value)}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Surface (cm²)</Text>
          <View style={[commonStyles.input, styles.calculatedField]}>
            <Text style={styles.calculatedText}>
              {dimensions.surface.toFixed(0)}
            </Text>
          </View>
        </View>
      </View>
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 6,
  },
  calculatedField: {
    backgroundColor: colors.border + '20',
    justifyContent: 'center',
  },
  calculatedText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
