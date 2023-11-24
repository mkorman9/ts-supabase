#!/usr/bin/env bash

DB_PORT="5432"

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
  esac
done

if [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ] || [ -z "$DB_NAME" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ]; then
  echo 'usage: ./migrate.sh --host <HOST> --port <PORT> --db <DB_NAME> --user <USER> --password <PASSWORD>'
  exit 1
fi

# Run migration
docker run \
  -it \
  --rm \
  -v ./migrations:/flyway/sql \
  redgate/flyway \
  -url="jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}" \
  -user="${DB_USER}" \
  -password="${DB_PASSWORD}" \
  migrate

# Make sure flyway_schema_history has row level security enabled
read -r -d '' ENABLE_RLS_QUERY << EOF
  alter table flyway_schema_history enable row level security;
  create policy flyway_schema_history_policy on flyway_schema_history for ALL to anon using (false);
EOF

docker run \
  -it \
  --rm \
  -e PGPASSWORD="${DB_PASSWORD}" \
  postgres:15 \
    psql \
    -h "${DB_HOST}" \
    -U "${DB_USER}" \
    "${DB_NAME}" \
    -c "${ENABLE_RLS_QUERY}" &> /dev/null || true
