import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileSelector from './FileSelector';
import TrainingSection from './TrainingSection';
import { toast } from 'react-toastify';

const Training = () => {
  const [trainingImages, setTrainingImages] = useState<string[]>([]);
  const [selectedTrainingFiles, setSelectedTrainingFiles] = useState<string[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const trainResponse = await axios.get<string[]>('http://127.0.0.1:5001/files/recognized');
        setTrainingImages(trainResponse.data);
        toast.success('Trained successfully');
      } catch (error) {
        console.error('Error fetching files:', error);
        toast.error('Failed to fetch images. Check console for details.');
      }
    };

    fetchFiles();
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    setSelectedTrainingFiles(prev => {
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
    } catch (error) {
      console.error('Error during training:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Training</h1>
      <FileSelector 
        trainingImages={trainingImages}
        selectedTrainingFiles={selectedTrainingFiles}
        handleFileSelect={handleFileSelect}
      />
      <TrainingSection
        handleTrain={handleTrain}
      />
    </div>
  );
};

export default Training;
