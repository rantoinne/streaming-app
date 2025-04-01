import * as WebSocket from 'ws';

const users = new Map();

export const webSocketCallback = (ws: WebSocket.WebSocket, wss: WebSocket.WebSocketServer) => {
  console.log('A client connected', wss.clients.size);
  let userId;


  // Handle errors
  ws.on('error', error => {
    console.error('WebSocket error:', error);
  });

  // Handle messages from clients
  ws.on('message', message => {
    let data;

    // Check if the message is a Buffer
    if (Buffer.isBuffer(message)) {
      data = JSON.parse(message.toString());
    }
    // Check if the message is an ArrayBuffer
    else if (message instanceof ArrayBuffer) {
      const decoder = new TextDecoder('utf-8');
      data = JSON.parse(decoder.decode(new Uint8Array(message)));
    }
    // Check if the message is an array of Buffers
    else if (Array.isArray(message) && message.every(Buffer.isBuffer)) {
      data = JSON.parse(Buffer.concat(message).toString());
    } else {
      console.error('Unsupported message type:', message);
      return;
    }

    // Now you can handle the parsed data
    switch (data.type) {
      case 'join':
        userId = data.userId;
        users.set(userId, ws);
        broadcast({ type: 'user-joined', userId });
        break;

      case 'offer':
      case 'answer':
      case 'candidate': {
        console.log({ data });
        const targetUser = users.get(data.targetId);
        if (targetUser) {
          targetUser.send(JSON.stringify(data));
        }
        break;
      }

      case 'leave':
        users.delete(userId);
        broadcast({ type: 'user-left', userId });
        break;
    }
  });

  // Handle disconnection
  ws.on('close', () => {
    console.log('A client disconnected');
    if (userId) {
      users.delete(userId);
      broadcast({ type: 'user-left', userId });
    }
  });
}

function broadcast(data) {
  users.forEach(client => {
    client.send(JSON.stringify(data));
  });
}
