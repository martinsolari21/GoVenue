# 📌 GoVenue - API Pública (MVP AMBA)

Esta API permite consultar información sobre complejos deportivos y eventos publicados en el Área Metropolitana de Buenos Aires. Actualmente los datos provienen de un mock temporal (sin DB).

---

## 🏟️ Endpoints de Venue

### 🔹 `GET /venues`
Retorna todos los complejos deportivos activos del AMBA.

**Ejemplo de respuesta:**
```json
[
  {
    "id": 1,
    "name": "Complejo Futbol 5 Palermo",
    "sport": "futbol",
    "city": "CABA - Palermo",
    "address": "Av. Juan B. Justo 1234, CABA",
    "description": "Césped sintético, iluminación LED",
    "is_active": true
  }
]
