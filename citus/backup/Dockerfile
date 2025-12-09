FROM alpine:3.18

# Instalar dependencias
RUN apk add --no-cache \
    postgresql-client \
    aws-cli \
    bash \
    curl

# Copiar script
COPY backup.sh /usr/local/bin/backup.sh
RUN chmod +x /usr/local/bin/backup.sh

# Configurar cron
# Ejecutar backup a las 3:00 AM todos los días
RUN echo "0 3 * * * /usr/local/bin/backup.sh >> /var/log/cron.log 2>&1" > /etc/crontabs/root

# Crear log file
RUN touch /var/log/cron.log

# Iniciar cron en foreground
CMD ["crond", "-f", "-d", "8"]
