# ReForest Web React

Aplicación frontend React para demostrar la integración del proyecto ReForest con sus APIs REST existentes.

## Objetivo

Crear una interfaz clara, académicamente demostrable y ordenada para evidenciar:
- autenticación con JWT
- consumo real de los endpoints REST de ReForest
- CRUD de incendios, donaciones y voluntarios
- navegación protegida
- integración sin sobreingeniería ni servicios adicionales

## Tecnologías

- React
- Vite
- JavaScript
- React Router
- CSS propio
- Fetch API

## Despliegue con Docker Compose

El frontend puede desplegarse como archivos estáticos mediante Nginx y publicarse en `https://reforest.codeconheiner.com`:

```bash
docker compose up -d --build
```

Por defecto queda disponible en `http://localhost:8080`. Para usar otro puerto:

```bash
WEB_PORT=8085 docker compose up -d --build
```

Las URLs de las APIs se inyectan durante la construcción de la imagen. Puedes sobrescribirlas sin modificar el código:

```bash
VITE_API_SERVICIOS_URL=https://reforestapi.codeconheiner.com \
VITE_API_AUTH_URL=https://auth.codeconheiner.com \
WEB_PORT=8080 \
docker compose up -d --build
```

El endpoint `GET /health` devuelve `ok` para comprobar el estado del contenedor. Configura ambas APIs para permitir este origen CORS:

```text
https://reforest.codeconheiner.com
```

Durante las pruebas locales también puedes permitir `http://localhost:5173`.

## Estructura

```text
src/
├── components/
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── Loading.jsx
│   └── StatusMessage.jsx
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Incendios.jsx
│   ├── Donaciones.jsx
│   └── Voluntarios.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── incendiosService.js
│   ├── donacionesService.js
│   └── voluntariosService.js
├── utils/
│   └── validation.js
├── App.jsx
├── main.jsx
├── styles.css
└──
```

## Configuración

La configuración centralizada vive en `src/services/api.js` y usa los valores reales del proyecto:

```js
const API_SERVICIOS_URL = 'https://reforestapi.codeconheiner.com';
const API_AUTH_URL = 'https://auth.codeconheiner.com';
```

No se hardcodean URLs en cada módulo.

## Endpoints utilizados

| Módulo | Método | Endpoint | Payload esperado |
| --- | --- | --- | --- |
| Auth | POST | `/api/auth/login` | `{ identificador, contrasena }` |
| Incendios | GET | `/api/incendios` | Lista de objetos |
| Incendios | POST / PUT | `/api/incendios` | `{ id, ubicacion, descripcion, estado, latitud, longitud }` |
| Incendios | DELETE | `/api/incendios?id={id}` | Query param id |
| Donaciones | GET | `/api/donaciones` | Lista de objetos |
| Donaciones | POST / PUT | `/api/donaciones` | `{ id, entidad, especie, cantidad }` |
| Donaciones | DELETE | `/api/donaciones?id={id}` | Query param id |
| Voluntarios | GET | `/api/voluntarios` | Lista de objetos |
| Voluntarios | POST / PUT | `/api/voluntarios` | `{ id, nombre, correo, telefono, disponibilidad }` |
| Voluntarios | DELETE | `/api/voluntarios?id={id}` | Query param id |

## Autenticación

Se conserva el flujo actual del frontend original:

- Login con `POST` a la API de autenticación.
- Envío exacto:

```json
{
  "identificador": "...",
  "contrasena": "..."
}
```

- Si la respuesta incluye `token`, se guarda único en `sessionStorage`.
- Las peticiones protegidas usan:

```http
Authorization: Bearer <token>
```

- En 401 se elimina el token y se redirige al login.
- No se guarda contraseña ni se manipula base de datos.

## Módulos funcionales

### Incendios

Campos esperados:
- `id`
- `ubicacion`
- `descripcion`
- `estado`
- `latitud`
- `longitud`
- `fechaRegistro`

Operaciones:
- listar
- registrar
- editar
- eliminar
- recargar datos
- mensajes de éxito/error

### Donaciones

Campos esperados:
- `id`
- `entidad`
- `especie`
- `cantidad`
- `fechaRegistro`

Operaciones:
- listar
- registrar
- editar
- eliminar
- validación de cantidad
- mensajes de éxito/error

### Voluntarios

Campos esperados:
- `id`
- `nombre`
- `correo`
- `telefono`
- `disponibilidad`

