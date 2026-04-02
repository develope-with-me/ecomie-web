import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {authApi, AuthResponse, EcomieError, User} from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: EcomieError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: EcomieError | null; success?: boolean; message?: string }>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ error: EcomieError | null }>;
  resendConfirmationEmail: (email: string) => Promise<{ error: EcomieError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const initializeAuth = async () => {
      try {
        const currentUser = await authApi.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAdmin(currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
        const payload = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
        };
      const response = await authApi.signUp(payload);
      return { error: null };
    } catch (error) {
      return { error: error as EcomieError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authApi.signIn(email, password);
      if (!response.success) {
        return { error: null, success: false, message: response.message };
      }
      setUser(response.user);
      setIsAdmin(response.user.role === 'ADMIN' || response.user.role === 'SUPER_ADMIN');
      return { error: null, success: true };
    } catch (error) {
      return { error: error as EcomieError };
    }
  };

  const signOut = async () => {
    authApi.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  const forgotPassword = async (email: string) => {
    try {
      await authApi.sendPasswordResetLink(email);
      return { error: null };
    } catch (error) {
      return { error: error as EcomieError };
    }
  };

  const resendConfirmationEmail = async (email: string) => {
    try {
      await authApi.resendConfirmationLink(email);
      return { error: null };
    } catch (error) {
      return { error: error as EcomieError };
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signUp, signIn, signOut, forgotPassword, resendConfirmationEmail }}>
      {children}
    </AuthContext.Provider>
  );
};
