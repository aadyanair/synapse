import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          // TODO: Verify token with backend
          // const response = await fetch('/api/auth/verify', {
          //   headers: { 'Authorization': `Bearer ${token}` }
          // });
          // const data = await response.json();
          // if (response.ok) {
          //   setUser(data.user);
          // } else {
          //   localStorage.removeItem('token');
          //   setToken(null);
          // }
        } catch (err) {
          console.error('Token verification failed', err);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
    };

    verifyToken();
  }, [token]);

  const login = async (email: string, _password: string) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();
      
      // Mock response for now
      const data = {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          email,
          name: email.split('@')[0]
        }
      };

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, _password: string) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, password })
      // });
      // const data = await response.json();
      
      // Mock response for now
      const data = {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          email,
          name
        }
      };

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
