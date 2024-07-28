import React from 'react';

interface Result {
  filename: string;
  names: string[];
}

interface ResultsSectionProps {
  results: Result[];
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ results }) => {
  return (
    <div className="mt-4 font-bold">
      <h2>Recognition Results</h2>
      <ul className="list-group">
        {results.map((result, index) => (
          <li key={index} className="list-group-item">
            {result.filename}: {result.names.join(', ')}
            <img
              src={`http://127.0.0.1:5001/files/${result.filename}`}
              alt="result"
              className="img-thumbnail"
              style={{ width: '100px', height: '100px' }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultsSection;
