import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { eventosService, catalogoService } from '../services/api.js';

const ZONAS = ['Todas', 'CABA', 'GBA Norte', 'GBA Oeste', 'GBA Sur'];

export default function Eventos() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [eventos, setEventos] = useState([]);
  const [deportes, setDeportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [filtroDeporte, setFiltroDeporte] = useState(searchParams.get('deporte') || '');
  const [filtroZona, setFiltroZona] = useState('Todas');
  const [filtroFecha, setFiltroFecha] = useState('');

  useEffect(() => {
    catalogoService.deportes().then(r => setDeportes(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setCargando(true);
    setError(null);
    const params = {};
    if (filtroDeporte) params.deporte = filtroDeporte;
    if (filtroFecha) params.fecha = filtroFecha;

    eventosService.listar(params)
      .then(r => {
        let data = r.data;
        if (filtroZona !== 'Todas') {
          data = data.filter(e => e.venue?.localidad?.zona === filtroZona);
        }
        setEventos(data);
      })
      .catch(() => setError('No se pudieron cargar los eventos.'))
      .finally(() => setCargando(false));
  }, [filtroDeporte, filtroZona, filtroFecha]);

  const formatFecha = (fecha) => {
    const d = new Date(fecha);
    return d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&family=Barlow:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; }

        .ev-page { font-family: 'Barlow', sans-serif; background: #0a0a0a; color: #f0f0f0; min-height: 100vh; }

        /* NAV */
        .ev-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.2rem 2.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .ev-logo {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.8rem; font-weight: 900; cursor: pointer;
        }
        .ev-logo span { color: #22c55e; }
        .ev-nav-back {
          background: none; border: 1px solid rgba(255,255,255,0.1); cursor: pointer;
          color: #aaa; font-family: 'Barlow', sans-serif; font-size: 0.9rem;
          padding: 0.5rem 1rem; border-radius: 6px; transition: all 0.2s;
        }
        .ev-nav-back:hover { color: #fff; border-color: rgba(255,255,255,0.3); }

        /* HEADER */
        .ev-header {
          padding: 3rem 2.5rem 2rem;
          max-width: 1200px; margin: 0 auto;
        }
        .ev-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 3.5rem; font-weight: 900; text-transform: uppercase;
          letter-spacing: -1px; margin-bottom: 0.3rem;
        }
        .ev-title span { color: #22c55e; }
        .ev-subtitle { color: #555; font-size: 1rem; }

        /* FILTROS */
        .ev-filtros {
          max-width: 1200px; margin: 0 auto 2.5rem;
          padding: 0 2.5rem;
          display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;
        }
        .ev-filtro-group { display: flex; flex-direction: column; gap: 0.3rem; }
        .ev-filtro-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; color: #555; font-weight: 600; }
        .ev-select {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          color: #f0f0f0; font-family: 'Barlow', sans-serif; font-size: 0.9rem;
          padding: 0.6rem 1rem; border-radius: 8px; cursor: pointer;
          outline: none; transition: border-color 0.2s;
          appearance: none; min-width: 150px;
        }
        .ev-select:focus { border-color: #22c55e; }
        .ev-select option { background: #1a1a1a; }

        .ev-input-fecha {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          color: #f0f0f0; font-family: 'Barlow', sans-serif; font-size: 0.9rem;
          padding: 0.6rem 1rem; border-radius: 8px; outline: none;
          transition: border-color 0.2s; colorscheme: dark;
        }
        .ev-input-fecha:focus { border-color: #22c55e; }

        .ev-btn-limpiar {
          background: none; border: 1px solid rgba(255,255,255,0.08); cursor: pointer;
          color: #666; font-family: 'Barlow', sans-serif; font-size: 0.85rem;
          padding: 0.6rem 1rem; border-radius: 8px; align-self: flex-end;
          transition: all 0.2s;
        }
        .ev-btn-limpiar:hover { color: #fff; border-color: rgba(255,255,255,0.2); }

        /* RESULTADOS */
        .ev-resultados {
          max-width: 1200px; margin: 0 auto;
          padding: 0 2.5rem 4rem;
        }
        .ev-count {
          font-size: 0.8rem; color: #555; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .ev-count strong { color: #22c55e; }

        /* GRID */
        .ev-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; overflow: hidden;
        }

        /* CARD */
        .ev-card {
          background: #0a0a0a; padding: 1.8rem;
          cursor: pointer; transition: background 0.2s;
          display: flex; flex-direction: column; gap: 1rem;
        }
        .ev-card:hover { background: #111; }

        .ev-card-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .ev-deporte-badge {
          font-size: 0.7rem; font-weight: 700; letter-spacing: 1px;
          text-transform: uppercase; padding: 0.3rem 0.7rem;
          border-radius: 100px; background: rgba(34,197,94,0.12);
          border: 1px solid rgba(34,197,94,0.25); color: #22c55e;
        }
        .ev-fecha-badge {
          font-size: 0.75rem; color: #555;
          font-family: 'Barlow Condensed', sans-serif; font-weight: 600;
          letter-spacing: 0.5px;
        }

        .ev-card-titulo {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.4rem; font-weight: 700; line-height: 1.1;
          text-transform: uppercase; letter-spacing: 0.3px;
        }

        .ev-card-info { display: flex; flex-direction: column; gap: 0.4rem; }
        .ev-card-info-row {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 0.85rem; color: #666;
        }
        .ev-card-info-row .icon { font-size: 0.9rem; }

        .ev-card-footer {
          display: flex; justify-content: space-between; align-items: center;
          border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1rem;
          margin-top: auto;
        }
        .ev-cupos {
          font-size: 0.8rem; color: #555;
        }
        .ev-cupos strong { color: #f0f0f0; }
        .ev-ver-btn {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.85rem; font-weight: 700; letter-spacing: 0.5px;
          text-transform: uppercase; color: #22c55e;
        }

        /* EMPTY / LOADING */
        .ev-empty {
          text-align: center; padding: 5rem 2rem; color: #444;
          border: 1px solid rgba(255,255,255,0.06); border-radius: 16px;
        }
        .ev-empty-icon { font-size: 3rem; margin-bottom: 1rem; }
        .ev-empty-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.5rem; font-weight: 700; text-transform: uppercase;
          margin-bottom: 0.5rem; color: #666;
        }

        .ev-loading {
          display: flex; align-items: center; justify-content: center;
          gap: 0.5rem; padding: 4rem; color: #555;
        }
        .ev-spinner {
          width: 20px; height: 20px; border: 2px solid rgba(34,197,94,0.2);
          border-top-color: #22c55e; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .ev-nav { padding: 1rem 1.2rem; }
          .ev-header { padding: 2rem 1.2rem 1.5rem; }
          .ev-title { font-size: 2.5rem; }
          .ev-filtros { padding: 0 1.2rem; }
          .ev-resultados { padding: 0 1.2rem 3rem; }
          .ev-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ev-page">
        {/* NAV */}
        <nav className="ev-nav">
          <div className="ev-logo" onClick={() => navigate('/')}>Go<span>Venue</span></div>
          <button className="ev-nav-back" onClick={() => navigate('/')}>← Volver</button>
        </nav>

        {/* HEADER */}
        <div className="ev-header">
          <h1 className="ev-title">Eventos <span>disponibles</span></h1>
          <p className="ev-subtitle">Encontrá tu próximo partido en el AMBA</p>
        </div>

        {/* FILTROS */}
        <div className="ev-filtros">
          <div className="ev-filtro-group">
            <span className="ev-filtro-label">Deporte</span>
            <select className="ev-select" value={filtroDeporte} onChange={e => setFiltroDeporte(e.target.value)}>
              <option value="">Todos</option>
              {deportes.map(d => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
          </div>

          <div className="ev-filtro-group">
            <span className="ev-filtro-label">Zona</span>
            <select className="ev-select" value={filtroZona} onChange={e => setFiltroZona(e.target.value)}>
              {ZONAS.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>

          <div className="ev-filtro-group">
            <span className="ev-filtro-label">Fecha</span>
            <input
              type="date"
              className="ev-input-fecha"
              value={filtroFecha}
              onChange={e => setFiltroFecha(e.target.value)}
            />
          </div>

          {(filtroDeporte || filtroZona !== 'Todas' || filtroFecha) && (
            <button className="ev-btn-limpiar" onClick={() => { setFiltroDeporte(''); setFiltroZona('Todas'); setFiltroFecha(''); }}>
              Limpiar filtros
            </button>
          )}
        </div>

        {/* RESULTADOS */}
        <div className="ev-resultados">
          {cargando ? (
            <div className="ev-loading">
              <div className="ev-spinner" />
              Cargando eventos...
            </div>
          ) : error ? (
            <div className="ev-empty">
              <div className="ev-empty-icon">⚠️</div>
              <div className="ev-empty-title">{error}</div>
            </div>
          ) : eventos.length === 0 ? (
            <div className="ev-empty">
              <div className="ev-empty-icon">🔍</div>
              <div className="ev-empty-title">No hay eventos disponibles</div>
              <p>Probá cambiando los filtros o volvé más tarde.</p>
            </div>
          ) : (
            <>
              <p className="ev-count"><strong>{eventos.length}</strong> evento{eventos.length !== 1 ? 's' : ''} encontrado{eventos.length !== 1 ? 's' : ''}</p>
              <div className="ev-grid">
                {eventos.map(evento => (
                  <div key={evento.id} className="ev-card" onClick={() => navigate(`/eventos/${evento.id}`)}>
                    <div className="ev-card-top">
                      <span className="ev-deporte-badge">{evento.deporte?.nombre}</span>
                      <span className="ev-fecha-badge">{formatFecha(evento.fecha)}</span>
                    </div>
                    <div className="ev-card-titulo">{evento.titulo}</div>
                    <div className="ev-card-info">
                      <div className="ev-card-info-row">
                        <span className="icon">🕐</span>
                        {evento.horaInicio} – {evento.horaFin}
                      </div>
                      <div className="ev-card-info-row">
                        <span className="icon">📍</span>
                        {evento.venue?.nombre} · {evento.venue?.localidad?.nombre}
                      </div>
                      {evento.organizador && (
                        <div className="ev-card-info-row">
                          <span className="icon">👤</span>
                          {evento.organizador.nombre}
                        </div>
                      )}
                    </div>
                    <div className="ev-card-footer">
                      <span className="ev-cupos">
                        <strong>{evento.cupos}</strong> cupos · {evento.precio ? `$${evento.precio}` : 'Gratis'}
                      </span>
                      <span className="ev-ver-btn">Ver más →</span>
                    </div>
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
