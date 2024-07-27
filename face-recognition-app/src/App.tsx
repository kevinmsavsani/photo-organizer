import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface FileResult {
  filename: string;
  names: string[];
}

const App: React.FC = () => {
  const [trainingImages, setTrainingImages] = useState<string[]>([]);
  const [recognitionImages, setRecognitionImages] = useState<string[]>([]);
  const [selectedTrainingFiles, setSelectedTrainingFiles] = useState<string[]>([]);
  const [selectedRecognitionFiles, setSelectedRecognitionFiles] = useState<string[]>([]);
  const [results, setResults] = useState<FileResult[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const trainResponse = await axios.get<string[]>('http://127.0.0.1:5001/files/recognized');
        setTrainingImages(trainResponse.data);

        const recognizeResponse = await axios.get<string[]>('http://127.0.0.1:5001/files/uploads');
        setRecognitionImages(recognizeResponse.data);
      } catch (error) {
        console.error('Error fetching files:', error);
        setMessage('Failed to fetch images. Check console for details.');
      }
    };

    fetchFiles();
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'train' | 'recognize') => {
    const { value, checked } = event.target;
    const updateSelection = type === 'train' ? setSelectedTrainingFiles : setSelectedRecognitionFiles;

    updateSelection(prev => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter(file => file !== value);
      }
    });
  };

  const handleTrain = async () => {
    try {
      const response = await axios.post<{ message: string }>('http://127.0.0.1:5001/train', selectedTrainingFiles, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error during training:', error);
      setMessage('Training failed. Check console for details.');
    }
  };

  const handleRecognize = async () => {
    try {
      const response = await axios.post<FileResult[]>('http://127.0.0.1:5001/recognize', selectedRecognitionFiles, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error during recognition:', error);
      setMessage('Recognition failed. Check console for details.');
    }
  };

  return (
    <div className="container mt-5">
      <h1>Face Recognition App</h1>

      <div>
        <h2>Select Images for Training</h2>
        {trainingImages.length > 0 ? (
          <div>
            {trainingImages.map((file, index) => (
              <div key={index} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`train-${file}`}
                  value={file}
                  onChange={(e) => handleFileSelect(e, 'train')}
                />
                <label className="form-check-label" htmlFor={`train-${file}`}>
                  {file}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <p>No training images available.</p>
        )}
        <button className="btn btn-primary mt-3" onClick={handleTrain}>Train Model</button>
      </div>

      <div className="mt-4">
        <h2>Select Images for Recognition</h2>
        {recognitionImages.length > 0 ? (
          <div>
            {recognitionImages.map((file, index) => (
              <div key={index} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`recognize-${file}`}
                  value={file}
                  onChange={(e) => handleFileSelect(e, 'recognize')}
                />
                <label className="form-check-label" htmlFor={`recognize-${file}`}>
                  {file}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <p>No recognition images available.</p>
        )}
        <button className="btn btn-success mt-3" onClick={handleRecognize}>Recognize Faces</button>
      </div>

      {message && <div className="alert alert-info mt-3">{message}</div>}

      <div className="mt-4">
        <h2>Recognition Results</h2>
        <ul className="list-group">
          {results.map((result, index) => (
            <li key={index} className="list-group-item">
              {result.filename}: {result.names.join(', ')}
              <img
                src={`http://127.0.0.1:5001/files/uploads/${result.filename}`}
                alt="result"
                className="img-thumbnail"
                style={{ width: '100px', height: '100px' }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
