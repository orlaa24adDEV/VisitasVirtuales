# Visitas Virtuales — Base de datos

> **multi-inquilino (multi-tenant):** Una instancia de la aplicación ofrece servicio a varios institutos. Una única base de datos almacena datos de múltiples institutos, separándolos lógicamente mediante una columna discriminadora (clave foránea).

Se utiliza el ORM **Drizzle** para generar el schema y realizar migraciones a partir de `./src/db/schema.js`. Los [scripts](./scripts.md) disponibles facilitan estas operaciones.

## `centers` (Institutos)

| Campo           | Tipo   | Restricciones |
| :-------------- | :----- | :------------ |
| **id**          | SERIAL | PRIMARY KEY   |
| **name**        | TEXT   | NOT NULL      |
| **description** | TEXT   | NULL allowed  |
| **location**    | TEXT   | NOT NULL      |

## `users` (Usuarios)

**Cada usuario pertenece a un centro y tiene un rol que le otorga diferentes permisos** (_admin_, _teacher_ o _student_)

| Campo         | Tipo       | Restricciones                                    |
| :------------ | :--------- | :----------------------------------------------- |
| **id**        | SERIAL     | PRIMARY KEY                                      |
| **email**     | TEXT       | NOT NULL, UNIQUE                                 |
| **username**  | TEXT       | NOT NULL, UNIQUE                                 |
| **password**  | TEXT       | NOT NULL                                         |
| **role**      | user_roles | NOT NULL, DEFAULT 'student',                     |
| **center_id** | INTEGER    | NOT NULL, FK -> `centers(id)`, ON DELETE CASCADE |

> Por defecto, los usuarios tendrán el rol de _student_, a excepción del primer usuario insertado en la base de datos que recibirá el rol de admin.
> Los administradores se encargarán de entregar a los profesores sus correspondientes roles.

## `pois` (POIs)

**Tabla de puntos de interés. Cada POI está asociado a un centro y un usuario y contiene detalles en formato JSONB.**

| Campo         | Tipo    | Restricciones                                    |
| :------------ | :------ | :----------------------------------------------- |
| **id**        | SERIAL  | PRIMARY KEY                                      |
| **name**      | TEXT    | NOT NULL                                         |
| **details**   | JSONB   | NOT NULL                                         |
| **user_id**   | INTEGER | NOT NULL, FK -> `users(id)`, ON DELETE CASCADE   |
| **center_id** | INTEGER | NOT NULL, FK -> `centers(id)`, ON DELETE CASCADE |

> Restricción de unicidad compuesta: `UNIQUE(name, center_id)`.
> No pueden existir dos POIs con el mismo nombre dentro de un mismo centro.

## `stats` (Historial_Logs)

**Almacena estadísticas de diferentes tipos.**

- `POI_VISIT` -> _`stats:center_3:poi_5:visit_count`_
- `CENTER_VISIT` -> _`stats:center_1:user_4:visit_count`_
- `USER_LOGIN` -> _`stats:user_10:login_count`_
- `...`

| Campo           | Tipo      | Restricciones                       |
| :-------------- | :-------- | :---------------------------------- |
| **id**          | SERIAL    | PRIMARY KEY                         |
| **event_type**  | TEXT      | NOT NULL                            |
| **event_count** | INTEGER   | NOT NULL, DEFAULT 0                 |
| **timestamp**   | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

> Para evitar sobrecargar la base de datos, usamos **Redis** (memoria volátil) para permitir el acceso y actualización de estas estadísticas de forma rápida y volcamos estas estadísticas a la base de datos cada cierto tiempo mediante una **tarea cron**.

## `stats_users`

**Tabla de unión para consultar estadísticas asociadas a un usuario concreto**

| Campo       | Tipo    | Restricciones                                  |
| :---------- | :------ | :--------------------------------------------- |
| **id**      | SERIAL  | PRIMARY KEY                                    |
| **stat_id** | INTEGER | NOT NULL, FK -> `stats(id)`, ON DELETE CASCADE |
| **user_id** | INTEGER | NOT NULL, FK -> `users(id)`, ON DELETE CASCADE |

## `stats_pois`

**Tabla de unión para consultar estadísticas asociadas a un punto de interés concreto**

| Campo       | Tipo    | Restricciones                                  |
| :---------- | :------ | :--------------------------------------------- |
| **id**      | SERIAL  | PRIMARY KEY                                    |
| **stat_id** | INTEGER | NOT NULL, FK -> `stats(id)`, ON DELETE CASCADE |
| **poi_id**  | INTEGER | NOT NULL, FK -> `pois(id)`, ON DELETE CASCADE  |

## `user_roles`

**Enum** en la base de datos que define los posibles roles para los usuarios.

| Valor        | Descripción                                                                           |
| :----------- | :------------------------------------------------------------------------------------ |
| `admin`      | Control total sobre el sistema, todos los centros, todos los POIs y gestión de roles. |
| `profesor`   | Gestión de POIs y consulta de estadísticas de su propio centro.                       |
| `estudiante` | Rol por defecto. Acceso de lectura a POIs                                             |

## Datos de prueba

Ejecuta `npm run db:seed` (tras generar y aplicar las migraciones) para insertar datos de prueba en la base de datos.
> **Atención:** Esto eliminará cualquier información que hayas insertado de forma manual.

Ejecuta `npm run db:studio` y accede a [https://local.drizzle.studio](https://local.drizzle.studio), la aplicación web de Drizzle Kit Studio,
donde podras explorar y consultar la base de datos.

> El historial de migraciones se encuentra en `./drizzle`.

> El schema de la base de datos se encuentra en `./src/db/schema.js`. Será necesario generar y aplicar migraciones tras editarlo.

### Usuarios de prueba

| email                         | username   | password  | role        | centro (ID ref)     |
| :---------------------------- | :--------- | :-------- | :---------- | :------------------ |
| **admin_mad@instituto.es**    | admin_mad  | Admin123! | **admin**   | Instituto Madrid    |
| **admin_bar@instituto.es**    | admin_bar  | Admin123! | **admin**   | Instituto Barcelona |
| **admin_sev@instituto.es**    | admin_sev  | Admin123! | **admin**   | Instituto Sevilla   |
| **profesor_mad@instituto.es** | prof_mad   | Profe123! | **teacher** | Instituto Madrid    |
| **profesor_bar@instituto.es** | prof_bar   | Profe123! | **teacher** | Instituto Barcelona |
| **profesor_sev@instituto.es** | prof_sev   | Profe123! | **teacher** | Instituto Sevilla   |
| **alumno_mad@instituto.es**   | alumno_mad | Alumno123! | **student** | Instituto Madrid    |
| **alumno_bar@instituto.es**   | alumno_bar | Alumno123! | **student** | Instituto Barcelona |
| **alumno_sev@instituto.es**   | alumno_sev | Alumno123! | **student** | Instituto Sevilla   |

Cada centro cuenta con POIs de prueba (Cafetería, Biblioteca, Aulas, etc.) asociados a usuarios creadores.
