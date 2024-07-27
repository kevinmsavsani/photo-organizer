import React from 'react';

interface RecognitionSectionProps {
  handleRecognize: () => void;
}

const RecognitionSection: React.FC<RecognitionSectionProps> = ({ handleRecognize }) => {
  return (
    <div className="mt-4">
      <h2>Recognition</h2>
      <button className="btn btn-success mt-3" onClick={handleRecognize}>Recognize Faces</button>
    </div>
  );
};

export default RecognitionSection;
