## Scripts útiles

### Desarrollo

#### Base de datos

- Iniciar base de datos: `npm run db:up`
- Generar migraciones: `npm run db:generate`
- Aplicar migraciones: `npm run db:migrate`
- Insertar datos de prueba: `npm run db:seed`
- Detener base de datos: `npm run db:down`
- Ver logs: `npm run db:logs`

#### Aplicación

- Iniciar en desarrollo: `npm run dev`

#### Documentación

- Generar documentación OpenAPI (Swagger): `npm run openapi:generate`

---

### Staging

- Desplegar e iniciar todo: `npm run stage:up`
- Detener: `npm run stage:down`
- Reiniciar: `npm run stage:restart`
- Ver logs: `npm run stage:logs`
- Ver estado de contenedores: `npm run stage:ps`

> En staging, solo es necesario `npm run stage:up`. La base de datos y migraciones se gestionan automáticamente por el contenedor.

---

### Producción

- Desplegar y e iniciar todo (API, DB, etc): `npm run prod:up`
- Detener: `npm run prod:down`
- Reiniciar: `npm run prod:restart`
- Ver logs: `npm run prod:logs`
- Ver estado de contenedores: `npm run prod:ps`

> En producción, solo es necesario `npm run prod:up`. La base de datos y migraciones se gestionan automáticamente por el contenedor.
