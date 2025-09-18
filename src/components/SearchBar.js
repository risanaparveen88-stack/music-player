import React from 'react';

export default function SearchBar({ value, setValue, onSearch }) {
  return (
    <div className="d-flex mb-3">
      <input
        className="form-control me-2"
        placeholder="Search by title, artist or genre"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button className="btn btn-primary" onClick={onSearch}>Search</button>
    </div>
  );
}