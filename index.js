import http from 'http';
import app from './app.js';

const PORT = 3002;

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
