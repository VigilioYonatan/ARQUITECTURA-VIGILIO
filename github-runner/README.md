# GitHub Actions Self-Hosted Runner

Este servicio ejecuta tus pipelines de CI/CD dentro de tu propio cluster, ahorrando costos y acelerando los builds de Docker.

## 🚀 Configuración

### 1. Obtener Token de GitHub

1.  Ve a tu cuenta de GitHub -> Settings -> Developer Settings -> Personal access tokens -> Tokens (classic).
2.  Genera un nuevo token con el permiso **`repo`** (Full control of private repositories).
3.  Copia el token y pégalo en `.env`.

### 2. Configurar Repositorio

Edita `docker-compose.yml` y pon la URL de tu repositorio (o de tu organización si quieres compartir el runner):
`REPO_URL: https://github.com/tu-usuario/tu-repo`

### 3. Desplegar

```bash
docker stack deploy -c docker-compose.yml runner-stack
```

## 📝 Cómo usar en tus Workflows

En tus archivos `.github/workflows/deploy.yml`, cambia `runs-on: ubuntu-latest` por:

```yaml
jobs:
    build:
        runs-on: [self-hosted, swarm] # ← Usa tu runner
        steps:
            - uses: actions/checkout@v3

            - name: Build Docker Image
              run: docker build -t mi-app .
              # Esto usará el Docker de tu servidor, ¡mucho más rápido!
```

## 🛡️ Seguridad y Recursos

-   **Límites:** El runner está limitado a 2 CPUs y 2GB RAM para no afectar a tus bases de datos.
-   **Docker Socket:** El runner tiene acceso al socket de Docker (`/var/run/docker.sock`) para poder construir imágenes. Esto es necesario pero implica que el runner tiene control total sobre Docker en ese nodo.
