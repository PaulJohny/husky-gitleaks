import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Map from './Map';
import LeftSideCard from './LeftSideCard';
import RightSideCard from './RightSideCard';

function App() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [visibleMarkers, setVisibleMarkers] = useState({});


  return (
    
    <div className="App">
      
      <Map selectedDate={selectedDate} selectedRegion={selectedRegion} visibleMarkers={visibleMarkers} /> {/* Pass visibleMarkers */}
      <LeftSideCard onSelectDate={setSelectedDate} onSelectRegion={setSelectedRegion} />
      <RightSideCard selectedRegion={selectedRegion} visibleMarkers={visibleMarkers} setVisibleMarkers={setVisibleMarkers} /> {/* Pass visibleMarkers and setVisibleMarkers */}
    </div>
    
  );
}

export default App;
