const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();

app.use(index);
const server = http.createServer(app);
const io = socketIo(server);
const getApiAndEmit = async socket => {
    try {
        socket.emit("FromAPI", {
            "source": "socket-io-server",
            "date": new Date(),
        });
    }
    catch (error) { console.error(`Error: ${error.code}`); }
};

let interval;
io.on("connection", socket => {
    console.log("New client connected");
    if (interval) clearInterval(interval);
    interval = setInterval(() => getApiAndEmit(socket), 1000);
    socket.on("disconnect", () => { console.log("Client disconnected"); });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
