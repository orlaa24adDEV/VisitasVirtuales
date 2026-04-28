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

- Generar documentación Swagger / OpenAPI: `npm run openapi:generate`

---

### Staging

- Desplegar y e iniciar todo: `npm run deploy:stage:up`
- Detener: `npm run deploy:stage:down`
- Reiniciar: `npm run deploy:stage:restart`
- Ver logs: `npm run deploy:stage:logs`
- Ver estado de contenedores: `npm run deploy:stage:ps`

> En staging, solo es necesario `npm run deploy:stage:up`. La base de datos y migraciones se gestionan automáticamente por el contenedor.

---

### Producción

- Desplegar y e iniciar todo (API, DB, etc): `npm run deploy:prod:up`
- Detener: `npm run deploy:prod:down`
- Reiniciar: `npm run deploy:prod:restart`
- Ver logs: `npm run deploy:prod:logs`
- Ver estado de contenedores: `npm run deploy:prod:ps`

> En producción, solo es necesario `npm run deploy:prod:up`. La base de datos y migraciones se gestionan automáticamente por el contenedor.
