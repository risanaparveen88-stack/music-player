import React from 'react';
import { getLS } from '../utils/storage';
import songsData from '../data/songs';

export default function Downloads() {
  const downloadsCount = getLS('ab_download_count', 0);
  // We don't store list of downloaded items separately here; show count & allow user to open files in public folder.
  return (
    <div>
      <h4>Downloads</h4>
      <div className="mb-3 small-muted">You have downloaded <strong>{downloadsCount}</strong> song(s).</div>
      <div>
        <div className="small-muted">Downloaded songs (open from your public/songs folder or check browser downloads history).</div>
        <div className="mt-2">
          <ul>
            {songsData.map(s => (
              <li key={s.id}>
                <a href={s.audio} target="_blank" rel="noreferrer">{s.title} — {s.artist}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}