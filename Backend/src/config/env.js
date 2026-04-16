import { config } from 'dotenv';

const envFile = `.env.${process.env.NODE_ENV}`;

export default config({ path: envFile });