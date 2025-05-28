const express = require('express');
const {createServer} = require('node:http');

const PORT = 3500;
const app = express();
const server = createServer(app);
const cors = require('cors');

app.use(cors());    


app.get('/', (request, response) => {
    response.send("Hello from the server!");
});

server.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
})

