#!/bin/bash
set -e

echo "Inicializando extensión Citus..."

# Crear extensión Citus
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE EXTENSION IF NOT EXISTS citus;
    
    -- Verificar que Citus está instalado
    SELECT * FROM citus_version();
EOSQL

echo "Extensión Citus inicializada correctamente"
