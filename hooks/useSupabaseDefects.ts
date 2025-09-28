
import { useState, useEffect } from 'react';
import { supabase } from '@/app/integrations/supabase/client';
import { DefectReport, DefectType, DefectSeverity, DefectStatus, DefectLocation, DefectDimensions } from '@/types';
import { Database } from '@/app/integrations/supabase/types';
import { getDbDefectType, getAppDefectType, getDbPriority, getAppSeverity } from '@/data/constants';

type DefectReportRow = Database['public']['Tables']['defect_reports']['Row'];
type DefectReportInsert = Database['public']['Tables']['defect_reports']['Insert'];

export function useSupabaseDefects() {
  const [defects, setDefects] = useState<DefectReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert database row to DefectReport type
  const convertToDefectReport = (row: DefectReportRow): DefectReport => {
    return {
      id: row.id,
      location: {
        latitude: Number(row.latitude),
        longitude: Number(row.longitude),
        address: row.address || undefined,
      },
      dimensions: {
        length: row.dimensions.length,
        width: row.dimensions.width,
        depth: row.dimensions.depth,
        surface: row.dimensions.surface,
      },
      type: getAppDefectType(row.type),
      severity: getAppSeverity(row.priority),
      description: row.description || '',
      imageUri: row.photos && row.photos.length > 0 ? row.photos[0] : undefined,
      reportedBy: row.reported_by,
      reportedAt: new Date(row.created_at || ''),
      validations: [], // Will be populated separately
      status: row.status === 'repaired' ? 'resolved' : row.status as DefectStatus,
      priority: row.total_score,
    };
  };

  // Fetch all defects
  const fetchDefects = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('defect_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching defects:', error);
        setError(error.message);
        return;
      }

      if (data) {
        const convertedDefects = data.map(convertToDefectReport);
        
        // Fetch validations for each defect
        for (const defect of convertedDefects) {
          const { data: validations } = await supabase
            .from('validations')
            .select('user_id')
            .eq('report_id', defect.id);
          
          if (validations) {
            defect.validations = validations.map(v => v.user_id);
          }
        }

        setDefects(convertedDefects);
      }
    } catch (err) {
      console.error('Error in fetchDefects:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Add a new defect report
  const addDefect = async (
    location: DefectLocation,
    dimensions: DefectDimensions,
    type: DefectType,
    severity: DefectSeverity,
    description: string,
    imageUri?: string,
    reportedBy?: string
  ): Promise<DefectReport | null> => {
    try {
      setError(null);

      // Get current user if reportedBy not provided
      const { data: { user } } = await supabase.auth.getUser();
      const userId = reportedBy || user?.id;

      if (!userId) {
        setError('User must be authenticated to report defects');
        return null;
      }

      // Get user profile to get weight
      const { data: profile } = await supabase
        .from('profiles')
        .select('weight')
        .eq('id', userId)
        .single();

      const userWeight = profile?.weight || 1;

      // Calculate priority based on severity
      let priorityScore = userWeight;
      switch (severity) {
        case 'critical': priorityScore *= 4; break;
        case 'high': priorityScore *= 3; break;
        case 'moderate': priorityScore *= 2; break;
        case 'low': priorityScore *= 1; break;
      }

      const newDefect: DefectReportInsert = {
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address || null,
        dimensions: {
          length: dimensions.length,
          width: dimensions.width,
          depth: dimensions.depth,
          surface: dimensions.surface,
        },
        type: getDbDefectType(type),
        priority: getDbPriority(severity),
        description,
        photos: imageUri ? [imageUri] : null,
        reported_by: userId,
        user_weight: userWeight,
        total_score: priorityScore,
        status: 'reported',
      };

      const { data, error } = await supabase
        .from('defect_reports')
        .insert(newDefect)
        .select()
        .single();

      if (error) {
        console.error('Error adding defect:', error);
        setError(error.message);
        return null;
      }

      if (data) {
        const convertedDefect = convertToDefectReport(data);
        setDefects(prev => [convertedDefect, ...prev]);
        return convertedDefect;
      }

      return null;
    } catch (err) {
      console.error('Error in addDefect:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    }
  };

  // Validate a defect (add validation)
  const validateDefect = async (defectId: string, userId?: string): Promise<boolean> => {
    try {
      setError(null);

      // Get current user if userId not provided
      const { data: { user } } = await supabase.auth.getUser();
      const validatorId = userId || user?.id;

      if (!validatorId) {
        setError('User must be authenticated to validate defects');
        return false;
      }

      // Check if user already validated this defect
      const { data: existingValidation } = await supabase
        .from('validations')
        .select('id')
        .eq('report_id', defectId)
        .eq('user_id', validatorId)
        .single();

      if (existingValidation) {
        setError('You have already validated this defect');
        return false;
      }

      // Get user profile to get weight
      const { data: profile } = await supabase
        .from('profiles')
        .select('weight')
        .eq('id', validatorId)
        .single();

      const userWeight = profile?.weight || 1;

      // Add validation
      const { error } = await supabase
        .from('validations')
        .insert({
          report_id: defectId,
          user_id: validatorId,
          user_weight: userWeight,
          validation_type: 'confirm',
        });

      if (error) {
        console.error('Error validating defect:', error);
        setError(error.message);
        return false;
      }

      // Update defect total score
      const { data: defectData } = await supabase
        .from('defect_reports')
        .select('total_score')
        .eq('id', defectId)
        .single();

      if (defectData) {
        const newScore = defectData.total_score + userWeight;
        await supabase
          .from('defect_reports')
          .update({ 
            total_score: newScore,
            status: newScore >= 5 ? 'validated' : 'reported' // Auto-validate if score is high enough
          })
          .eq('id', defectId);
      }

      // Update local state
      setDefects(prev => prev.map(defect => 
        defect.id === defectId 
          ? { ...defect, validations: [...defect.validations, validatorId] }
          : defect
      ));

      return true;
    } catch (err) {
      console.error('Error in validateDefect:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    }
  };

  // Update defect status
  const updateDefectStatus = async (defectId: string, status: DefectStatus): Promise<boolean> => {
    try {
      setError(null);

      const dbStatus = status === 'resolved' ? 'repaired' : status;

      const { error } = await supabase
        .from('defect_reports')
        .update({ 
          status: dbStatus as any,
          updated_at: new Date().toISOString() 
        })
        .eq('id', defectId);

      if (error) {
        console.error('Error updating defect status:', error);
        setError(error.message);
        return false;
      }

      // Update local state
      setDefects(prev => prev.map(defect => 
        defect.id === defectId 
          ? { ...defect, status }
          : defect
      ));

      return true;
    } catch (err) {
      console.error('Error in updateDefectStatus:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    }
  };

  // Get defect by ID
  const getDefectById = (id: string): DefectReport | undefined => {
    return defects.find(defect => defect.id === id);
  };

  // Filter defects by various criteria
  const getFilteredDefects = (filters: {
    severity?: DefectSeverity[];
    status?: DefectStatus[];
    type?: DefectType[];
  }) => {
    return defects.filter(defect => {
      if (filters.severity && !filters.severity.includes(defect.severity)) return false;
      if (filters.status && !filters.status.includes(defect.status)) return false;
      if (filters.type && !filters.type.includes(defect.type)) return false;
      return true;
    });
  };

  useEffect(() => {
    fetchDefects();
  }, []);

  return {
    defects,
    loading,
    error,
    addDefect,
    validateDefect,
    updateDefectStatus,
    getDefectById,
    getFilteredDefects,
    refetch: fetchDefects,
  };
}
