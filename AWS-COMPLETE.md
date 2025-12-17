1. CREAR AWS INSTANCIA

Seguridad a nuestra instancia o servidor

| Prioridad   | Tarea de Seguridad                                      | Descripción y Por Qué es Importante                                                                                                                                                                               |
| ----------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Crítica (1) | Configurar un Firewall (UFW/firewalld)                  | "Restringe el tráfico de red solo a los puertos necesarios (p. ej., 22/SSH, 80/HTTP, 443/HTTPS). Bloquea todo lo demás. Este es el primer punto de defensa contra escaneos y ataques externos."                   |
| Crítica (2) | "Asegurar SSH (Deshabilitar root, Claves SSH)           | Deshabilita el inicio de sesión del usuario root a través de SSH y usa autenticación basada en claves SSH en lugar de contraseñas. Esto previene ataques de fuerza bruta al usuario con más privilegios.          |
| Alta (3)    | Asegurar la API de Docker (Si es accesible remotamente) | "Por defecto, la API de Docker no debería ser accesible públicamente. Si la has expuesto para gestión remota, debes asegurarla con TLS/Certificados para cifrar la comunicación y autenticar clientes."           |
| Alta (4)    | Usuarios y Permisos de Docker                           | No ejecutes Docker o comandos docker como root a menos que sea absolutamente necesario. Crea un usuario no-root y agrégalo al grupo docker. Nunca compartas el socket docker.sock con contenedores no confiables. |
| Media (5)   | Actualizaciones de Seguridad (Host y Docker)            | Mantén el sistema operativo del VPS (Host) y el Motor de Docker actualizados. Las actualizaciones a menudo incluyen parches para vulnerabilidades de seguridad conocidas.                                         |
| Media (6)   | Limitar Recursos del Contenedor                         | Usas las opciones de limits (como CPU y memoria) en Docker Compose o al ejecutar contenedores. Esto evita que un contenedor comprometido consuma todos los recursos del host (ataque DoS interno).                |
| Media (7)   | Configurar Políticas de Reinicio y Logging              | Asegura que los contenedores tengan políticas de reinicio adecuadas (restart: always o on-failure). Configura el logging (p. ej., con un driver centralizado) para poder auditar la actividad maliciosa.          |
| Baja (8)    | Usar Imágenes Base Mínimas (Alpine)                     | Utiliza imágenes de Docker que sean lo más pequeñas posible (como las basadas en Alpine o scratch). Esto reduce la superficie de ataque al incluir menos software y librerías innecesarias.                       |
| Baja (9)    | Escaneo de Vulnerabilidades                             | Usa herramientas como Trivy, Clair o Snyk para escanear tus imágenes de Docker en busca de vulnerabilidades conocidas antes de desplegarlas.                                                                      |

### Implementación Técnica (Comandos Nivel Senior)

# RECOMENDACIONES CON tu ssh

Nunca tenerlos en descarga tu .pem

```bash
# iniciar ssh-agent
eval "$(ssh-agent -s)"


# mover tu .pem en la carpeta .ssh"
mv tupem.pem ~/.ssh/


#darle permisos
chmod 400 tupem.pem

#agregarlo a ssh-agent

ssh-add ~/.ssh/tupem.pem

# ver si esta agregado
ssh-add -l

# # quitarlo de ssh-agent
# ssh-add -d ~/.ssh/tupem.pem
```

Con esto ya no es necesario tener el .pem en descarga ni poner en el terminal -i tupem.pem

#### 1. Firewall (UFW) (no necesario en aws ec2 )

Para entornos Debian/Ubuntu:

```bash
sudo apt update && sudo apt upgrade -y
# Instalar y activar UFW
sudo apt update && sudo apt install ufw -y

# Bloquear todo el tráfico entrante por defecto (Default Deny)
sudo ufw default deny incoming # Bloquea todo el tráfico entrante por defecto (Default Deny)
# sudo ufw default allow outgoing # Permite todo el tráfico saliente por defecto (Default Allow)

# Permitir SSH (IMPORTANTE: Hacerlo antes de activar)
sudo ufw allow ssh # Permite el tráfico SSH (Puerto 22)

# ver status, ves los puertos abiertos
sudo ufw status

# Permitir tráfico Web
sudo ufw allow http
sudo ufw allow https
# Puerto de tu app (3000)
sudo ufw allow 3000/tcp

# Activar el firewall
sudo ufw enable
```

#### 1.1 Fail2Ban (no necesario en aws ec2 )

```bash
# Instalar Fail2Ban
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Status
sudo fail2ban-client status
# Status
# |- Number of jail:      1
# `- Jail list:   sshd

# ver ips bloqueadas
sudo fail2ban-client status sshd

# desbloquear ip
sudo fail2ban-client set sshd unbanip <IP>

# ver logs en tiempo real
sudo tail -f /var/log/fail2ban.log

# editar configuracion
sudo nano /etc/fail2ban/jail.conf

