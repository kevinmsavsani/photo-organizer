// @ts-nocheck
import React, { useEffect, useState } from "react";

interface FileSelectorProps {
  images: string[];
  selectedFiles: string[];
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFolderSelect: any
}

const FileSelector: React.FC<FileSelectorProps> = ({
  images,
  selectedFiles,
  handleFileSelect,
  handleFolderSelect
}) => {
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (images.length > 0) {
      setSelectAll(selectedFiles.length === images.length);
    } else {
      setSelectAll(false);
    }
  }, [selectedFiles, images]);

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);

    const syntheticEvent = {
      target: {
        value: "",
        checked: isChecked,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    images.forEach((file) => {
      syntheticEvent.target.value = file;
      handleFileSelect(syntheticEvent);
    });
  };

  const handleIndividualSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <input
        type="file"
        webkitdirectory="true"
        onChange={handleFolderSelect}
        className="border p-2 rounded"
      />
      <h2 className="text-xl font-semibold mb-4">Select Images for Recognition</h2>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600"
            id="select-all"
            checked={selectAll}
            onChange={handleSelectAllChange}
          />
          <label className="text-gray-700" htmlFor="select-all">
            Select All
          </label>
        </div>
        {images.length > 0 ? (
          images.map((file, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                id={`train-${file}`}
                value={file}
                checked={selectedFiles.includes(file)}
                onChange={handleIndividualSelect}
              />
              <label className="text-gray-700" htmlFor={`train-${file}`}>
                {file}
              </label>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No images available.</p>
        )}
      </div>
    </div>
  );
};

export default FileSelector;
