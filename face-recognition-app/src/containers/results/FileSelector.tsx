import React from 'react';

interface FileSelectorProps {
  images: string[];
  selectedFiles: string[];
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>, type: 'train' | 'recognize') => void;
}

const FileSelector = ({ images, selectedFiles, handleFileSelect }: FileSelectorProps) => {
  return (
    <div>
      <div className="mt-4">
        <h2>Select Images for Recognition</h2>
        {images.length > 0 ? (
          <div>
            {images.map((file, index) => (
              <div key={index} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`recognize-${file}`}
                  value={file}
                  checked={selectedFiles.includes(file)}
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
      </div>
    </div>
  );
};

export default FileSelector;
