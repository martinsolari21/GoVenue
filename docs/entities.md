# 🧱 Entidades Principales – GoVenue

Este documento define las entidades fundamentales del sistema GoVenue. Su objetivo es servir como base para decisiones técnicas futuras (modelo de datos, API, validaciones e interfaces).

---

## 🏟️ 1. Venue (Sede Deportiva)

**Descripción:** Espacio físico donde se realizan eventos deportivos o recreativos.

**Atributos principales:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | ID | Identificador único |
| nombre | String | Nombre comercial del venue |
| dirección | String | Dirección exacta |
| localidad | String | Localidad dentro de AMBA (ej: Quilmes, Palermo, Morón) |
| deportes | Lista | Deportes disponibles (ej: fútbol 5, tenis, hockey) |
| servicios | Lista | Servicios ofrecidos (vestuarios, estacionamiento, comida, etc.) |
| fotos | Lista | Imágenes opcionales |
| fecha_creación | Date | Fecha de alta en GoVenue |

---

## 🎟️ 2. Evento Deportivo

**Descripción:** Actividad publicada por organizadores dentro de una sede.

**Atributos principales:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | ID | Identificador único |
| venue_id | ID | Relación a Venue |
| deporte | String | Tipo de deporte del evento |
| título | String | Nombre público del evento |
| descripción | String | Detalle opcional |
| fecha | Date | Día del evento |
| hora_inicio | Time | Horario de inicio |
| hora_fin | Time | Horario de fin |
| cupos | Integer | Máximo de participantes/equipos |
| estado | Enum | Borrador / Publicado / Cancelado / Completo |
| fecha_creación | Date | Fecha de publicación |
| última_modificación | Date | Actualización del evento |

---

## 👤 3. Usuario

**Descripción:** Persona que utiliza GoVenue (participante, organizador o administrador).

**Atributos principales:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | ID | Identificador único |
| nombre | String | Nombre completo |
| email | String | Identificador de usuario |
| rol | Enum | Participante / Organizador / Admin |
| localidad | String | Ciudad o zona de AMBA |
| fecha_registro | Date | Fecha de alta |

> Nota: En el MVP no hay contraseña ni login avanzado. Este dato puede estar gestionado por un sistema simple o “mock”.

---

## 🎟️ 4. Organizador (extensión de Usuario)

**Descripción:** Usuario que crea eventos.

**Relaciones:**
- Un Organizador es un Usuario con rol `Organizador`.
- Puede crear, editar y cancelar sus eventos.

**Datos adicionales (futuro):**
| Campo | Descripción |
|-------|-------------|
| reputación | Puntaje basado en participantes |
| historial | Métricas de eventos pasados |

---

## 🛡️ 5. Administrador del sistema (extensión de Usuario)

**Descripción:** Usuario de GoVenue con permisos avanzados.

**Funciones clave:**
- Aprobar sedes (si se decide tener moderación).
- Gestionar deportes disponibles en la plataforma.
- Ver métricas globales del sistema.

> MVP mínimo: Solo valida inputs, sin procesos complejos.

---

## 🎯 Relaciones Básicas (Resumen)

| Relación | Descripción |
|----------|-------------|
| Un **Venue** puede tener múltiples **Eventos** |
| Un **Organizador** puede crear múltiples **Eventos** |
| Un **Evento** ocurre en solo **un Venue** |
| Un **Participante** puede interactuar con eventos (solo en vista pública en el MVP) |

---

## 💡 Futuras Entidades (No MVP)

| Entidad | Uso futuro |
|---------|-----------|
| Reservas | Bloqueo de horarios y cupos |
| Pago | Integración con medios de pago |
| Deportivo/Disciplina | Catálogo avanzada con niveles |
| Sponsor | Marcas dentro de eventos |

---

👤 *Documento liderado por Product Owner:*  
**Martín Solari – GoVenue**
