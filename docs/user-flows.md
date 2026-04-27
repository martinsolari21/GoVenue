# 🔄 Flujos de Usuario – GoVenue (MVP AMBA)

Este documento describe los flujos principales de uso de GoVenue en su versión MVP.  
Se centra en tres actores: **Organizador**, **Venue** y **Participante**.

---

## 1. Flujo – Organizador crea un evento

**Actor principal:** Organizador de eventos deportivos.  
**Objetivo:** Publicar un evento en una sede del AMBA.

### Pasos

1. El Organizador accede al panel de GoVenue.
2. Selecciona la opción **“Crear evento”**.
3. El sistema muestra un formulario con:
   - Selección de **Venue** (de una lista de venues disponibles).
   - Selección de **deporte**.
   - Campos para:
     - Título del evento.
     - Descripción (opcional).
     - Fecha.
     - Hora de inicio y fin.
     - Cupos (cantidad de participantes o equipos).
4. El Organizador completa los campos obligatorios.
5. El Organizador elige el **estado inicial**:
   - Borrador (aún no se ve públicamente).
   - Publicado (queda visible para los usuarios).
6. El Organizador confirma la creación.
7. El sistema:
   - Valida los datos.
   - Crea el evento asociado a la sede.
   - Registra fecha de creación.
8. Si el evento se creó correctamente:
   - Muestra un mensaje de éxito.
   - Ofrece un botón “Ver evento” o “Crear otro evento”.

---

## 2. Flujo – Organizador edita un evento

**Objetivo:** Actualizar información de un evento ya creado.

### Pasos

1. El Organizador accede al panel y entra en **“Mis eventos”**.
2. Ve un listado de eventos con:
   - Título.
   - Fecha.
   - Sede.
   - Estado (Borrador, Publicado, Cancelado, Completo).
3. Selecciona un evento y hace clic en **“Editar”**.
4. El sistema muestra el mismo formulario de creación pero con datos ya cargados.
5. El Organizador modifica los campos necesarios (ej: horario, descripción, cupos).
6. Guarda los cambios.
7. El sistema:
   - Valida los datos actualizados.
   - Registra la **última fecha de modificación**.
   - Actualiza la información que se ve en la ficha pública del evento (si está publicado).

---

## 3. Flujo – Venue se registra en GoVenue

**Actor principal:** Administrador de una sede deportiva.  
**Objetivo:** Registrar un venue para poder asociarle eventos.

### Pasos

1. El Administrador accede a la sección **“Registrar sede”**.
2. El sistema muestra un formulario con:
   - Nombre del venue.
   - Dirección.
   - Localidad (dentro de AMBA).
   - Deportes disponibles.
   - Servicios (vestuarios, estacionamiento, food & beverage, etc.).
   - Datos de contacto básicos.
3. El Administrador completa y envía el formulario.
4. El sistema:
   - Valida campos obligatorios.
   - Crea la entidad **Venue**.
   - (Opcional) Marca el venue como “Pendiente de aprobación” si hay moderación.
5. El venue queda disponible para asociar eventos.

> En el MVP se puede asumir aprobación automática para simplificar.

---

## 4. Flujo – Participante busca eventos

**Actor principal:** Usuario/participante.  
**Objetivo:** Descubrir eventos deportivos en AMBA que le interesen.

### Pasos

1. El Participante entra a GoVenue (vista pública).
2. Accede a la pantalla de **“Buscar eventos”**.
3. El sistema muestra filtros:
   - Deporte.
   - Localidad / zona dentro de AMBA.
   - Fecha o rango de fechas.
4. El Participante selecciona uno o más filtros.
5. El sistema devuelve un **listado de eventos** que:
   - Están en estado “Publicado”.
   - Coinciden con los filtros.
6. En cada evento del listado se muestra:
   - Título.
   - Deporte.
   - Sede (nombre + localidad).
   - Fecha y hora.
   - Estado (Disponible, Completo, Cancelado).
7. El Participante puede hacer clic en un evento para ver el **detalle**.

---

## 5. Flujo – Participante ve detalle de evento

**Objetivo:** Entender bien de qué se trata un evento.

### Pasos

1. El Participante selecciona un evento del listado.
2. El sistema muestra la ficha del evento con:
   - Título del evento.
   - Deporte.
   - Descripción.
   - Sede (nombre, dirección).
   - Localidad.
   - Fecha y horario.
   - Cupos y/o estado.
3. El sistema muestra también información básica de la sede:
   - Servicios.
   - Link a otros eventos del mismo venue (futuro).
4. En el MVP, el Participante no se inscribe desde la plataforma:
   - Solo obtiene la información.
   - Puede haber un dato de contacto o texto informativo para la inscripción externa (futuro).

---

## 6. Flujo – Admin del sistema gestiona catálogo mínimo

**Actor principal:** Administrador de GoVenue.  
**Objetivo:** Mantener consistente el catálogo de deportes y localidades.

### Pasos

1. El Admin accede a la sección interna del sistema.
2. Ve un listado de **deportes** disponibles en la plataforma.
3. Puede:
   - Agregar un nuevo deporte.
   - Editar el nombre de un deporte.
   - Desactivar un deporte (que deja de ofrecerse en nuevos eventos).
4. El sistema valida que no haya duplicados obvios.

> En el MVP esto puede realizarse inicialmente de forma manual por el equipo técnico, pero el flujo sirve como referencia futura.

---

## 7. Alcance de flujos en el MVP

Los flujos que **deben estar soportados** en el MVP son:

- Crear evento (Organizador).
- Editar evento (Organizador).
- Listar eventos de un organizador.
- Registrar sede (Venue).
- Listar venues (internamente para asociarlos a eventos).
- Buscar eventos (Participante).
- Ver detalle de evento (Participante).

Quedan fuera del MVP (pero documentados):

- Inscripción de participantes desde la plataforma.
- Gestión avanzada de horarios y reservas.
- Pagos integrados.

---

👤 *Documento de referencia funcional*  
**Product Owner:** Martín Solari – GoVenue
