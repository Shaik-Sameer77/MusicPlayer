// AudioPlayer.jsx
import React, { useState, useEffect } from "react";
import "./Card.css";
import disk from "../../assets/disk.png";
import { timer } from "../../utils/timer.js";
import FileUpload from "../FileUpload/FileUpload.jsx";

const Card = ({
  setOpen,
  audioFiles,
  currentAudioIndex,
  handleNextPrev,
  audioRef,
  onAudioEnded,
  onTimeUpdate,
  currentTime,
  setCurrentTime,
  repeat,
  setRepeat,
  play,
  setPlay,
  onAudioUpload
}) => {
  const [duration, setDuration] = useState(0);
  const [showVol, setShowVol] = useState(false);
  const [volume, setVolume] = useState(100);

  useEffect(() => {
    audioRef.current.volume = volume / 100;
  }, [volume]);

  function handleLoadStart(e) {
    const src = e.nativeEvent.srcElement.src;
    const audio = new Audio(src);
    audio.onloadedmetadata = function () {
      if (audio.readyState > 0) {
        setDuration(audio.duration);
      }
    };
    if (play) {
      audioRef.current.play();
    }
  }

  const changeCurrentTime = (e) => {
    const currentTime = Number(e.target.value);
    audioRef.current.currentTime = currentTime;
    setCurrentTime(currentTime);
  };

  const handleRepeat = () => {
    setRepeat((value) => {
      switch (value) {
        case "repeat":
          return "repeat_one";
        case "repeat_one":
          return "shuffle";
        default:
          return "repeat";
      }
    });
  };

  const handlePlaying = () => {
    if (play) {
      audioRef.current.pause();
      setPlay(false);
    } else {
      audioRef.current.play();
      setPlay(true);
    }
  };

  

  return (
    <div className="card">
      <div className="nav">
        <i className="material-icons">expand_more</i>
        <span>
          <FileUpload onAudioUpload={onAudioUpload}/>
        </span>
        <i className="material-icons" onClick={() => setOpen((prev) => !prev)}>
          queue_music
        </i>
      </div>
      <div className="img">
        <img src={disk} alt="" className={`${play ? "playing" : ""}`}/>
      </div>
      <div className="details">
        <p className="title">
          Now Playing {currentAudioIndex + 1}/{audioFiles.length}
        </p>
        <p className="artist">{audioFiles[currentAudioIndex].name}</p>
      </div>
      <div className="progress">
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={(e) => changeCurrentTime(e)}
          style={{
            background: `linear-gradient(to right, 
              #3264fe ${(currentTime / duration) * 100}%,
              #e5e5e5 ${(currentTime / duration) * 100}%)`,
          }}
        />
      </div>
      <div className="timer">
        <span>{timer(currentTime)}</span>
        <span>{timer(duration)}</span>
      </div>
      <div className="controls">
      <i className="material-icons" onClick={handleRepeat}>
          {repeat}
        </i>
        <i
          className="material-icons"
          id="prev"
          onClick={() => {
            handleNextPrev(-1);
          }}
        >
          skip_previous
        </i>
        <div className="play" onClick={handlePlaying}>
          <i className="material-icons">{play ? "pause" : "play_arrow"}</i>
        </div>
        <i
          className="material-icons"
          id="next"
          onClick={() => handleNextPrev(1)}
        >
          skip_next
        </i>
        <i
          className="material-icons"
          onClick={() => setShowVol((prev) => !prev)}
        >
          volume_up
        </i>
        <div className={`volume ${showVol ? "show" : ""}`}>
          <i
            className="material-icons"
            onClick={() => setVolume((v) => (v > 0 ? 0 : 100))}
          >
            {volume === 0 ? "volume_off" : "volume_up"}
          </i>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, 
                #3264fe ${volume}%,
                #e5e5e5 ${volume}%)`
            }}
          />
          <span>{volume}</span>
        </div>
      </div>

      <audio
        ref={audioRef}
        hidden
        controls
        autoPlay
        onEnded={onAudioEnded}
        onTimeUpdate={onTimeUpdate}
        onLoadStart={handleLoadStart}
      />
    </div>
  );
};

export default Card;
