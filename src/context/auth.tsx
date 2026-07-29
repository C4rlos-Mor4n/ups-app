import React, { createContext, useContext, useState, useEffect } from 'react';
import { authTokens, apiClient } from '../api/client';
import { useRouter, useSegments } from 'expo-router';

type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  emailVerified: boolean;
  isActive: boolean;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await authTokens.getToken();
        if (token) {
          const userData = await apiClient.get<User>('/auth/me');
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to load user', error);
        await authTokens.removeToken();
        await authTokens.removeRefreshToken();
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to login
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Redirect to main app
      router.replace('/(tabs)/routes');
    }
  }, [user, segments, isLoading]);

  const login = async (email: string, code: string) => {
    const data = await apiClient.post<{ accessToken: string; refreshToken: string; user: User }>('/auth/verify-code', {
      email,
      code,
    });
    
    await authTokens.setToken(data.accessToken);
    await authTokens.setRefreshToken(data.refreshToken);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout', {});
    } catch (e) {
      // Ignore
    }
    await authTokens.removeToken();
    await authTokens.removeRefreshToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
