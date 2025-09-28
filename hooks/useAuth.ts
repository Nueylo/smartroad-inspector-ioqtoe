
import { useState, useEffect } from 'react';
import { supabase } from '@/app/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '@/types';
import { Database } from '@/app/integrations/supabase/types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert database row to User type
  const convertToUser = (row: ProfileRow): User => {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      type: row.role === 'ministry' ? 'admin' : 
            row.role === 'delegate' || row.role === 'supervisor' ? 'approved' : 
            'citizen',
      weight: row.weight,
    };
  };

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data ? convertToUser(data) : null;
    } catch (err) {
      console.error('Error in fetchUserProfile:', err);
      return null;
    }
  };

  // Create user profile in database
  const createUserProfile = async (
    userId: string, 
    name: string, 
    email: string,
    userType: 'citizen' | 'approved' | 'admin' = 'citizen'
  ) => {
    try {
      const role = userType === 'admin' ? 'ministry' : 
                   userType === 'approved' ? 'delegate' : 
                   'citizen';
      const weight = userType === 'admin' ? 10 : userType === 'approved' ? 5 : 1;

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          name,
          email,
          role: role as any,
          weight,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        return null;
      }

      return data ? convertToUser(data) : null;
    } catch (err) {
      console.error('Error in createUserProfile:', err);
      return null;
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://natively.dev/email-confirmed'
        }
      });

      if (error) {
        setError(error.message);
        return { success: false, message: error.message };
      }

      if (data.user) {
        // Create user profile
        await createUserProfile(data.user.id, name, email);
        return { 
          success: true, 
          message: 'Registration successful! Please check your email to verify your account.' 
        };
      }

      return { success: false, message: 'Registration failed' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Sign in successful!' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setError(error.message);
        return { success: false, message: error.message };
      }

      setUser(null);
      setSupabaseUser(null);
      return { success: true, message: 'Signed out successfully!' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return { success: false, message };
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<Pick<User, 'name' | 'email'>>) => {
    try {
      setError(null);
      
      if (!user) {
        setError('No user logged in');
        return { success: false, message: 'No user logged in' };
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        setError(error.message);
        return { success: false, message: error.message };
      }

      if (data) {
        setUser(convertToUser(data));
        return { success: true, message: 'Profile updated successfully!' };
      }

      return { success: false, message: 'Update failed' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return { success: false, message };
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id).then(profile => {
          setUser(profile);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSupabaseUser(session?.user ?? null);
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          setUser(profile);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    supabaseUser,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.type === 'admin',
    isApproved: user?.type === 'approved' || user?.type === 'admin',
  };
}
