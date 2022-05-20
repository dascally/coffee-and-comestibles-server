import 'dotenv/config';

const PORT = process.env.PORT ?? 3002;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:3000';

const DB_URL =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_DB_URL
    : process.env.DB_URL;

const SECRET = process.env.SECRET;

export { PORT, CLIENT_ORIGIN, DB_URL, SECRET };
