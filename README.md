<div align="center">
  
# 🏟️ GoVenue  
**Plataforma web para organizar y descubrir eventos deportivos recreativos en AMBA**

🔗 Proyecto en desarrollo — MVP

</div>

---

## 📌 ¿Qué es GoVenue?

GoVenue es una plataforma que conecta:

👨‍💼 **Organizadores de actividades deportivas recreativas**  
🏃‍♂️ **Personas que buscan jugar cerca de su zona**

El MVP permite **crear y administrar eventos deportivos en venues reales**, con información visual y filtrada por deporte, zona y horario.

> 🎯 **Objetivo inicial:** Fútbol, Pádel, Tenis, Hockey y Básquet en **AMBA (Argentina)**.

---

## 🎯 Alcance del MVP

| Rol | Función |
|-----|--------|
| 📍 **Usuario público** | Descubre actividades deportivas disponibles (vista pública con tarjetas y detalle) |
| 👨‍💼 **Organizador** | Crea, edita y administra eventos desde un panel con login |
| 🏟️ **Venue** | Espacios deportivos precargados (no se crean desde el MVP) |

🔒 **No incluye por ahora:** inscripciones, pagos, ni armado de equipos.

📌 Se trata de un MVP **centrado en descubrimiento y gestión de eventos individuales**.

---

## 🧱 Arquitectura del proyecto

| Capa | Tecnología | Servicio |
|------|------------|----------|
| Frontend | React + Vite | Vercel |
| Backend | Node.js + Express + JWT | Railway |
| Base de Datos | PostgreSQL | Supabase |
| ORM | Prisma | — |

### 🔐 Seguridad básica MVP
- Autenticación vía JWT
- Variables protegidas mediante `.env`
- No se exponen credenciales públicas

---

## 🗃️ Backlog de Producto (EPICs + Issues)

📌 **Documentación oficial del producto:**

👉 [`/docs/backlog.md`](./docs/backlog.md)

Incluye:
- EPICs 1 a 5 completas
- Issues linkeados al repositorio
- Roadmap post-MVP: inscripciones y pagos

---

## 🚀 Flujo de trabajo

### 🔧 Para desarrolladores
- Issues organizadas por tareas con identificadores:
  - `VEN-TXX` — Venues
  - `EV-TXX` — Eventos
  - `PUB-TXX` — Vista pública
  - `ORG-TXX` — Panel organizador
  - `INF-TXX` — Infraestructura
- Uso recomendado de branches por Issue:  
  `feature/ORG-T03-crear-evento`

### 🧪 Testing (futuro)
- Tests unitarios (Jest)
- Tests de API (Supertest)

---

## 🛠️ Variables de entorno (MVP)

Crear un archivo `.env` basado en:  
📌 `/backend/.env.example` *(pendiente de INF-T05)*

Variables esenciales:
```env
DATABASE_URL=postgresql://USUARIO:PASS@HOST:PUERTO/BD
JWT_SECRET=CAMBIAR_ESTA_CLAVE
VITE_API_BASE_URL=http://localhost:3000
```

---

## 🧭 Roadmap a futuro (no MVP)

| EPIC | Función | Estado |
|------|---------|--------|
| 🧍 EPIC 6 | Inscripción de participantes con cupos | 🔜 |
| 💳 EPIC 7 | Pagos con MercadoPago / Stripe | 🔜 |
| 🧩 EPIC 8 | Armado de equipos y rankings | 💡 Idea |
| 🏆 EPIC 9 | Gamificación y niveles de jugador | 💡 Idea |

---

<div align="center">

📌 **Proyecto abierto a colaboración**  
📩 Para colaborar, revisar Issues o abrir PRs 🏗️  
✉️ Contacto: **Martín Solari** — gestor deportivo & product owner — [LinkedIn](https://www.linkedin.com/in/martin-solari-068b26230/)  

**GoVenue — AMBA, Argentina 🇦🇷⚽**

</div>


</div>


