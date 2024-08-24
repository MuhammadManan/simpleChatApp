const express = require('express');
const app = express();
const socketio = require('socket.io');
const Port = 9000;
app.use(express.static(__dirname + '/public'));
const expressServer = app.listen(Port, () => {
  console.log(`Server started on http://localhost:${Port}`);
});
const io = socketio(expressServer);
const helmet = require('helmet');
app.use(helmet());

module.exports ={
  app,
  io
}
