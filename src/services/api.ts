import { mockApiService } from './mockApi';

// Mock API service that simulates the real API
class ApiService {
  private baseURL = 'http://localhost:3000'; // Mock URL

  constructor() {
    console.log('🔧 Using Mock API Service for local development');
  }

  // Generic methods that delegate to mock service
  async get<T>(url: string, params?: any): Promise<T> {
    console.log(`🚀 Mock API Request: GET ${url}`, { params });
    
    // Route to appropriate mock method based on URL
    if (url === '/health') {
      return await mockApiService.healthCheck() as T;
    }
    
    throw new Error(`Mock API: Unhandled GET ${url}`);
  }

  async post<T>(url: string, data?: any): Promise<T> {
    console.log(`🚀 Mock API Request: POST ${url}`, { data });
    
    // Route to appropriate mock method based on URL
    if (url === '/auth/login') {
      return await mockApiService.login(data) as T;
    }
    if (url === '/auth/register') {
      return await mockApiService.register(data) as T;
    }
    if (url === '/auth/refresh') {
      return await mockApiService.refreshToken() as T;
    }
    if (url === '/auth/logout') {
      await mockApiService.logout();
      return {} as T;
    }
    
    throw new Error(`Mock API: Unhandled POST ${url}`);
  }

  async put<T>(url: string, data?: any): Promise<T> {
    console.log(`🚀 Mock API Request: PUT ${url}`, { data });
    throw new Error(`Mock API: Unhandled PUT ${url}`);
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    console.log(`🚀 Mock API Request: PATCH ${url}`, { data });
    throw new Error(`Mock API: Unhandled PATCH ${url}`);
  }

  async delete<T>(url: string): Promise<T> {
    console.log(`🚀 Mock API Request: DELETE ${url}`);
    throw new Error(`Mock API: Unhandled DELETE ${url}`);
  }

  // File upload
  async uploadFile<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    console.log(`🚀 Mock API Request: UPLOAD ${url}`, { fileName: file.name });
    
    // Simulate upload progress
    if (onProgress) {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        onProgress(i);
      }
    }
    
    return `https://mock-storage.com/files/${file.name}` as T;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    return await mockApiService.healthCheck();
  }

  // Get API base URL for debugging
  getBaseURL(): string {
    return this.baseURL;
  }
}

export const apiService = new ApiService();