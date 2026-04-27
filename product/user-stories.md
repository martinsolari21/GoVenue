# 🧩 User Stories – GoVenue

Las siguientes historias de usuario definen el comportamiento esperado del producto desde la perspectiva de sus actores principales.

---

## 1. Organizadores de eventos

### 1.1 Crear un nuevo evento

**Como** organizador de eventos deportivos  
**quiero** crear un evento con fecha, hora, deporte, sede y cupos  
**para** poder publicarlo rápidamente y centralizar la información en un solo lugar.

**Criterios de aceptación:**
- Puedo seleccionar una sede existente.
- Puedo indicar deporte, categoría y nivel.
- Puedo definir fecha, hora de inicio y fin.
- Puedo establecer un número máximo de participantes o equipos.
- Puedo marcar el evento como “borrador” o “publicado”.

---

### 1.2 Editar datos de un evento

**Como** organizador  
**quiero** poder modificar los datos de un evento ya creado  
**para** corregir información o actualizar horarios y cupos.

**Criterios de aceptación:**
- Sólo el organizador (o rol con permiso) puede editar.
- Los participantes ven los cambios actualizados.
- El sistema registra la última fecha de modificación.

---

### 1.3 Ver listado de mis eventos

**Como** organizador  
**quiero** ver un listado de mis eventos actuales y pasados  
**para** tener una vista general de la actividad y su estado.

**Criterios de aceptación:**
- Puedo filtrar por fecha, sede y estado (próximo, finalizado, cancelado).
- Puedo acceder al detalle de cada evento desde el listado.

---

## 2. Sedes deportivas (venues)

### 2.1 Registrar una sede

**Como** administrador de una sede deportiva  
**quiero** registrar mi venue con todos sus datos  
**para** que organizadores y usuarios puedan encontrarlo y utilizarlo.

**Criterios de aceptación:**
- Puedo cargar dirección, ciudad, país y ubicación aproximada en mapa.
- Puedo indicar qué deportes se pueden practicar.
- Puedo detallar servicios (vestuarios, estacionamiento, food & beverage, etc.).
- Puedo agregar fotos representativas.

---

### 2.2 Gestionar disponibilidad básica

**Como** administrador de venue  
**quiero** definir horarios disponibles para eventos  
**para** evitar solapamientos y tener una agenda ordenada.

**Criterios de aceptación (futuro):**
- Definir bloques horarios por día.
- Ver qué bloques están ocupados por eventos.

*(Esta funcionalidad puede entrar en una fase posterior del producto.)*

---

## 3. Participantes / Fans

### 3.1 Buscar eventos

**Como** participante/fan  
**quiero** buscar eventos deportivos filtrando por deporte, fecha y ubicación  
**para** encontrar fácilmente experiencias que me interesen.

**Criterios de aceptación:**
- Puedo filtrar por deporte.
- Puedo filtrar por rango de fechas.
- Puedo filtrar por ciudad o zona.
- El listado muestra nombre del evento, sede, fecha/hora y estado.

---

### 3.2 Ver detalle de un evento

**Como** participante  
**quiero** ver una ficha detallada del evento  
**para** entender bien de qué se trata antes de participar.

**Criterios de aceptación:**
- Se muestran: título, descripción, deporte, sede, fecha/hora, cupos.
- Se indica si el evento está abierto, completo o cancelado.
- Se muestra la ubicación de la sede.

---

## 4. Admin del sistema / Producto

### 4.1 Gestionar categorías y deportes

**Como** administrador del sistema  
**quiero** gestionar la lista de deportes y categorías disponibles  
**para** mantener el catálogo ordenado y consistente.

---

## 5. Alcance del MVP (resumen)

El MVP de GoVenue incluirá, al menos:

- Registro y visualización de **sedes deportivas**.
- Creación, edición y listados de **eventos**.
- Vista pública de **búsqueda y detalle de eventos**.

Quedan fuera del MVP (para fases futuras):

- Pagos integrados.
- Sistema completo de reservas con bloqueo de horarios.
- Perfiles avanzados de usuarios y reputación.
- Integración con sponsors y marcas.
