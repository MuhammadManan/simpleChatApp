const http = require('http');
const webSocket = require('ws');


const server = http.createServer((req, res) => {
  res.end('Hello World');
});

const wss = new webSocket.WebSocketServer({ server });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
    ws.send(`Received: ${message}`);
  });
  ws.send('Welcome to the websocket server');
});

server.listen(8080, () => {
  console.log('Server is running on port 3000');
});