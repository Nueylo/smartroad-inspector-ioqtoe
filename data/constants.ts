
import { DefectTypeInfo, SeverityInfo, DefectType, DefectSeverity, DbDefectType, DbDefectPriority } from '@/types';

export const DEFECT_TYPES: DefectTypeInfo[] = [
  {
    id: 'pothole',
    label: 'Pothole',
    icon: 'exclamationmark.circle.fill',
    color: '#FF6B6B',
    dbType: 'hole',
  },
  {
    id: 'crack',
    label: 'Crack',
    icon: 'bolt.fill',
    color: '#4ECDC4',
    dbType: 'crack',
  },
  {
    id: 'surface_damage',
    label: 'Surface Damage',
    icon: 'square.dashed',
    color: '#45B7D1',
    dbType: 'erosion',
  },
  {
    id: 'edge_damage',
    label: 'Edge Damage',
    icon: 'rectangle.split.2x1',
    color: '#96CEB4',
    dbType: 'other',
  },
  {
    id: 'drainage_issue',
    label: 'Drainage Issue',
    icon: 'drop.fill',
    color: '#FFEAA7',
    dbType: 'other',
  },
  {
    id: 'other',
    label: 'Other',
    icon: 'questionmark.circle.fill',
    color: '#DDA0DD',
    dbType: 'other',
  },
];

export const SEVERITY_LEVELS: SeverityInfo[] = [
  {
    id: 'low',
    label: 'Low',
    color: '#4CAF50',
    minDepth: 0,
    dbPriority: 'low',
  },
  {
    id: 'moderate',
    label: 'Moderate',
    color: '#FF9800',
    minDepth: 2,
    dbPriority: 'medium',
  },
  {
    id: 'high',
    label: 'High',
    color: '#FF5722',
    minDepth: 5,
    dbPriority: 'high',
  },
  {
    id: 'critical',
    label: 'Critical',
    color: '#F44336',
    minDepth: 10,
    dbPriority: 'critical',
  },
];

// Helper functions to convert between app types and database types
export const getDbDefectType = (appType: DefectType): DbDefectType => {
  const typeInfo = DEFECT_TYPES.find(t => t.id === appType);
  return typeInfo?.dbType || 'other';
};

export const getAppDefectType = (dbType: DbDefectType): DefectType => {
  const typeInfo = DEFECT_TYPES.find(t => t.dbType === dbType);
  return typeInfo?.id || 'other';
};

export const getDbPriority = (severity: DefectSeverity): DbDefectPriority => {
  const severityInfo = SEVERITY_LEVELS.find(s => s.id === severity);
  return severityInfo?.dbPriority || 'low';
};

export const getAppSeverity = (dbPriority: DbDefectPriority): DefectSeverity => {
  const severityInfo = SEVERITY_LEVELS.find(s => s.dbPriority === dbPriority);
  return severityInfo?.id || 'low';
};

export const STATUS_LABELS = {
  reported: 'Reported',
  validated: 'Validated',
  in_progress: 'In Progress',
  repaired: 'Resolved',
  rejected: 'Rejected',
};

export const PRIORITY_COLORS = {
  low: '#4CAF50',
  medium: '#FF9800',
  high: '#FF5722',
  critical: '#F44336',
};
