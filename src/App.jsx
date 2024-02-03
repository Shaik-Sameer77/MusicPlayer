import React, { useState, useEffect, useRef } from "react";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer";
import FileUpload from "./components/FileUpload/FileUpload";
import Playlist from "./components/Playlist/Playlist";

import "./App.css";

const App = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(null);
  const [audioPositions, setAudioPositions] = useState({});
  const [prevPlaybackPosition, setPrevPlaybackPosition] = useState(0);
  const audioRef = useRef();

  useEffect(() => {
    const initializeAudioFiles = () => {
      const storedAudioFiles = JSON.parse(
        localStorage.getItem("audioFiles") || "[]"
      );
      if (storedAudioFiles.length > 0) {
        setAudioFiles(storedAudioFiles);
        const storedAudioIndex = parseInt(
          localStorage.getItem("currentAudioIndex"),
          10
        );
        const storedAudioPositions = JSON.parse(
          localStorage.getItem("audioPositions") || "{}"
        );

        setCurrentAudioIndex(storedAudioIndex);
        setAudioPositions(storedAudioPositions);
      }
    };

    initializeAudioFiles();
  }, []);

  const readBlobFromIndexedDB = async (fileName) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("audioDB", 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore("audios");
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("audios", "readonly");
        const store = transaction.objectStore("audios");
        const getRequest = store.get(fileName);

        getRequest.onsuccess = (event) => {
          const blob = event.target.result;
          resolve(blob);
        };

        getRequest.onerror = (event) => {
          reject(event.error);
        };

        transaction.oncomplete = () => {
          db.close();
        };
      };

      request.onerror = (event) => {
        reject(event.error);
      };
    });
  };

  const handleAudioUpload = async (file) => {
    const request = indexedDB.open("audioDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore("audios");
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("audios", "readwrite");
      const store = transaction.objectStore("audios");

      const blob = new Blob([file], { type: file.type });
      store.put(blob, file.name);

      setAudioFiles((prevAudioFiles) => [
        ...prevAudioFiles,
        { name: file.name },
      ]);

      if (audioFiles.length === 0) {
        setCurrentAudioIndex(0);
      }

      transaction.oncomplete = () => {
        db.close();
      };
    };

    request.onerror = (event) => {
      console.error("Error opening IndexedDB:", event.error);
    };
  };

  const handleAudioEnded = async () => {
    if (currentAudioIndex !== null) {
      // Set the position for the current audio file to 0
      setAudioPositions({
        ...audioPositions,
        [audioFiles[currentAudioIndex].name]: 0,
      });

      // Check if the current audio is the last one in the playlist
      if (currentAudioIndex === audioFiles.length - 1) {
        // If it's the last one, set position to 0, move to the first audio, and play
        setPrevPlaybackPosition(0);
        setCurrentAudioIndex(0);
        playAudio(0);
      } else {
        // Move to the next audio in the playlist
        setCurrentAudioIndex((prevIndex) => prevIndex + 1);

        // Set the playback position based on audioPositions, or start from 0 if not available
        const fileName = audioFiles[currentAudioIndex + 1].name;
        const newPosition =
          audioPositions[fileName] !== undefined ? audioPositions[fileName] : 0;

        // Play the next audio
        playAudio(newPosition);

        // Set the prevPlaybackPosition after setting the new index
        setPrevPlaybackPosition(newPosition);
      }
    }
  };

  const handleAudioClick = async (index) => {
    setCurrentAudioIndex(index);
    const fileName = audioFiles[index].name;

    setPrevPlaybackPosition(() => {
      const newPosition =
        audioPositions[fileName] !== undefined ? audioPositions[fileName] : 0;
      setAudioPositions({
        ...audioPositions,
        [fileName]: newPosition,
      });
      return newPosition;
    });

    playAudio();
  };

  const playAudio = async (startPosition = 0) => {
    if (currentAudioIndex !== null) {
      const fileName = audioFiles[currentAudioIndex].name;
      const blobData = await readBlobFromIndexedDB(fileName);
      const blobURL = URL.createObjectURL(blobData);

      audioRef.current.src = blobURL;

      // If the audio is already loaded, play from the specified start position
      if (audioRef.current.readyState >= 2) {
        audioRef.current.currentTime = startPosition;
        audioRef.current.play();
      } else {
        // Otherwise, wait for the audio to be loaded
        audioRef.current.onloadeddata = () => {
          // Set the start position and play
          audioRef.current.currentTime = startPosition;
          audioRef.current.play();
        };
      }
    }
  };

  const handleTimeUpdate = () => {
    setPrevPlaybackPosition(audioRef.current.currentTime);
    setAudioPositions({
      ...audioPositions,
      [audioFiles[currentAudioIndex].name]: audioRef.current.currentTime,
    });
  };

  useEffect(() => {
    if (currentAudioIndex !== null) {
      playAudio(prevPlaybackPosition);
    }
  }, [currentAudioIndex]);

  useEffect(() => {
    const saveAudioFiles = () => {
      localStorage.setItem("audioFiles", JSON.stringify(audioFiles));
    };

    saveAudioFiles();
  }, [audioFiles]);

  useEffect(() => {
    const saveCurrentAudioIndex = () => {
      if (audioFiles.length > 0) {
        localStorage.setItem("currentAudioIndex", currentAudioIndex.toString());
      }
    };

    saveCurrentAudioIndex();
  }, [currentAudioIndex, audioFiles]);

  useEffect(() => {
    const saveAudioPositions = () => {
      if (audioFiles.length > 0) {
        localStorage.setItem("audioPositions", JSON.stringify(audioPositions));
      }
    };

    saveAudioPositions();
  }, [audioPositions, audioFiles]);

  return (
    <div className="app-container">
      <h1>Audio Player</h1>
      <FileUpload onAudioUpload={handleAudioUpload} />
      {audioFiles.length === 0 ? (
        <p className="no-files-message">Upload audios to play</p>
      ) : (
        <>
          <AudioPlayer
            audioRef={audioRef}
            onAudioEnded={handleAudioEnded}
            onTimeUpdate={handleTimeUpdate}
          />
          <Playlist
            audioFiles={audioFiles}
            currentAudioIndex={currentAudioIndex}
            onAudioClick={handleAudioClick}
          />
        </>
      )}
    </div>
  );
};

export default App;
