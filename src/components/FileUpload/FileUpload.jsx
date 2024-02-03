
import React, { useRef } from 'react';
import "./FileUpload.css"

const FileUpload = ({ onAudioUpload }) => {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onAudioUpload(file);
    }
  };

  return (
    <>
      <button onClick={() => fileInputRef.current.click()}>Upload Audio</button>
      <input
        type="file"
        accept=".mp3"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </>
  );
};

export default FileUpload;