Operaciones:
- listar
- registrar
- editar
- eliminar
- validación de campos
- mensajes de éxito/error

## Dashboard

Incluye:
- branding ReForest
- acceso a módulos principales
- tarjetas para Incendios, Donaciones y Voluntarios
- botón de cierre de sesión
- aviso de que notificaciones están pendientes

## Notificaciones

No se implementa CRUD falso. Se muestra únicamente:

> Notificaciones: módulo pendiente de implementación en la API.

## Ejecución

```bash
npm install
npm run dev -- --host 0.0.0.0
```

Abrir la URL que indique Vite, normalmente:

```text
http://localhost:5173
```

## Verificación final

Los estados se expresan con estas etiquetas:

- `[OK] Verificado`
- `[ERROR] Verificado y falló`
- `[PENDIENTE] No verificado`

### A. Estructura y tecnologías

- `[OK] Verificado`: existen `src/components`, `src/pages`, `src/services` y `src/utils`.
- `[OK] Verificado`: los archivos documentados de React, servicios y utilidades existen.
- `[OK] Verificado`: `package.json` contiene React, React DOM, React Router, Vite y el plugin de React.
- `[OK] Verificado`: el código utiliza `fetch` para Auth y servicios REST.
- `[PENDIENTE] No verificado`: no existe script `npm run lint` en `package.json`.

### B. URLs y configuración

- `[OK] Verificado`: `src/services/api.js` lee `VITE_API_SERVICIOS_URL` y `VITE_API_AUTH_URL` mediante `import.meta.env`.
- `[OK] Verificado`: Docker Compose inyecta esas variables como argumentos `VITE_*` durante la construcción.
- `[OK] Verificado`: existen valores por defecto para producción en `api.js`, `Dockerfile` y `docker-compose.yml`.
- `[OK] Verificado`: no existe archivo `.env` en el workspace revisado.
- `[OK] Verificado`: Auth usa `https://auth.codeconheiner.com` y Servicios usa `https://reforestapi.codeconheiner.com`.

El desarrollo puede sobrescribir las URLs mediante variables `VITE_*`. En producción, Vite las incorpora durante `npm run build`; no se cambian en tiempo de ejecución dentro del contenedor Nginx.

### C. Autenticación

- `[OK] Verificado`: `Login.jsx` envía `identificador` y `contrasena`.
- `[OK] Verificado`: `authService.js` llama `POST /api/auth/login` y exige un campo `token`.
- `[OK] Verificado`: el token se guarda en `sessionStorage` con la clave `reforest_token`.
- `[OK] Verificado`: `api.js` envía `Authorization: Bearer <token>` en las solicitudes protegidas.
- `[OK] Verificado`: una respuesta `401` elimina el token y redirige a `/login`.
- `[OK] Verificado`: `ProtectedRoute` bloquea las rutas privadas cuando no existe token.
- `[OK] Verificado`: login real con `angie` respondió `HTTP 200` y devolvió token.
- `[ERROR] Verificado y falló`: login real con `angietrululu@reforest.com` respondió `HTTP 401`.

### D. APIs reales

- `[OK] Verificado`: CORS de Auth responde `204` para `https://reforest.codeconheiner.com`.
- `[OK] Verificado`: CORS de Servicios responde `204` para `https://reforest.codeconheiner.com`.
- `[OK] Verificado`: con el JWT real de `angie`, los GET de incendios, donaciones y voluntarios respondieron `HTTP 200`.
- `[PENDIENTE] No verificado`: no se ejecutaron POST, PUT ni DELETE para evitar modificar datos reales.

### E. CRUD y nombres de campos

- `[OK] Verificado`: los tres servicios React implementan GET, POST, PUT y DELETE con las rutas documentadas.
- `[OK] Verificado`: incendios usa `id`, `ubicacion`, `descripcion`, `estado`, `latitud` y `longitud`.
- `[OK] Verificado`: donaciones usa `id`, `entidad`, `especie` y `cantidad`.
- `[OK] Verificado`: voluntarios usa `id`, `nombre`, `correo`, `telefono` y `disponibilidad`.
- `[ERROR] Verificado y requiere atención`: la API observada devuelve `fecha_registro`, mientras Incendios y Donaciones renderizan `fechaRegistro`; esas fechas pueden aparecer vacías.

### F. Notificaciones

- `[OK] Verificado`: no existe CRUD de notificaciones; solo se muestra `Notificaciones: módulo pendiente de implementación en la API.`

