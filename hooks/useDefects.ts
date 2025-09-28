
import { useSupabaseDefects } from './useSupabaseDefects';
import { mockDefects } from '@/data/mockData';
import { DefectReport } from '@/types';

// This hook provides a fallback to mock data when Supabase is not available
export function useDefects() {
  const supabaseHook = useSupabaseDefects();
  
  // If Supabase is loading or has errors, fall back to mock data
  if (supabaseHook.loading && supabaseHook.defects.length === 0) {
    return {
      defects: mockDefects,
      loading: false,
      error: null,
      addDefect: supabaseHook.addDefect,
      validateDefect: supabaseHook.validateDefect,
      updateDefectStatus: supabaseHook.updateDefectStatus,
      getDefectById: (id: string) => mockDefects.find(d => d.id === id),
      getFilteredDefects: (filters: any) => mockDefects,
      refetch: supabaseHook.refetch,
    };
  }

  // If we have Supabase data or no error, use Supabase
  if (supabaseHook.defects.length > 0 || !supabaseHook.error) {
    return supabaseHook;
  }

  // Fallback to mock data if there's an error
  console.log('Falling back to mock data due to Supabase error:', supabaseHook.error);
  return {
    defects: mockDefects,
    loading: false,
    error: supabaseHook.error,
    addDefect: supabaseHook.addDefect,
    validateDefect: supabaseHook.validateDefect,
    updateDefectStatus: supabaseHook.updateDefectStatus,
    getDefectById: (id: string) => mockDefects.find(d => d.id === id),
    getFilteredDefects: (filters: any) => mockDefects,
    refetch: supabaseHook.refetch,
  };
}
