import React from "react";
import { CustomButton } from "../../components/Button";

interface RecognitionSectionProps {
  handleRecognize: () => void;
}

const RecognitionSection: React.FC<RecognitionSectionProps> = ({
  handleRecognize,
}) => {
  return (
    <div className="mt-4">
      <CustomButton variant="primary" onClick={handleRecognize}>
        Recognize Faces
      </CustomButton>
    </div>
  );
};

export default RecognitionSection;
