import React from "react";
import { CustomButton } from "../../components/Button";

interface TrainingSectionProps {
  handleTrain: () => void;
}

const TrainingSection: React.FC<TrainingSectionProps> = ({ handleTrain }) => {
  return (
    <div className="mt-4">
      <CustomButton variant="primary" onClick={handleTrain}>
        Train Model
      </CustomButton>
    </div>
  );
};

export default TrainingSection;
