
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from './use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get current session
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error.message);
        setLoading(false);
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string,
    password: string,
    role?: 'job_seeker' | 'work_provider'
  ) => {
    try {
      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: role ? { role } : undefined,
        },
      });

      if (error) throw error;
      
      toast({
        title: 'Compte créé',
        description: 'Vérifiez votre email pour confirmer votre compte.',
      });
      
      return true;
    } catch (error: any) {
      console.error('SignUp error:', error);
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: 'Connecté',
        description: 'Vous êtes maintenant connecté.',
      });
      
      return true;
    } catch (error: any) {
      console.error('SignIn error:', error);
      toast({
        title: 'Erreur de connexion',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      // Redirection vers Google : pas de toast succès ici (la page navigue).
      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast({
        title: 'Erreur de connexion',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  // Envoie un code OTP via WhatsApp (canal Twilio Verify). En signup, le rôle
  // est passé en user_metadata pour le trigger handle_new_user.
  const sendPhoneOtp = async (
    phone: string,
    role?: 'job_seeker' | 'work_provider'
  ) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          channel: 'whatsapp',
          data: role ? { role } : undefined,
        },
      });

      if (error) throw error;

      toast({
        title: 'Code envoyé',
        description: 'Vérifiez WhatsApp, un code à 6 chiffres vous a été envoyé.',
      });

      return true;
    } catch (error: any) {
      console.error('Send phone OTP error:', error);
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  // Vérifie le code OTP téléphone (type 'sms' même quand le canal est WhatsApp).
  const verifyPhoneOtp = async (phone: string, token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });

      if (error) throw error;

      toast({
        title: 'Connecté',
        description: 'Vous êtes maintenant connecté.',
      });

      return true;
    } catch (error: any) {
      console.error('Verify phone OTP error:', error);
      toast({
        title: 'Erreur de connexion',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: 'Déconnecté',
        description: 'Vous avez été déconnecté avec succès.',
      });
    } catch (error: any) {
      console.error('SignOut error:', error);
      toast({
        title: 'Erreur de déconnexion',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    sendPhoneOtp,
    verifyPhoneOtp,
    signOut,
  };
};
