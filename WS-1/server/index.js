import express from "express";
import { WebSocketServer } from "ws";

const app = express();
const port = 8080;

const server = app.listen(port, () => {
    console.log('server is listening on: 8080');
})

const wss = new WebSocketServer({ server });  // we are using same port of sever to listening WS
// const wss = new WebSocketServer({ port: 3000 }); // we can also use different port for listening WS

// connection -> event
// so when ever a 'connection' gets established, callback will be 'ws'
wss.on('connection', (ws) => {
    // if any 'message' arrives, that is 'data' then this will be exected
    ws.on('message', (data) => {
        console.log('data from client %s', data);
        // optional -> when can send back response when required
        ws.send('Thanks');
    })
})