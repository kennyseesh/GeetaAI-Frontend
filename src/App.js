import React, { useState, useRef } from 'react';
import './App.css';

const API_URL = "https://geetaai-backend.onrender.com/chat";

const SCREENS = {
  INTRO: 'INTRO',
  HOME: 'HOME',
  INPUT: 'INPUT',
  LOADING: 'LOADING',
  OUTPUT: 'OUTPUT'
};

function App() {
  const [screen, setScreen] = useState(SCREENS.INTRO);
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState({ shloka: "", meaning: "", guidance: "" });
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);

  // START
  const handleStart = () => {
    setScreen(SCREENS.HOME);

    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.muted = false;
      audioRef.current.play().catch(() => {});
      setIsMuted(false);
    }
  };

  const handleAsk = () => setScreen(SCREENS.INPUT);

  const handleContinue = () => {
    setUserInput("");
    setScreen(SCREENS.INPUT);
  };

  // 🔊 FIXED MUTE LOGIC
  const toggleAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(audioRef.current.muted);
  };

  // API CALL
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    setScreen(SCREENS.LOADING);
    setError(null);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await res.json();
      setResponse(data);
      setScreen(SCREENS.OUTPUT);

    } catch (err) {
      setError("Krishna is silent. Ensure backend is running.");
      setScreen(SCREENS.INPUT);
    }
  };

  return (
    <div className="app-container">

      {/* AUDIO */}
      <audio ref={audioRef} loop>
        <source src="/backgroundmusic.mp3" type="audio/mpeg" />
      </audio>

      {/* 🔊 BUTTON FIXED */}
      <button className="music-btn" onClick={toggleAudio}>
        {isMuted ? "🔇" : "🔊"}
      </button>

      <div className="background-overlay"></div>

      {/* INTRO */}
      {screen === SCREENS.INTRO && (
        <div className="screen fade-in intro-screen">
          <div className="intro-box">

            <h1 className="intro-title">Bhagavad Gita AI Assistant</h1>

            <p className="intro-text">
              On the battlefield of Kurukshetra, Arjuna was lost in fear and confusion.
              Lord Krishna guided him with eternal wisdom.
            </p>

            <p className="intro-text">
              This AI brings that same wisdom into your life.
              Ask your problems and receive guidance inspired by the Gita.
            </p>

            <button className="get-started-btn" onClick={handleStart}>
              Get Started
            </button>

          </div>
        </div>
      )}

      {/* HOME */}
      {screen === SCREENS.HOME && (
        <div className="screen fade-in">

          <img
            src="/arjuna.png"
            alt="Arjuna"
            className="character arjuna-home"
            onClick={handleAsk}
          />

          <div className="center-content">
            <h1 className="title-text">Seek Guidance from Krishna</h1>
            <p className="subtitle-text">Click Arjuna to begin</p>
          </div>

        </div>
      )}

      {/* INPUT */}
      {screen === SCREENS.INPUT && (
        <div className="screen fade-in">

          <img
            src="/arjunainput.png"
            alt="Arjuna"
            className="character arjuna-kneeling"
          />

          <div className="speech-bubble arjuna-bubble">

            <textarea
              className="gita-input"
              placeholder="Describe your problem, O Partha..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />

            <button className="send-btn" onClick={handleSendMessage}>
              Ask Krishna
            </button>

            {error && <p className="error-text">{error}</p>}

          </div>

        </div>
      )}

      {/* LOADING */}
      {screen === SCREENS.LOADING && (
        <div className="screen fade-in">
          <div className="loading-container">

            <img src="/chakra.png" alt="chakra" className="chakra-spin" />

            <h2 className="loading-text">Krishna is thinking...</h2>

          </div>
        </div>
      )}

      {/* OUTPUT */}
      {screen === SCREENS.OUTPUT && (
        <div className="screen fade-in">

          <img
            src="/krishna.png"
            alt="Krishna"
            className="character krishna-right"
          />

          <div className="speech-bubble krishna-bubble">

            <div className="box">
              <h3 className="label">📖 Shloka</h3>
              <p className="shloka-text">{response.shloka}</p>
            </div>

            <div className="box">
              <h3 className="label">💡 Meaning</h3>
              <p className="meaning-text">{response.meaning}</p>
            </div>

            <div className="box">
              <h3 className="label">🧠 Guidance</h3>
              <p className="guidance-text">{response.guidance}</p>
            </div>

          </div>

          <div className="continue-container">
            <button className="continue-btn" onClick={handleContinue}>
              Continue Conversation
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

export default App;