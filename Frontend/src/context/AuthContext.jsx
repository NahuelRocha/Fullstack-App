import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { authService } from '../services/authService';

// Crear el contexto de autenticación
export const AuthContext = createContext(null);

// Proveedor de contexto para manejar la autenticación
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    const token = await authService.login(username, password);
    setIsAuthenticated(true);
    return token;
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    setIsAuthenticated, // Asegúrate de incluir `setIsAuthenticated` en el contexto
  };

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
};

// Definir los PropTypes para el AuthProvider
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
