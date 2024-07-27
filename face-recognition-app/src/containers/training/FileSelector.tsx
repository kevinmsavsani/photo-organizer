import React from 'react';

interface FileSelectorProps {
  trainingImages: string[];
  selectedTrainingFiles: string[];
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>, type: 'train' | 'recognize') => void;
}

const FileSelector: React.FC<FileSelectorProps> = ({ trainingImages, selectedTrainingFiles, handleFileSelect }) => {
  return (
    <div>
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
                  checked={selectedTrainingFiles.includes(file)}
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
      </div>
    </div>
  );
};

export default FileSelector;
