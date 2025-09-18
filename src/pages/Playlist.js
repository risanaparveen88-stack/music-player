// Playlists.js
import React, { useEffect, useState } from "react";
import songsData from "../data/songs";
import SongCard from "../components/SongCard";
import { getLS } from "../utils/storage";
import { Play, Pause } from "lucide-react";

export default function Playlist({ setCurrent, playing, setPlaying, setPlaylistQueue }) {
  const [plist, setPlist] = useState([]);
  useEffect(() => setPlist(getLS("ab_playlist", [])), []);

  const handlePlayPause = () => {
    if (playing) {
      setCurrent(null);
      setPlaying(false);
    } else {
      if (plist.length > 0) {
        const firstSong = songsData.find((x) => x.id === plist[0]);
        if (firstSong) {
          setCurrent(firstSong);
          setPlaying(true);
          setPlaylistQueue(plist); // Set the playlist queue in App.js
        }
      }
    }
  };

  return (
    <div>
      <h4 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        Playlist
        <button
          onClick={handlePlayPause}
          style={{
            background: "var(--accent)",
            border: "none",
            borderRadius: "50%",
            padding: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {playing ? <Pause color="white" /> : <Play color="white" />}
        </button>
      </h4>
      <div className="row-cards">
        {plist.length === 0 && (
          <div className="small-muted">No songs in playlist yet</div>
        )}
        {plist.map((id) => {
          const s = songsData.find((x) => x.id === id);
          if (!s) return null;
          return (
            <SongCard
              key={s.id}
              song={s}
              play={setCurrent}
              refresh={() => setPlist(getLS("ab_playlist", []))}
              playing={playing} 
              setPlaying={setPlaying}
              setPlaylistQueue={setPlaylistQueue}
            />
          );
        })}
      </div>
    </div>
  );
}