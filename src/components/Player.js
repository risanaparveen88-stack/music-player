// Player.js
import React, { useEffect, useRef, useState } from 'react';
import songsData from '../data/songs';
import { getLS, setLS } from '../utils/storage';

export default function Player({ current, setCurrent, playing, setPlaying, isPremium, setIsPremium, playlistQueue }) {
  const audioRef = useRef(null);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    if (!audioRef.current) return;
    const el = audioRef.current;
    const onTime = () => setProgress(el.currentTime);
    const onEnded = () => {
      // Check if there's a playlist queue and a next song to play
      if (playlistQueue.length > 0 && current) {
        const currentIdx = playlistQueue.findIndex(id => id === current.id);
        const nextIdx = (currentIdx + 1) % playlistQueue.length;
        const nextSongId = playlistQueue[nextIdx];
        const nextSong = songsData.find(s => s.id === nextSongId);
        if (nextSong) {
          setCurrent(nextSong);
          setPlaying(true);
        } else {
          setPlaying(false);
        }
      } else {
        setPlaying(false);
      }
    };
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('ended', onEnded);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('ended', onEnded);
    };
  }, [current, playlistQueue]);

  useEffect(() => {
    if (!audioRef.current) return;
    const el = audioRef.current;
    if (current) {
      el.src = current.audio;
      el.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  }, [current]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  };

  const next = () => {
    if (!current) return;
    if (playlistQueue.length > 0) {
      const currentIdx = playlistQueue.findIndex(id => id === current.id);
      const nextIdx = (currentIdx + 1) % playlistQueue.length;
      const nextSongId = playlistQueue[nextIdx];
      const nextSong = songsData.find(s => s.id === nextSongId);
      if (nextSong) {
        setCurrent(nextSong);
      }
    } else {
      const nextSong = songsData[(songsData.findIndex(s => s.id === current.id) + 1) % songsData.length];
      setCurrent(nextSong);
    }
  };

  const prev = () => {
    if (!current) return;
    if (playlistQueue.length > 0) {
      const currentIdx = playlistQueue.findIndex(id => id === current.id);
      const prevIdx = (currentIdx - 1 + playlistQueue.length) % playlistQueue.length;
      const prevSongId = playlistQueue[prevIdx];
      const prevSong = songsData.find(s => s.id === prevSongId);
      if (prevSong) {
        setCurrent(prevSong);
      }
    } else {
      const prevSong = songsData[(songsData.findIndex(s => s.id === current.id) - 1 + songsData.length) % songsData.length];
      setCurrent(prevSong);
    }
  };

  const seekTo = (e) => {
    if (!audioRef.current) return;
    const el = audioRef.current;
    const percent = e.target.value;
    el.currentTime = (percent / 100) * (el.duration || 1);
  };

  const toggleFav = () => {
    if (!current) return;
    let f = getLS('ab_favorites', []);
    if (f.includes(current.id)) {
      f = f.filter(i => i !== current.id);
    } else {
      f.push(current.id);
    }
    setLS('ab_favorites', f);
    alert('Favorites updated.');
  };

  const togglePlaylist = () => {
    if (!current) return;
    let p = getLS('ab_playlist', []);
    if (p.includes(current.id)) {
      p = p.filter(i => i !== current.id);
    } else {
      p.push(current.id);
    }
    setLS('ab_playlist', p);
    alert('Playlist updated.');
  };

  const tryDownload = () => {
    if (!current) return;
    const dcount = getLS('ab_download_count', 0);
    if (!isPremium && dcount >= 5) {
      if (window.confirm('Free download limit reached. Subscribe to Premium for unlimited downloads ($10/month)?')) {
        if (window.confirm('Proceed to subscribe (simulated)?')) {
          setIsPremium(true);
          alert('Subscribed (simulated). You can now download.');
        }
      }
      return;
    }
    setLS('ab_download_count', dcount + 1);
    const a = document.createElement('a');
    a.href = current.audio;
    a.download = `${current.title}.mp3`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="player-fixed">
      <audio ref={audioRef} onEnded={() => setPlaying(false)} />
      <div style={{ width: 120 }}>
        {current ? (
          <div>
            <strong>{current.title}</strong>
            <div className="small-muted">{current.artist}</div>
          </div>
        ) : (
          <div className="small-muted">No song selected</div>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="btn btn-sm btn-outline-secondary" onClick={prev}> ⏮ </button>
          <button className="btn btn-sm btn-primary" onClick={togglePlay}>
            {playing ? ' ⏸ ' : ' ▶ '}
          </button>
          <button className="btn btn-sm btn-outline-secondary" onClick={next}> ⏭ </button>
          <div style={{ flex: 1, marginLeft: 12 }}>
            <input
              type="range"
              min="0"
              max="100"
              value={
                audioRef.current && audioRef.current.duration
                  ? Math.floor((progress / audioRef.current.duration) * 100)
                  : 0
              }
              onChange={seekTo}
            />
            <div className="small-muted">
              {Math.floor((audioRef.current && audioRef.current.currentTime) || 0)} /
              {Math.floor((audioRef.current && audioRef.current.duration) || 0)} sec
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <select
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="form-select form-select-sm"
        >
          <option value={0.75}>0.75x</option>
          <option value={1}>1x</option>
          <option value={1.25}>1.25x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
        <button className="btn btn-sm btn-outline-secondary" onClick={toggleFav}>♥</button>
        <button className="btn btn-sm btn-outline-secondary" onClick={togglePlaylist}>＋</button>
        <button className="btn btn-sm btn-outline-primary" onClick={tryDownload}> ⬇ </button>
      </div>
    </div>
  );
}