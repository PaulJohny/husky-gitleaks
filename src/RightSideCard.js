import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './RightSideCard.css';
import data from './data.json';

const RightSideCard = ({ selectedRegion, visibleMarkers, setVisibleMarkers }) => {
  const rangeColors = [
    'green', 'yellow', 'orange', 'blue', 'purple', 'red', 'pink', 'brown', 'gray', 'black'
  ];

  const calculateThroughputRanges = (region) => {
    const filteredRecords = data.filter((record) => record.SubLocation === region);
    const throughputValues = filteredRecords.map((record) => record.throughput);
  
    const minThroughput = Math.floor(Math.min(...throughputValues));
    const maxThroughput = Math.ceil(Math.max(...throughputValues));
    const ranges = [];
  
    for (let i = minThroughput; i < maxThroughput; i++) {
      const range = `${i}-${i + 1}`;
      const colorIndex = i - minThroughput;
      const color = rangeColors[colorIndex % rangeColors.length];
      
      ranges.push({
        range,
        color,
      });
    }
  
    return ranges;
  };

  const throughputRanges = selectedRegion ? calculateThroughputRanges(selectedRegion) : [];

  // Initialize the visibleMarkers state with all ranges initially set to true
  if (selectedRegion && !Object.keys(visibleMarkers).length) {
    const initialVisibleMarkers = {};
    throughputRanges.forEach((rangeData) => {
      initialVisibleMarkers[rangeData.range] = true;
    });
    setVisibleMarkers(initialVisibleMarkers);
  }

  const toggleMarkerVisibility = (range) => {
    setVisibleMarkers((prevVisibleMarkers) => ({
      ...prevVisibleMarkers,
      [range]: !prevVisibleMarkers[range],
    }));
  };
  
  return (
    <div className="right-side-card">
      {throughputRanges.length > 0 ? (
        <div className="color-ranges">
          {throughputRanges.map((rangeData, index) => (
            <div className="color-range" key={index}>
              <div className="color-box" style={{ backgroundColor: rangeData.color }}></div>
              <p>{rangeData.range}</p>
              <div className="eye-icon" onClick={() => toggleMarkerVisibility(rangeData.range)}>
                <FontAwesomeIcon icon={visibleMarkers[rangeData.range] ? faEye : faEyeSlash} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className='status'>No throughput ranges available.</p>
      )}
    </div>
  );
};

export default RightSideCard;
