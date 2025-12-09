# MinIO en Docker Swarm

Esta configuración es **mucho más limpia** que la manual porque Swarm maneja la red y el DNS.

## 🚀 Ventajas

1. **Sin `/etc/hosts`**: Swarm resuelve `minio1`, `minio2` automáticamente.
2. **Red Overlay**: Todos los nodos se ven como si estuvieran en la misma red local.
3. **Despliegue Centralizado**: Ejecutas el comando en un solo nodo (Manager).

## 📋 Requisitos

-   4 VPS conectados en red privada (recomendado).
-   Puertos abiertos entre ellos: 2377, 7946, 4789 (puertos de Swarm).

## 🛠️ Pasos de Instalación

### 1. Inicializar Swarm (en VPS 1 - Manager)

```bash
docker swarm init --advertise-addr <IP-PRIVADA-VPS1>
```

_Te dará un comando con un token._

### 2. Unir los otros nodos (en VPS 2, 3, 4)

Ejecuta el comando que te dio el paso 1 en los otros servidores:

```bash
docker swarm join --token <TOKEN> <IP-PRIVADA-VPS1>:2377
```

### 3. Etiquetar los Nodos (CRUCIAL)

Para que MinIO sepa qué contenedor va en qué disco físico, etiquetamos los nodos.
En el **Manager (VPS 1)** ejecuta:

```bash
# Listar nodos para ver sus IDs o Hostnames
docker node ls

# Asignar etiquetas (reemplaza HOSTNAME por el nombre real del nodo)
docker node update --label-add minio-node=1 <HOSTNAME-VPS1>
docker node update --label-add minio-node=2 <HOSTNAME-VPS2>
docker node update --label-add minio-node=3 <HOSTNAME-VPS3>
docker node update --label-add minio-node=4 <HOSTNAME-VPS4>
```

### 4. Preparar Discos

En **CADA** servidor, asegúrate de que existan las carpetas:

```bash
mkdir -p /mnt/disk1 /mnt/disk2
```

### 5. Desplegar el Stack

En el **Manager (VPS 1)**:

```bash
# Copia docker-compose.yml, nginx.conf y .env a una carpeta
docker stack deploy -c docker-compose.yml minio-stack
```

## 🔍 Verificar

```bash
docker service ls
docker service ps minio-stack_minio1
```

## 🌐 Conexión

Conéctate a la IP de **CUALQUIER** nodo del Swarm en el puerto 9000.
Swarm tiene un "Routing Mesh" que redirige el tráfico automáticamente.
