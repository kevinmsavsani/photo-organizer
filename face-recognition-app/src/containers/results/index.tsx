import React, { useState, useEffect } from "react";
import axios from "axios";

const RecognitionResults = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/recognition_results"
        );
        let res: any = [];
        response.data.forEach((val: any) => {
          try {
            const nameString = val.name.replace(/'/g, '"'); // Replace single quotes with double quotes
            const parsedName = JSON.parse(nameString);
            res = [...res, { filename: val.filename, name: parsedName }];
          } catch (e) {
            console.error("Error parsing JSON:", e);
            res = [...res, { filename: val.filename, name: [''] }];
          }
        });

        setResults(res);
        setLoading(false);
      } catch (error: any) {
        setError(error);
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Filter results based on the filter state
  const filteredResults = results.filter((result) =>
    result.name.join(', ').toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      {/* Filter input */}
      <input
        type="text"
        placeholder="Filter by name"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {/* Display images and recognition results */}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredResults.map((result, index) => (
          <div key={index} style={{ margin: "10px", textAlign: "center" }}>
            <img
              src={`http://127.0.0.1:5001/files/${result.filename}`}
              alt="result"
              className="img-thumbnail"
              style={{ width: "100px", height: "100px" }}
            />
            <p>{result.name.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecognitionResults;
