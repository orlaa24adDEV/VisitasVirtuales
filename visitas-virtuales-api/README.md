# Visitas Virtuales API
API para gestionar visitas virtuales en centros educativos.

## Características principales

- **Arquitectura multi‑inquilino**: una única instancia de Express, PostgreSQL y MinIO da servicio a múltiples centros educativos.  
- **Seguridad**: Autenticación mediante JWT (cookies HTTP‑only), Helmet para proteger cabeceras HTTP y rate limiting para evitar abusos.  
- **Tipado**: Uso de TypeScript y Zod para validación estricta de datos y definición del contrato de la API.  
- **Despliegue**: El proyecto se despliega mediante Docker y PM2. Ficheros relevantes:  
  - `docker-compose.prod.yml`  
  - `Dockerfile`  
  - `docker-entrypoint.sh`  
  > También existe un entorno de **staging** para pruebas antes de producción (`docker-compose.stage.yml`).  
  
  > GitHub Actions está configurado para deploy automático a staging (`.github/workflows/deploy-stage.yml`).  

## Roles de usuario

- **Administradores (admin)**: Control completo de centros, Puntos de Interés (POIs), usuarios y auditoría.  
- **Profesores (teacher)**: Pueden editar POIs de cualquier centro y actualizar su propio perfil. No tienen permisos de gestión de usuarios ni acceso a auditoría.  
- **Invitados (guest)**: Acceso de lectura a centros y POIs. No se almacenan en la base de datos. Cualquier usuario no autenticado se considera invitado.  

## Guía rápida para desarrollo

1. **Preparar el proyecto**:
    ```bash
    git clone https://github.com/jaimemoya-bit/VisitasVirtualesZaitec
    git switch Web_Zaitec
    cd VisitasVirtualesZaitec/visitas-virtuales-api
    ```

2. **Instalar dependencias**:  
   `npm install`

3. **Configurar el entorno**: Copia `.env.template` a `.env` y define credenciales seguras para:
    - `POSTGRES_PASSWORD`
    - `JWT_SECRET`
    - `MINIO_ROOT_PASSWORD`

    > Puedes usar `openssl rand -hex 32` para generar credenciales seguras. Usa valores distintos para cada variable.

4. **Iniciar la base de datos**:
    ```bash
    npm run db:up
    npm run db:logs # opcional, para ver logs
    ```

5. **Iniciar almacén de objetos (MinIO)**:
    ```bash
    npm run storage:up
    npm run storage:logs # opcional, para ver logs
    ```

    > MinIO es un servicio de almacenamiento de objetos compatible con S3. Se utiliza para almacenar imágenes de centros y usuarios.

6. **Aplicar migraciones e insertar datos de prueba**:
    ```bash
    npm run db:generate
    npm run db:migrate
    npm run db:seed
    ```

    > Las migraciones versionan el esquema y permiten revertir y reproducir un conjunto de cambios. Más info: [db](./docs/db.md)

7. **Iniciar la aplicación**:  
   `npm run dev`

---

## Notas para stage/prod (Docker)

- **Variables de entorno:** En producción y staging no se usa `.env`. Docker las carga mediante `env_file` desde `.env.stage` o `.env.prod`.  
- **Networking:** Las URLs deben usar los hostnames de Docker (`postgres_service`, `vv-minio`) en lugar de `localhost`.

---

## Herramientas útiles

### Documentación API
- OpenAPI / Swagger: http://localhost:8000/api-docs

### Gestión de Base de Datos

- **Drizzle Kit Studio**:
  ```bash
  npm run db:studio
  # luego abre https://local.drizzle.studio
  ```

- **psql**:
  ```bash
  psql -h localhost -U postgres -p 5433 -d visitas_virtuales_db
  -- dentro de psql:
  \dt               -- listar tablas
  \d <nombre_tabla> -- ver columnas
  ```

## Solución de problemas comunes

### Error de conexión a la base de datos

**Causas comunes:**
- El contenedor de PostgreSQL no se está ejecutando.  
- Faltan variables de entorno (`POSTGRES_USER`, `POSTGRES_PASSWORD`).  
- El volumen conserva credenciales antiguas.
- Endpoint incorrecto (local vs Docker).

**Soluciones:**
- **Confirmar que el contenedor de PostgreSQL está activo**:  
   ```bash
   docker ps # busca el contenedor de postgres
   # Si no está activo, inicialo:
   npm run db:up
   npm run db:logs # para ver si hay errores al iniciar
   ```
- **Revisar variables de entorno**  
   Asegúrate de que `.env` contiene *todas* las variables requeridas.

- **Recrear la base de datos si cambiaste credenciales**  
   Si estás en entorno de desarrollo y cambiaste las credenciales, el volumen de Docker puede estar reteniendo las antiguas. Para solucionarlo:
   ```bash
   docker compose down
   docker volume ls # identifica el volumen de postgres
   docker volume rm <nombre_del_volumen_de_postgres>
   docker compose up -d
   ```
- **Usar el host correcto**  
   - Desarrollo local: `POSTGRES_HOST=localhost`  
   - Docker (stage/prod): `POSTGRES_HOST=postgres_service`
---

### Error de conexión al almacenamiento (MinIO)

**Causas comunes:**
- El contenedor de MinIO no se está ejecutando.  
- Faltan variables de entorno (`MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD`, `MINIO_ENDPOINT`).  
- Endpoint incorrecto (local vs Docker).

**Soluciones:**
1. **Verificar variables de entorno**  
   Revisa que `.env` incluya todas las variables necesarias para MinIO. Compara con `.env.template`.

2. **Usar el endpoint correcto**  
   - Desarrollo local: `MINIO_ENDPOINT=localhost`  
   - Docker (stage/prod): `MINIO_ENDPOINT=vv-minio`

3. **Reiniciar MinIO**  
   ```bash
   npm run storage:up
   ```

4. **Ver logs si sigue fallando**  
   ```bash
   npm run storage:logs
   ```