const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const loginRoutes = require('./routes/loginRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type'
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Dots and Boxes Game API');
});

// routes
app.use('/register', authRoutes);
app.use('/login', loginRoutes);

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// websocket initialization
const wss = new WebSocket.Server({ server });

// connected players
const players = new Map();

// send list of connected users
const sendConnectedUsers = () => {
    const playerList = Array.from(players.keys());
    
    players.forEach((ws) => {
        ws.send(JSON.stringify({ type: 'playerList', players: playerList }));
        if (playerList.length === 1) {
            ws.send(JSON.stringify({ type: 'lobbyMessage', message: 'You are the only player in the lobby' }));
        }
    });
};

// websocket connection
wss.on('connection', ws => {
    let username = null;

    // listen for messages from the client
    ws.on('message', (message) => {
        const data = JSON.parse(message);

        // handle setting the username
        if (data.type === 'setUsername') {
            if (!data.username || typeof data.username !== 'string' || data.username.trim() === '') {
                ws.send(JSON.stringify({ type: 'error', message: 'Invalid username' }));
                return;
            }
            
            username = data.username.trim(); // trim any whitespace
            if (players.has(username)) {
                ws.send(JSON.stringify({ type: 'error', message: 'Username already taken' }));
                return;
            }
        
            players.set(username, ws);
            console.log(`${username} connected`);
            sendConnectedUsers(); // send updated player list to all clients
        }

        // challenge logic
        if (data.type === 'challenge') {
            const { challengedPlayer } = data;

            if (players.has(challengedPlayer)) {
                const challengedWs = players.get(challengedPlayer);

                challengedWs.send(JSON.stringify({
                    type: 'challengeReceived',
                    challenger: username
                }));
            }
        }

        // accept/decline challenge
        if (data.type === 'challengeResponse') {
            const { response, challenger } = data;
            if (response === 'accept') {
                ws.send(JSON.stringify({ type: 'gameStarted', opponent: challenger }));
                players.get(challenger).send(JSON.stringify({ type: 'gameStarted', opponent: username }));
            } else {
                ws.send(JSON.stringify({ type: 'challengeDeclined', challenger }));
            }
        }
    });

    // player disconnect
    ws.on('close', () => {
        if (username) {
            players.delete(username);  // remove player from the list
            console.log(`${username} disconnected`);
            sendConnectedUsers();  // send updated player list to all clients
        }
    });
});