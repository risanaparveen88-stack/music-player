// SongCard.js
import React from 'react';
import { getLS, setLS } from '../utils/storage';

export default function SongCard({ song, play, refresh, current, playing, setPlaying, setPlaylistQueue }) {
  const favs = getLS('ab_favorites', []);
  const playlist = getLS('ab_playlist', []);
  const isFav = favs.includes(song.id);
  const inPlaylist = playlist.includes(song.id);

  const toggleFav = () => {
    let f = getLS('ab_favorites', []);
    if (f.includes(song.id)) {
      f = f.filter(i => i !== song.id);
    } else {
      f.push(song.id);
    }
    setLS('ab_favorites', f);
    refresh();
  };

  const togglePlaylist = () => {
    let p = getLS('ab_playlist', []);
    if (p.includes(song.id)) {
      p = p.filter(i => i !== song.id);
    } else {
      p.push(song.id);
    }
    setLS('ab_playlist', p);
    refresh();
  };

  const handleDownload = (isPremium) => {
    const dcount = getLS('ab_download_count', 0);
    if (!isPremium && dcount >= 5) {
      alert('Free download limit reached (5). Please subscribe to Premium ($10/month).');
      return;
    }
    setLS('ab_download_count', dcount + 1);
    const a = document.createElement('a');
    a.href = song.audio;
    a.download = `${song.title}.mp3`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    refresh();
  };

  const handlePlayPause = () => {
    setPlaylistQueue([]); // Clear playlist queue when playing a single song from a card
    if (current?.id === song.id && playing) {
      setPlaying(false);
      play(null); // Stop the player by setting current song to null
    } else {
      play(song);
      setPlaying(true);
    }
  };

  return (
    <div className="card-song">
      <img src={song.artwork} alt={song.title} />
      <div className="song-meta">
        <strong>{song.title}</strong>
        <p>Genre: {song.genre}</p>
        <p>Subgenre: {song.subgenre}</p>
        <p>Singer: {song.artist}</p>
        <p>
          Duration: {Math.floor(song.duration / 60)}:
          {(song.duration % 60).toString().padStart(2, '0')}
        </p>
      </div>
      <div className="song-actions">
        <button
          className="btn btn-sm btn-primary"
          onClick={handlePlayPause}
        >
          {current?.id === song.id && playing ? ' ⏸  Pause' : ' ▶  Play'}
        </button>
        <button
          className={`btn btn-sm ${isFav ? 'btn-danger' : 'btn-outline-secondary'}`}
          onClick={toggleFav}
        >
          {isFav ? '♥' : ' ♡ '}
        </button>
        <button
          className={`btn btn-sm ${inPlaylist ? 'btn-success' : 'btn-outline-secondary'}`}
          onClick={togglePlaylist}
        >
          {inPlaylist ? 'In Playlist' : 'Add'}
        </button>
        <div style={{ marginLeft: 'auto' }}>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleDownload(localStorage.getItem('ab_premium') === 'true')}
          >
             ⬇
          </button>
        </div>
      </div>
    </div>
  );
}