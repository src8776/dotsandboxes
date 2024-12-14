import React, {useEffect, useState} from 'react';
import './App.css';
import Register from './components/register';
import Login from './components/login';
import Lobby from './components/lobby';
import ChatContainer from './components/chatContainer';
import useWebSocket from './hooks/useWebSocket';
import GameBoard from './components/gameboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [isRegistering, setIsRegistering] = useState(false); // for toggling
  const [currentRoom, setCurrentRoom] = useState('lobby'); 
  const [showBoard, setShowBoard] = useState(false);

  const handleLogin = (token, user) => {
    setToken(token);
    setUsername(user);
    localStorage.setItem('authToken', token);
    localStorage.setItem('username', user);
  }

  const handleLogout = () => {
    setToken('');
    setUsername('');
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
  }

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  }

  const toggleBoard = () => {
    setShowBoard(!showBoard);
  }

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const { players, message, challengeStatus, sendChallenge, respondToChallenge, sendMessage } = useWebSocket('ws://localhost:5001', username);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dots and Boxes</h1>
        {!token ? (
          <>
            {isRegistering ? (
              <>
                <Register/>
                <br/>
                <button onClick={toggleForm}>Already have an account? Login</button>
              </>
            ) : (
              <>
                <Login onLogin={handleLogin}/>
                <br/>
                <button onClick={toggleForm}>Don't have an account? Register</button>
              </>
            )}
          </>
        ) : !showBoard? (
            <>
              <Lobby username={username} />
              <button onClick={toggleBoard}>Show game</button>
              <button onClick={handleLogout}>Logout</button>
              
              <ChatContainer
                players={players}
                currentRoom={currentRoom}
                sendMessage={sendMessage}
              />
              <br />
            </>
          ) : (
            <>
              <GameBoard/>
            </>
          )}
      </header>
    </div>
  );
}

export default App;
