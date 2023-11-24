import 'dotenv/config';
import {z} from 'zod';

const ConfigSchema = z.object({
  SUPABASE_URL: z.string(),
  SUPABASE_TOKEN: z.string(),

  DB_HOST: z.string(),
  DB_PORT: z.preprocess(Number, z.number().int()),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string()
});

export default (() => {
  try {
    return ConfigSchema.parse(process.env);
  } catch (e) {
    console.log(`🚫 Configuration loading has failed: ${e}`);
    process.exit(1);
  }
})();
