import express from 'express';
import cors from 'cors';
import { router as indexRouter } from './routes/index.js';
import { syncDatabase } from './models/config.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const WebSocket = require('ws');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use("/", indexRouter);

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Map();
const messages = new Map(); 
wss.on('connection', (ws) => {
  let currentUser;

  ws.on('message', (message) => {
    const { sender, recipient, text, type } = JSON.parse(message);
    currentUser = sender;

    if (type === 'init') {
      const senderConnections = clients.get(sender) || new Set();
      senderConnections.add(ws);
      clients.set(sender, senderConnections);
      return;
    }

    const senderConnections = clients.get(sender) || new Set();
    senderConnections.add(ws);
    clients.set(sender, senderConnections);

    ws.on('close', () => {
      senderConnections.delete(ws);
      if (senderConnections.size === 0) {
        clients.delete(sender);
      }
    });

    const recipientConnections = clients.get(recipient);
    if (recipientConnections) {
      recipientConnections.forEach((recipientWs) => {
        if (recipientWs.readyState === WebSocket.OPEN) {
          recipientWs.send(JSON.stringify({ sender, text }));
        }
      });
    } else {
      const recipientMessages = messages.get(recipient) || [];
      recipientMessages.push({ sender, text });
      messages.set(recipient, recipientMessages);
    }

    senderConnections.forEach((senderWs) => {
      if (senderWs.readyState === WebSocket.OPEN) {
        senderWs.send(JSON.stringify({ sender, text }));
      }
    });
  });

  ws.on('open', () => {
    const recipientMessages = messages.get(currentUser);
    if (recipientMessages) {
      recipientMessages.forEach((message) => {
        ws.send(JSON.stringify(message));
      });
      messages.delete(currentUser);
    }
  });

  const senderConnections = clients.get(currentUser);
  if (senderConnections) {
    senderConnections.forEach((senderWs) => {
      if (senderWs.readyState === WebSocket.OPEN) {
        const recipientMessages = messages.get(sender);
        if (recipientMessages) {
          recipientMessages.forEach((message) => {
            senderWs.send(JSON.stringify(message));
          });
          messages.delete(sender);
        }
      }
    });
  }
});

const server = app.listen(PORT, async () => {
  try {
    await syncDatabase();
    console.log(`Server started on http://localhost:${PORT}`);
  } catch (err) {
    console.log("error with db");
    server.close();
  }
});
