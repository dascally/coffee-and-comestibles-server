import 'dotenv/config';

const PORT = process.env.PORT ?? 3002;

const DB_URL =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_DB_URL
    : process.env.DB_URL;

const SECRET = process.env.SECRET;

export { PORT, DB_URL, SECRET };
