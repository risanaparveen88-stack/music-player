// Favorites.js
import React, { useEffect, useState } from 'react';
import songsData from '../data/songs';
import SongCard from '../components/SongCard';
import { getLS } from '../utils/storage';

export default function Favorites({ setCurrent, playing, setPlaying, setPlaylistQueue }) {
  const [favs, setFavs] = useState([]);
  useEffect(() => setFavs(getLS('ab_favorites', [])), []);

  return (
    <div>
      <h4>Favorites</h4>
      <div className="row-cards">
        {favs.length === 0 && <div className="small-muted">No favorites yet</div>}
        {favs.map(id => {
          const s = songsData.find(x => x.id === id);
          if (!s) return null;
          return <SongCard 
            key={s.id} 
            song={s} 
            play={setCurrent} 
            refresh={() => setFavs(getLS('ab_favorites', []))}
            playing={playing} 
            setPlaying={setPlaying}
            setPlaylistQueue={setPlaylistQueue}
          />;
        })}
      </div>
    </div>
  );
}