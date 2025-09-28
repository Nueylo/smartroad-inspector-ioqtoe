
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DefectReport } from '../types';
import { mockDefects } from '../data/mockData';

const STORAGE_KEY = 'smartroad_defects';

export const useDefects = () => {
  const [defects, setDefects] = useState<DefectReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDefects();
  }, []);

  const loadDefects = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedDefects = JSON.parse(stored).map((defect: any) => ({
          ...defect,
          reportedAt: new Date(defect.reportedAt),
        }));
        setDefects(parsedDefects);
      } else {
        // Initialize with mock data
        setDefects(mockDefects);
        await saveDefects(mockDefects);
      }
    } catch (error) {
      console.log('Error loading defects:', error);
      setDefects(mockDefects);
    } finally {
      setLoading(false);
    }
  };

  const saveDefects = async (defectsToSave: DefectReport[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defectsToSave));
    } catch (error) {
      console.log('Error saving defects:', error);
    }
  };

  const addDefect = async (defect: DefectReport) => {
    const updatedDefects = [...defects, defect];
    setDefects(updatedDefects);
    await saveDefects(updatedDefects);
  };

  const updateDefect = async (id: string, updates: Partial<DefectReport>) => {
    const updatedDefects = defects.map(defect =>
      defect.id === id ? { ...defect, ...updates } : defect
    );
    setDefects(updatedDefects);
    await saveDefects(updatedDefects);
  };

  const validateDefect = async (defectId: string, userId: string) => {
    const defect = defects.find(d => d.id === defectId);
    if (!defect || defect.validations.includes(userId)) {
      return;
    }

    const updatedValidations = [...defect.validations, userId];
    await updateDefect(defectId, {
      validations: updatedValidations,
      status: updatedValidations.length >= 3 ? 'validated' : defect.status,
    });
  };

  const getDefectsByStatus = (status: DefectReport['status']) => {
    return defects.filter(defect => defect.status === status);
  };

  const getDefectsBySeverity = (severity: DefectReport['severity']) => {
    return defects.filter(defect => defect.severity === severity);
  };

  return {
    defects,
    loading,
    addDefect,
    updateDefect,
    validateDefect,
    getDefectsByStatus,
    getDefectsBySeverity,
    refresh: loadDefects,
  };
};
