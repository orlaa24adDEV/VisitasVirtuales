# Visitas Virtuales — DB schema

> **multi-inquilino (multi-tenant):** Una instancia de la aplicación ofrece servicio a varios institutos. Una única base de datos almacena datos de múltiples institutos, separándolos lógicamente mediante una columna discriminadora (clave foránea).

---

## `centers` (Institutos)

| Campo           | Tipo   | Restricciones |
| :-------------- | :----- | :------------ |
| **id**          | SERIAL | PRIMARY KEY   |
| **name**        | TEXT   | NOT NULL      |
| **description** | TEXT   | NOT NULL      |
| **location**    | TEXT   | NOT NULL      |

---

## `users` (Usuarios)

**Cada usuario** (profesor o estudiante) **pertenece a un centro.**

| Campo         | Tipo    | Restricciones                 |
| :------------ | :------ | :---------------------------- |
| **id**        | SERIAL  | PRIMARY KEY                   |
| **email**     | TEXT    | NOT NULL, UNIQUE              |
| **username**  | TEXT    | NOT NULL, UNIQUE              |
| **password**  | TEXT    | NOT NULL                      |
| **center_id** | INTEGER | NOT NULL, FK -> `centers(id)` |
| **role**      | TEXT    | NOT NULL                      |

---

## `pois` (POIs)

**Tabla de puntos de interés. Cada punto de interés esta asociado a un centro y puede tener unos detalles, proporcionados en formato JSON.**

| Campo         | Tipo    | Restricciones                 |
| :------------ | :------ | :---------------------------- |
| **id**        | SERIAL  | PRIMARY KEY                   |
| **center_id** | INTEGER | NOT NULL, FK -> `centers(id)` |
| **name**      | TEXT    | NOT NULL                      |
| **details**   | JSONB   | NOT NULL                      |

---

## `stats` (Historial_Logs)

**Almacena estadísticas de diferentes tipos:**

- `POI_VISIT` -> _`stats:center_3:poi_5:visit_count`_
- `CENTER_VISIT` -> _`stats:center_1:user_4:visit_count`_
- `USER_LOGIN` -> _`stats:user_10:login_count`_
- `...`

| Campo           | Tipo      | Restricciones                 |
| :-------------- | :-------- | :---------------------------- |
| **id**          | SERIAL    | PRIMARY KEY                   |
| **center_id**   | INTEGER   | NOT NULL, FK -> `centers(id)` |
| **event_type**  | TEXT      | NOT NULL                      |
| **event_count** | INTEGER   | DEFAULT 0                     |
| **updated_at**  | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP     |

> Para evitar sobrecargar la base de datos, usamos **Redis** (memoria volátil) para permitir el acceso y actualización de estas estadísticas de forma rápida y volcamos estas estadísticas a la base de datos cada cierto tiempo mediante una **tarea cron**.

---

## `stats_users`

**Tabla de unión para consultar estadísticas asociadas a un usuario concreto**

| Campo       | Tipo    | Restricciones               |
| :---------- | :------ | :-------------------------- |
| **id**      | SERIAL  | PRIMARY KEY                 |
| **stat_id** | INTEGER | NOT NULL, FK -> `stats(id)` |
| **user_id** | INTEGER | NOT NULL, FK -> `users(id)` |

---

## `stats_pois`

**Tabla de unión para consultar estadísticas asociadas a un punto de interés concreto**

| Campo       | Tipo    | Restricciones               |
| :---------- | :------ | :-------------------------- |
| **id**      | SERIAL  | PRIMARY KEY                 |
| **stat_id** | INTEGER | NOT NULL, FK -> `stats(id)` |
| **poi_id**  | INTEGER | NOT NULL, FK -> `pois(id)`  |
