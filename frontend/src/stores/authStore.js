import { create } from 'zustand';
import { authService } from '@/services/authService';

const useAuthStore = create((set) => ({
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),
  
  setUser: (userData) => {
    set({ user: userData, isAuthenticated: true });
  },
  
  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },
  
  // Initialize auth state from localStorage
  initialize: () => {
    const user = authService.getCurrentUser();
    set({ user, isAuthenticated: !!user });
  }
}));

export { useAuthStore }; 