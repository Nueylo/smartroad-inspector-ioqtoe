
import { DefectReport, User } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    type: 'citizen',
    weight: 1,
  },
  {
    id: '2',
    name: 'Marie Martin',
    email: 'marie.martin@travaux.gouv.fr',
    type: 'approved',
    weight: 5,
  },
  {
    id: '3',
    name: 'Pierre Durand',
    email: 'pierre.durand@example.com',
    type: 'citizen',
    weight: 1,
  },
  {
    id: '4',
    name: 'Sophie Moreau',
    email: 'sophie.moreau@travaux.gouv.fr',
    type: 'admin',
    weight: 10,
  },
];

export const mockDefects: DefectReport[] = [
  {
    id: '1',
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      address: 'Avenue des Champs-Élysées, Paris',
    },
    dimensions: {
      length: 45,
      width: 30,
      depth: 8,
      surface: 1350,
    },
    type: 'pothole',
    severity: 'high',
    description: 'Nid-de-poule important sur la voie de droite',
    reportedBy: '2',
    reportedAt: new Date('2024-01-15T10:30:00'),
    validations: ['2', '4'],
    status: 'validated',
    priority: 15,
  },
  {
    id: '2',
    location: {
      latitude: 48.8606,
      longitude: 2.3376,
      address: 'Rue de Rivoli, Paris',
    },
    dimensions: {
      length: 120,
      width: 5,
      depth: 2,
      surface: 600,
    },
    type: 'crack',
    severity: 'moderate',
    description: 'Fissure longitudinale sur plusieurs mètres',
    reportedBy: '1',
    reportedAt: new Date('2024-01-14T14:20:00'),
    validations: ['1'],
    status: 'reported',
    priority: 1,
  },
  {
    id: '3',
    location: {
      latitude: 48.8529,
      longitude: 2.3499,
      address: 'Boulevard Saint-Germain, Paris',
    },
    dimensions: {
      length: 25,
      width: 20,
      depth: 12,
      surface: 500,
    },
    type: 'pothole',
    severity: 'critical',
    description: 'Nid-de-poule très profond, dangereux pour les véhicules',
    reportedBy: '4',
    reportedAt: new Date('2024-01-16T09:15:00'),
    validations: ['4'],
    status: 'validated',
    priority: 10,
  },
];

// Current user (for demo purposes)
export const currentUser: User = mockUsers[0]; // Jean Dupont (citizen)
