
import React from 'react';
import "./Playlist.css"

const Playlist = ({ audioFiles, currentAudioIndex, onAudioClick }) => {
  return (
    <ul className="playlist">
      {audioFiles.map((audio, index) => (
        <li
          key={index}
          onClick={() => onAudioClick(index)}
          className={index === currentAudioIndex ? 'active' : ''}
        >
          {audio.name}
        </li>
      ))}
    </ul>
  );
};

export default Playlist;
