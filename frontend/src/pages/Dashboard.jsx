import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { eventosService, venuesService, catalogoService } from '../services/api.js';

const ESTADO_COLORS = {
  BORRADOR: { bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.3)', color: '#fbbf24' },
  PUBLICADO: { bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)', color: '#22c55e' },
  CANCELADO: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', color: '#f87171' },
  FINALIZADO: { bg: 'rgba(107,114,128,0.12)', border: 'rgba(107,114,128,0.3)', color: '#9ca3af' },
};

const FORM_INICIAL = {
  titulo: '', descripcion: '', fecha: '', horaInicio: '', horaFin: '',
  cupos: '', precio: '', deporteId: '', venueId: '',
  nuevoVenueNombre: '', nuevoVenueDireccion: '', nuevoVenueLocalidadId: '',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { organizador, logout } = useAuth();
  const [tab, setTab] = useState('eventos');
  const [eventos, setEventos] = useState([]);
  const [venues, setVenues] = useState([]);
  const [deportes, setDeportes] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [form, setForm] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState(null);
  const [creandoVenue, setCreandoVenue] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);

  useEffect(() => {
    Promise.all([
      eventosService.misEventos(),
      venuesService.listar(),
      catalogoService.deportes(),
      catalogoService.localidades(),
    ]).then(([ev, vn, dep, loc]) => {
      setEventos(ev.data);
      setVenues(vn.data);
      setDeportes(dep.data);
      setLocalidades(loc.data);
    }).finally(() => setCargando(false));
  }, []);

  const handleGuardar = async (e) => {
    e.preventDefault();
    setError(null); setExito(null); setGuardando(true);
    try {
      let venueId = form.venueId;
      if (creandoVenue) {
        const v = await venuesService.crear({
          nombre: form.nuevoVenueNombre,
          direccion: form.nuevoVenueDireccion,
          localidadId: form.nuevoVenueLocalidadId,
        });
        venueId = v.data.id;
        setVenues(prev => [...prev, v.data]);
      }

      if (editandoId) {
        const updated = await eventosService.editar(editandoId, {
          titulo: form.titulo, descripcion: form.descripcion,
          fecha: form.fecha, horaInicio: form.horaInicio, horaFin: form.horaFin,
          cupos: form.cupos, precio: form.precio || null,
        });
        setEventos(prev => prev.map(e => e.id === editandoId ? updated.data : e));
        setExito('Evento actualizado correctamente.');
      } else {
        const nuevo = await eventosService.crear({
          titulo: form.titulo, descripcion: form.descripcion,
          fecha: form.fecha, horaInicio: form.horaInicio, horaFin: form.horaFin,
          cupos: form.cupos, precio: form.precio || null,
          deporteId: form.deporteId, venueId,
        });
        setEventos(prev => [nuevo.data, ...prev]);
        setExito('¡Evento creado! Está en borrador — publicalo cuando quieras.');
      }

      setForm(FORM_INICIAL);
      setEditandoId(null);
      setCreandoVenue(false);
      setTab('eventos');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el evento');
    } finally {
      setGuardando(false);
    }
  };

  const handleEditar = (ev) => {
    setEditandoId(ev.id);
    setForm({
      titulo: ev.titulo, descripcion: ev.descripcion || '',
      fecha: ev.fecha?.split('T')[0] || '',
      horaInicio: ev.horaInicio, horaFin: ev.horaFin,
      cupos: ev.cupos, precio: ev.precio || '',
      deporteId: ev.deporteId, venueId: ev.venueId,
      nuevoVenueNombre: '', nuevoVenueDireccion: '', nuevoVenueLocalidadId: '',
    });
    setCreandoVenue(false);
    setError(null); setExito(null);
    setTab('crear');
  };

  const handleCancelarEvento = async (id) => {
    if (!confirm('¿Cancelar este evento?')) return;
    try {
      const updated = await eventosService.editar(id, { estado: 'CANCELADO' });
      setEventos(prev => prev.map(e => e.id === id ? updated.data : e));
    } catch {}
  };

  const handlePublicar = async (id) => {
    try {
      const updated = await eventosService.editar(id, { estado: 'PUBLICADO' });
      setEventos(prev => prev.map(e => e.id === id ? updated.data : e));
    } catch {}
  };

  const handleLogout = () => { logout(); navigate('/'); };
  const formatFecha = (f) => new Date(f).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });

  // Stats
  const totalEventos = eventos.length;
  const publicados = eventos.filter(e => e.estado === 'PUBLICADO').length;
  const totalVistas = eventos.reduce((acc, e) => acc + (e.vistas || 0), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&family=Barlow:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; }
        .db-page { font-family: 'Barlow', sans-serif; background: #0a0a0a; color: #f0f0f0; min-height: 100vh; }
        .db-nav { display: flex; align-items: center; justify-content: space-between; padding: 1.2rem 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .db-logo { font-family: 'Barlow Condensed', sans-serif; font-size: 1.8rem; font-weight: 900; cursor: pointer; }
        .db-logo span { color: #22c55e; }
        .db-nav-right { display: flex; align-items: center; gap: 1rem; }
        .db-org-name { font-size: 0.9rem; color: #555; }
        .db-org-name strong { color: #f0f0f0; }
        .db-btn-logout { background: none; border: 1px solid rgba(255,255,255,0.08); cursor: pointer; color: #666; font-family: 'Barlow', sans-serif; font-size: 0.85rem; padding: 0.45rem 0.9rem; border-radius: 6px; transition: all 0.2s; }
        .db-btn-logout:hover { color: #fff; border-color: rgba(255,255,255,0.2); }
        .db-wrap { max-width: 1000px; margin: 0 auto; padding: 2.5rem 2rem 5rem; }
        .db-header { margin-bottom: 2rem; }
        .db-title { font-family: 'Barlow Condensed', sans-serif; font-size: 2.8rem; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 1.5rem; }
        .db-title span { color: #22c55e; }

        /* STATS */
        .db-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; overflow: hidden; margin-bottom: 2rem; }
        .db-stat { background: #0a0a0a; padding: 1.2rem 1.5rem; }
        .db-stat-num { font-family: 'Barlow Condensed', sans-serif; font-size: 2.2rem; font-weight: 900; color: #22c55e; }
        .db-stat-label { font-size: 0.75rem; color: #555; text-transform: uppercase; letter-spacing: 0.5px; }

        .db-tabs { display: flex; gap: 2px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 3px; margin-bottom: 2.5rem; width: fit-content; }
        .db-tab { background: none; border: none; cursor: pointer; font-family: 'Barlow Condensed', sans-serif; font-size: 1rem; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: #555; padding: 0.55rem 1.4rem; border-radius: 8px; transition: all 0.2s; }
        .db-tab.activo { background: #22c55e; color: #000; }
        .db-tab:hover:not(.activo) { color: #fff; }

        .db-msg { padding: 0.9rem 1rem; border-radius: 8px; margin-bottom: 1.5rem; font-size: 0.9rem; }
        .db-msg.error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #f87171; }
        .db-msg.exito { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25); color: #22c55e; }

        .db-empty { text-align: center; padding: 4rem 2rem; color: #444; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; }
        .db-empty-icon { font-size: 2.5rem; margin-bottom: 1rem; }
        .db-empty-title { font-family: 'Barlow Condensed', sans-serif; font-size: 1.5rem; font-weight: 700; text-transform: uppercase; margin-bottom: 0.5rem; color: #555; }
        .db-btn-crear-empty { background: #22c55e; color: #000; border: none; cursor: pointer; font-family: 'Barlow Condensed', sans-serif; font-size: 1rem; font-weight: 700; text-transform: uppercase; padding: 0.8rem 1.8rem; border-radius: 8px; margin-top: 1rem; transition: background 0.2s; }
        .db-btn-crear-empty:hover { background: #16a34a; }

        .db-eventos-list { display: flex; flex-direction: column; gap: 1px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; overflow: hidden; }
        .db-evento-row { background: #0a0a0a; padding: 1.4rem 1.8rem; display: flex; align-items: center; gap: 1.2rem; transition: background 0.2s; }
        .db-evento-row:hover { background: #111; }
        .db-evento-info { flex: 1; }
        .db-evento-titulo { font-family: 'Barlow Condensed', sans-serif; font-size: 1.2rem; font-weight: 700; text-transform: uppercase; margin-bottom: 0.25rem; }
        .db-evento-meta { font-size: 0.82rem; color: #555; }
        .db-evento-vistas { font-size: 0.78rem; color: #444; margin-top: 0.2rem; }
        .db-evento-vistas span { color: #22c55e; font-weight: 600; }
        .db-estado-badge { font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 0.3rem 0.7rem; border-radius: 100px; white-space: nowrap; }
        .db-acciones { display: flex; gap: 0.5rem; flex-shrink: 0; }
        .db-btn-accion { background: none; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; font-family: 'Barlow Condensed', sans-serif; font-size: 0.82rem; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; padding: 0.35rem 0.8rem; border-radius: 6px; transition: all 0.2s; white-space: nowrap; }
        .db-btn-accion.publicar { color: #22c55e; border-color: rgba(34,197,94,0.3); }
        .db-btn-accion.publicar:hover { background: rgba(34,197,94,0.1); }
        .db-btn-accion.editar { color: #aaa; }
        .db-btn-accion.editar:hover { color: #fff; border-color: rgba(255,255,255,0.3); }
        .db-btn-accion.cancelar { color: #f87171; border-color: rgba(239,68,68,0.2); }
        .db-btn-accion.cancelar:hover { background: rgba(239,68,68,0.08); }

        /* FORM */
        .db-form-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
        .db-form-titulo { font-family: 'Barlow Condensed', sans-serif; font-size: 1.5rem; font-weight: 700; text-transform: uppercase; }
        .db-form-titulo span { color: #22c55e; }
        .db-form { display: flex; flex-direction: column; gap: 1.2rem; }
        .db-form-section { font-family: 'Barlow Condensed', sans-serif; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #444; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); margin-top: 0.5rem; }
        .db-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .db-field { display: flex; flex-direction: column; gap: 0.4rem; }
        .db-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1px; color: #555; font-weight: 600; }
        .db-input, .db-select, .db-textarea { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: #f0f0f0; font-family: 'Barlow', sans-serif; font-size: 0.95rem; padding: 0.75rem 0.9rem; border-radius: 8px; outline: none; transition: border-color 0.2s; width: 100%; }
        .db-input:focus, .db-select:focus, .db-textarea:focus { border-color: #22c55e; }
        .db-input::placeholder, .db-textarea::placeholder { color: #444; }
        .db-select { appearance: none; cursor: pointer; }
        .db-select option { background: #1a1a1a; }
        .db-textarea { resize: vertical; min-height: 80px; }
        .db-input[type="date"], .db-input[type="time"] { colorscheme: dark; }
        .db-venue-toggle { display: flex; align-items: center; gap: 0.8rem; }
        .db-toggle-btn { background: none; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; color: #888; font-family: 'Barlow', sans-serif; font-size: 0.82rem; padding: 0.4rem 0.8rem; border-radius: 6px; transition: all 0.2s; }
        .db-toggle-btn:hover, .db-toggle-btn.activo { color: #22c55e; border-color: rgba(34,197,94,0.3); }
        .db-venue-nuevo { background: rgba(34,197,94,0.04); border: 1px solid rgba(34,197,94,0.15); border-radius: 10px; padding: 1.2rem; display: flex; flex-direction: column; gap: 1rem; }
        .db-form-actions { display: flex; gap: 1rem; padding-top: 0.5rem; }
        .db-btn-submit { background: #22c55e; color: #000; border: none; cursor: pointer; font-family: 'Barlow Condensed', sans-serif; font-size: 1.1rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 0.9rem 2.2rem; border-radius: 10px; transition: background 0.2s, transform 0.1s; }
        .db-btn-submit:hover:not(:disabled) { background: #16a34a; transform: translateY(-1px); }
        .db-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .db-btn-cancel { background: none; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; color: #666; font-family: 'Barlow', sans-serif; font-size: 0.95rem; padding: 0.9rem 1.5rem; border-radius: 10px; transition: all 0.2s; }
        .db-btn-cancel:hover { color: #fff; }
        .db-spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(0,0,0,0.2); border-top-color: #000; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 0.5rem; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .db-nav { padding: 1rem 1.2rem; }
          .db-wrap { padding: 2rem 1.2rem 4rem; }
          .db-form-row { grid-template-columns: 1fr; }
          .db-stats { grid-template-columns: 1fr; }
          .db-acciones { flex-wrap: wrap; }
        }
      `}</style>

      <div className="db-page">
        <nav className="db-nav">
          <div className="db-logo" onClick={() => navigate('/')}>Go<span>Venue</span></div>
          <div className="db-nav-right">
            <span className="db-org-name">Hola, <strong>{organizador?.nombre}</strong></span>
            <button className="db-btn-logout" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </nav>

        <div className="db-wrap">
          <div className="db-header">
            <h1 className="db-title">Mi <span>panel</span></h1>
            <div className="db-stats">
              <div className="db-stat">
                <div className="db-stat-num">{totalEventos}</div>
                <div className="db-stat-label">Eventos totales</div>
              </div>
              <div className="db-stat">
                <div className="db-stat-num">{publicados}</div>
                <div className="db-stat-label">Publicados</div>
              </div>
              <div className="db-stat">
                <div className="db-stat-num">{totalVistas}</div>
                <div className="db-stat-label">Vistas totales</div>
              </div>
            </div>
          </div>

          <div className="db-tabs">
            <button className={`db-tab ${tab === 'eventos' ? 'activo' : ''}`} onClick={() => { setTab('eventos'); setEditandoId(null); setForm(FORM_INICIAL); }}>Mis eventos</button>
            <button className={`db-tab ${tab === 'crear' ? 'activo' : ''}`} onClick={() => { setTab('crear'); setEditandoId(null); setForm(FORM_INICIAL); setError(null); setExito(null); }}>+ Crear evento</button>
          </div>

          {error && <div className="db-msg error">{error}</div>}
          {exito && <div className="db-msg exito">{exito}</div>}

          {/* TAB EVENTOS */}
          {tab === 'eventos' && (
            cargando ? (
              <div style={{textAlign:'center', padding:'3rem', color:'#555'}}>Cargando...</div>
            ) : eventos.length === 0 ? (
              <div className="db-empty">
                <div className="db-empty-icon">🏟️</div>
                <div className="db-empty-title">Todavía no creaste eventos</div>
                <p>Publicá tu primer partido y llegá a más jugadores.</p>
                <button className="db-btn-crear-empty" onClick={() => setTab('crear')}>Crear mi primer evento →</button>
              </div>
            ) : (
              <div className="db-eventos-list">
                {eventos.map(ev => {
                  const est = ESTADO_COLORS[ev.estado] || ESTADO_COLORS.BORRADOR;
                  return (
                    <div key={ev.id} className="db-evento-row">
                      <div className="db-evento-info">
                        <div className="db-evento-titulo">{ev.titulo}</div>
                        <div className="db-evento-meta">{ev.deporte?.nombre} · {formatFecha(ev.fecha)} · {ev.horaInicio}–{ev.horaFin} · {ev.venue?.nombre}</div>
                        <div className="db-evento-vistas">👁 <span>{ev.vistas || 0}</span> vistas</div>
                      </div>
                      <span className="db-estado-badge" style={{background: est.bg, border: `1px solid ${est.border}`, color: est.color}}>{ev.estado}</span>
                      <div className="db-acciones">
                        {ev.estado === 'BORRADOR' && (
                          <button className="db-btn-accion publicar" onClick={() => handlePublicar(ev.id)}>Publicar</button>
                        )}
                        {(ev.estado === 'BORRADOR' || ev.estado === 'PUBLICADO') && (
                          <button className="db-btn-accion editar" onClick={() => handleEditar(ev)}>Editar</button>
                        )}
                        {ev.estado !== 'CANCELADO' && ev.estado !== 'FINALIZADO' && (
                          <button className="db-btn-accion cancelar" onClick={() => handleCancelarEvento(ev.id)}>Cancelar</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* TAB CREAR / EDITAR */}
          {tab === 'crear' && (
            <>
              <div className="db-form-header">
                <div className="db-form-titulo">{editandoId ? <>Editar <span>evento</span></> : <>Nuevo <span>evento</span></>}</div>
              </div>
              <form className="db-form" onSubmit={handleGuardar}>
                <div className="db-form-section">Información del evento</div>
                <div className="db-field">
                  <label className="db-label">Título *</label>
                  <input className="db-input" type="text" placeholder="Ej: Partido de fútbol 5 vs 5" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} required />
                </div>
                <div className="db-field">
                  <label className="db-label">Descripción</label>
                  <textarea className="db-textarea" placeholder="Contá más sobre el evento..." value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
                </div>
                <div className="db-form-row">
                  <div className="db-field">
                    <label className="db-label">Deporte *</label>
                    <select className="db-select" value={form.deporteId} onChange={e => setForm({...form, deporteId: e.target.value})} required disabled={!!editandoId}>
                      <option value="">Seleccioná...</option>
                      {deportes.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                    </select>
                  </div>
                  <div className="db-field">
                    <label className="db-label">Cupos *</label>
                    <input className="db-input" type="number" min="1" placeholder="Ej: 10" value={form.cupos} onChange={e => setForm({...form, cupos: e.target.value})} required />
                  </div>
                </div>
                <div className="db-form-row">
                  <div className="db-field">
                    <label className="db-label">Fecha *</label>
                    <input className="db-input" type="date" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} required />
                  </div>
                  <div className="db-field">
                    <label className="db-label">Precio (vacío = gratis)</label>
                    <input className="db-input" type="number" min="0" placeholder="$0" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} />
                  </div>
                </div>
                <div className="db-form-row">
                  <div className="db-field">
                    <label className="db-label">Hora inicio *</label>
                    <input className="db-input" type="time" value={form.horaInicio} onChange={e => setForm({...form, horaInicio: e.target.value})} required />
                  </div>
                  <div className="db-field">
                    <label className="db-label">Hora fin *</label>
                    <input className="db-input" type="time" value={form.horaFin} onChange={e => setForm({...form, horaFin: e.target.value})} required />
                  </div>
                </div>

                {!editandoId && (
                  <>
                    <div className="db-form-section">Venue</div>
                    <div className="db-venue-toggle">
                      <button type="button" className={`db-toggle-btn ${!creandoVenue ? 'activo' : ''}`} onClick={() => setCreandoVenue(false)}>Elegir existente</button>
                      <button type="button" className={`db-toggle-btn ${creandoVenue ? 'activo' : ''}`} onClick={() => setCreandoVenue(true)}>+ Crear nuevo venue</button>
                    </div>
                    {!creandoVenue ? (
                      <div className="db-field">
                        <label className="db-label">Venue *</label>
                        <select className="db-select" value={form.venueId} onChange={e => setForm({...form, venueId: e.target.value})} required={!creandoVenue}>
                          <option value="">Seleccioná un venue...</option>
                          {venues.map(v => <option key={v.id} value={v.id}>{v.nombre} — {v.localidad?.nombre}</option>)}
                        </select>
                      </div>
                    ) : (
                      <div className="db-venue-nuevo">
                        <div className="db-field">
                          <label className="db-label">Nombre del venue *</label>
                          <input className="db-input" type="text" placeholder="Ej: Canchas Los Pinos" value={form.nuevoVenueNombre} onChange={e => setForm({...form, nuevoVenueNombre: e.target.value})} required={creandoVenue} />
                        </div>
                        <div className="db-field">
                          <label className="db-label">Dirección *</label>
                          <input className="db-input" type="text" placeholder="Ej: Av. Corrientes 1234" value={form.nuevoVenueDireccion} onChange={e => setForm({...form, nuevoVenueDireccion: e.target.value})} required={creandoVenue} />
                        </div>
                        <div className="db-field">
                          <label className="db-label">Localidad *</label>
                          <select className="db-select" value={form.nuevoVenueLocalidadId} onChange={e => setForm({...form, nuevoVenueLocalidadId: e.target.value})} required={creandoVenue}>
                            <option value="">Seleccioná...</option>
                            {localidades.map(l => <option key={l.id} value={l.id}>{l.nombre} ({l.zona})</option>)}
                          </select>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="db-form-actions">
                  <button type="submit" className="db-btn-submit" disabled={guardando}>
                    {guardando && <span className="db-spinner" />}
                    {guardando ? 'Guardando...' : editandoId ? 'Guardar cambios →' : 'Crear evento →'}
                  </button>
                  <button type="button" className="db-btn-cancel" onClick={() => { setForm(FORM_INICIAL); setEditandoId(null); setTab('eventos'); }}>Cancelar</button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
