// FileUpload.jsx
import React, { useRef } from 'react';
import "./FileUpload.css"

const FileUpload = ({ onAudioUpload, uploadMore }) => {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onAudioUpload(file) || uploadMore(file);
    }
  };

  return (
    <>
      <button onClick={() => fileInputRef.current.click()}>Upload</button>
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
