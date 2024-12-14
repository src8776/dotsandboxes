import React, { useState, useEffect } from 'react';
import useWebSocket from '../hooks/useWebSocket';

const Lobby = ({ username }) => {
    const [challengePlayer, setChallengePlayer] = useState('');
    const [message, setMessage] = useState('');
    const [isChallenged, setIsChallenged] = useState(false);

    const { players, challengeStatus, sendChallenge, respondToChallenge } = useWebSocket('ws://localhost:5001', username);

    useEffect(() => {
        // reset challenge state if a challenge is accepted or declined
        if (message && message.includes('Challenge received')) {
            setIsChallenged(true);
        } else {
            setIsChallenged(false);
        }
    }, [message]);

    const handleChallenge = (player) => {
        setChallengePlayer(player);
        sendChallenge(player);
    };

    const handleChallengeResponse = (response) => {
        respondToChallenge(response, challengePlayer);
        setChallengePlayer('');
    };

    // exclude self from player list
    const otherPlayers = players.filter((player) => player !== username);

    return (
        <div>
            <h2>Welcome, {username}!</h2>
            <h3>Players in Lobby:</h3>
            <ul>
                {otherPlayers.length > 0 ? (
                    otherPlayers.map((player) => (
                        <li key={player}>
                            {player}{' '}
                            <button onClick={() => handleChallenge(player)}>
                                Challenge
                            </button>
                        </li>
                    ))
                ) : (
                    <p>No other players in the lobby.</p>
                )}
            </ul>

            {challengeStatus && challengeStatus.status === 'pending' && (
            <div>
                <p>{challengeStatus.from} has challenged you!</p>
                <button onClick={() => respondToChallenge('accept', challengeStatus.from)}>
                    Accept
                </button>
                <button onClick={() => respondToChallenge('decline', challengeStatus.from)}>
                    Decline
                </button>
            </div>
        )}

            {message && !isChallenged && <p>{message}</p>}
        </div>
    );
};

export default Lobby;