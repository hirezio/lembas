#!/bin/bash
#entrypoint.dev.sh
echo "Waiting for postgres to get up and running..."
while ! nc -z db 5432; do
  # where the postgres_container is the hos, in my case, it is a Docker container.
  # You can use localhost for example in case your database is running locally.
  echo "waiting for postgress listening..."
  sleep 0.1
done
echo "PostgreSQL started"

npm start