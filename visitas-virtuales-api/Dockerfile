FROM node:25-slim

WORKDIR /app
# Instalar netcat y psql
RUN apt-get update && apt-get install -y netcat-openbsd postgresql-client && rm -rf /var/lib/apt/lists/*

# Instalar P<2 y Drizzle Kit
RUN npm install -g pm2 drizzle-kit tsx

# Cachear dependencias para evitar reinstalarlas en cada build
COPY package*.json ./

# Instalar solo las dependencias de producción
RUN npm install --omit=dev

# Copiar el resto del código de la aplicación
COPY . .

ENV NODE_ENV=production

# Exponer puerto de la aplicación
EXPOSE 8000

# Ejecutar migraciones DB y PM2
COPY docker-entrypoint.sh .
RUN chmod +x /app/docker-entrypoint.sh
ENTRYPOINT ["./docker-entrypoint.sh"]