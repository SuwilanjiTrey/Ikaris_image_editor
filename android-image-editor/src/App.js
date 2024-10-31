import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [outputMessage, setOutputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const densities = {
    mdpi: 1,
    hdpi: 1.5,
    xhdpi: 2,
    xxhdpi: 3,
    xxxhdpi: 4
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setOutputMessage('');
    } else {
      setOutputMessage('Please select a valid image file.');
    }
  };

  const processImage = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setOutputMessage('');

    const img = await loadImage(selectedFile);

    for (const [density, scale] of Object.entries(densities)) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const scaledWidth = Math.round(img.width * scale);
      const scaledHeight = Math.round(img.height * scale);
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;

      ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

      const dataUrl = canvas.toDataURL(selectedFile.type);
      downloadImage(dataUrl, `${getBaseFileName(selectedFile.name)}_${density}.${getFileExtension(selectedFile.name)}`);
    }

    setIsLoading(false);
    setOutputMessage('Image processing complete. Check your downloads.');
  };

  const loadImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const downloadImage = (dataUrl, fileName) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    link.click();
  };

  const getBaseFileName = (fileName) => fileName.split('.').slice(0, -1).join('.');
  const getFileExtension = (fileName) => fileName.split('.').pop();

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setOutputMessage('');
  };

  return (
    <div className="container">
      <h1>Android Image Editor</h1>
      <button>
        <a href="https://suwilanjitrey.github.io/IkarisC.S.I/">Back to Editor</a>
      </button>
      <div
        className="upload-area"
        onClick={() => document.getElementById('imageInput').click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files[0]);
        }}
      >
        <p>Drag & Drop your image here or click to select</p>
      </div>
      <input
        type="file"
        id="imageInput"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {previewUrl && <img id="preview" src={previewUrl} alt="Preview" />}
      <button
        onClick={processImage}
        disabled={!selectedFile || isLoading}
        className="process-button"
      >
        {isLoading ? 'Processing...' : 'Process Image'}
      </button>
      <button onClick={clearImage} className="clear-button">
        Clear Image
      </button>
      <div id="output">{outputMessage}</div>
      {isLoading && <div className="loading"></div>}
    </div>
  );
}

export default App;
