#!/bin/bash
# Script para configurar múltiples bases de datos y usuarios en Citus
# Ejecutar desde el coordinator después del despliegue

set -e

echo "========================================="
echo "  🗄️  Configuración Multi-Proyecto Citus"
echo "========================================="

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Función para crear base de datos y usuario
create_project_db() {
    local DB_NAME=$1
    local DB_USER=$2
    local DB_PASSWORD=$3
    
    echo -e "${BLUE}📦 Creando proyecto: $DB_NAME${NC}"
    
    # Crear base de datos
    docker exec -i citus-master psql -U postgres <<EOF
-- Crear base de datos
CREATE DATABASE $DB_NAME;

-- Crear usuario
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';

-- Dar permisos
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;

\c $DB_NAME

-- Crear extensión Citus
CREATE EXTENSION IF NOT EXISTS citus;

-- Dar permisos en el schema
GRANT ALL ON SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;

-- Verificar
SELECT citus_version();
EOF
    
    echo -e "${GREEN}✅ Proyecto $DB_NAME creado${NC}"
    echo ""
}

# Crear proyectos de ejemplo
echo -e "${YELLOW}Creando proyectos de ejemplo...${NC}"
echo ""

# Proyecto 1: Producción
create_project_db "app_production" "app_user" "AppPassword123!"

# Proyecto 2: Staging
create_project_db "app_staging" "staging_user" "StagingPassword123!"

# Proyecto 3: Analytics
create_project_db "analytics" "analytics_user" "AnalyticsPassword123!"

# Mostrar resumen
echo "========================================="
echo -e "${GREEN}✅ Configuración completada${NC}"
echo "========================================="
echo ""
echo "📊 Bases de datos creadas:"
echo ""

docker exec -i citus-master psql -U postgres <<EOF
SELECT datname as "Base de Datos" 
FROM pg_database 
WHERE datname NOT IN ('postgres', 'template0', 'template1')
ORDER BY datname;
EOF

echo ""
echo "👥 Usuarios creados:"
echo ""

docker exec -i citus-master psql -U postgres <<EOF
SELECT usename as "Usuario" 
FROM pg_user 
WHERE usename != 'postgres'
ORDER BY usename;
EOF

echo ""
echo "========================================="
echo "📝 Información de Conexión:"
echo "========================================="
echo ""
echo "Proyecto 1 - Producción:"
echo "  Database: app_production"
echo "  User: app_user"
echo "  Password: AppPassword123!"
echo "  Connection: postgresql://app_user:AppPassword123!@citus-master:5432/app_production"
echo ""
echo "Proyecto 2 - Staging:"
echo "  Database: app_staging"
echo "  User: staging_user"
echo "  Password: StagingPassword123!"
echo "  Connection: postgresql://staging_user:StagingPassword123!@citus-master:5432/app_staging"
echo ""
echo "Proyecto 3 - Analytics:"
echo "  Database: analytics"
echo "  User: analytics_user"
echo "  Password: AnalyticsPassword123!"
echo "  Connection: postgresql://analytics_user:AnalyticsPassword123!@citus-master:5432/analytics"
echo ""
echo "========================================="
echo "📚 Próximos pasos:"
echo "========================================="
echo ""
echo "1. Conectar desde tu aplicación:"
echo "   const pool = new Pool({"
echo "     host: 'citus-master',"
echo "     database: 'app_production',"
echo "     user: 'app_user',"
echo "     password: 'AppPassword123!'"
echo "   });"
echo ""
echo "2. Crear tablas distribuidas:"
echo "   docker exec -it citus-master psql -U app_user -d app_production"
echo "   CREATE TABLE users (id BIGSERIAL, name TEXT);"
echo "   SELECT create_distributed_table('users', 'id');"
echo ""
echo "========================================="
