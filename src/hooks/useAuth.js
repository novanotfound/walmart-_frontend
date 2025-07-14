import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userProfile = localStorage.getItem('userProfile');
    
    if (token && userProfile) {
      setUser(JSON.parse(userProfile));
      setIsAuthenticated(true);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userProfile');
    setUser(null);
    setIsAuthenticated(false);
  };

  return { user, isAuthenticated, logout };
};
