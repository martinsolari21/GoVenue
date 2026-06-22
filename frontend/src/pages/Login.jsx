import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService, jugadoresService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [rol, setRol] = useState('jugador');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      let res;
      if (rol === 'jugador') {
        res = await jugadoresService.login(form);
        login(res.data.jugador, res.data.token, 'jugador');
        navigate('/mi-perfil');
      } else {
        res = await authService.login(form);
        login(res.data.organizador, res.data.token, 'organizador');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciales inválidas');
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&family=Barlow:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; }
        .login-page { font-family: 'Barlow', sans-serif; background: #0a0a0a; color: #f0f0f0; min-height: 100vh; display: flex; flex-direction: column; }
        .login-nav { display: flex; align-items: center; padding: 1.2rem 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .login-logo { font-family: 'Barlow Condensed', sans-serif; font-size: 1.8rem; font-weight: 900; cursor: pointer; }
        .login-logo span { color: #22c55e; }
        .login-center { flex: 1; display: flex; align-items: center; justify-content: center; padding: 3rem 1.5rem; }
        .login-box { width: 100%; max-width: 420px; }
        .login-title { font-family: 'Barlow Condensed', sans-serif; font-size: 3rem; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 0.3rem; }
        .login-title span { color: #22c55e; }
        .login-sub { color: #555; font-size: 0.95rem; margin-bottom: 2rem; }

        .login-rol-tabs { display: flex; gap: 2px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 3px; margin-bottom: 2rem; }
        .login-rol-tab { flex: 1; background: none; border: none; cursor: pointer; font-family: 'Barlow Condensed', sans-serif; font-size: 1rem; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: #555; padding: 0.6rem; border-radius: 8px; transition: all 0.2s; }
        .login-rol-tab.activo { background: #22c55e; color: #000; }
        .login-rol-tab:hover:not(.activo) { color: #fff; }

        .login-field { margin-bottom: 1.2rem; }
        .login-label { display: block; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1px; color: #555; font-weight: 600; margin-bottom: 0.4rem; }
        .login-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: #f0f0f0; font-family: 'Barlow', sans-serif; font-size: 1rem; padding: 0.85rem 1rem; border-radius: 10px; outline: none; transition: border-color 0.2s; }
        .login-input:focus { border-color: #22c55e; }
        .login-input::placeholder { color: #444; }
        .login-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #f87171; font-size: 0.9rem; padding: 0.8rem 1rem; border-radius: 8px; margin-bottom: 1.2rem; }
        .login-btn { width: 100%; background: #22c55e; color: #000; border: none; cursor: pointer; font-family: 'Barlow Condensed', sans-serif; font-size: 1.1rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 1rem; border-radius: 10px; transition: background 0.2s, transform 0.1s; margin-bottom: 1.5rem; }
        .login-btn:hover:not(:disabled) { background: #16a34a; transform: translateY(-1px); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .login-footer { text-align: center; color: #555; font-size: 0.9rem; }
        .login-link { color: #22c55e; text-decoration: none; font-weight: 600; }
        .login-link:hover { text-decoration: underline; }
      `}</style>
      <div className="login-page">
        <nav className="login-nav">
          <div className="login-logo" onClick={() => navigate('/')}>Go<span>Venue</span></div>
        </nav>
        <div className="login-center">
          <div className="login-box">
            <h1 className="login-title">Iniciar <span>sesión</span></h1>
            <p className="login-sub">Bienvenido de vuelta</p>

            <div className="login-rol-tabs">
              <button className={`login-rol-tab ${rol === 'jugador' ? 'activo' : ''}`} onClick={() => { setRol('jugador'); setError(null); }}>🏃 Jugador</button>
              <button className={`login-rol-tab ${rol === 'organizador' ? 'activo' : ''}`} onClick={() => { setRol('organizador'); setError(null); }}>🏟️ Organizador</button>
            </div>

            {error && <div className="login-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="login-field">
                <label className="login-label">Email</label>
                <input className="login-input" type="email" placeholder="tu@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              <div className="login-field">
                <label className="login-label">Contraseña</label>
                <input className="login-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
              </div>
              <button className="login-btn" disabled={cargando}>{cargando ? 'Ingresando...' : 'Ingresar →'}</button>
            </form>
            <div className="login-footer">
              ¿No tenés cuenta? <Link to="/register" className="login-link">Registrate gratis</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
