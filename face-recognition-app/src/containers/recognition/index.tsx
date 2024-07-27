import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileSelector from './FileSelector';
import RecognitionSection from './RecognitionSection';
import ResultsSection from './ResultsSection';
import { toast } from 'react-toastify';

interface FileResult {
  filename: string;
  names: string[];
}

const Results = () => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [results, setResults] = useState<FileResult[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const recognizeResponse = await axios.get<string[]>('http://127.0.0.1:5001/files/recognizing');
        setImages(recognizeResponse.data);
      } catch (error) {
        console.error('Error fetching files:', error);
        toast.error('Failed to fetch images. Check console for details.');
      }
    };

    fetchFiles();
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    setSelectedFiles(prev => {
      if (checked) {
        return [...new Set([...prev, value])];
      } else {
        return prev.filter(file => file !== value);
      }
    });
  };

  const handleRecognize = async () => {
    try {
      const response = await axios.post<FileResult[]>('http://127.0.0.1:5001/recognize', selectedFiles, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error during recognition:', error);
      toast.error('Recognition failed. Check console for details.');
    }
  };

  return (
    <div className="container mt-5">
      <FileSelector 
        images={images}
        selectedFiles={selectedFiles}
        handleFileSelect={handleFileSelect}
      />
      <RecognitionSection
        handleRecognize={handleRecognize}
      />
      <ResultsSection results={results} />
    </div>
  );
};

export default Results;
