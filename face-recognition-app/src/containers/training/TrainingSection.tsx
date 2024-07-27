import React from 'react';

interface TrainingSectionProps {
  handleTrain: () => void;
}

const TrainingSection: React.FC<TrainingSectionProps> = ({ handleTrain }) => {
  return (
    <div className="mt-4">
      <h2>Training</h2>
      <button className="btn btn-primary mt-3" onClick={handleTrain}>Train Model</button>
    </div>
  );
};

export default TrainingSection;
