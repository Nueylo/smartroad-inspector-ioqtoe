
import { DefectTypeInfo, SeverityInfo } from '../types';
import { colors } from '../styles/commonStyles';

export const DEFECT_TYPES: DefectTypeInfo[] = [
  {
    id: 'pothole',
    label: 'Nid-de-poule',
    icon: '🕳️',
    color: colors.danger,
  },
  {
    id: 'crack',
    label: 'Fissure',
    icon: '⚡',
    color: colors.warning,
  },
  {
    id: 'surface_damage',
    label: 'Dégradation de surface',
    icon: '🔨',
    color: colors.textSecondary,
  },
  {
    id: 'edge_damage',
    label: 'Dégradation de bordure',
    icon: '📐',
    color: colors.accent,
  },
  {
    id: 'drainage_issue',
    label: 'Problème de drainage',
    icon: '💧',
    color: colors.primary,
  },
  {
    id: 'other',
    label: 'Autre',
    icon: '❓',
    color: colors.textSecondary,
  },
];

export const SEVERITY_LEVELS: SeverityInfo[] = [
  {
    id: 'low',
    label: 'Léger',
    color: colors.success,
    minDepth: 0,
  },
  {
    id: 'moderate',
    label: 'Modéré',
    color: colors.warning,
    minDepth: 3,
  },
  {
    id: 'high',
    label: 'Élevé',
    color: '#f97316', // orange-500
    minDepth: 6,
  },
  {
    id: 'critical',
    label: 'Critique',
    color: colors.danger,
    minDepth: 10,
  },
];

export const USER_WEIGHTS = {
  citizen: 1,
  approved: 5,
  admin: 10,
};

export const VALIDATION_THRESHOLD = 3; // Number of validations needed for citizen reports
