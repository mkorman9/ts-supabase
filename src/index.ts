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

// Create fake user and validate token
(async () => {
  const {data: signUpData, error: signUpError} = await supabase.auth.signUp({
    email: `anonymous-${randomBytes(16).toString('hex')}@playground.supabase.co`,
    password: randomBytes(32).toString('hex')
  });
  if (signUpError) {
    console.log(`Failed to create user: ${signUpError}`);
    return;
  }

  const token = signUpData.session?.access_token;
  if (!token) {
    console.log('Missing user session');
    return;
  }

  const {data: authData, error: authError} = await supabase.auth.getUser(token);
  if (authError) {
    console.log(`Failed to validate user token: ${authError}`);
    return;
  }

  console.log(`User ${authData.user?.id} authorized successfully`);
})();
