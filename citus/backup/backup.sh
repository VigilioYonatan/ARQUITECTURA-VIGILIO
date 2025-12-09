#!/bin/bash
set -e

# Configuración
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="/tmp/backup_${TIMESTAMP}.dump"
S3_PATH="s3://${MINIO_BUCKET}/citus-backups/backup_${TIMESTAMP}.dump"

echo "[${TIMESTAMP}] 🚀 Iniciando backup de Citus..."

# 1. Dump de la base de datos
# Usamos pg_dumpall para incluir roles y todas las DBs, o pg_dump para una específica
# Aquí usamos pg_dump con formato custom (-Fc) que es más flexible
echo "📦 Generando dump..."
PGPASSWORD=$POSTGRES_PASSWORD pg_dump -h $POSTGRES_HOST -U $POSTGRES_USER -F c $POSTGRES_DB > $BACKUP_FILE

# 2. Subir a MinIO (Estrategia Ultra-Minimalista: 4 Archivos)
# Mantendremos solo 4 archivos fijos, sobrescribiéndolos según corresponda.

DAY_OF_WEEK=$(date +%u) # 1=Lunes, 7=Domingo
DAY_OF_MONTH=$(date +%d)

echo "☁️ Subiendo backups..."

# 1. Backup de AYER (Siempre se sobrescribe con el de hoy, que mañana será ayer)
# Conceptualmente, el backup que subimos HOY es el más reciente.
# Para cumplir "1 de ayer y 1 de antes de ayer", necesitamos rotar.

# Rotación manual en MinIO usando 'mc' (aws cli no tiene move fácil)
# Simulamos rotación renombrando al subir

# A. El backup de HOY se convierte en "ayer" mañana.
# B. El backup de "ayer" se convierte en "antes-de-ayer".

# Paso 1: Mover 'ayer.dump' a 'antes-de-ayer.dump'
aws --endpoint-url $MINIO_ENDPOINT s3 cp s3://${MINIO_BUCKET}/citus/ayer.dump s3://${MINIO_BUCKET}/citus/antes-de-ayer.dump || true

# Paso 2: Subir el nuevo como 'ayer.dump' (que es el más fresco)
aws --endpoint-url $MINIO_ENDPOINT s3 cp $BACKUP_FILE s3://${MINIO_BUCKET}/citus/ayer.dump

# Paso 3: Backup Semanal (Solo los Domingos)
if [ "$DAY_OF_WEEK" -eq "7" ]; then
    echo "📅 Domingo: Actualizando backup semanal..."
    aws --endpoint-url $MINIO_ENDPOINT s3 cp $BACKUP_FILE s3://${MINIO_BUCKET}/citus/semana-pasada.dump
fi

# Paso 4: Backup Mensual (Solo el día 1)
if [ "$DAY_OF_MONTH" -eq "01" ]; then
    echo "📅 Día 1: Actualizando backup mensual..."
    aws --endpoint-url $MINIO_ENDPOINT s3 cp $BACKUP_FILE s3://${MINIO_BUCKET}/citus/mes-pasado.dump
fi

# 3. Limpieza
rm $BACKUP_FILE
echo "✅ Backup completado exitosamente."