#  listas blancas, importante por que puedes que tengas muchos desarrolladores y se equivoquen
curl ifconfig.me
sudo nano /etc/fail2ban/jail.local
# [DEFAULT]
# ignoreip = 127.0.0.1/8 <tu ip># tu ip y espacio para agregar mas ips

# reiniciar
sudo systemctl restart fail2ban
```

| Parámetro | Descripción                                                                 | Ejemplo de Valor               |
| --------- | --------------------------------------------------------------------------- | ------------------------------ |
| bantime   | Duración del bloqueo de la IP (en segundos).                                | 600 (10 minutos) o 1h (1 hora) |
| findtime  | Ventana de tiempo (en segundos) para contar los intentos fallidos.          | 600 (10 minutos)               |
| maxretry  | Número de intentos fallidos antes de un bloqueo.                            | 5                              |
| ignoreip  | Lista de IPs o rangos que nunca serán bloqueados (añade tu propia IP aquí). | 127.0.0.1/8 192.168.1.0/24     |

#### 2. Asegurar SSH (Hardening Senior) (no necesario en aws ec2 )

<!-- leer importante aca -->

```bash
#!/bin/bash

CONFIG_FILE="/etc/ssh/sshd_config"
ADMIN_USER="tu_usuario_admin" # <<-- ¡!!IMPORTANTE!!!! Reemplazar con tu usuario de administración, cuidado aqui pones admin - c2-user IMPORTANTE
NEW_PORT="2222" # <<-- O el puerto que decidas

echo "Iniciando hardening de SSH..."

# 1. Copia de seguridad
sudo cp $CONFIG_FILE $CONFIG_FILE.bak
echo "Copia de seguridad creada en $CONFIG_FILE.bak"

# 2. Hardening: Deshabilitar root y contraseñas (Idempotente)
sudo sed -i 's/^#Port .*/Port '$NEW_PORT'/' $CONFIG_FILE
sudo sed -i 's/^Port .*/Port '$NEW_PORT'/' $CONFIG_FILE

sudo sed -i 's/^#PermitRootLogin.*/PermitRootLogin no/' $CONFIG_FILE
sudo sed -i 's/^PermitRootLogin.*/PermitRootLogin no/' $CONFIG_FILE

sudo sed -i 's/^#PasswordAuthentication.*/PasswordAuthentication no/' $CONFIG_FILE
sudo sed -i 's/^PasswordAuthentication.*/PasswordAuthentication no/' $CONFIG_FILE

sudo sed -i 's/^#MaxAuthTries.*/MaxAuthTries 3/' $CONFIG_FILE
sudo sed -i 's/^MaxAuthTries.*/MaxAuthTries 3/' $CONFIG_FILE

# 2.A. Abrir el puerto en el firewall local (CRÍTICO para evitar bloqueo)
echo "Abriendo el puerto $NEW_PORT en UFW..."
sudo ufw allow $NEW_PORT/tcp
echo "Regla UFW añadida para el puerto $NEW_PORT."

# 3. Restringir usuarios (Idempotente: borrar y re-añadir)
sudo sed -i '/^AllowUsers/d' $CONFIG_FILE
echo "AllowUsers $ADMIN_USER" | sudo tee -a $CONFIG_FILE > /dev/null
echo "Acceso restringido a: $ADMIN_USER"

# 4. Limitar vida de la sesión (5 minutos de inactividad)
sudo sed -i 's/^#LoginGraceTime.*/LoginGraceTime 60/' $CONFIG_FILE
sudo sed -i 's/^ClientAliveInterval.*/ClientAliveInterval 300/' $CONFIG_FILE
sudo sed -i 's/^#ClientAliveInterval.*/ClientAliveInterval 300/' $CONFIG_FILE
sudo sed -i 's/^ClientAliveCountMax.*/ClientAliveCountMax 0/' $CONFIG_FILE
sudo sed -i 's/^#ClientAliveCountMax.*/ClientAliveCountMax 0/' $CONFIG_FILE

# 5. Validación y Reinicio
echo "Validando configuración..."
if sudo sshd -t; then
    echo "Configuración válida. Reiniciando servicio..."
    sudo systemctl restart ssh
    echo "¡SSH Hardening completado!"
else
    echo "ERROR: La configuración de SSH tiene errores. Revise $CONFIG_FILE y $CONFIG_FILE.bak."
fi
```

Ahora tienes un SSH Hardened.

```bash
# me conecto con

ssh -i ./tupem.pem  -p <TU-PUERTO> admin@<TU-IP-EC2>

# IMPORTANTE!!!! agregar ese ip a tu aws EC2 TCP - 2222 - miip y guardas
# EC2 > Grupos de seguridad > sxsxsxsdsadwe2-launc
```

#### 3. Asegurar API de Docker (TLS) - OJO TIENES QUE TENER INSTALADO DOCKER QUE ESTÁ ABAJO

_Nota: Lo más seguro es NO exponerla vía TCP. Si necesitas acceso remoto, usa SSH Tunneling:_

```bash

