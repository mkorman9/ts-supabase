# ts-supabase

## Setup

- Create project on supabase. Save project URL, secret token and database credentials

- Under `Authentication -> Providers -> Email` disable `Confirm Email`

- Create `.env` file

```
cp .env.template .env

# Replace placeholders with supabase tokens and DB credentials 
```

- Migrate database

```
./migrate.sh \
    --host <DB_HOST> \
    --db postgres \
    --user postgres \
    --password <DB_PASSWORD> \
    --schema private
```
