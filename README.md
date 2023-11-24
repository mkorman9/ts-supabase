# ts-supabase

```
cp .env.template .env

# Replace placeholders with supabase tokens and DB credentials 
```

```
./migrate.sh \
    --host <DB_HOST> \
    --db postgres \
    --user postgres \
    --password <DB_PASSWORD> \
    --schema private
```
