const express = require('express');
const {createServer} = require('node:http');
const { join } = require('node:path');
const {Server} = require('socket.io');

const PORT = 3500;
const app = express();

const server = createServer(app);
const io = new Server(server);
const lobbies = new Object();


app.get('/index', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.get('/online', (req, res) => {
  res.sendFile(join(__dirname, 'online.html'));
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'select.html'));
});



app.get('/css', (req, res) => {
  res.sendFile(join(__dirname, 'style.css'));
});

app.get('/script', (req, res) => {
  res.sendFile(join(__dirname, 'script.js'));
});

app.get('/test', (req, res) => {
  res.send("hello!");
});

io.on('connection', (socket) => {

    socket.on('create-lobby', (lobby) => {
        if (lobby in lobbies) {
            socket.emit("create-status", "failed");
        } else {
            lobbies[lobby] = "";
            socket.emit("create-status", "success");
        }
    });

    socket.on('join-lobby', (lobby) => {
        if (lobby in lobbies) {
            socket.emit("create-status", "success");
        } else {
            socket.emit("create-status", "failed");
        }
    });

    socket.on('mark-index', ({index, lobby}) => {
        console.log('The player marked index: ' + index + ' at lobby: '+ lobby);
        lobbies[lobby] = index;
        socket.emit("move-recieved", true)
    });

    socket.on('game-over', (lobby) => {
        // free up the lobby object when the game is done
        delete lobbies[lobby];
    });
});

server.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
})

