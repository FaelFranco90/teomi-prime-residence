import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isEditor?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthHook = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ role: string | null; status: string | null } | null>(null);

  const loadProfile = async (uid: string) => {
    try {
      console.log('[auth-debug] fetching profile for uid:', uid);
      const { data, error } = await supabase
        .from('profiles')
        .select('role,status')
        .eq('id', uid)
        .maybeSingle();
      if (error) throw error;
      console.log('[auth-debug] profiles select result:', data);
      setProfile(data ?? null);
    } catch (err) {
      console.error('[auth-debug] profiles select error (check RLS):', err);
      setProfile(null);
    }
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      const { data: userData, error } = await supabase.auth.getUser();
      if (error) console.error('[auth-debug] getUser error:', error);
      const currentUser = userData?.user ?? null;
      if (!isMounted) return;
      setUser(currentUser);
      const { data: sess } = await supabase.auth.getSession();
      if (!isMounted) return;
      setSession(sess.session ?? null);
      if (currentUser?.id) {
        await loadProfile(currentUser.id);
      } else {
        setProfile(null);
      }
      if (isMounted) setLoading(false);
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, sess) => {
      console.log('[auth-debug] onAuthStateChange:', event, 'user:', sess?.user?.id, sess?.user?.email);
      setSession(sess);
      const u = sess?.user ?? null;
      setUser(u);
      setLoading(true);
      if (!u) {
        setProfile(null);
        setLoading(false);
        return;
      }
      setTimeout(() => {
        loadProfile(u.id).finally(() => setLoading(false));
      }, 0);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log('[auth-debug] loading:', loading, 'user:', user?.id, user?.email, 'role:', profile?.role, 'status:', profile?.status);
  }, [loading, user?.id, user?.email, profile?.role, profile?.status]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const role = profile?.role ?? null;
  const status = profile?.status ?? null;
  const isActive = status === 'active';
  const isAdmin = role === 'admin' && isActive;
  const isEditor = role === 'editor' && isActive;

  return {
    user,
    session,
    loading,
    signIn,
    signOut,
    isAdmin,
    isEditor,
  };
};