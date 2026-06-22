import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { jugadoresService, inscripcionesService } from '../services/api.js';

const ESTADO_COLORS = {
  INSCRIPTO: { bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)', color: '#22c55e', label: 'Inscripto' },
  LISTA_ESPERA: { bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.3)', color: '#fbbf24', label: 'Lista de espera' },
  CANCELADO: { bg: 'rgba(107,114,128,0.12)', border: 'rgba(107,114,128,0.3)', color: '#9ca3af', label: 'Cancelado' },
};

export default function DashboardJugador() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const [inscripciones, setInscripciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cancelando, setCancelando] = useState(null);

  useEffect(() => {
    jugadoresService.misInscripciones()
      .then(r => setInscripciones(r.data))
      .finally(() => setCargando(false));
  }, []);

  const handleCancelar = async (eventoId) => {
    if (!confirm('¿Cancelar tu inscripción a este evento?')) return;
    setCancelando(eventoId);
    try {
      await inscripcionesService.cancelar(eventoId);
      setInscripciones(prev => prev.map(i =>
        i.evento.id === eventoId ? { ...i, estado: 'CANCELADO' } : i
      ));
    } catch (err) {
      alert(err.response?.data?.error || 'Error al cancelar');
    } finally {
      setCancelando(null);
    }
  };

  const formatFecha = (f) => new Date(f).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  const activas = inscripciones.filter(i => i.estado !== 'CANCELADO');
  const pasadas = inscripciones.filter(i => i.estado === 'CANCELADO');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&family=Barlow:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; }
        .dj-page { font-family: 'Barlow', sans-serif; background: #0a0a0a; color: #f0f0f0; min-height: 100vh; }
        .dj-nav { display: flex; align-items: center; justify-content: space-between; padding: 1.2rem 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .dj-logo { font-family: 'Barlow Condensed', sans-serif; font-size: 1.8rem; font-weight: 900; cursor: pointer; }
        .dj-logo span { color: #22c55e; }
        .dj-nav-right { display: flex; align-items: center; gap: 1rem; }
        .dj-user { font-size: 0.9rem; color: #555; }
        .dj-user strong { color: #f0f0f0; }
        .dj-btn-logout { background: none; border: 1px solid rgba(255,255,255,0.08); cursor: pointer; color: #666; font-family: 'Barlow', sans-serif; font-size: 0.85rem; padding: 0.45rem 0.9rem; border-radius: 6px; transition: all 0.2s; }
        .dj-btn-logout:hover { color: #fff; }

        .dj-wrap { max-width: 900px; margin: 0 auto; padding: 2.5rem 2rem 5rem; }

        .dj-header { margin-bottom: 2.5rem; }
        .dj-title { font-family: 'Barlow Condensed', sans-serif; font-size: 2.8rem; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 0.3rem; }
        .dj-title span { color: #22c55e; }
        .dj-sub { color: #555; font-size: 0.95rem; }

        /* STATS */
        .dj-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; overflow: hidden; margin-bottom: 2.5rem; }
        .dj-stat { background: #0a0a0a; padding: 1.2rem 1.5rem; }
        .dj-stat-num { font-family: 'Barlow Condensed', sans-serif; font-size: 2rem; font-weight: 900; color: #22c55e; }
        .dj-stat-label { font-size: 0.75rem; color: #555; text-transform: uppercase; letter-spacing: 0.5px; }

        .dj-section-title { font-family: 'Barlow Condensed', sans-serif; font-size: 1.3rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 1rem; color: #888; }

        /* INSCRIPCIONES */
        .dj-list { display: flex; flex-direction: column; gap: 1px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; overflow: hidden; margin-bottom: 2rem; }
        .dj-item { background: #0a0a0a; padding: 1.4rem 1.8rem; display: flex; align-items: center; gap: 1.2rem; transition: background 0.2s; }
        .dj-item:hover { background: #111; }
        .dj-item-info { flex: 1; cursor: pointer; }
        .dj-item-titulo { font-family: 'Barlow Condensed', sans-serif; font-size: 1.2rem; font-weight: 700; text-transform: uppercase; margin-bottom: 0.25rem; }
        .dj-item-meta { font-size: 0.82rem; color: #555; }
        .dj-item-fecha { font-size: 0.78rem; color: #444; margin-top: 0.15rem; }
        .dj-badge { font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 0.3rem 0.7rem; border-radius: 100px; white-space: nowrap; flex-shrink: 0; }
        .dj-btn-cancelar { background: none; border: 1px solid rgba(239,68,68,0.2); cursor: pointer; color: #f87171; font-family: 'Barlow Condensed', sans-serif; font-size: 0.82rem; font-weight: 700; text-transform: uppercase; padding: 0.35rem 0.8rem; border-radius: 6px; transition: all 0.2s; white-space: nowrap; flex-shrink: 0; }
        .dj-btn-cancelar:hover { background: rgba(239,68,68,0.08); }
        .dj-btn-cancelar:disabled { opacity: 0.4; cursor: not-allowed; }

        .dj-empty { text-align: center; padding: 3rem 2rem; color: #444; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; margin-bottom: 2rem; }
        .dj-empty-icon { font-size: 2.5rem; margin-bottom: 0.8rem; }
        .dj-empty-title { font-family: 'Barlow Condensed', sans-serif; font-size: 1.3rem; font-weight: 700; text-transform: uppercase; margin-bottom: 0.5rem; color: #555; }
        .dj-btn-explorar { background: #22c55e; color: #000; border: none; cursor: pointer; font-family: 'Barlow Condensed', sans-serif; font-size: 1rem; font-weight: 700; text-transform: uppercase; padding: 0.75rem 1.8rem; border-radius: 8px; margin-top: 1rem; transition: background 0.2s; }
        .dj-btn-explorar:hover { background: #16a34a; }

        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .dj-nav { padding: 1rem 1.2rem; }
          .dj-wrap { padding: 2rem 1.2rem 4rem; }
          .dj-stats { grid-template-columns: 1fr; }
          .dj-item { flex-wrap: wrap; }
        }
      `}</style>

      <div className="dj-page">
        <nav className="dj-nav">
          <div className="dj-logo" onClick={() => navigate('/')}>Go<span>Venue</span></div>
          <div className="dj-nav-right">
            <span className="dj-user">Hola, <strong>{usuario?.nombre}</strong></span>
            <button className="dj-btn-logout" onClick={() => { logout(); navigate('/'); }}>Cerrar sesión</button>
          </div>
        </nav>

        <div className="dj-wrap">
          <div className="dj-header">
            <h1 className="dj-title">Mis <span>eventos</span></h1>
            <p className="dj-sub">Tus inscripciones activas y tu historial</p>
          </div>

          <div className="dj-stats">
            <div className="dj-stat">
              <div className="dj-stat-num">{inscripciones.filter(i => i.estado === 'INSCRIPTO').length}</div>
              <div className="dj-stat-label">Inscripto</div>
            </div>
            <div className="dj-stat">
              <div className="dj-stat-num">{inscripciones.filter(i => i.estado === 'LISTA_ESPERA').length}</div>
              <div className="dj-stat-label">En espera</div>
            </div>
            <div className="dj-stat">
              <div className="dj-stat-num">{inscripciones.length}</div>
              <div className="dj-stat-label">Totales</div>
            </div>
          </div>

          {cargando ? (
            <div style={{textAlign:'center', padding:'3rem', color:'#555'}}>Cargando...</div>
          ) : activas.length === 0 ? (
            <div className="dj-empty">
              <div className="dj-empty-icon">🏃</div>
              <div className="dj-empty-title">Todavía no te inscribiste a ningún evento</div>
              <p>Explorá los eventos disponibles y anotate en el que más te guste.</p>
              <button className="dj-btn-explorar" onClick={() => navigate('/eventos')}>Ver eventos disponibles →</button>
            </div>
          ) : (
            <>
              <div className="dj-section-title">Inscripciones activas</div>
              <div className="dj-list">
                {activas.map(i => {
                  const est = ESTADO_COLORS[i.estado];
                  return (
                    <div key={i.id} className="dj-item">
                      <div className="dj-item-info" onClick={() => navigate(`/eventos/${i.evento.id}`)}>
                        <div className="dj-item-titulo">{i.evento.titulo}</div>
                        <div className="dj-item-meta">{i.evento.deporte?.nombre} · {i.evento.venue?.nombre} · {i.evento.horaInicio}–{i.evento.horaFin}</div>
                        <div className="dj-item-fecha">{formatFecha(i.evento.fecha)}</div>
                      </div>
                      <span className="dj-badge" style={{background: est.bg, border: `1px solid ${est.border}`, color: est.color}}>{est.label}</span>
                      <button className="dj-btn-cancelar" disabled={cancelando === i.evento.id} onClick={() => handleCancelar(i.evento.id)}>
                        {cancelando === i.evento.id ? '...' : 'Cancelar'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {pasadas.length > 0 && (
            <>
              <div className="dj-section-title" style={{marginTop:'1rem'}}>Historial</div>
              <div className="dj-list">
                {pasadas.map(i => (
                  <div key={i.id} className="dj-item" style={{opacity:0.5}}>
                    <div className="dj-item-info" onClick={() => navigate(`/eventos/${i.evento.id}`)}>
                      <div className="dj-item-titulo">{i.evento.titulo}</div>
                      <div className="dj-item-meta">{i.evento.deporte?.nombre} · {i.evento.venue?.nombre}</div>
                    </div>
                    <span className="dj-badge" style={{background: ESTADO_COLORS.CANCELADO.bg, border: `1px solid ${ESTADO_COLORS.CANCELADO.border}`, color: ESTADO_COLORS.CANCELADO.color}}>Cancelado</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
