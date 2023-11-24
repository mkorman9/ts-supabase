import './hooks';
import config from './config';

import {createClient} from '@supabase/supabase-js';
import pg from 'pg';

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_TOKEN);
const dbPool = new pg.Pool({
  host: config.DB_HOST,
  port: config.DB_PORT,
  database: config.DB_NAME,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  max: 5
});

// Query data from public schema using API
(async () => {
  const {data, error} =
    await supabase.from('todo_items')
      .select();

  if (error) {
    console.log(`Failed to query data through the API: ${error}`);
    return;
  }

  console.log(`TODO Items:`);
  data?.forEach(d => console.log(d));
})();

// Query data from private schema using database connection
(async () => {
  const conn = await dbPool.connect();
  const rows = await conn.query('SELECT id, username from private.users');

  console.log('Users:');
  rows.rows.forEach(r => console.log(r));

  conn.release();
})();
