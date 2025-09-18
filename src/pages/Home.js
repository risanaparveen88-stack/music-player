// Home.js
import React, { useState, useMemo } from 'react';
import songsData from '../data/songs';
import SearchBar from '../components/SearchBar';
import SongCard from '../components/SongCard';

export default function Home({ setCurrent, playing, setPlaying, setPlaylistQueue }) {
  const [q, setQ] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const play = (song) => setCurrent(song);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return songsData.filter(s =>
      s.title.toLowerCase().includes(t) ||
      s.artist.toLowerCase().includes(t) ||
      s.genre.toLowerCase().includes(t)
    );
  }, [q]);
  const grouped = ['Tamil', 'Hindi', 'English', 'Telugu'];

  return (
    <div>
      <div className="section">
        <h4>Discover</h4>
        <SearchBar 
          value={q} 
          setValue={setQ} 
          onSearch={() => setRefreshKey(k => k + 1)} 
        />
      </div>

      {q && filtered.length > 0 && (
        <div className="section">
          <h4>Search Results</h4>
          <div className="row-cards">
            {filtered.map(s => (
              <SongCard 
                key={s.id} 
                song={s} 
                play={play} 
                refresh={() => setRefreshKey(k => k + 1)}
                playing={playing} 
                setPlaying={setPlaying} 
                setPlaylistQueue={setPlaylistQueue}
              />
            ))}
          </div>
        </div>
      )}

      {q && filtered.length === 0 && (
        <div className="section">
          <h4>No songs found for "{q}"</h4>
        </div>
      )}

      {grouped.map(g => (
        <div className="section" key={g}>
          <h4>{g} Songs</h4>
          <div className="row-cards">
            {songsData
              .filter(s => s.genre === g)
              .map(s => (
                <SongCard 
                  key={s.id} 
                  song={s} 
                  play={play} 
                  refresh={() => setRefreshKey(k => k + 1)} 
                  playing={playing} 
                  setPlaying={setPlaying} 
                  setPlaylistQueue={setPlaylistQueue}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}