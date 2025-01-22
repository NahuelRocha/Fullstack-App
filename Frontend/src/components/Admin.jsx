import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { authService } from '../services/authService';

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      navigate('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Verificando acceso...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <h1 className="text-4xl font-bold">Bienvenido al Panel de Administrador</h1>
    </div>
  );
};

export default Admin;
