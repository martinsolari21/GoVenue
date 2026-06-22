import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventosService, inscripcionesService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function EventoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario, rol } = useAuth();

  const [evento, setEvento] = useState(null);
  const [inscripcion, setInscripcion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [inscribiendo, setInscribiendo] = useState(false);
  const [msgInscripcion, setMsgInscripcion] = useState(null);

  // Modal contacto
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    eventosService.obtener(id)
      .then(r => setEvento(r.data))
      .catch(() => setError('Evento no encontrado.'))
      .finally(() => setCargando(false));
  }, [id]);

  // Si es jugador, verificar si ya está inscripto
  useEffect(() => {
    if (rol === 'jugador' && usuario && evento) {
      import('../services/api.js').then(({ jugadoresService }) => {
        jugadoresService.misInscripciones().then(r => {
          const found = r.data.find(i => i.evento.id === evento.id);
          if (found) setInscripcion(found);
        }).catch(() => {});
      });
    }
  }, [rol, usuario, evento]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setModalAbierto(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const formatFechaLarga = (f) => new Date(f).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const cuposOcupados = evento?._count?.inscripciones || 0;
  const cuposLibres = evento ? evento.cupos - cuposOcupados : 0;
  const lleno = cuposLibres <= 0;
  const porcentajeOcupado = evento ? Math.round((cuposOcupados / evento.cupos) * 100) : 0;

  const handleInscribirse = async () => {
    if (!usuario) return navigate('/login');
    if (rol !== 'jugador') return navigate('/login');
    setInscribiendo(true);
    setMsgInscripcion(null);
    try {
      const res = await inscripcionesService.inscribirse(evento.id);
      setInscripcion({ estado: res.data.estado });
      setMsgInscripcion(
        res.data.estado === 'INSCRIPTO'
          ? '✅ ¡Te inscribiste al evento!'
          : '⏳ Estás en lista de espera. Te avisamos si se libera un lugar.'
      );
      // Actualizar cupos en UI
      setEvento(prev => ({
        ...prev,
        _count: { inscripciones: (prev._count?.inscripciones || 0) + 1 }
      }));
    } catch (err) {
      setMsgInscripcion('❌ ' + (err.response?.data?.error || 'Error al inscribirse'));
    } finally {
      setInscribiendo(false);
    }
  };

  const handleCancelarInscripcion = async () => {
    if (!confirm('¿Cancelar tu inscripción a este evento?')) return;
    setInscribiendo(true);
    try {
      await inscripcionesService.cancelar(evento.id);
      setInscripcion({ estado: 'CANCELADO' });
      setMsgInscripcion('Inscripción cancelada.');
      setEvento(prev => ({
        ...prev,
        _count: { inscripciones: Math.max(0, (prev._count?.inscripciones || 1) - 1) }
      }));
    } catch (err) {
      setMsgInscripcion('❌ ' + (err.response?.data?.error || 'Error al cancelar'));
    } finally {
      setInscribiendo(false);
    }
  };

  const handleEnviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    await new Promise(r => setTimeout(r, 1200));
    setEnviando(false);
    setEnviado(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setEnviado(false);
    setForm({ nombre: '', email: '', mensaje: '' });
  };

  const renderBotonInscripcion = () => {
    if (rol === 'organizador') return null;

    if (inscripcion?.estado === 'INSCRIPTO') {
      return (
        <div style={{display:'flex', flexDirection:'column', gap:'0.5rem', alignItems:'flex-end'}}>
          <span style={{background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.3)', color:'#22c55e', padding:'0.5rem 1rem', borderRadius:'8px', fontSize:'0.85rem', fontWeight:700}}>
            ✅ Inscripto
          </span>
          <button className="det-btn-cancelar" onClick={handleCancelarInscripcion} disabled={inscribiendo}>
            Cancelar inscripción
          </button>
        </div>
      );
    }

    if (inscripcion?.estado === 'LISTA_ESPERA') {
      return (
        <div style={{display:'flex', flexDirection:'column', gap:'0.5rem', alignItems:'flex-end'}}>
          <span style={{background:'rgba(234,179,8,0.12)', border:'1px solid rgba(234,179,8,0.3)', color:'#fbbf24', padding:'0.5rem 1rem', borderRadius:'8px', fontSize:'0.85rem', fontWeight:700}}>
            ⏳ En lista de espera
          </span>
          <button className="det-btn-cancelar" onClick={handleCancelarInscripcion} disabled={inscribiendo}>
            Salir de lista
          </button>
        </div>
      );
    }

    if (!usuario) {
      return (
        <button className="det-btn-contactar" onClick={() => navigate('/login')}>
          Iniciar sesión para inscribirme →
        </button>
      );
    }

    return (
      <button className="det-btn-contactar" onClick={handleInscribirse} disabled={inscribiendo}>
        {inscribiendo ? 'Procesando...' : lleno ? 'Anotarme en lista de espera →' : 'Inscribirme →'}
      </button>
    );
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

        /* BARRA DE CUPOS */
        .det-cupos-wrap { margin-bottom: 2rem; }
        .det-cupos-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
        .det-cupos-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #555; font-weight: 600; }
        .det-cupos-num { font-size: 0.85rem; color: #aaa; }
        .det-cupos-num span { color: #22c55e; font-weight: 700; }
        .det-barra { height: 6px; background: rgba(255,255,255,0.08); border-radius: 100px; overflow: hidden; }
        .det-barra-fill { height: 100%; border-radius: 100px; transition: width 0.5s ease; }

        .det-descripcion { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; color: #888; line-height: 1.7; font-size: 0.95rem; }
        .det-desc-title { font-family: 'Barlow Condensed', sans-serif; font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #555; margin-bottom: 0.7rem; }

        .det-cta { display: flex; align-items: center; justify-content: space-between; background: linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02)); border: 1px solid rgba(34,197,94,0.2); border-radius: 14px; padding: 1.8rem; gap: 1.5rem; }
        .det-precio { font-family: 'Barlow Condensed', sans-serif; font-size: 2.2rem; font-weight: 900; color: #22c55e; }
        .det-precio-sub { font-size: 0.8rem; color: #555; text-transform: uppercase; letter-spacing: 0.5px; }
        .det-btn-contactar { background: #22c55e; color: #000; border: none; cursor: pointer; font-family: 'Barlow Condensed', sans-serif; font-size: 1.1rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 1rem 2rem; border-radius: 10px; transition: background 0.2s, transform 0.1s; white-space: nowrap; }
        .det-btn-contactar:hover:not(:disabled) { background: #16a34a; transform: translateY(-1px); }
        .det-btn-contactar:disabled { opacity: 0.6; cursor: not-allowed; }
        .det-btn-cancelar { background: none; border: 1px solid rgba(239,68,68,0.3); color: #f87171; cursor: pointer; font-family: 'Barlow', sans-serif; font-size: 0.82rem; padding: 0.4rem 0.8rem; border-radius: 6px; transition: all 0.2s; }
        .det-btn-cancelar:hover { background: rgba(239,68,68,0.08); }
        .det-btn-cancelar:disabled { opacity: 0.5; cursor: not-allowed; }

        .det-msg-inscripcion { padding: 0.85rem 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.9rem; background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2); color: #22c55e; }

        .det-organizador { margin-top: 1.5rem; display: flex; align-items: center; gap: 0.8rem; color: #555; font-size: 0.9rem; cursor: pointer; }
        .det-organizador:hover .det-org-nombre { text-decoration: underline; }
        .det-org-avatar { width: 36px; height: 36px; border-radius: 50%; background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.2); display: flex; align-items: center; justify-content: center; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 1rem; color: #22c55e; flex-shrink: 0; }
        .det-org-nombre { color: #22c55e; font-weight: 600; }

        .det-btn-secundario { background: none; border: 1px solid rgba(255,255,255,0.12); cursor: pointer; color: #888; font-family: 'Barlow', sans-serif; font-size: 0.85rem; padding: 0.5rem 1rem; border-radius: 8px; margin-top: 1rem; transition: all 0.2s; display: block; }
        .det-btn-secundario:hover { color: #fff; border-color: rgba(255,255,255,0.3); }

        .det-center { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 1rem; color: #555; }
        .det-spinner { width: 24px; height: 24px; border: 2px solid rgba(34,197,94,0.2); border-top-color: #22c55e; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* MODAL */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 1.5rem; animation: fadeIn 0.15s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-box { background: #111; border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; padding: 2rem; width: 100%; max-width: 480px; animation: slideUp 0.2s ease; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .modal-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; }
        .modal-title { font-family: 'Barlow Condensed', sans-serif; font-size: 1.8rem; font-weight: 900; text-transform: uppercase; letter-spacing: -0.5px; }
        .modal-title span { color: #22c55e; }
        .modal-close { background: none; border: none; cursor: pointer; color: #555; font-size: 1.4rem; line-height: 1; padding: 0.2rem; transition: color 0.2s; }
        .modal-close:hover { color: #fff; }
        .modal-evento { background: rgba(255,255,255,0.04); border-radius: 8px; padding: 0.8rem 1rem; margin-bottom: 1.5rem; font-size: 0.85rem; color: #666; }
        .modal-evento strong { color: #f0f0f0; display: block; font-size: 0.95rem; margin-bottom: 0.15rem; }
        .modal-field { margin-bottom: 1rem; }
        .modal-label { display: block; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1px; color: #555; font-weight: 600; margin-bottom: 0.4rem; }
        .modal-input, .modal-textarea { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: #f0f0f0; font-family: 'Barlow', sans-serif; font-size: 0.95rem; padding: 0.75rem 0.9rem; border-radius: 8px; outline: none; transition: border-color 0.2s; }
        .modal-input:focus, .modal-textarea:focus { border-color: #22c55e; }
        .modal-input::placeholder, .modal-textarea::placeholder { color: #444; }
        .modal-textarea { resize: vertical; min-height: 100px; }
        .modal-btn { width: 100%; background: #22c55e; color: #000; border: none; cursor: pointer; font-family: 'Barlow Condensed', sans-serif; font-size: 1.1rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 0.9rem; border-radius: 10px; transition: background 0.2s; margin-top: 0.5rem; }
        .modal-btn:hover:not(:disabled) { background: #16a34a; }
        .modal-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .modal-spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(0,0,0,0.2); border-top-color: #000; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 0.5rem; }
        .modal-exito { text-align: center; padding: 1rem 0; }
        .modal-exito-icon { font-size: 3rem; margin-bottom: 1rem; }
        .modal-exito-title { font-family: 'Barlow Condensed', sans-serif; font-size: 1.8rem; font-weight: 900; text-transform: uppercase; margin-bottom: 0.5rem; color: #22c55e; }
        .modal-exito-sub { color: #666; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem; }
        .modal-btn-cerrar { background: none; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; color: #aaa; font-family: 'Barlow', sans-serif; font-size: 0.95rem; padding: 0.7rem 1.5rem; border-radius: 8px; transition: all 0.2s; }
        .modal-btn-cerrar:hover { color: #fff; }

        @media (max-width: 640px) {
          .det-nav { padding: 1rem 1.2rem; }
          .det-wrap { padding: 2rem 1.2rem 4rem; }
          .det-grid { grid-template-columns: 1fr; }
          .det-cta { flex-direction: column; }
        }
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
            <div style={{fontSize:'3rem'}}>⚠️</div>
            <div style={{fontFamily:'Barlow Condensed',fontSize:'1.8rem',fontWeight:700,textTransform:'uppercase',color:'#666'}}>{error}</div>
            <button className="det-nav-back" onClick={() => navigate('/eventos')}>Ver todos los eventos</button>
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
              <div className="det-info-item"><div className="det-info-label">Cupos</div><div className="det-info-value grande">{cuposLibres > 0 ? cuposLibres : '0'} <span style={{fontSize:'1rem',color:'#555'}}>disponibles</span></div></div>
            </div>

            {/* BARRA DE CUPOS */}
            <div className="det-cupos-wrap">
              <div className="det-cupos-header">
                <span className="det-cupos-label">Ocupación del evento</span>
                <span className="det-cupos-num"><span>{cuposOcupados}</span>/{evento.cupos} inscriptos</span>
              </div>
              <div className="det-barra">
                <div className="det-barra-fill" style={{
                  width: `${porcentajeOcupado}%`,
                  background: porcentajeOcupado >= 90 ? '#ef4444' : porcentajeOcupado >= 60 ? '#f59e0b' : '#22c55e'
                }} />
              </div>
            </div>

            {evento.descripcion && (
              <div className="det-descripcion">
                <div className="det-desc-title">Descripción</div>
                {evento.descripcion}
              </div>
            )}

            {msgInscripcion && (
              <div className="det-msg-inscripcion">{msgInscripcion}</div>
            )}

            <div className="det-cta">
              <div>
                <div className="det-precio">{evento.precio ? `$${Number(evento.precio).toLocaleString('es-AR')}` : 'Gratis'}</div>
                <div className="det-precio-sub">por persona · {lleno ? 'Sin cupos — hay lista de espera' : `${cuposLibres} cupos disponibles`}</div>
              </div>
              {renderBotonInscripcion()}
            </div>

            {/* Botón contactar (siempre disponible) */}
            {rol !== 'organizador' && (
              <button className="det-btn-secundario" onClick={() => setModalAbierto(true)}>
                💬 Contactar al organizador directamente
              </button>
            )}

            <div className="det-organizador" onClick={() => navigate(`/organizador/${evento.organizadorId}`)}>
              <div className="det-org-avatar">{evento.organizador?.nombre?.charAt(0).toUpperCase()}</div>
              <span>Organizado por <span className="det-org-nombre">{evento.organizador?.nombre}</span></span>
            </div>
          </div>
        )}
      </div>

      {/* MODAL CONTACTO */}
      {modalAbierto && evento && (
        <div className="modal-overlay" onClick={(e) => { if (e.target.classList.contains('modal-overlay')) handleCerrarModal(); }}>
          <div className="modal-box">
            {enviado ? (
              <div className="modal-exito">
                <div className="modal-exito-icon">✅</div>
                <div className="modal-exito-title">¡Mensaje enviado!</div>
                <p className="modal-exito-sub">Le avisamos a <strong>{evento.organizador?.nombre}</strong> que querés sumarte.</p>
                <button className="modal-btn-cerrar" onClick={handleCerrarModal}>Cerrar</button>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <div className="modal-title">Contactar <span>organizador</span></div>
                  <button className="modal-close" onClick={handleCerrarModal}>✕</button>
                </div>
                <div className="modal-evento">
                  <strong>{evento.titulo}</strong>
                  {evento.deporte?.nombre} · {evento.venue?.nombre} · {evento.horaInicio}–{evento.horaFin}
                </div>
                <form onSubmit={handleEnviar}>
                  <div className="modal-field">
                    <label className="modal-label">Tu nombre *</label>
                    <input className="modal-input" type="text" placeholder="Nombre y apellido" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
                  </div>
                  <div className="modal-field">
                    <label className="modal-label">Tu email *</label>
                    <input className="modal-input" type="email" placeholder="tu@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                  </div>
                  <div className="modal-field">
                    <label className="modal-label">Mensaje *</label>
                    <textarea className="modal-textarea" placeholder={`Hola ${evento.organizador?.nombre}, me interesa sumarme...`} value={form.mensaje} onChange={e => setForm({...form, mensaje: e.target.value})} required />
                  </div>
                  <button className="modal-btn" disabled={enviando}>
                    {enviando && <span className="modal-spinner" />}
                    {enviando ? 'Enviando...' : 'Enviar mensaje →'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
