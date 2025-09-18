// App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Playlist from './pages/Playlist';
import Downloads from './pages/Downloads';
import Player from './components/Player';
import { getLS, setLS } from './utils/storage';
import './App.css';

export default function App() {
  const [current, setCurrent] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [playlistQueue, setPlaylistQueue] = useState([]);
  const [isPremium, setIsPremium] = useState(() => getLS('ab_premium', false));
  
  useEffect(() => setLS('ab_premium', isPremium), [isPremium]);

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="brand">
          <h3>Aurora Beats</h3>
          <small className="text-muted">your melodic companion</small>
        </div>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/playlist">Playlist</Link>
          <Link to="/downloads">Downloads</Link>
        </nav>
        <div className="premium-card">
          <div>
            <strong>{isPremium ? 'Premium Active' : 'Free Account'}</strong>
            <div className="small muted">Downloads: {getLS('ab_download_count', 0)}</div>
          </div>
          <div className="mt-2">
            {isPremium ? (
              <button className="btn btn-outline-danger btn-sm" onClick={() => {
                if(window.confirm('Cancel Premium subscription?')) setIsPremium(false);
              }}>Cancel</button>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={() => {
                if(window.confirm('Subscribe to Premium for $10/month?')) {
                  setIsPremium(true);
                  alert('Subscribed to Premium (simulated).');
                }
              }}>Subscribe $10/mo</button>
            )}
          </div>
        </div>
      </aside>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home setCurrent={setCurrent} playing={playing} setPlaying={setPlaying} setPlaylistQueue={setPlaylistQueue} />} />
          <Route path="/favorites" element={<Favorites setCurrent={setCurrent} playing={playing} setPlaying={setPlaying} setPlaylistQueue={setPlaylistQueue} />} />
          <Route path="/playlist" element={<Playlist setCurrent={setCurrent} playing={playing} setPlaying={setPlaying} setPlaylistQueue={setPlaylistQueue} />} />
          <Route path="/downloads" element={<Downloads />} />
        </Routes>
        <div style={{ height: '120px' }}></div> 
      </main>
      <Player 
        current={current} 
        setCurrent={setCurrent} 
        playing={playing} 
        setPlaying={setPlaying} 
        isPremium={isPremium} 
        setIsPremium={setIsPremium} 
        playlistQueue={playlistQueue}
      />
    </div>
  );
}