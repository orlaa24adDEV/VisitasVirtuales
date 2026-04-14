
# Base de datos

ORM: **Drizzle**. Esquema definido en [./src/db/schema.js](../src/db/schema.js).

## `centers`
Centros educativos registrados en el sistema.

| Campo           | Tipo   | Restricciones |
| :-------------- | :----- | :------------ |
| id              | SERIAL | PRIMARY KEY   |
| name            | TEXT   | NOT NULL      |
| description     | TEXT   | NULL allowed  |
| location        | TEXT   | NOT NULL      |

## `users`
Usuarios registrados en el sistema.

| Campo     | Tipo       | Restricciones                        |
| :-------- | :--------- | :----------------------------------- |
| id        | SERIAL     | PRIMARY KEY                          |
| email     | TEXT       | NOT NULL, UNIQUE                     |
| username  | TEXT       | NOT NULL, UNIQUE                     |
| password  | TEXT       | NOT NULL                             |
| role      | user_roles | NOT NULL, DEFAULT 'student'          |

> Por defecto, los usuarios tendrán el rol de _student_, a excepción del primer usuario insertado en la base de datos que recibirá el rol de _admin_.
 Estos usuarios no están asociados a ningún centro en particular.

> Los administradores se encargarán de entregar a los profesores sus correspondientes roles.


## `pois`
Puntos de interes (POIs) asociados a un centro educativo.
| Campo      | Tipo    | Restricciones                                    |
| :--------- | :------ | :----------------------------------------------- |
| id         | SERIAL  | PRIMARY KEY                                      |
| name       | TEXT    | NOT NULL                                         |
| details    | JSONB   | NOT NULL                                         |
| user_id    | INTEGER | NOT NULL, FK users(id), ON DELETE CASCADE        |
| center_id  | INTEGER | NOT NULL, FK centers(id), ON DELETE CASCADE      |

> Restricción de unicidad compuesta: `UNIQUE(name, center_id)`. No pueden existir dos POIs con el mismo nombre dentro de un mismo centro.

> Los POIs son accesibles para todos los usuarios registrados.


## `stats` (Historial/Logs)
Registro de eventos relevantes para estadísticas y auditoría. Mantiene un conteo de eventos específicos.

| Campo        | Tipo      | Restricciones                       |
| :----------- | :-------- | :---------------------------------- |
| id           | SERIAL    | PRIMARY KEY                         |
| event_type   | TEXT      | NOT NULL                            |
| event_count  | INTEGER   | NOT NULL, DEFAULT 0                 |
| timestamp    | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

> Ejemplos: POI_VISIT, CENTER_VISIT, USER_LOGIN. Se usa Redis para acceso rápido y se vuelca a la base de datos periódicamente.

## `stats_users`
Estadísticas de usuarios asociados a eventos específicos.

| Campo    | Tipo    | Restricciones                                  |
| :------- | :------ | :--------------------------------------------- |
| id       | SERIAL  | PRIMARY KEY                                    |
| stat_id  | INTEGER | NOT NULL, FK stats(id), ON DELETE CASCADE      |
| user_id  | INTEGER | NOT NULL, FK users(id), ON DELETE CASCADE      |

## `stats_pois`
Estadísticas de POIs asociados a eventos específicos.

| Campo    | Tipo    | Restricciones                                  |
| :------- | :------ | :--------------------------------------------- |
| id       | SERIAL  | PRIMARY KEY                                    |
| stat_id  | INTEGER | NOT NULL, FK stats(id), ON DELETE CASCADE      |
| poi_id   | INTEGER | NOT NULL, FK pois(id), ON DELETE CASCADE       |


## `poi_history`
Trazabilidad detallada de cambios en los POIs para auditoría.

| Campo     | Tipo      | Restricciones                                  |
| :-------- | :-------- | :----------------------------------------------|
| id        | SERIAL    | PRIMARY KEY                                    |
| poi_id    | INTEGER   | NOT NULL, FK pois(id), ON DELETE CASCADE       |
| user_id   | INTEGER   | NOT NULL, FK users(id), ON DELETE CASCADE      |
| action    | TEXT      | NOT NULL                                       |
| timestamp | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP            |
| details   | JSONB     | Opcional. Información adicional del cambio      |

> Guarda un registro de cada acción relevante sobre un POI (creación, edición, borrado, etc.), quién la realizó y cuándo.

## `user_roles`

**Enum** en la base de datos que define los posibles roles para los usuarios.

| Valor        | Descripción                                                                           |
| :----------- | :------------------------------------------------------------------------------------ |
| `admin`      | Control total sobre el sistema, todos los centros, todos los POIs y gestión de roles. |
| `teacher`    | Gestión de POIs y consulta de estadísticas de su propio centro.                       |
| `student`    | Rol por defecto. Acceso de lectura a POIs                                             |

## Datos de prueba


Para insertart datos de prueba.
1. Genera y aplica migraciones (`npm run db:generate` y `npm run db:migrate`).
2. Ejecuta `npm run db:seed` para añadir usuarios de prueba, centros y POIs asociados.

    > ⚠️ Esto eliminará cualquier información que hayas insertado de forma manual.

Puedes explorar la base de datos con Drizzle Kit Studio:
- `npm run db:studio` y abre [https://local.drizzle.studio](https://local.drizzle.studio)

> Historial de migraciones: [./drizzle](../drizzle/)

> Esquema: [./src/db/schema.js](../src/db/schema.js) (genera y aplica migraciones tras editarlo)

### Usuarios de prueba

| email                         | username   | password  | role        | 
| :---------------------------- | :--------- | :-------- | :---------- | 
| **admin_mad@instituto.es**    | admin_mad  | Admin123! | **admin**   |
| **admin_bar@instituto.es**    | admin_bar  | Admin123! | **admin**   | 
| **admin_sev@instituto.es**    | admin_sev  | Admin123! | **admin**   | 
| **profesor_mad@instituto.es** | prof_mad   | Profe123! | **teacher** |
| **profesor_bar@instituto.es** | prof_bar   | Profe123! | **teacher** | 
| **profesor_sev@instituto.es** | prof_sev   | Profe123! | **teacher** |
| **alumno_mad@instituto.es**   | alumno_mad | Alumno123! | **student** |
| **alumno_bar@instituto.es**   | alumno_bar | Alumno123! | **student** |
| **alumno_sev@instituto.es**   | alumno_sev | Alumno123! | **student** | 