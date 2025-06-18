import { mockApiService } from './mockApi';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('🔐 Attempting login with:', { email: credentials.email });
      
      const response = await mockApiService.login(credentials);
      
      console.log('✅ Login successful:', { user: response.user });
      
      // Store tokens and user data
      localStorage.setItem('token', response.token);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(response.user));

      return response;
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      throw new Error(error.message || 'Erro ao fazer login');
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('📝 Attempting registration with:', { 
        email: userData.email, 
        name: userData.name, 
        role: userData.role 
      });
      
      const response = await mockApiService.register(userData);
      
      console.log('✅ Registration successful:', { user: response.user });
      
      // Store tokens and user data
      localStorage.setItem('token', response.token);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(response.user));

      return response;
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      throw new Error(error.message || 'Erro ao criar conta');
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      console.log('🔄 Attempting token refresh');
      
      const response = await mockApiService.refreshToken();

      console.log('✅ Token refresh successful');

      // Update stored tokens
      localStorage.setItem('token', response.token);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(response.user));

      return response;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      // If refresh fails, logout user
      this.logout();
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      console.log('🚪 Attempting logout');
      await mockApiService.logout();
      console.log('✅ Logout successful');
    } catch (error) {
      // Ignore logout errors, just clear local storage
      console.warn('⚠️ Logout request failed:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      console.log('🧹 Local storage cleared');
    }
  }

  getCurrentUser(): User | null {
    return mockApiService.getCurrentUser();
  }

  getToken(): string | null {
    return mockApiService.getToken();
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  isAuthenticated(): boolean {
    return mockApiService.isAuthenticated();
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  canAccess(requiredRoles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? requiredRoles.includes(user.role) : false;
  }

  // Check if token is expired (basic check)
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    // For mock tokens, never expire
    return false;
  }
}

export const authService = new AuthService();