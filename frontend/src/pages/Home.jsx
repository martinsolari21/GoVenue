import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const DEPORTES = [
  { nombre: 'Fútbol', emoji: '⚽', id: 1 },
  { nombre: 'Pádel', emoji: '🎾', id: 2 },
  { nombre: 'Tenis', emoji: '🎾', id: 3 },
  { nombre: 'Hockey', emoji: '🏑', id: 4 },
  { nombre: 'Básquet', emoji: '🏀', id: 5 },
];

export default function Home() {
  const navigate = useNavigate();
  const { organizador } = useAuth();
  const [deporteSeleccionado, setDeporteSeleccionado] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  const handleBuscar = () => {
    const params = deporteSeleccionado ? `?deporte=${deporteSeleccionado}` : '';
    navigate(`/eventos${params}`);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&family=Barlow:wght@400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #0a0a0a; }

        .gv-home {
          font-family: 'Barlow', sans-serif;
          background: #0a0a0a;
          color: #f0f0f0;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* NAV */
        .gv-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.2rem 2.5rem;
          background: rgba(10,10,10,0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .gv-logo {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.8rem; font-weight: 900; letter-spacing: -0.5px;
          color: #fff;
        }
        .gv-logo span { color: #22c55e; }
        .gv-nav-links { display: flex; gap: 1rem; align-items: center; }
        .gv-nav-link {
          background: none; border: none; cursor: pointer;
          color: #aaa; font-family: 'Barlow', sans-serif;
          font-size: 0.95rem; font-weight: 500;
          padding: 0.5rem 1rem; border-radius: 6px;
          transition: color 0.2s;
        }
        .gv-nav-link:hover { color: #fff; }
        .gv-btn-nav {
          background: #22c55e; color: #000; border: none; cursor: pointer;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1rem; font-weight: 700; letter-spacing: 0.5px;
          padding: 0.55rem 1.4rem; border-radius: 6px;
          transition: background 0.2s, transform 0.1s;
        }
        .gv-btn-nav:hover { background: #16a34a; transform: translateY(-1px); }

        /* HERO */
        .gv-hero {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 7rem 2rem 4rem;
          position: relative;
          text-align: center;
        }
        .gv-hero-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 50% 40%, rgba(34,197,94,0.12) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 20% 80%, rgba(34,197,94,0.06) 0%, transparent 60%);
        }
        .gv-hero-grid {
          position: absolute; inset: 0; overflow: hidden; opacity: 0.04;
          background-image:
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .gv-hero-content {
          position: relative; z-index: 1;
          opacity: 0; transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .gv-hero-content.visible { opacity: 1; transform: translateY(0); }

        .gv-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.3);
          color: #22c55e; font-size: 0.8rem; font-weight: 600;
          letter-spacing: 1px; text-transform: uppercase;
          padding: 0.35rem 0.9rem; border-radius: 100px;
          margin-bottom: 1.8rem;
        }
        .gv-badge::before { content: '●'; font-size: 0.5rem; }

        .gv-hero-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(4rem, 10vw, 8rem);
          font-weight: 900; line-height: 0.92;
          letter-spacing: -2px;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }
        .gv-hero-title .accent { color: #22c55e; display: block; }

        .gv-hero-sub {
          font-size: 1.15rem; color: #888; max-width: 480px;
          margin: 0 auto 3rem; line-height: 1.6;
        }

        /* SEARCH BOX */
        .gv-search-box {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 1.5rem;
          max-width: 600px; width: 100%;
          margin: 0 auto 2rem;
          backdrop-filter: blur(8px);
        }
        .gv-search-label {
          font-size: 0.75rem; font-weight: 600; letter-spacing: 1px;
          text-transform: uppercase; color: #555;
          margin-bottom: 0.8rem; text-align: left;
        }
        .gv-deportes-grid {
          display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .gv-deporte-btn {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; cursor: pointer; color: #f0f0f0;
          font-family: 'Barlow', sans-serif; font-size: 0.8rem; font-weight: 500;
          padding: 0.7rem 0.4rem;
          display: flex; flex-direction: column; align-items: center; gap: 0.3rem;
          transition: all 0.15s;
        }
        .gv-deporte-btn:hover { border-color: rgba(34,197,94,0.4); color: #22c55e; }
        .gv-deporte-btn.activo {
          background: rgba(34,197,94,0.12); border-color: #22c55e; color: #22c55e;
        }
        .gv-deporte-emoji { font-size: 1.4rem; }

        .gv-btn-buscar {
          width: 100%; background: #22c55e; color: #000; border: none; cursor: pointer;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.1rem; font-weight: 700; letter-spacing: 1px;
          text-transform: uppercase;
          padding: 0.9rem; border-radius: 10px;
          transition: background 0.2s, transform 0.1s;
        }
        .gv-btn-buscar:hover { background: #16a34a; transform: translateY(-1px); }

        /* STATS */
        .gv-stats {
          display: flex; gap: 2.5rem; justify-content: center;
          margin-top: 1rem;
        }
        .gv-stat { text-align: center; }
        .gv-stat-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 2rem; font-weight: 900; color: #22c55e;
        }
        .gv-stat-label { font-size: 0.75rem; color: #555; text-transform: uppercase; letter-spacing: 0.5px; }

        /* SECTION */
        .gv-section {
          padding: 5rem 2rem;
          max-width: 1100px; margin: 0 auto;
        }
        .gv-section-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 2.8rem; font-weight: 900; text-transform: uppercase;
          letter-spacing: -1px; margin-bottom: 0.5rem;
        }
        .gv-section-sub { color: #666; margin-bottom: 2.5rem; font-size: 1rem; }

        /* FEATURE CARDS */
        .gv-features {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; overflow: hidden;
          background: rgba(255,255,255,0.06);
        }
        .gv-feature {
          background: #0a0a0a; padding: 2rem 1.8rem;
          transition: background 0.2s;
        }
        .gv-feature:hover { background: rgba(34,197,94,0.05); }
        .gv-feature-icon {
          font-size: 2rem; margin-bottom: 1rem;
        }
        .gv-feature-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.3rem; font-weight: 700; margin-bottom: 0.5rem;
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        .gv-feature-desc { color: #666; font-size: 0.9rem; line-height: 1.5; }

        /* CTA ORGANIZADOR */
        .gv-cta {
          margin: 0 2rem 5rem;
          max-width: 1100px; margin-left: auto; margin-right: auto;
          background: linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.02) 100%);
          border: 1px solid rgba(34,197,94,0.2);
          border-radius: 20px; padding: 3.5rem;
          display: flex; align-items: center; justify-content: space-between; gap: 2rem;
        }
        .gv-cta-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 2.2rem; font-weight: 900; text-transform: uppercase;
          letter-spacing: -0.5px; margin-bottom: 0.5rem;
        }
        .gv-cta-sub { color: #777; font-size: 0.95rem; }
        .gv-btn-cta {
          background: #22c55e; color: #000; border: none; cursor: pointer;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.1rem; font-weight: 700; letter-spacing: 1px;
          text-transform: uppercase; white-space: nowrap;
          padding: 1rem 2.2rem; border-radius: 10px;
          transition: background 0.2s, transform 0.1s;
        }
        .gv-btn-cta:hover { background: #16a34a; transform: translateY(-1px); }

        /* FOOTER */
        .gv-footer {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 2rem; text-align: center;
          color: #444; font-size: 0.85rem;
        }

        @media (max-width: 768px) {
          .gv-nav { padding: 1rem 1.2rem; }
          .gv-features { grid-template-columns: 1fr; }
          .gv-cta { flex-direction: column; text-align: center; }
          .gv-deportes-grid { grid-template-columns: repeat(3, 1fr); }
          .gv-stats { gap: 1.5rem; }
        }
      `}</style>

      <div className="gv-home">
        {/* NAV */}
        <nav className="gv-nav">
          <div className="gv-logo">Go<span>Venue</span></div>
          <div className="gv-nav-links">
            <button className="gv-nav-link" onClick={() => navigate('/eventos')}>Eventos</button>
            {organizador ? (
              <button className="gv-btn-nav" onClick={() => navigate('/dashboard')}>Mi panel</button>
            ) : (
              <>
                <button className="gv-nav-link" onClick={() => navigate('/login')}>Ingresar</button>
                <button className="gv-btn-nav" onClick={() => navigate('/register')}>Crear evento</button>
              </>
            )}
          </div>
        </nav>

        {/* HERO */}
        <section className="gv-hero">
          <div className="gv-hero-bg" />
          <div className="gv-hero-grid" />
          <div className={`gv-hero-content ${visible ? 'visible' : ''}`}>
            <div className="gv-badge">AMBA · Buenos Aires</div>
            <h1 className="gv-hero-title">
              Encontrá tu<br />
              <span className="accent">próximo partido</span>
            </h1>
            <p className="gv-hero-sub">
              Eventos deportivos recreativos en el área metropolitana. Fútbol, Pádel, Tenis, Hockey y Básquet.
            </p>

            <div className="gv-search-box">
              <p className="gv-search-label">¿Qué deporte buscás?</p>
              <div className="gv-deportes-grid">
                {DEPORTES.map(d => (
                  <button
                    key={d.id}
                    className={`gv-deporte-btn ${deporteSeleccionado === d.id ? 'activo' : ''}`}
                    onClick={() => setDeporteSeleccionado(deporteSeleccionado === d.id ? null : d.id)}
                  >
                    <span className="gv-deporte-emoji">{d.emoji}</span>
                    {d.nombre}
                  </button>
                ))}
              </div>
              <button className="gv-btn-buscar" onClick={handleBuscar}>
                Ver eventos disponibles →
              </button>
            </div>

            <div className="gv-stats">
              <div className="gv-stat">
                <div className="gv-stat-num">5</div>
                <div className="gv-stat-label">Deportes</div>
              </div>
              <div className="gv-stat">
                <div className="gv-stat-num">AMBA</div>
                <div className="gv-stat-label">Cobertura</div>
              </div>
              <div className="gv-stat">
                <div className="gv-stat-num">100%</div>
                <div className="gv-stat-label">Gratis</div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="gv-section">
          <h2 className="gv-section-title">Cómo funciona</h2>
          <p className="gv-section-sub">Simple, rápido y sin vueltas.</p>
          <div className="gv-features">
            <div className="gv-feature">
              <div className="gv-feature-icon">🔍</div>
              <div className="gv-feature-title">Buscá</div>
              <p className="gv-feature-desc">Filtrá por deporte, zona y fecha. Encontrá eventos cerca tuyo en segundos.</p>
            </div>
            <div className="gv-feature">
              <div className="gv-feature-icon">📍</div>
              <div className="gv-feature-title">Elegí</div>
              <p className="gv-feature-desc">Ves el venue, el horario, los cupos disponibles y el organizador.</p>
            </div>
            <div className="gv-feature">
              <div className="gv-feature-icon">🏃</div>
              <div className="gv-feature-title">Jugá</div>
              <p className="gv-feature-desc">Conectate con el organizador y sumarte al partido. Así de fácil.</p>
            </div>
          </div>
        </section>

        {/* CTA ORGANIZADOR */}
        <div className="gv-cta">
          <div>
            <h3 className="gv-cta-title">¿Organizás eventos?</h3>
            <p className="gv-cta-sub">Publicá tus partidos y llegá a más jugadores en todo el AMBA.</p>
          </div>
          <button
            className="gv-btn-cta"
            onClick={() => navigate(organizador ? '/dashboard' : '/register')}
          >
            {organizador ? 'Ir a mi panel' : 'Empezar gratis →'}
          </button>
        </div>

        <footer className="gv-footer">
          © 2024 GoVenue · Eventos deportivos en AMBA
        </footer>
      </div>
    </>
  );
}
