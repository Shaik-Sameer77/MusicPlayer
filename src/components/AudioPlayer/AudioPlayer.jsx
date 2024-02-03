// AudioPlayer.jsx
import React from 'react';
import "./AudioPlayer.css"


const AudioPlayer = ({ audioRef, onAudioEnded, onTimeUpdate }) => {
  return (
    <audio ref={audioRef} controls autoPlay onEnded={onAudioEnded} onTimeUpdate={onTimeUpdate} />
  );
};

export default AudioPlayer;
