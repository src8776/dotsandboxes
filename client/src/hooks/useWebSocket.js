import { useEffect, useState } from 'react';

const useWebSocket = (url, username) => {
    const [ws, setWs] = useState(null);
    const [players, setPlayers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentRoom, setCurrentRoom] = useState('lobby'); 
    const [challengeStatus, setChallengeStatus] = useState(null);

    useEffect(() => {
        const socket = new WebSocket(url);

        socket.onopen = () => {
            console.log('WebSocket connected');
            socket.send(JSON.stringify({ type: 'setUsername', username }));
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'playerList') {
                console.log(data.players);
                setPlayers(data.players);
            } else if (data.type === 'chatMessage' && data.room === currentRoom) {
                // update messages only if the message is for the current room
                setMessages((prevMessages) => [...prevMessages, `${data.sender}: ${data.message}`]);
            } else if (data.type === 'challengeReceived') {
                setChallengeStatus({
                    from: data.from,
                    to: data.to,
                    status: 'pending',  // 'pending' until accepted or declined
                });
            } else if (data.type === 'challengeResponse') {
                // handle challenge response (accepted or declined)
                if (data.response === 'accept') {
                    console.log('Challenge accepted');
                } else {
                    console.log('Challenge declined');
                }
                setChallengeStatus(null);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        setWs(socket);

        return () => {
            socket.close();
        };
    }, [url, username, currentRoom]);

    const sendMessage = (message) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            const messageData = {
                type: 'chatMessage',
                room: currentRoom, 
                message: message,
                username: username
            };
            ws.send(JSON.stringify(messageData)); 
        }
    };

    const sendChallenge = (challengedPlayer) => {
        const challengeData = {
            type: 'sendChallenge',
            challengedPlayer,
            from: username
        };
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(challengeData)); 
        }
    };

    const respondToChallenge = (response, challenger) => {
        const responseData = {
            type: 'challengeResponse',
            response,
            challenger,
            to: username
        };
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(responseData)); 
        }
    };

    return { players, messages, challengeStatus, sendMessage, sendChallenge, respondToChallenge, setCurrentRoom };
};

export default useWebSocket;
