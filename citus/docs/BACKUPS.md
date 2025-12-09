# Backups Automáticos en Citus

El stack de Citus incluye un servicio de backup automático (`citus-backup`) que se ejecuta diariamente.

## ⚙️ Cómo Funciona

1.  **Servicio Dedicado:** Un contenedor ligero (`alpine` + `pg_dump` + `aws-cli`) corre junto al cluster.
2.  **Cron Job:** Ejecuta el script de backup todos los días a las **3:00 AM**.
3.  **Proceso:**
    -   Genera un dump comprimido de la base de datos.
    -   Lo sube automáticamente a tu cluster MinIO.
    -   Limpia el archivo local.

## 🧠 Conceptos Clave (Mental Model)

-   **Un Archivo = Todos los Proyectos:** Citus guarda todas las bases de datos (`app1`, `app2`, `app3`) en un solo cluster. Por eso, el backup es un solo archivo `.dump` que contiene **TODO**.
-   **Restauración Flexible:** Aunque es un solo archivo gigante, puedes restaurar **solo un proyecto** específico si lo necesitas. No estás obligado a restaurar todo.
-   **Seguridad:** Si borras una tabla en `app1`, puedes recuperarla sin afectar a `app2`.

## 🔧 Configuración

El servicio se configura automáticamente con las variables de entorno en `docker-compose.yml`.

### Variables Requeridas (.env)

Asegúrate de tener estas variables en tu archivo `.env` de Citus:

```env
# Postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=tu_password

# MinIO (para subir los backups)
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=tu_minio_password
```

### Personalizar Horario

Para cambiar la hora del backup, edita `citus/backup/Dockerfile`:

```dockerfile
# Ejemplo: Ejecutar a las 5:00 AM
RUN echo "0 5 * * * /usr/local/bin/backup.sh ..."
```

Y reconstruye la imagen:

```bash
docker compose build citus-backup
docker stack deploy -c docker-compose.yml citus-stack
```

## 📦 Restauración de Backups

### 1. Descargar Backup desde MinIO

Usa la interfaz de MinIO o `mc` para descargar el archivo `.dump` que necesitas.

```bash
mc cp minio/backups/citus-backups/backup_20231201_030000.dump ./backup.dump
```

### 2. Restaurar en Citus

````bash
# Copiar al contenedor Master
docker cp ./backup.dump $(docker ps -q -f name=citus-master):/tmp/backup.dump

# Ejecutar restauración COMPLETA (Todas las DBs)
docker exec -it $(docker ps -q -f name=citus-master) pg_restore -U postgres -d postgres -v /tmp/backup.dump

### 3. Restaurar SOLO UN PROYECTO (Ej: app1)
Si solo quieres recuperar una base de datos específica sin tocar las demás:
 
```bash
# Esto restaura SOLO 'app1' y deja 'app2', 'app3' intactas
docker exec -it $(docker ps -q -f name=citus-master) pg_restore -U postgres -d app1 --clean --create -v /tmp/backup.dump
````

````

## ⏳ Estrategia de Retención "Smart" (GFS)

Las empresas no guardan 365 backups diarios. Usan la estrategia **Abuelo-Padre-Hijo (GFS)**.
El script de backup ya está configurado para soportar esto automáticamente:

1.  **Diarios (`citus/daily/`):** Se suben todos los días.
2.  **Mensuales (`citus/monthly/`):** El día 1 de cada mes, se guarda una copia extra aquí.

### Configuración en MinIO (Lifecycle Rules)

Para que esto funcione, debes crear **2 reglas** en tu bucket de MinIO:

#### Regla 1: Limpieza Diaria

-   **Target Prefix:** `citus/daily/`
-   **Action:** Expire objects
-   **Days:** `30`
-   _Resultado: Tienes los últimos 30 días recuperables. El día 31 se borra._

#### Regla 2: Retención Mensual

-   **Target Prefix:** `citus/monthly/`
-   **Action:** Expire objects
-   **Days:** `365` (o déjalo vacío para guardar por siempre)
-   _Resultado: Guardas 1 backup por mes durante un año._

### Resumen de lo que tendrás:

-   ✅ Últimos 30 días: Backup de cada día.
-   ✅ Último año: 1 backup por mes.
-   **Total archivos:** ~42 archivos (30 diarios + 12 mensuales) en lugar de 365.

---

### 📉 Opción: Estrategia Minimalista (Solo 10 archivos)

Si 42 archivos te parece mucho, usa esta configuración más agresiva:

#### Regla 1: Limpieza Diaria (Solo 1 semana)

-   **Target Prefix:** `citus/daily/`
-   **Days:** `7`
-   _Resultado: Tienes backup de cada día de la última semana._

#### Regla 2: Retención Trimestral (Solo 3 meses)

-   **Target Prefix:** `citus/monthly/`
-   **Days:** `90`
-   _Resultado: Guardas solo los últimos 3 meses._

**Total archivos:** 7 diarios + 3 mensuales = **10 archivos.**

## 🛠️ Ejecución Manual

Si quieres forzar un backup en este momento:

```bash
# Buscar el ID del contenedor de backup
BACKUP_CONTAINER=$(docker ps -q -f name=citus_citus-backup)

# Ejecutar script
docker exec $BACKUP_CONTAINER /usr/local/bin/backup.sh
````
