import 'dotenv/config';
import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import http from 'http';
import * as WebSocket from 'ws';
import { webSocketCallback } from './services/socket/index.js';

const app = express();
const PORT = process.env.NODE_PORT as unknown as number || 4000;

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (_, callback) => {
      callback(null, true);
    },
    optionsSuccessStatus: 200,
  }),
);
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  console.log('health check');
  res.json({ status: 'ok' });
});

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.WebSocketServer({ server });

// WebSocket connection handler
wss.on('connection', (ws: WebSocket.WebSocket) => webSocketCallback(ws, wss));

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server up and running on port ${PORT}`);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
  wss.close((err: Error) => {
    if (err) {
      console.error('Error closing WebSocket server:', err);
    } else {
      console.log('WebSocket server closed');
    }
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
  wss.close((err: Error) => {
    if (err) {
      console.error('Error closing WebSocket server:', err);
    } else {
      console.log('WebSocket server closed');
    }
  });
});

export default server;