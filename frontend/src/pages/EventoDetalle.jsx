import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventosService } from '../services/api.js';

export default function EventoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    eventosService.obtener(id)
      .then(r => setEvento(r.data))
      .catch(() => setError('Evento no encontrado.'))
      .finally(() => setCargando(false));
  }, [id]);

  const formatFechaLarga = (fecha) => {
    const d = new Date(fecha);
    return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&family=Barlow:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; }
        .det-page { font-family: 'Barlow', sans-serif; background: #0a0a0a; color: #f0f0f0; min-height: 100vh; }
        .det-nav { display: flex; align-items: center; justify-content: space-between; padding: 1.2rem 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .det-logo { font-family: 'Barlow Condensed', sans-serif; font-size: 1.8rem; font-weight: 900; cursor: pointer; }
        .det-logo span { color: #22c55e; }
        .det-nav-back { background: none; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; color: #aaa; font-family: 'Barlow', sans-serif; font-size: 0.9rem; padding: 0.5rem 1rem; border-radius: 6px; transition: all 0.2s; }
        .det-nav-back:hover { color: #fff; border-color: rgba(255,255,255,0.3); }
        .det-wrap { max-width: 860px; margin: 0 auto; padding: 3rem 2.5rem 5rem; }
        .det-deporte-badge { display: inline-block; font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 0.35rem 0.9rem; border-radius: 100px; background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.25); color: #22c55e; margin-bottom: 1.2rem; }
        .det-titulo { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 900; line-height: 0.95; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 2rem; }
        .det-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; overflow: hidden; margin-bottom: 2rem; }
        .det-info-item { background: #0a0a0a; padding: 1.5rem; }
        .det-info-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; color: #444; font-weight: 600; margin-bottom: 0.4rem; }
        .det-info-value { font-family: 'Barlow Condensed', sans-serif; font-size: 1.3rem; font-weight: 700; text-transform: capitalize; }
        .det-info-value.grande { font-size: 1.8rem; color: #22c55e; }
        .det-descripcion { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; color: #888; line-height: 1.7; font-size: 0.95rem; }
        .det-desc-title { font-family: 'Barlow Condensed', sans-serif; font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #555; margin-bottom: 0.7rem; }
        .det-cta { display: flex; align-items: center; justify-content: space-between; background: linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02)); border: 1px solid rgba(34,197,94,0.2); border-radius: 14px; padding: 1.8rem; gap: 1.5rem; }
        .det-precio { font-family: 'Barlow Condensed', sans-serif; font-size: 2.2rem; font-weight: 900; color: #22c55e; }
        .det-precio-sub { font-size: 0.8rem; color: #555; text-transform: uppercase; letter-spacing: 0.5px; }
        .det-btn-contactar { background: #22c55e; color: #000; border: none; cursor: pointer; font-family: 'Barlow Condensed', sans-serif; font-size: 1.1rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 1rem 2rem; border-radius: 10px; transition: background 0.2s, transform 0.1s; white-space: nowrap; }
        .det-btn-contactar:hover { background: #16a34a; transform: translateY(-1px); }
        .det-organizador { margin-top: 1.5rem; display: flex; align-items: center; gap: 0.8rem; color: #555; font-size: 0.9rem; }
        .det-org-avatar { width: 36px; height: 36px; border-radius: 50%; background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.2); display: flex; align-items: center; justify-content: center; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 1rem; color: #22c55e; flex-shrink: 0; }
        .det-center { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 1rem; color: #555; }
        .det-spinner { width: 24px; height: 24px; border: 2px solid rgba(34,197,94,0.2); border-top-color: #22c55e; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .det-error-icon { font-size: 3rem; }
        .det-error-title { font-family: 'Barlow Condensed', sans-serif; font-size: 1.8rem; font-weight: 700; text-transform: uppercase; color: #666; }
        .det-btn-volver { background: none; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; color: #aaa; font-family: 'Barlow', sans-serif; font-size: 0.9rem; padding: 0.6rem 1.2rem; border-radius: 8px; transition: all 0.2s; }
        .det-btn-volver:hover { color: #fff; }
        @media (max-width: 640px) { .det-nav { padding: 1rem 1.2rem; } .det-wrap { padding: 2rem 1.2rem 4rem; } .det-grid { grid-template-columns: 1fr; } .det-cta { flex-direction: column; } }
      `}</style>

      <div className="det-page">
        <nav className="det-nav">
          <div className="det-logo" onClick={() => navigate('/')}>Go<span>Venue</span></div>
          <button className="det-nav-back" onClick={() => navigate('/eventos')}>← Eventos</button>
        </nav>

        {cargando ? (
          <div className="det-center"><div className="det-spinner" /><span>Cargando evento...</span></div>
        ) : error ? (
          <div className="det-center">
            <div className="det-error-icon">⚠️</div>
            <div className="det-error-title">{error}</div>
            <button className="det-btn-volver" onClick={() => navigate('/eventos')}>Ver todos los eventos</button>
          </div>
        ) : (
          <div className="det-wrap">
            <div className="det-deporte-badge">{evento.deporte?.nombre}</div>
            <h1 className="det-titulo">{evento.titulo}</h1>
            <div className="det-grid">
              <div className="det-info-item"><div className="det-info-label">Fecha</div><div className="det-info-value">{formatFechaLarga(evento.fecha)}</div></div>
              <div className="det-info-item"><div className="det-info-label">Horario</div><div className="det-info-value">{evento.horaInicio} – {evento.horaFin}</div></div>
              <div className="det-info-item"><div className="det-info-label">Venue</div><div className="det-info-value">{evento.venue?.nombre}</div></div>
              <div className="det-info-item"><div className="det-info-label">Zona</div><div className="det-info-value">{evento.venue?.localidad?.nombre} · {evento.venue?.localidad?.zona}</div></div>
              <div className="det-info-item"><div className="det-info-label">Dirección</div><div className="det-info-value" style={{fontSize:'1rem'}}>{evento.venue?.direccion}</div></div>
              <div className="det-info-item"><div className="det-info-label">Cupos</div><div className="det-info-value grande">{evento.cupos}</div></div>
            </div>
            {evento.descripcion && (
              <div className="det-descripcion">
                <div className="det-desc-title">Descripción</div>
                {evento.descripcion}
              </div>
            )}
            <div className="det-cta">
              <div>
                <div className="det-precio">{evento.precio ? `$${Number(evento.precio).toLocaleString('es-AR')}` : 'Gratis'}</div>
                <div className="det-precio-sub">por persona · {evento.cupos} cupos disponibles</div>
              </div>
              <button className="det-btn-contactar">Contactar organizador →</button>
            </div>
            <div className="det-organizador">
              <div className="det-org-avatar">{evento.organizador?.nombre?.charAt(0).toUpperCase()}</div>
              <span>Organizado por <strong style={{color:'#f0f0f0'}}>{evento.organizador?.nombre}</strong></span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
