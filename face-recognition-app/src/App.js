import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxFiles: 10,
  });

  const handleTrain = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/train",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error during training:", error);
      setMessage("Training failed. Check console for details.");
    }
  };

  const handleRecognize = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/recognize",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResults(response.data);
    } catch (error) {
      console.error("Error during recognition:", error);
      setMessage("Recognition failed. Check console for details.");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Face Recognition App</h1>
      <div
        {...getRootProps({ className: "dropzone" })}
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <input {...getInputProps()} />
        <p>Drag & drop images here, or click to select files</p>
      </div>
      <button className="btn btn-primary mt-3" onClick={handleTrain}>
        Train Model
      </button>
      <button className="btn btn-success mt-3 ml-2" onClick={handleRecognize}>
        Recognize Faces
      </button>
      {message && <div className="alert alert-info mt-3">{message}</div>}
      <div className="mt-4">
        <h2>Results</h2>
        <ul className="list-group">
          {results.map((result, index) => (
            <li key={index} className="list-group-item">
              {result.name}: {result.filename}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
