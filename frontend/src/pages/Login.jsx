import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      const res = await authService.login(form);
      login(res.data.organizador, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
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
        .auth-page { font-family: 'Barlow', sans-serif; background: #0a0a0a; color: #f0f0f0; min-height: 100vh; display: flex; flex-direction: column; }
        .auth-nav { display: flex; align-items: center; padding: 1.2rem 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .auth-logo { font-family: 'Barlow Condensed', sans-serif; font-size: 1.8rem; font-weight: 900; cursor: pointer; }
        .auth-logo span { color: #22c55e; }
        .auth-center { flex: 1; display: flex; align-items: center; justify-content: center; padding: 3rem 1.5rem; }
        .auth-box { width: 100%; max-width: 420px; }
        .auth-title { font-family: 'Barlow Condensed', sans-serif; font-size: 3rem; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 0.3rem; }
        .auth-title span { color: #22c55e; }
        .auth-sub { color: #555; font-size: 0.95rem; margin-bottom: 2.5rem; }
        .auth-field { margin-bottom: 1.2rem; }
        .auth-label { display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #555; font-weight: 600; margin-bottom: 0.5rem; }
        .auth-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: #f0f0f0; font-family: 'Barlow', sans-serif; font-size: 1rem; padding: 0.85rem 1rem; border-radius: 10px; outline: none; transition: border-color 0.2s; }
        .auth-input:focus { border-color: #22c55e; }
        .auth-input::placeholder { color: #444; }
        .auth-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #f87171; font-size: 0.9rem; padding: 0.8rem 1rem; border-radius: 8px; margin-bottom: 1.2rem; }
        .auth-btn { width: 100%; background: #22c55e; color: #000; border: none; cursor: pointer; font-family: 'Barlow Condensed', sans-serif; font-size: 1.1rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 1rem; border-radius: 10px; transition: background 0.2s, transform 0.1s; margin-bottom: 1.5rem; }
        .auth-btn:hover:not(:disabled) { background: #16a34a; transform: translateY(-1px); }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .auth-footer { text-align: center; color: #555; font-size: 0.9rem; }
        .auth-link { color: #22c55e; text-decoration: none; font-weight: 600; }
        .auth-link:hover { text-decoration: underline; }
      `}</style>
      <div className="auth-page">
        <nav className="auth-nav">
          <div className="auth-logo" onClick={() => navigate('/')}>Go<span>Venue</span></div>
        </nav>
        <div className="auth-center">
          <div className="auth-box">
            <h1 className="auth-title">Iniciar <span>sesión</span></h1>
            <p className="auth-sub">Accedé a tu panel de organizador</p>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label className="auth-label">Email</label>
                <input className="auth-input" type="email" placeholder="tu@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              <div className="auth-field">
                <label className="auth-label">Contraseña</label>
                <input className="auth-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
              </div>
              <button className="auth-btn" disabled={cargando}>{cargando ? 'Ingresando...' : 'Ingresar →'}</button>
            </form>
            <div className="auth-footer">
              ¿No tenés cuenta? <Link to="/register" className="auth-link">Registrate gratis</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}