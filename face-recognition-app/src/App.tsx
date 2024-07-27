import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');

  const onDrop = (acceptedFiles: any) => {
    setFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxFiles: 10,
  } as any);

  const handleTrain = async () => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    try {
      const response = await axios.post('http://127.0.0.1:5001/train', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error during training:', error);
      setMessage('Training failed. Check console for details.');
    }
  };

  const handleRecognize = async () => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    try {
      const response = await axios.post('http://127.0.0.1:5001/recognize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error during recognition:', error);
      setMessage('Recognition failed. Check console for details.');
    }
  };

  useEffect(() => {
    // Reset message when files change
    if (files.length) setMessage('');
  }, [files]);

  return (
    <div className="flex items-center justify-center container mt-5">
      <h1>Face Recognition App</h1>
      <div {...getRootProps({ className: 'dropzone' })} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
        <input {...getInputProps()} />
        <p>Drag & drop images here, or click to select files</p>
      </div>
      <button className="btn btn-primary mt-3" onClick={handleTrain}>Train Model</button>
      <button className="btn btn-success mt-3 ml-2" onClick={handleRecognize}>Recognize Faces</button>
      {message && <div className="alert alert-info mt-3">{message}</div>}
      <div className="mt-4">
        <h2>Uploaded Images</h2>
        <div className="d-flex flex-wrap">
          {files.map((file, index) => (
            <div key={index} className="m-2">
              <img src={URL.createObjectURL(file)} alt="preview" className="img-thumbnail" style={{ width: '100px', height: '100px' }} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <h2>Results</h2>
        <ul className="list-group">
          {results.map((result: any, index) => (
            <li key={index} className="list-group-item">
              {result.filename}: {result.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
