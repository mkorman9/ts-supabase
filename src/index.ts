import './hooks';
import config from './config';

import {createClient} from '@supabase/supabase-js';
import pg from 'pg';

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_TOKEN);
const db = new pg.Client({
  host: config.DB_HOST,
  port: config.DB_PORT,
  database: config.DB_NAME,
  user: config.DB_USER,
  password: config.DB_PASSWORD
});

// (async () => {
//   const {data, error} =
//     await supabase.from('todo_items')
//       .select();
//
//   if (error) {
//     console.log(`Failed to query data through the API: ${error}`);
//     return;
//   }
//
//   console.log(`Data from API:`);
//   data?.forEach(d => console.log(d));
// })();

(async () => {
  await db.connect();
  const rows = await db.query('SELECT id, content from private.todo_items');

  console.log('Data from the DB:');
  rows.rows.forEach(r => console.log(r));

  await db.end();
})();
