const http = require('http');
const socketIO = require('socket.io');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

const io = socketIO(server);

io.on('connection', (socket,req) => {
    console.log('a user connected');
    socket.emit('welcome', 'Hello from server');
    socket.on('message', (msg) => {
        console.log('message: ' + msg.message);
    });
})

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000/');
});