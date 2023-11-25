import './hooks';
import config from './config';

import {randomBytes} from 'crypto';
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
  const result = await supabase.from('todo_items')
    .select();

  if (result.error) {
    console.log(`Failed to query data through the API: ${result.error}`);
    return;
  }

  console.log(`TODO Items: [${result.data?.map(d => d.content)}]`);
})();

// Query data from private schema using database connection
(async () => {
  const conn = await dbPool.connect();
  const rows = await conn.query('SELECT id, username from private.users');

  console.log(`Users: [${rows.rows.map(r => r.username)}]`);

  conn.release();
})();

// Create fake user and validate token
(async () => {
  const signUpResult = await supabase.auth.signUp({
    email: `anonymous-${randomBytes(16).toString('hex')}@playground.supabase.co`,
    password: randomBytes(32).toString('hex')
  });
  if (signUpResult.error) {
    console.log(`Failed to create user: ${signUpResult.error}`);
    return;
  }

  const token = signUpResult.data.session?.access_token;
  if (!token) {
    console.log('Missing user session');
    return;
  }

  const authResult = await supabase.auth.getUser(token);
  if (authResult.error) {
    console.log(`Failed to validate user token: ${authResult.error}`);
    return;
  }

  console.log(`User ${authResult.data.user?.id} authorized successfully`);
})();
