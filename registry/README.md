# Docker Registry Privado (con MinIO)

Este servicio te permite guardar tus imágenes Docker de forma privada, ilimitada y segura, usando tu cluster MinIO como almacenamiento.

## 🚀 Instalación

### 1. Preparar MinIO

Entra a tu MinIO y crea un bucket llamado `docker-registry`.

```bash
docker exec minio mc mb local/docker-registry
```

### 2. Generar Contraseña (htpasswd)

Necesitas crear un archivo con tu usuario y contraseña encriptada.
Si tienes `htpasswd` instalado (apache2-utils):

```bash
htpasswd -Bc auth/htpasswd miusuario
```

Si NO tienes `htpasswd`, usa este comando Docker para generarlo:

```bash
docker run --entrypoint htpasswd registry:2 -Bbn miusuario mipassword > auth/htpasswd
```

### 3. Desplegar

```bash
docker stack deploy -c docker-compose.yml registry-stack
```

## 💻 Cómo Usar (Desde tu PC)

### 1. Login

```bash
docker login registry.tudominio.com
# Usuario: miusuario
# Password: mipassword
```

### 2. Etiquetar Imagen (Tag)

```bash
# Construir
docker build -t mi-app .

# Etiquetar para subir
docker tag mi-app registry.tudominio.com/mi-app:v1
```

### 3. Subir (Push)

```bash
docker push registry.tudominio.com/mi-app:v1
```

### 4. Descargar en el Servidor (Pull)

```bash
docker pull registry.tudominio.com/mi-app:v1
```
