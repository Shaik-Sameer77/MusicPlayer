// Playlist.jsx
import React from 'react';
import "./Playlist.css"

const Playlist = ({ open,setOpen, audioFiles, setCurrentAudioIndex, currentAudioIndex, onAudioClick }) => {
  return (
    <div className={`list ${open? 'show' : ''}`}>
      <div className="header">
      <div className="">
          <i className="material-icons">queue_music</i>
          <span>Music list</span>
        </div>
        <i className="material-icons" onClick={() => setOpen(false)}>
          close
        </i>
      </div>
      <ul>
      {audioFiles.map((audio, index) => (
        <li
          key={index}
          onClick={() => onAudioClick(index)}
          className={index === currentAudioIndex ? 'active' : ''}
        >
          <div className="row">
            <span>{audio.name}</span>
          </div>
          
        </li>
      ))}
    </ul>
    </div>
    
  );
};

export default Playlist;
