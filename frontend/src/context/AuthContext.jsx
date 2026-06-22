import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null); // 'jugador' | 'organizador'
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('govenue_token');
    const data = localStorage.getItem('govenue_usuario');
    const rolGuardado = localStorage.getItem('govenue_rol');
    if (token && data && rolGuardado) {
      setUsuario(JSON.parse(data));
      setRol(rolGuardado);
    }
    setCargando(false);
  }, []);

  const login = (data, token, rolUsuario) => {
    localStorage.setItem('govenue_token', token);
    localStorage.setItem('govenue_usuario', JSON.stringify(data));
    localStorage.setItem('govenue_rol', rolUsuario);
    setUsuario(data);
    setRol(rolUsuario);
  };

  const logout = () => {
    localStorage.removeItem('govenue_token');
    localStorage.removeItem('govenue_usuario');
    localStorage.removeItem('govenue_rol');
    // Compatibilidad con keys viejas
    localStorage.removeItem('govenue_organizador');
    setUsuario(null);
    setRol(null);
  };

  // Compatibilidad con código que usa organizador
  const organizador = rol === 'organizador' ? usuario : null;
  const jugador = rol === 'jugador' ? usuario : null;

  return (
    <AuthContext.Provider value={{ usuario, rol, organizador, jugador, cargando, login, logout }}>
      {!cargando && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
