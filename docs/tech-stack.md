# 🧰 Tech Stack Oficial – GoVenue (MVP AMBA)

Este documento define la arquitectura tecnológica seleccionada para el MVP de GoVenue. Se prioriza velocidad de desarrollo, escalabilidad y disponibilidad de talento en Argentina/LatAm.

---

## 🧱 Arquitectura Base (Web App Mobile-First)

| Capa | Tecnología | Motivo Estratégico |
|------|-------------|-------------------|
| **Frontend Web** | React + Vite | Desarrollo rápido y reutilizable con React Native |
| **Backend API** | Node.js + Express | Gran disponibilidad de desarrolladores y alto rendimiento en CRUDs |
| **Base de Datos** | PostgreSQL | Sólido estándar para datos relacionales, geolocalización y crecimiento |
| **ORM** | Prisma | Productividad + tipado sólido + migraciones seguras |

---

## 🏗️ Infraestructura y Deploy (Propuesta MVP)

| Módulo | Tecnología/Servicio | Motivo |
|--------|---------------------|--------|
| Backend | Railway / Render | Despliegue sencillo y económico |
| Frontend | Vercel | Deploy rápido con integración a React |
| Base de datos | Railway / Supabase / Neon | PostgreSQL gestionado con escalabilidad |

> La selección final podrá variar según costos específicos al momento de implementación, sin alterar el stack principal.

---

## 🔐 Autenticación (Estrategia MVP)

- MVP inicial *sin login avanzado*, con modelos básicos de usuario y roles.
- Se podrá agregar autenticación completa más adelante con:
  - **Auth0**
  - **Clerk**
  - **Supabase Auth**
  - o implementación custom (JWT) según necesidades futuras.

---

## 📊 Evolución Tecnológica Futura (Datos y Analítica)

Cuando el producto crezca en tráfico y métricas, se podrá incorporar:

| Tecnología | Rol |
|------------|-----|
| Python + FastAPI | Microservicios para analítica deportiva |
| Pandas / Scikit | Procesamiento estadístico |
| ML liviano | Recomendación de eventos, predicción de demanda |
| BigQuery / Redshift | Scalado para big data |

📌 Estos módulos **no afectan el MVP**, pero el stack actual permite integrarlos sin reescribir.

---

## 🎯 Resumen Estratégico

> **React + Node + PostgreSQL** permite lanzar GoVenue rápidamente, con talento accesible en el mercado local y la posibilidad de crecer mediante componentes de analítica en Python en fases posteriores.

---

👤 *Documento oficial de Producto & Tecnología*  
**Product Owner:** Martín Solari – GoVenue