# Método Senior: Crear contexto remoto (ejecutar en TU máquina local, no en el servidor)
docker context create remote-server --docker "host=ssh://ubuntu@<TU-IP-EC2>:puertosipusiste"
docker context use remote-server
# Ahora tus comandos 'docker ps' locales se ejecutan en el servidor seguramente via SSH.

# ver info de docker # remote-server
docker info
```

#### 4. Usuarios y Permisos Docker

```bash
# Evitar 'sudo docker' (Crea grupo y añade usuario)
sudo groupadd docker
sudo usermod -aG docker $USER
# Reiniciar sesión para aplicar (critical step)
newgrp docker
```

#### 5. Actualizaciones de Seguridad Automáticas

Descargar e instalar automáticamente parches de seguridad críticos y otras actualizaciones importantes del sistema operativo sin requerir tu intervención manual.

```bash
# Debian/Ubuntu (unattended-upgrades)
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure --priority=low unattended-upgrades
# Verificar
systemctl status unattended-upgrades
```

#### 6. Limitar Recursos (Prevención DoS)

Al ejecutar contenedores manuales:

```bash
# Límite duro de memoria y CPUs
docker run -d --name app-segura \
  --memory="512m" \
  --memory-swap="1g" \
  --cpus="0.5" \
  nginx:latest
```

#### 7. Políticas de Reinicio y Logging Centralizado

En tu `docker-compose.yml` (nivel producción):

```yaml
services:
    app:
        image: mi-app:v1
        restart: on-failure:5 # No usar 'always' ciegamente para evitar bucles infinitos
        logging:
            driver: "json-file"
            options:
                max-size: "10m"
                max-file: "3"
```

#### 8. Imágenes Base Mínimas (Dockerfile)

En tu `Dockerfile`, cambia imágenes completas por Alpine o Distroless:

```dockerfile
# MAL USO:
# FROM node:18

# BUEN USO (Senior):
FROM node:18-alpine
# O mejor aún, multistage build:
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
# ...
```

#### 9. Escaneo de Vulnerabilidades (CI/CD)

Integrar Trivy en tu pipeline o manual antes de deploy:

```bash
# Instalar Trivy (Debian/Ubuntu)
sudo apt-get install wget apt-transport-https gnupg lsb-release -y
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
echo deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt-get update
sudo apt-get install trivy -y

# Escanear
trivy image --severity HIGH,CRITICAL mi-app:v1

# Escanear sistema de archivos del proyecto
trivy fs .
```

---

2. Instalar docker

```bash

# 0. Ver que distro es
cat /etc/os-release

# 1. Actualiza el sistema
sudo apt update && sudo apt upgrade -y
# 2. Desinstalar docker para evitar conflicto
sudo apt remove $(dpkg --get-selections docker.io docker-compose docker-doc podman-docker containerd runc | cut -f1)

# https://docs.docker.com/engine/install/debian/ INSTALACION DE DOCKER OFICIAL

docker --version
# admin@ip-172-31-5-255:~$ docker version
# Client: Docker Engine - Community
#  Version:           29.1.3
#  API version:       1.52
#  Go version:        go1.25.5
#  Git commit:        f52814d
#  Built:             Fri Dec 12 14:49:42 2025
#  OS/Arch:           linux/amd64
#  Context:           default
#

# 3. Asegurar Docker otorgar a tu usuario actual los permisos necesarios para interactuar con el demonio de Docker sin necesidad de usar sudo cada vez.
sudo usermod -aG docker $USER
```

# INSTALAR DOKPLOY

```bash
sudo curl -sSL https://dokploy.com/install.sh | sudo sh
```

Warning:
Si al entrar a tu http:ip:3000 no funciona,

1. Ve a la Consola de AWS -> EC2 -> Security.
2. Edita el Grupo de Seguridad asociado a tu instancia.
3. Ve a "Inbound rules" (Reglas de entrada).
4. Agrega una nueva regla con la siguiente configuración:Type (Tipo): Custom TCPPort range (Rango de puertos): 3000

# Configurar dokploy

1. Crear cuenta de dokploy
2.

# github runner

1. copiay pegamos el docker compose y script.sh
2. Asegúrate de obtener el token desde aquí:

-   Ve a https://github.com/organizations/Vigilio-Services/settings/actions/runners
-   Botón New Runner.
-   Copia el token que aparece ahí. ./config.sh --url https://github.com/V --token ATDKB553DxxxxW

3. una vez tengas los dos archivos ejecutar bash script.sh

```bash
./script.sh

# si te pide que te logees o te sale error
# echo "GITHUB_ACCESS_TOKEN" | docker login ghcr.io -u VigilioYonatan --password-stdin



# √ Connected to GitHub

# Current runner version: '2.316.0'
# 2025-12-17 05:02:08Z: Listening for Jobs
# Runner update in progress, do not shutdow

```

Como usarlo en github actions

```yml
name: Deploy Nest App
on:
    push:
        branches: [main]

jobs:
    build:
        # IMPORTANTE: Usa las etiquetas que configuraste en el docker-compose
        runs-on: [self-hosted]
```


# registry

