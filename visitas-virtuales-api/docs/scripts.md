# Scripts

## Desarrollo

### Base de datos

- **Generar migraciones** (sentencias DDL que se ejecutarán en la DB)
  > `npm run db:generate`
- **Iniciar base de datos** (PostgreSQL y pgAdmin en Docker Compose)
  > `npm run db:up` \
  > `npm run db:up:watch`
- **Insertar datos de prueba**
  > `npm run db:seed`
- **Aplicar migraciones**
  > `npm run db:migrate:dev`
- **Detener base de datos**
  > `npm run db:down`
- **Ver logs**
  > `npm run db:logs`

### Aplicación

- **Iniciar la aplicación**
  > `npm run dev`

### API & Documentación

- **Generar especificación OpenAPI**
  > `npm run openapi:generate`

## Producción

### Base de datos

- **Aplicar migraciones**
  > `npm run db:migrate:prod`

### Aplicación

- **Iniciar la aplicación**
  > `npm run deploy:prod:up`
- **Detener la aplicación**
  > `npm run deploy:prod:down`
- **Reiniciar la aplicación**
  > `npm run deploy:prod:restart`
- **Ver logs**
  > `npm run deploy:prod:logs`
- **Ver estado de contenedores**
  > `npm run deploy:prod:ps`
