# 📌 GoVenue – Backlog de Producto (MVP AMBA)

GoVenue es una plataforma web que conecta **organizadores de deportes recreativos** con **personas que buscan actividades para jugar**.

El enfoque principal del MVP es el **armado y gestión de eventos deportivos en venues** (canchas, predios, clubes), permitiendo:

- Que los organizadores **crean, editan y administren** eventos.
- Que los participantes **encuentren actividades cercanas** para jugar.

📍 **Ámbito del MVP:** AMBA (Argentina)  
🏅 **Deportes iniciales:** Fútbol, Pádel, Tenis, Hockey y Básquet  
🎯 **Tipo de evento inicial:** Cupos individuales (sin formar equipos)

---

## 🧭 EPICs del MVP

Cada EPIC agrupa funcionalidades vinculadas entre sí.  
No se crean como Issues individuales: se documentan aquí y se ejecutan mediante tareas (Issues) vinculadas.

---

### 🏟️ EPIC 1 — Gestión de Venues

📌 **Objetivo:** Permitir registrar y consultar venues disponibles para que luego sean usados en eventos.

**Issues asociados:**
- [VEN-T01] Endpoint para registrar un Venue  
https://github.com/martinsolari21/GoVenue/issues/1
- [VEN-T02] Validaciones obligatorias para registrar Venue  
https://github.com/martinsolari21/GoVenue/issues/4
- [VEN-T03] Endpoint para listar Venues  
https://github.com/martinsolari21/GoVenue/issues/3
- [VEN-T04] Precargar listado de localidades AMBA  
https://github.com/martinsolari21/GoVenue/issues/6
- [VEN-T05] Precargar catálogo inicial de deportes  
https://github.com/martinsolari21/GoVenue/issues/7

---

### 🎫 EPIC 2 — Gestión de Eventos

📌 **Objetivo:** Permitir crear, editar y administrar eventos deportivos asociados a un venue existente.

**Issues asociados:**
- [EV-T01] Relación Evento ↔ Venue  
https://github.com/martinsolari21/GoVenue/issues/8
- [EV-T02] Manejo y validación de estados de evento  
https://github.com/martinsolari21/GoVenue/issues/12
- [EV-T03] Endpoint para crear evento  
https://github.com/martinsolari21/GoVenue/issues/9
- [EV-T04] Endpoint para editar evento  
https://github.com/martinsolari21/GoVenue/issues/10
- [EV-T05] Endpoint para listar eventos del organizador  
https://github.com/martinsolari21/GoVenue/issues/11

---

### 🌍 EPIC 3 — Vista Pública de Eventos

📌 **Objetivo:** Mostrar al usuario público un catálogo de eventos deportivos disponibles en formato visual (tarjetas).

**Issues asociados:**
- [PUB-T01] Búsqueda pública de eventos  
https://github.com/martinsolari21/GoVenue/issues/13
- [PUB-T02] Listado público de eventos en tarjetas  
https://github.com/martinsolari21/GoVenue/issues/14
- [PUB-T03] Vista pública de detalle de evento  
https://github.com/martinsolari21/GoVenue/issues/15
- [PUB-T04] Componente reutilizable de tarjeta  
https://github.com/martinsolari21/GoVenue/issues/16

---

### 👨‍💼 EPIC 4 — Panel del Organizador

📌 **Objetivo:** Ofrecer un panel privado donde los organizadores puedan administrar sus eventos.

**Issues asociados:**
- [ORG-T01] Layout de Panel con Sidebar  
https://github.com/martinsolari21/GoVenue/issues/17
- [ORG-T02] Pantalla “Mis eventos”  
https://github.com/martinsolari21/GoVenue/issues/19
- [ORG-T03] Formulario para crear evento  
https://github.com/martinsolari21/GoVenue/issues/18
- [ORG-T04] Formulario para editar evento  
https://github.com/martinsolari21/GoVenue/issues/20

---

### 🧱 EPIC 5 — Infraestructura y Deploy

📌 **Objetivo:** Desplegar el sistema del MVP con separación profesional de servicios.

**Stack seleccionado:**
- Backend: **Railway**
- Base de datos: **PostgreSQL en Supabase**
- Frontend: **Vercel**

**Issues asociados:**
- [INF-T01] Arquitectura de infraestructura GoVenue  
🕒 *Próximo a crear*
- [INF-T02] Base de datos Supabase  
🕒 *Próximo a crear*
- [INF-T03] Backend en Railway  
🕒 *Próximo a crear*
- [INF-T04] Frontend en Vercel  
🕒 *Próximo a crear*
- [INF-T05] Archivo `.env.example`  
🕒 *Próximo a crear*

---

## 🧭 Roadmap Futuro (Post-MVP)

Estas EPICs NO se desarrollan ahora. Quedan planificadas para expansión:

### 🧍 EPIC 6 — Inscripciones y Cupos por Jugador
📌 Participantes se inscriben en eventos (con control de cupos).

### 💳 EPIC 7 — Pagos e Integración con Plataformas
📌 Cobro de inscripciones (MercadoPago / Stripe).

---

📌 **Este documento debe actualizarse cada vez que una EPIC agrega o finaliza tareas.**

---

