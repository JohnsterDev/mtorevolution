import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authService } from '../services/auth';
import { User } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'ADMIN' | 'COACH' | 'CLIENTE') => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
  canAccess: (roles: string[]) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      console.log('🔐 Initializing authentication...');
      
      const currentUser = authService.getCurrentUser();
      const token = authService.getToken();

      console.log('📋 Auth state:', { 
        hasUser: !!currentUser, 
        hasToken: !!token,
        user: currentUser 
      });

      if (currentUser && token) {
        // Check if token is expired
        if (authService.isTokenExpired()) {
          console.log('⏰ Token expired, attempting refresh...');
          try {
            // Try to refresh token
            const response = await authService.refreshToken();
            setUser(response.user);
            console.log('✅ Token refreshed successfully');
          } catch (error) {
            console.log('❌ Token refresh failed, logging out...');
            // Refresh failed, logout user
            await logout();
          }
        } else {
          console.log('✅ Valid token found, user authenticated');
          setUser(currentUser);
        }
      } else {
        console.log('ℹ️ No valid authentication found');
      }
    } catch (error) {
      console.error('❌ Auth initialization error:', error);
      await logout();
    } finally {
      setIsLoading(false);
      console.log('🏁 Auth initialization complete');
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('🔑 Attempting login for:', email);
      const response = await authService.login({ email, password });
      setUser(response.user);
      console.log('✅ Login successful for user:', response.user.name);
      toast.success(`Bem-vindo, ${response.user.name}!`);
    } catch (error: any) {
      console.error('❌ Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'ADMIN' | 'COACH' | 'CLIENTE') => {
    setIsLoading(true);
    try {
      console.log('📝 Attempting registration for:', email);
      const response = await authService.register({ name, email, password, role });
      setUser(response.user);
      console.log('✅ Registration successful for user:', response.user.name);
      toast.success(`Conta criada com sucesso! Bem-vindo, ${response.user.name}!`);
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out user...');
      await authService.logout();
      setUser(null);
      console.log('✅ Logout successful');
      toast.success('Logout realizado com sucesso');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Even if logout request fails, clear local state
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      console.log('🔄 Refreshing user data...');
      const response = await authService.refreshToken();
      setUser(response.user);
      console.log('✅ User data refreshed');
    } catch (error) {
      console.error('❌ Refresh user error:', error);
      await logout();
    }
  };

  const hasRole = (role: string) => {
    const result = authService.hasRole(role);
    console.log(`🔍 Role check: ${role} = ${result} (current: ${user?.role})`);
    return result;
  };

  const canAccess = (roles: string[]) => {
    const result = authService.canAccess(roles);
    console.log(`🔍 Access check: [${roles.join(', ')}] = ${result} (current: ${user?.role})`);
    return result;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    hasRole,
    canAccess,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}