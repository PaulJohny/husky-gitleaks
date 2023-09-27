import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import data from "./data.json";

mapboxgl.accessToken =
  "pk.eyJ1IjoijbGtnaHc5NmgwMGli0In0.XMNzzTI2nHCObuDa8qaNlQ";

const MapComponent = ({ selectedDate, selectedRegion, visibleMarkers }) => {
  const [jsonData, setJsonData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [markerVisibility, setMarkerVisibility] = useState({});

  useEffect(() => {
    setJsonData(data);
  }, []);

  useEffect(() => {
    if (jsonData.length > 0 && selectedRegion) {
      const formattedSelectedDate = new Date(selectedDate.replace(/-/g, "/"));
      const filteredRecords = jsonData.filter((record) => {
        const recordDate = new Date(record.data_date);
        return (
          recordDate.getTime() === formattedSelectedDate.getTime() &&
          record.SubLocation === selectedRegion
        );
      });
      setFilteredData(filteredRecords);
    }
  }, [jsonData, selectedDate, selectedRegion]);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.5, 40],
      zoom: 2,
      cluster: true, // Enable clustering
      clusterMaxZoom: 14, // Maximum zoom to cluster points o
    });

    const markers = []; // Create an array to store markers
    if (filteredData.length > 0) {
      const coordinates = filteredData.map((record) => [
        record.longitude,
        record.latitude,
      ]);

      const bounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

      map.fitBounds(bounds, {
        padding: 50,
        maxZoom: 8,
      });
      const lineFeatures = [];

      // Loop through the filtered data to create line features

      filteredData.forEach((record, index) => {
        let marker;
        let latitudeWithOffset;
        let longitudeWithOffset;
        const markerThroughput = Math.round(record.throughput);
        let markerVisible = true; // Set all markers to be visible by default

        // Loop through the visibility ranges and check if markerThroughput falls within any of them
        for (const range in visibleMarkers) {
          const [min, max] = range.split("-").map(Number);
          if (
            markerThroughput >= min &&
            markerThroughput <= max &&
            !visibleMarkers[range]
          ) {
            markerVisible = false;
            break; // No need to check further ranges
          }
        }
        if (markerVisible) {
          const result = hasMatchingCoordinates();
          if (result) {
            latitudeWithOffset = record.latitude + 0.00002; // Adjust this offset as needed
            longitudeWithOffset = record.longitude;
            map.on("load", () => {
              map.addSource(`lines+${index}`, {
                type: "geojson",
                data: {
                  type: "FeatureCollection",
                  features: [
                    {
                      type: "Feature",
                      properties: {
                        color: "#F7455D", // red
                      },
                      geometry: {
                        type: "LineString",
                        coordinates: [
                          [record.longitude, record.latitude],
                          [longitudeWithOffset, latitudeWithOffset],
                        ],
                      },
                    },
                  ],
                },
              });
              map.addLayer({
                id: `line+${index}`,
                type: "line",
                source: `lines+${index}`,
                paint: {
                  "line-width": 3,
                  "line-color": ["get", "color"],
                },
              });
              const popupContent = `
              <div>
                <strong>Date:</strong> ${record.data_date}<br>
                <strong>Location:</strong> ${record.Location}<br>
                <strong>Sublocation:</strong> ${record.SubLocation}<br>
                <strong>Latitude:</strong> ${record.latitude}<br>
                <strong>Longitude:</strong> ${record.longitude}
                <br>
                <div class="group-buttons">
                <button class="popup-button" id="btnA">Go to A</button>
                <button class="popup-button" id="btnB">Go to B</button>
                <button class="popup-button" id="btnC">Go to C</button>
                </div>
              </div>
            `;

            const popup1 = new mapboxgl.Popup({
              offset: 25,
              closeButton: true,
              className: "custom-popup",
            }).setHTML(popupContent);

            const popup2 = new mapboxgl.Popup({
              offset: 25,
              closeButton: true,
              className: "custom-popup",
            }).setHTML(popupContent);
              // Add markers for the start and end points
              new mapboxgl.Marker({ color: "red" }) // Customize the marker appearance
                .setLngLat([record.longitude, record.latitude])
                .setPopup(popup1)
                .addTo(map);

              new mapboxgl.Marker({ color: "green" }) // Customize the marker appearance
                .setLngLat([longitudeWithOffset, latitudeWithOffset])
                .setPopup(popup2)
                .addTo(map);
            });
          } else {
            latitudeWithOffset = record.latitude; // Adjust this offset as needed
            longitudeWithOffset = record.longitude;
            marker = new mapboxgl.Marker()
              .setLngLat([longitudeWithOffset, latitudeWithOffset])
              .addTo(map);
          }

          // const popupContent = `
          //   <div>
          //     <strong>Date:</strong> ${record.data_date}<br>
          //     <strong>Location:</strong> ${record.Location}<br>
          //     <strong>Sublocation:</strong> ${record.SubLocation}<br>
          //     <strong>Latitude:</strong> ${record.latitude}<br>
          //     <strong>Longitude:</strong> ${record.longitude}
          //     <br>
          //     <div class="group-buttons">
          //     <button class="popup-button" id="btnA">Go to A</button>
          //     <button class="popup-button" id="btnB">Go to B</button>
          //     <button class="popup-button" id="btnC">Go to C</button>
          //     </div>
          //   </div>
          // `;

          // Add event listeners to buttons inside the popup
          // popup.on("open", () => {
          //   document.getElementById("btnA").addEventListener("click", () => {
          //     window.location.href = "/a";
          //   });

          //   document.getElementById("btnB").addEventListener("click", () => {
          //     window.location.href = "/b";
          //   });

          //   document.getElementById("btnC").addEventListener("click", () => {
          //     window.location.href = "/c";
          //   });
          // });
        }
      });
    }

    return () => {
      markers.forEach((marker) => marker.remove()); // Remove markers
      map.remove();
    };
  }, [filteredData, visibleMarkers]);

  function checkCoordinatesEqual(obj1, obj2) {
    return obj1.latitude === obj2.latitude && obj1.longitude === obj2.longitude;
  }

  function hasMatchingCoordinates() {
    for (let i = 0; i < filteredData.length; i++) {
      for (let j = i + 1; j < filteredData.length; j++) {
        if (checkCoordinatesEqual(filteredData[i], data[j])) {
          return true; // Return true as soon as a match is found
        }
      }
    }
    return false; // No matching coordinates were found
  }
  return (
    <div className="map-container">
      <div id="map" className="map" />
    </div>
  );
};

export default MapComponent;
