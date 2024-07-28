import React, { useState, useEffect } from "react";
import axios from "axios";
import FileSelector from "./FileSelector";
import TrainingSection from "./TrainingSection";
import { toast } from "react-toastify";

const Training = () => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const trainResponse = await axios.get<string[]>(
          "http://127.0.0.1:5001/files/training"
        );
        setImages(trainResponse.data);
        toast.success("Trained successfully");
      } catch (error) {
        console.error("Error fetching files:", error);
        toast.error("Failed to fetch images. Check console for details.");
      }
    };

    fetchFiles();
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    setSelectedFiles((prev) => {
      if (checked) {
        return [...new Set([...prev, value])];
      } else {
        return prev.filter((file) => file !== value);
      }
    });
  };

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files
      .filter(
        (file) =>
          file.name.toLowerCase().endsWith(".jpg") ||
          file.name.toLowerCase().endsWith(".jpeg") ||
          file.name.toLowerCase().endsWith(".png")
      )
      .map((file) => file.name);

    setImages(validFiles);
  };

  const handleTrain = async () => {
    try {
      const response = await axios.post<{ message: string }>(
        "http://127.0.0.1:5001/train",
        selectedFiles,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error during training:", error);
    }
  };

  return (
    <div className="flex flex-col gap-2 ">
      <FileSelector
        images={images}
        selectedFiles={selectedFiles}
        handleFolderSelect={handleFolderSelect}
        handleFileSelect={handleFileSelect}
      />
      <TrainingSection handleTrain={handleTrain} />
    </div>
  );
};

export default Training;
