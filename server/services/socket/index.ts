import * as WebSocket from 'ws';

export const webSocketCallback = (ws: WebSocket.WebSocket, wss: WebSocket.WebSocketServer) => {
  console.log('A client connected', wss.clients.size);

  // Handle errors
  ws.on('error', error => {
    console.error('WebSocket error:', error);
  });

  // Handle messages from clients
  ws.on('message', message => {
    console.log('Received message:', message.toString());

    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  // Handle disconnection
  ws.on('close', () => {
    console.log('A client disconnected');
  });
}
