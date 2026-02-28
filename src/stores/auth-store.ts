import { create } from 'zustand';
import { AuthUser, AuthStatus } from '@/types/auth';
import { getSupabaseClient } from '@/lib/supabase/client';

interface AuthStore {
  user: AuthUser | null;
  status: AuthStatus;
  error: string | null;

  initialize: () => void;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  clearError: () => void;
}

function mapSupabaseUser(supabaseUser: { id: string; email?: string; user_metadata?: Record<string, string>; app_metadata?: Record<string, string>; created_at?: string }): AuthUser {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    displayName: supabaseUser.user_metadata?.display_name || supabaseUser.user_metadata?.full_name || '',
    avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
    provider: supabaseUser.app_metadata?.provider || 'email',
    createdAt: supabaseUser.created_at || new Date().toISOString(),
  };
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  status: 'loading',
  error: null,

  initialize: () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      set({ status: 'unauthenticated' });
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        set({ user: mapSupabaseUser(session.user), status: 'authenticated' });
      } else {
        set({ status: 'unauthenticated' });
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        set({ user: mapSupabaseUser(session.user), status: 'authenticated' });
      } else {
        set({ user: null, status: 'unauthenticated' });
      }
    });
  },

  signUp: async (email, password, displayName) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      set({ error: 'Authentication not configured' });
      return;
    }

    set({ error: null });
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });

    if (error) {
      set({ error: error.message });
    }
  },

  signIn: async (email, password) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      set({ error: 'Authentication not configured' });
      return;
    }

    set({ error: null });
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      set({ error: error.message });
    }
  },

  signInWithOAuth: async (provider) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      set({ error: 'Authentication not configured' });
      return;
    }

    set({ error: null });
    const { error } = await supabase.auth.signInWithOAuth({ provider });

    if (error) {
      set({ error: error.message });
    }
  },

  signOut: async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    await supabase.auth.signOut();
    set({ user: null, status: 'unauthenticated' });
  },

  updateProfile: async (updates) => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { error } = await supabase.auth.updateUser({
      data: {
        display_name: updates.displayName,
        avatar_url: updates.avatarUrl,
      },
    });

    if (error) {
      set({ error: error.message });
    } else {
      const current = get().user;
      if (current) {
        set({ user: { ...current, ...updates } });
      }
    }
  },

  updatePassword: async (newPassword) => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      set({ error: error.message });
    }
  },

  clearError: () => set({ error: null }),
}));
