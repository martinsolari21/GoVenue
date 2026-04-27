\# 📌 GoVenue - Modelos de Datos (MVP AMBA)



Este documento define los modelos que usa la plataforma GoVenue para manejar sedes, eventos y organizadores dentro del MVP enfocado en el Área Metropolitana de Buenos Aires (AMBA).



---



\### 🏟️ Venue (Complejo Deportivo)



| Campo | Tipo | Ejemplo | Descripción |

|-------|------|---------|-------------|

| id | number | 1 | Identificador del complejo |

| name | string | "Complejo Futbol 5 Palermo" | Nombre comercial |

| sport | string | "futbol", "tenis" | Deporte principal |

| city | string | "CABA - Palermo" | Zona/barrio dentro de AMBA |

| address | string | "Av. Juan B. Justo 1234, CABA" | Dirección completa |

| description | string | "Césped sintético, iluminación LED" | Características |

| is\_active | boolean | true | Si el venue está activo en la plataforma |



---



\### 🎟️ Event (Evento Deportivo)



| Campo | Tipo | Ejemplo | Descripción |

|-------|------|---------|-------------|

| id | number | 1 | Identificador del evento |

| title | string | "Torneo Relámpago 6 vs 6" | Nombre del evento |

| sport | string | "futbol" | Deporte |

| venue\_id | number | 1 | Relación con Venue |

| date | string | "2025-12-10" | Fecha del evento |

| start\_time | string | "19:30" | Hora de inicio |

| price | number | 3000 | Costo por persona o equipo |

| organizer\_id | number | 1 | Relación con Organizer |

| is\_active | boolean | true | Si el evento está publicado |



---



\### 👤 Organizer (Organizador Deportivo)



| Campo | Tipo | Ejemplo | Descripción |

|-------|------|---------|-------------|

| id | number | 1 | Identificador |

| name | string | "Liga AMBA" | Nombre comercial |

| phone | string | "+54 11 2222-3333" | Contacto |

| email | string | "contacto@ligaamba.com" | Correo |



---



📌 \*Todos los modelos están pensados para un MVP, y pueden ampliarse en futuras iteraciones (ej. pagos, reservas, login, ratings, disponibilidad horaria, etc.).\*



