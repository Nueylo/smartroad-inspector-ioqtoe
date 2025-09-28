
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

// Map existing database types to our app types
export type DefectType = 
  | 'pothole'  // maps to 'hole'
  | 'crack' 
  | 'surface_damage'  // maps to 'erosion'
  | 'edge_damage'     // maps to 'other'
  | 'drainage_issue'  // maps to 'other'
  | 'other';

export type DefectSeverity = 'low' | 'moderate' | 'high' | 'critical';

export type DefectStatus = 'reported' | 'validated' | 'in_progress' | 'resolved' | 'rejected';

// Database types (what's actually in the database)
export type DbDefectType = 'hole' | 'crack' | 'erosion' | 'other';
export type DbDefectStatus = 'reported' | 'validated' | 'in_progress' | 'repaired';
export type DbDefectPriority = 'low' | 'medium' | 'high' | 'critical';

export interface DefectTypeInfo {
  id: DefectType;
  label: string;
  icon: string;
  color: string;
  dbType: DbDefectType; // mapping to database enum
}

export interface SeverityInfo {
  id: DefectSeverity;
  label: string;
  color: string;
  minDepth: number; // minimum depth in cm for this severity
  dbPriority: DbDefectPriority; // mapping to database enum
}
