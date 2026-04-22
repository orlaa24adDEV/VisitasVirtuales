# Visitas Virtuales API

API para visitas virtuales en centros educativos.

Arquitectura **multi-inquilino**: una sola instancia de Express y PostgreSQL da servicio a múltiples centros educativos. Autenticación con JWT y cookies HTTP-only.

Permite registrar y autenticar usuarios de tres tipos:

- **Administradores (_admin_)**: pueden gestionar todos los centros y Puntos de Interés (POIs), registrar usuarios, administrar roles, ver estadísticas y logs.
- **Profesores (_teacher_)**: pueden crear, leer, actualizar y eliminar POIs de su propio centro.
- **Invitados (_guest_)**: acceso de lectura a POIs, sin necesidad de autenticación. No se almacenan en la base de datos, pero se les asigna este rol por defecto. Este rol también se asigna a los usuarios creados por el administrador si no se especifica un rol.

Desplegado mediante Docker y PM2. Consulta [docker-compose.prod.yml](./docker-compose.prod.yml), [Dockerfile](./Dockerfile) y [docker-entrypoint.sh](./docker-entrypoint.sh).

Entorno de staging disponible para pruebas antes de producción ([docker-compose.stage.yml](./docker-compose.stage.yml)).

GitHub Actions configurado para deploy automático a staging. Consulta [.github/workflows/deploy-stage.yml](./.github/workflows/deploy-stage.yml) en la raíz del repositorio.

### Guía rápida para desarrollo

1.  **Preparar el proyecto**:

    ```bash
    git clone https://github.com/jaimemoya-bit/VisitasVirtualesZaitec
    git switch Web_Zaitec
    cd VisitasVirtualesZaitec/visitas-virtuales-api
    ```

2.  **Instalar dependencias**: `npm install`
3.  **Configurar el entorno**: Copia `.env.template` a `.env` y define credenciales seguras para:
    - `POSTGRES_PASSWORD`
    - `JWT_SECRET`
      > Puedes usar `openssl rand -hex 32` para generar credenciales seguras. Usa valores distintos para cada variable.

4.  **Iniciar la base de datos**:

    ```bash
    npm run db:up
    npm run db:logs # opcional, para ver logs
    ```

5.  **Aplicar migraciones e insertar datos de prueba**:

    ```bash
    npm run db:generate
    npm run db:migrate
    npm run db:seed
    ```

    > Las migraciones versionan el esquema y permiten revertir cambios. Más info: [db](./docs/db.md)

6.  **Iniciar la aplicación**: `npm run dev`

---

> Para producción utiliza `.env.prod` (no definitivo) y para staging `.env.stage`. Ambos pueden generarse a partir de `.env.template`

---

### Herramientas útiles

#### Documentación API

- OpenAPI / Swagger: [http://localhost:8000/api-docs](http://localhost:8000/api-docs)

#### Gestión de Base de Datos

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
- **Scripts disponibles**: [scripts.md](./docs/scripts.md)
