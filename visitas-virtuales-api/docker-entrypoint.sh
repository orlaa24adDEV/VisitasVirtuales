#!/bin/sh
set -e

echo "Esperando disponibilidad de PostgreSQL..."
until nc -z postgres_service 5432; do
  sleep 1
done

echo "Ejecutando migraciones de base de datos..."
npm run db:migrate:prod

echo "Iniciando la aplicación con PM2..."
pm2-runtime start ecosystem.config.cjs --env production
