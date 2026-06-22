import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService, jugadoresService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const PROVINCIAS = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
  'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
  'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan',
  'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero',
  'Tierra del Fuego', 'Tucumán',
];

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [rol, setRol] = useState(null); // 'jugador' | 'organizador'
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmar: '', telefono: '', ciudad: '', provincia: 'Buenos Aires' });
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirmar) return setError('Las contraseñas no coinciden');
    if (form.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres');
    setCargando(true);
    try {
      let res;
      if (rol === 'jugador') {
        res = await jugadoresService.register({
          nombre: form.nombre, email: form.email, password: form.password,
          telefono: form.telefono, ciudad: form.ciudad, provincia: form.provincia,
        });
        login(res.data.jugador, res.data.token, 'jugador');
        navigate('/mi-perfil');
      } else {
        res = await authService.register({ nombre: form.nombre, email: form.email, password: form.password });
        login(res.data.organizador, res.data.token, 'organizador');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
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
        .reg-page { font-family: 'Barlow', sans-serif; background: #0a0a0a; color: #f0f0f0; min-height: 100vh; display: flex; flex-direction: column; }
        .reg-nav { display: flex; align-items: center; padding: 1.2rem 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .reg-logo { font-family: 'Barlow Condensed', sans-serif; font-size: 1.8rem; font-weight: 900; cursor: pointer; }
        .reg-logo span { color: #22c55e; }
        .reg-center { flex: 1; display: flex; align-items: center; justify-content: center; padding: 3rem 1.5rem; }
        .reg-box { width: 100%; max-width: 460px; }
        .reg-title { font-family: 'Barlow Condensed', sans-serif; font-size: 3rem; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 0.3rem; }
        .reg-title span { color: #22c55e; }
        .reg-sub { color: #555; font-size: 0.95rem; margin-bottom: 2rem; }

        /* ROL SELECTOR */
        .reg-roles { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 2rem; }
        .reg-rol-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.4rem 1rem; cursor: pointer; transition: all 0.2s; text-align: center; }
        .reg-rol-card:hover { border-color: rgba(34,197,94,0.3); }
        .reg-rol-card.activo { background: rgba(34,197,94,0.08); border-color: #22c55e; }
        .reg-rol-icon { font-size: 2rem; margin-bottom: 0.5rem; }
        .reg-rol-title { font-family: 'Barlow Condensed', sans-serif; font-size: 1.1rem; font-weight: 700; text-transform: uppercase; margin-bottom: 0.25rem; }
        .reg-rol-card.activo .reg-rol-title { color: #22c55e; }
        .reg-rol-desc { font-size: 0.78rem; color: #555; line-height: 1.4; }

        .reg-field { margin-bottom: 1rem; }
        .reg-label { display: block; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1px; color: #555; font-weight: 600; margin-bottom: 0.4rem; }
        .reg-input, .reg-select { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: #f0f0f0; font-family: 'Barlow', sans-serif; font-size: 1rem; padding: 0.85rem 1rem; border-radius: 10px; outline: none; transition: border-color 0.2s; }
        .reg-input:focus, .reg-select:focus { border-color: #22c55e; }
        .reg-input::placeholder { color: #444; }
        .reg-select { appearance: none; cursor: pointer; }
        .reg-select option { background: #1a1a1a; }
        .reg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
        .reg-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #f87171; font-size: 0.9rem; padding: 0.8rem 1rem; border-radius: 8px; margin-bottom: 1rem; }
        .reg-btn { width: 100%; background: #22c55e; color: #000; border: none; cursor: pointer; font-family: 'Barlow Condensed', sans-serif; font-size: 1.1rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 1rem; border-radius: 10px; transition: background 0.2s, transform 0.1s; margin-top: 0.5rem; margin-bottom: 1.5rem; }
        .reg-btn:hover:not(:disabled) { background: #16a34a; transform: translateY(-1px); }
        .reg-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .reg-footer { text-align: center; color: #555; font-size: 0.9rem; }
        .reg-link { color: #22c55e; text-decoration: none; font-weight: 600; }
        .reg-link:hover { text-decoration: underline; }
        .reg-divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 1.5rem 0; }
      `}</style>
      <div className="reg-page">
        <nav className="reg-nav">
          <div className="reg-logo" onClick={() => navigate('/')}>Go<span>Venue</span></div>
        </nav>
        <div className="reg-center">
          <div className="reg-box">
            <h1 className="reg-title">Crear <span>cuenta</span></h1>
            <p className="reg-sub">¿Cómo vas a usar GoVenue?</p>

            <div className="reg-roles">
              <div className={`reg-rol-card ${rol === 'jugador' ? 'activo' : ''}`} onClick={() => setRol('jugador')}>
                <div className="reg-rol-icon">🏃</div>
                <div className="reg-rol-title">Jugador</div>
                <div className="reg-rol-desc">Buscá eventos y anotate en los que te gusten</div>
              </div>
              <div className={`reg-rol-card ${rol === 'organizador' ? 'activo' : ''}`} onClick={() => setRol('organizador')}>
                <div className="reg-rol-icon">🏟️</div>
                <div className="reg-rol-title">Organizador</div>
                <div className="reg-rol-desc">Creá y publicá eventos deportivos</div>
              </div>
            </div>

            {rol && (
              <>
                {error && <div className="reg-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="reg-field">
                    <label className="reg-label">Nombre completo *</label>
                    <input className="reg-input" type="text" placeholder="Tu nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
                  </div>
                  <div className="reg-field">
                    <label className="reg-label">Email *</label>
                    <input className="reg-input" type="email" placeholder="tu@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                  </div>

                  {rol === 'jugador' && (
                    <>
                      <div className="reg-field">
                        <label className="reg-label">Teléfono</label>
                        <input className="reg-input" type="tel" placeholder="Ej: 11 1234-5678" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} />
                      </div>
                      <div className="reg-row">
                        <div className="reg-field">
                          <label className="reg-label">Ciudad</label>
                          <input className="reg-input" type="text" placeholder="Ej: Buenos Aires" value={form.ciudad} onChange={e => setForm({...form, ciudad: e.target.value})} />
                        </div>
                        <div className="reg-field">
                          <label className="reg-label">Provincia</label>
                          <select className="reg-select" value={form.provincia} onChange={e => setForm({...form, provincia: e.target.value})}>
                            {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="reg-row">
                    <div className="reg-field">
                      <label className="reg-label">Contraseña *</label>
                      <input className="reg-input" type="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                    </div>
                    <div className="reg-field">
                      <label className="reg-label">Confirmar *</label>
                      <input className="reg-input" type="password" placeholder="Repetí la contraseña" value={form.confirmar} onChange={e => setForm({...form, confirmar: e.target.value})} required />
                    </div>
                  </div>

                  <button className="reg-btn" disabled={cargando}>
                    {cargando ? 'Creando cuenta...' : `Crear cuenta como ${rol === 'jugador' ? 'jugador' : 'organizador'} →`}
                  </button>
                </form>
              </>
            )}

            <div className="reg-footer">
              ¿Ya tenés cuenta? <Link to="/login" className="reg-link">Iniciá sesión</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
