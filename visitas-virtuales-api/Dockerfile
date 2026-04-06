FROM node:25-slim

WORKDIR /app
# Instalar PM2 globalmente para producción
RUN npm install pm2 -g

# Cachear dependencias para evitar reinstalarlas en cada build
COPY package*.json ./

# Instalar solo las dependencias de producción
RUN npm install --omit=dev

# Copiar el resto del código de la aplicación
COPY . .

# Exponer puerto de la aplicación
EXPOSE 3000

# Usar PM2 para ejecutar la aplicación en modo producción
CMD ["pm2-runtime", "start", "ecosystem.config.cjs", "--env", "production"]