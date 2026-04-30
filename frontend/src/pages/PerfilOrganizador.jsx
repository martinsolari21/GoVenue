import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventosService } from '../services/api.js';
import api from '../services/api.js';

export default function PerfilOrganizador() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/api/organizadores/${id}`)
      .then(r => {
        setPerfil(r.data.organizador);
        setEventos(r.data.eventos);
      })
      .catch(() => setError('Organizador no encontrado.'))
      .finally(() => setCargando(false));
  }, [id]);

  const formatFecha = (f) => new Date(f).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&family=Barlow:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; }
        .perf-page { font-family: 'Barlow', sans-serif; background: #0a0a0a; color: #f0f0f0; min-height: 100vh; }
        .perf-nav { display: flex; align-items: center; justify-content: space-between; padding: 1.2rem 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .perf-logo { font-family: 'Barlow Condensed', sans-serif; font-size: 1.8rem; font-weight: 900; cursor: pointer; }
        .perf-logo span { color: #22c55e; }
        .perf-nav-back { background: none; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; color: #aaa; font-family: 'Barlow', sans-serif; font-size: 0.9rem; padding: 0.5rem 1rem; border-radius: 6px; transition: all 0.2s; }
        .perf-nav-back:hover { color: #fff; border-color: rgba(255,255,255,0.3); }

        .perf-wrap { max-width: 900px; margin: 0 auto; padding: 3rem 2.5rem 5rem; }

        /* HEADER PERFIL */
        .perf-header { display: flex; align-items: center; gap: 2rem; margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .perf-avatar { width: 80px; height: 80px; border-radius: 50%; background: rgba(34,197,94,0.12); border: 2px solid rgba(34,197,94,0.3); display: flex; align-items: center; justify-content: center; font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-size: 2.2rem; color: #22c55e; flex-shrink: 0; }
        .perf-info { flex: 1; }
        .perf-nombre { font-family: 'Barlow Condensed', sans-serif; font-size: 2.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 0.3rem; }
        .perf-badge { display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); color: #22c55e; font-size: 0.75rem; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; padding: 0.3rem 0.8rem; border-radius: 100px; }
        .perf-badge::before { content: '●'; font-size: 0.4rem; }

        /* STATS */
        .perf-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; overflow: hidden; margin-bottom: 3rem; }
        .perf-stat { background: #0a0a0a; padding: 1.2rem 1.5rem; }
        .perf-stat-num { font-family: 'Barlow Condensed', sans-serif; font-size: 2rem; font-weight: 900; color: #22c55e; }
        .perf-stat-label { font-size: 0.75rem; color: #555; text-transform: uppercase; letter-spacing: 0.5px; }

        /* EVENTOS */
        .perf-section-title { font-family: 'Barlow Condensed', sans-serif; font-size: 1.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: -0.5px; margin-bottom: 1.2rem; }
        .perf-section-title span { color: #22c55e; }

        .perf-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; overflow: hidden; }
        .perf-card { background: #0a0a0a; padding: 1.5rem; cursor: pointer; transition: background 0.2s; display: flex; flex-direction: column; gap: 0.8rem; }
        .perf-card:hover { background: #111; }
        .perf-card-top { display: flex; justify-content: space-between; align-items: center; }
        .perf-deporte { font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 0.25rem 0.6rem; border-radius: 100px; background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.25); color: #22c55e; }
        .perf-fecha { font-size: 0.75rem; color: #555; font-family: 'Barlow Condensed', sans-serif; font-weight: 600; }
        .perf-card-titulo { font-family: 'Barlow Condensed', sans-serif; font-size: 1.2rem; font-weight: 700; text-transform: uppercase; line-height: 1.1; }
        .perf-card-meta { font-size: 0.82rem; color: #555; }
        .perf-card-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.8rem; margin-top: auto; }
        .perf-precio { font-size: 0.85rem; color: #aaa; }
        .perf-ver { font-family: 'Barlow Condensed', sans-serif; font-size: 0.85rem; font-weight: 700; color: #22c55e; text-transform: uppercase; }

        .perf-empty { text-align: center; padding: 3rem; color: #444; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; }

        .perf-center { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 1rem; color: #555; }
        .perf-spinner { width: 24px; height: 24px; border: 2px solid rgba(34,197,94,0.2); border-top-color: #22c55e; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 640px) {
          .perf-nav { padding: 1rem 1.2rem; }
          .perf-wrap { padding: 2rem 1.2rem 4rem; }
          .perf-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .perf-stats { grid-template-columns: 1fr; }
          .perf-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="perf-page">
        <nav className="perf-nav">
          <div className="perf-logo" onClick={() => navigate('/')}>Go<span>Venue</span></div>
          <button className="perf-nav-back" onClick={() => navigate(-1)}>← Volver</button>
        </nav>

        {cargando ? (
          <div className="perf-center"><div className="perf-spinner" /><span>Cargando perfil...</span></div>
        ) : error ? (
          <div className="perf-center">
            <div style={{fontSize:'3rem'}}>⚠️</div>
            <div style={{fontFamily:'Barlow Condensed',fontSize:'1.8rem',fontWeight:700,textTransform:'uppercase',color:'#666'}}>{error}</div>
            <button style={{background:'none',border:'1px solid rgba(255,255,255,0.1)',cursor:'pointer',color:'#aaa',padding:'0.6rem 1.2rem',borderRadius:'8px'}} onClick={() => navigate('/eventos')}>Ver eventos</button>
          </div>
        ) : (
          <div className="perf-wrap">
            <div className="perf-header">
              <div className="perf-avatar">{perfil?.nombre?.charAt(0).toUpperCase()}</div>
              <div className="perf-info">
                <div className="perf-nombre">{perfil?.nombre}</div>
                <div className="perf-badge">Organizador verificado</div>
              </div>
            </div>

            <div className="perf-stats">
              <div className="perf-stat">
                <div className="perf-stat-num">{eventos.length}</div>
                <div className="perf-stat-label">Eventos publicados</div>
              </div>
              <div className="perf-stat">
                <div className="perf-stat-num">{[...new Set(eventos.map(e => e.deporte?.nombre))].length}</div>
                <div className="perf-stat-label">Deportes</div>
              </div>
              <div className="perf-stat">
                <div className="perf-stat-num">{eventos.reduce((acc, e) => acc + (e.vistas || 0), 0)}</div>
                <div className="perf-stat-label">Vistas totales</div>
              </div>
            </div>

            <div className="perf-section-title">Eventos <span>publicados</span></div>

            {eventos.length === 0 ? (
              <div className="perf-empty">Este organizador todavía no tiene eventos publicados.</div>
            ) : (
              <div className="perf-grid">
                {eventos.map(ev => (
                  <div key={ev.id} className="perf-card" onClick={() => navigate(`/eventos/${ev.id}`)}>
                    <div className="perf-card-top">
                      <span className="perf-deporte">{ev.deporte?.nombre}</span>
                      <span className="perf-fecha">{formatFecha(ev.fecha)}</span>
                    </div>
                    <div className="perf-card-titulo">{ev.titulo}</div>
                    <div className="perf-card-meta">📍 {ev.venue?.nombre} · {ev.venue?.localidad?.nombre}</div>
                    <div className="perf-card-footer">
                      <span className="perf-precio">{ev.precio ? `$${Number(ev.precio).toLocaleString('es-AR')}` : 'Gratis'} · {ev.cupos} cupos</span>
                      <span className="perf-ver">Ver →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
