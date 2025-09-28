
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { DefectReport } from '../types';
import { DEFECT_TYPES, SEVERITY_LEVELS } from '../data/constants';
import { colors, commonStyles } from '../styles/commonStyles';
import { IconSymbol } from './IconSymbol';

interface DefectCardProps {
  defect: DefectReport;
  onPress?: () => void;
  showValidateButton?: boolean;
  onValidate?: () => void;
}

export const DefectCard: React.FC<DefectCardProps> = ({
  defect,
  onPress,
  showValidateButton,
  onValidate,
}) => {
  const defectType = DEFECT_TYPES.find(type => type.id === defect.type);
  const severity = SEVERITY_LEVELS.find(sev => sev.id === defect.severity);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusColor = (status: DefectReport['status']) => {
    switch (status) {
      case 'reported':
        return colors.textSecondary;
      case 'validated':
        return colors.success;
      case 'in_progress':
        return colors.warning;
      case 'resolved':
        return colors.success;
      case 'rejected':
        return colors.danger;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusLabel = (status: DefectReport['status']) => {
    switch (status) {
      case 'reported':
        return 'Signalé';
      case 'validated':
        return 'Validé';
      case 'in_progress':
        return 'En cours';
      case 'resolved':
        return 'Résolu';
      case 'rejected':
        return 'Rejeté';
      default:
        return status;
    }
  };

  return (
    <Pressable
      style={[commonStyles.card, styles.container]}
      onPress={onPress}
      android_ripple={{ color: colors.border }}
    >
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <Text style={styles.typeIcon}>{defectType?.icon}</Text>
          <Text style={styles.typeLabel}>{defectType?.label}</Text>
        </View>
        <View style={[styles.severityBadge, { backgroundColor: severity?.color }]}>
          <Text style={styles.severityText}>{severity?.label}</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {defect.description}
      </Text>

      <View style={styles.locationContainer}>
        <IconSymbol name="location" size={16} color={colors.textSecondary} />
        <Text style={styles.locationText} numberOfLines={1}>
          {defect.location.address || `${defect.location.latitude.toFixed(4)}, ${defect.location.longitude.toFixed(4)}`}
        </Text>
      </View>

      <View style={styles.dimensionsContainer}>
        <Text style={styles.dimensionText}>
          {defect.dimensions.length}×{defect.dimensions.width}×{defect.dimensions.depth} cm
        </Text>
        <Text style={styles.dimensionText}>
          Surface: {defect.dimensions.surface} cm²
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(defect.status) }]} />
          <Text style={styles.statusText}>{getStatusLabel(defect.status)}</Text>
        </View>
        
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>
            {formatDate(defect.reportedAt)}
          </Text>
          {defect.validations.length > 0 && (
            <Text style={styles.validationText}>
              {defect.validations.length} validation{defect.validations.length > 1 ? 's' : ''}
            </Text>
          )}
        </View>
      </View>

      {showValidateButton && onValidate && (
        <Pressable
          style={styles.validateButton}
          onPress={onValidate}
          android_ripple={{ color: colors.surface }}
        >
          <IconSymbol name="checkmark" size={16} color={colors.surface} />
          <Text style={styles.validateButtonText}>Valider</Text>
        </Pressable>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.surface,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
    flex: 1,
  },
  dimensionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dimensionText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  metaContainer: {
    alignItems: 'flex-end',
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  validationText: {
    fontSize: 11,
    color: colors.success,
    fontWeight: '500',
  },
  validateButton: {
    backgroundColor: colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  validateButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});
