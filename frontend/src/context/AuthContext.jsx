import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [organizador, setOrganizador] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('govenue_token');
    const data = localStorage.getItem('govenue_organizador');
    if (token && data) setOrganizador(JSON.parse(data));
    setCargando(false);
  }, []);

  const login = (data, token) => {
    localStorage.setItem('govenue_token', token);
    localStorage.setItem('govenue_organizador', JSON.stringify(data));
    setOrganizador(data);
  };

  const logout = () => {
    localStorage.removeItem('govenue_token');
    localStorage.removeItem('govenue_organizador');
    setOrganizador(null);
  };

  return (
    <AuthContext.Provider value={{ organizador, cargando, login, logout }}>
      {!cargando && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
