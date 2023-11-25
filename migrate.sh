#!/usr/bin/env bash

DB_PORT="5432"
DB_SCHEMA="private"

while [[ $# -gt 0 ]]; do
  case $1 in
    -h|--host)
      DB_HOST="$2"
      shift
      shift
      ;;
    -p|--port)
      DB_PORT="$2"
      shift
      shift
      ;;
    -d|--db)
      DB_NAME="$2"
      shift
      shift
      ;;
    -u|--user)
      DB_USER="$2"
      shift
      shift
      ;;
    -p|--password)
      DB_PASSWORD="$2"
      shift
      shift
      ;;
    -s|--schema)
      DB_SCHEMA="$2"
      shift
      shift
      ;;
  esac
done

if [ -z "$DB_HOST" ] \
  || [ -z "$DB_PORT" ] \
  || [ -z "$DB_NAME" ] \
  || [ -z "$DB_USER" ] \
  || [ -z "$DB_PASSWORD" ] \
  || [ -z "$DB_SCHEMA" ]; then
  echo 'usage: ./migrate.sh --host <HOST> --port <PORT> --db <DB_NAME> --user <USER> --password <PASSWORD> --schema <SCHEMA>'
  exit 1
fi

docker run \
  -it \
  --rm \
  -v ./migrations:/flyway/sql \
  redgate/flyway \
  -url="jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}" \
  -user="${DB_USER}" \
  -password="${DB_PASSWORD}" \
  -defaultSchema="${DB_SCHEMA}" \
  migrate
