
export interface DefectLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface DefectDimensions {
  length: number; // in cm
  width: number; // in cm
  depth: number; // in cm
  surface: number; // calculated area in cm²
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'citizen' | 'approved' | 'admin';
  weight: number; // weighting factor for reports
}

export interface DefectReport {
  id: string;
  location: DefectLocation;
  dimensions: DefectDimensions;
  type: DefectType;
  severity: DefectSeverity;
  description: string;
  imageUri?: string;
  reportedBy: string; // user id
  reportedAt: Date;
  validations: string[]; // array of user ids who validated this report
  status: DefectStatus;
  priority: number; // calculated based on user weight and validations
}

export type DefectType = 
  | 'pothole' 
  | 'crack' 
  | 'surface_damage' 
  | 'edge_damage' 
  | 'drainage_issue' 
  | 'other';

export type DefectSeverity = 'low' | 'moderate' | 'high' | 'critical';

export type DefectStatus = 'reported' | 'validated' | 'in_progress' | 'resolved' | 'rejected';

export interface DefectTypeInfo {
  id: DefectType;
  label: string;
  icon: string;
  color: string;
}

export interface SeverityInfo {
  id: DefectSeverity;
  label: string;
  color: string;
  minDepth: number; // minimum depth in cm for this severity
}
