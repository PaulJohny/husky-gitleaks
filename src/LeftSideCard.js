import React , { useState } from 'react';
import Slider from 'rc-slider'; // Import the slider component
import 'rc-slider/assets/index.css'; // Import the slider's CSS
import './LeftSideCard.css';
import Iphone from "./assets/images/iphone.png";
import customer from "./assets/images/account.png";
import grid from "./assets/images/menu.png";
import data from './data.json';


const LeftSideCard = ({ onSelectDate, onSelectRegion }) => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedHourRange, setSelectedHourRange] = useState([0, 24]); // Initial time range
  const [selectedButton, setSelectedButton] = useState('cell'); // Initialize with 'cell'

  const handleClick = (button) => {
    setSelectedButton(button);
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setSelectedRegion('');
  };

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
    onSelectRegion(event.target.value);
  };

  const handleDateChange = (event) => {
    // setSelectedDate(event.target.value);
    
    const newDate = event.target.value;
    console.log('Date', newDate)
    setSelectedDate(newDate);
    onSelectDate(newDate);
  };

  const handleHourChange = (event) => {
    setSelectedHour(event.target.value);
  };

  const handleHourRangeChange = (hourRange) => {
    setSelectedHourRange(hourRange);
  };

  const getUniqueStates = () => {
    const states = new Set();
    data.forEach((record) => states.add(record.Location));
    return Array.from(states);
  };

  const getRegionsByState = (state) => {
    const regions = new Set();
    data.forEach((record) => {
      if (record.Location === state) {
        regions.add(record.SubLocation);
      }
    });
    return Array.from(regions);
  };
  
  return (
    <div className="left-side-card">
       <div className="buttons">
      <button className={selectedButton === 'cell' ? 'selected' : 'unselected'} onClick={() => handleClick('cell')}>
        <img className="icon" src={Iphone} alt="images" width={"20px"} />
        <span>Cell</span>
      </button>
      <button className={selectedButton === 'customer' ? 'selected' : 'unselected'} onClick={() => handleClick('customer')}>
        <img className="icon" src={customer} alt="images" width={"20px"} />
        <span>Customer</span>
      </button>
      <button className={selectedButton === 'grid' ? 'selected' : 'unselected'} onClick={() => handleClick('grid')}>
        <img className="icon" src={grid} alt="images" width={"20px"} />
        <span>Grid</span>
      </button>
    </div>


      {selectedState && (
        <div className="selected-values">
          
          <p>{selectedState} :  {selectedRegion}</p>
        </div>
      )}
      <div className="dropdowns">
      <select value={selectedState} onChange={handleStateChange}>
          <option value="">Select a state</option>
          {getUniqueStates().map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <select value={selectedRegion} onChange={handleRegionChange} disabled={!selectedState}>
          <option value="">Select a region</option>
          {selectedState &&
            getRegionsByState(selectedState).map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
        </select>

        <div className="date-selector">
          <label>TIME RANGE</label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            placeholder="Select a date"
          />
        </div>

      </div>
      <div className="hour-range-selector">
          <label>Time Range:</label>
          <Slider
            range
            min={0}
            max={24}
            defaultValue={selectedHourRange}
            onChange={handleHourRangeChange}
          />
          <div className="hour-range-labels">
            <span>{selectedHourRange[0]}:00</span>
            <span>{selectedHourRange[1]}:00</span>
          </div>
        </div>
      {/* Add your other card content here */}
    </div>
  );
};

export default LeftSideCard;