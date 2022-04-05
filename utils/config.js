import 'dotenv/config';

const PORT = process.env.port ?? 3002;

const DB_URL =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_DB_URL
    : process.env.DB_URL;

export { PORT, DB_URL };
