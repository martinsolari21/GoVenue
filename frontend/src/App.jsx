import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Home from './pages/Home.jsx';
import Eventos from './pages/Eventos.jsx';
import EventoDetalle from './pages/EventoDetalle.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DashboardJugador from './pages/DashboardJugador.jsx';
import PerfilOrganizador from './pages/PerfilOrganizador.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

function RutaProtegida({ children, rolRequerido }) {
  const { usuario, rol, cargando } = useAuth();
  if (cargando) return null;
  if (!usuario) return <Navigate to="/login" replace />;
  if (rolRequerido && rol !== rolRequerido) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/eventos/:id" element={<EventoDetalle />} />
        <Route path="/organizador/:id" element={<PerfilOrganizador />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas de jugador */}
        <Route path="/mi-perfil" element={
          <RutaProtegida rolRequerido="jugador">
            <DashboardJugador />
          </RutaProtegida>
        } />

        {/* Rutas de organizador */}
        <Route path="/dashboard/*" element={
          <RutaProtegida rolRequerido="organizador">
            <Dashboard />
          </RutaProtegida>
        } />
      </Routes>
    </AuthProvider>
  );
}
