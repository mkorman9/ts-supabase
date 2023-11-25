import 'dotenv/config';
import {z} from 'zod';

const str = () => z.string();
const bool = () => z.string().transform(v => ['true', '1'].includes(v.toLowerCase()));
const int = () => z.preprocess(Number, z.number().int());

const ConfigSchema = z.object({
  SUPABASE_URL: str(),
  SUPABASE_TOKEN: str(),

  DB_HOST: str(),
  DB_PORT: int(),
  DB_NAME: str(),
  DB_USER: str(),
  DB_PASSWORD: str()
});

export default (() => {
  try {
    return ConfigSchema.parse(process.env);
  } catch (e) {
    console.log(`🚫 Configuration loading has failed: ${e}`);
    process.exit(1);
  }
})();