### G. Docker y producción

- `[OK] Verificado`: el Dockerfile compila con Node y sirve `dist` mediante Nginx.
- `[OK] Verificado`: Compose expone el puerto configurable y contiene un healthcheck para `/health`.
- `[OK] Verificado`: Nginx usa fallback a `/index.html` para React Router.
- `[PENDIENTE] No verificado`: Docker no está disponible en este entorno; no se ejecutaron `docker compose build`, `docker compose up`, `docker ps` ni `GET /health` dentro del contenedor.
- `[PENDIENTE] No verificado`: `https://reforest.codeconheiner.com` no resolvió DNS durante la comprobación (`HTTP 000`).
- `[ERROR] Verificado y falló`: `https://reforestapi.codeconheiner.com` devolvió `HTTP 500` en una consulta sin JWT; las consultas autenticadas de lectura sí respondieron `HTTP 200`.
- `[ERROR] Verificado y falló`: `https://auth.codeconheiner.com` devolvió `HTTP 500` con un login vacío en la comprobación más reciente; el login válido con `angie` sí respondió `HTTP 200`.

La disponibilidad de una API y la integración completa frontend + APIs son comprobaciones distintas. La integración autenticada de lectura fue verificada con `curl`; el despliegue público del frontend y las operaciones que modifican datos siguen pendientes.

### H. Build

- `[OK] Verificado`: `npm install` terminó correctamente; npm reportó 4 vulnerabilidades en dependencias.
- `[OK] Verificado`: `npm run build` terminó correctamente y generó `dist`.
- `[PENDIENTE] No verificado`: no hay script `lint` configurado.

### I. Problemas y pruebas pendientes

- Corregir en el frontend o acordar con el backend el nombre `fecha_registro` frente a `fechaRegistro`.
- Corregir posteriormente el login por correo en `api-auth`.
- Crear/validar el DNS y proxy HTTPS de `reforest.codeconheiner.com`.
- Ejecutar el build y healthcheck Docker en el homelab.
- Probar POST, PUT y DELETE con datos controlados o de prueba.

## Archivos principales creados

- `src/App.jsx`
- `src/main.jsx`
- `src/pages/Login.jsx`
- `src/pages/Dashboard.jsx`
- `src/pages/Incendios.jsx`
- `src/pages/Donaciones.jsx`
- `src/pages/Voluntarios.jsx`
- `src/components/Navbar.jsx`
- `src/components/ProtectedRoute.jsx`
- `src/components/Loading.jsx`
- `src/components/StatusMessage.jsx`
- `src/services/api.js`
- `src/services/authService.js`
- `src/services/incendiosService.js`
- `src/services/donacionesService.js`
- `src/services/voluntariosService.js`
- `src/styles.css`

## Archivos modificados

- `index.html`
- `README.md`
- `package.json`
- `vite.config.js`

## Arquitectura

La arquitectura sigue esta lógica:

UI -> Pages -> Services -> API REST

- Las páginas manejan estado y formularios.
- Los servicios encapsulan Fetch.
- `api.js` centraliza URLs, JWT y manejo de errores.
- `ProtectedRoute` impide navegación sin token.

## Cómo funciona el login

1. Se recoge usuario y contraseña en `Login.jsx`.
2. `authService.loginUser()` hace `POST` a `/api/auth/login`.
3. Si la API devuelve un token, se guarda en `sessionStorage`.
4. El usuario es redirigido al dashboard.
5. Las páginas protegidas comprueban la existencia del token.

## Cómo se consume cada API

- Autenticación: `src/services/authService.js`
- Incendios: `src/services/incendiosService.js`
- Donaciones: `src/services/donacionesService.js`
- Voluntarios: `src/services/voluntariosService.js`

Todas las llamadas pasan por `src/services/api.js` para manejar `Authorization` y errores HTTP.

## Cómo funcionan los CRUD

- GET: carga lista inicial del módulo.
- POST: registra un nuevo elemento.
- PUT: actualiza elemento existente usando el mismo endpoint.
- DELETE: elimina sobre `/api/... ?id=<id>`.
- Cada operación muestra mensajes de éxito/error y recarga la tabla.

## Qué queda pendiente

- Ejecutar la app contra APIs reales con backend activo.
- Verificar login real.
- Verificar CRUD real de cada módulo.
- Confirmar respuestas exactas de cada endpoint si cambian en producción.
# reforest-web
