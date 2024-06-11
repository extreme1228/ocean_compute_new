import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MonitoringStation.css';

// 自定义图标
const customIcon = new L.Icon({
  iconUrl: require('../assets/marker-icon.png'), // 请确保有相应的图标文件
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// 初始站点数据
const initialStations = [
  { id: 1, name: 'Station 1', lat: 37.7749, lon: -122.4194, info: 'Info about Station 1', data: 'Temperature, Salinity' },
  { id: 2, name: 'Station 2', lat: 34.0522, lon: -118.2437, info: 'Info about Station 2', data: 'pH, Turbidity' },
  { id: 3, name: 'Station 3', lat: 35.6895, lon: 139.6917, info: 'Info about Station 3', data: 'Nutrients, Chlorophyll' },
  { id: 4, name: 'Station 4', lat: 55.7558, lon: 37.6176, info: 'Info about Station 4', data: 'Dissolved Oxygen, Heavy Metals' },
  { id: 5, name: 'Station 5', lat: -33.8688, lon: 151.2093, info: 'Info about Station 5', data: 'Microplastics, Oil Spills' },
  { id: 6, name: 'Station 6', lat: 51.5074, lon: -0.1278, info: 'Info about Station 6', data: 'Temperature, Salinity' },
  { id: 7, name: 'Station 7', lat: 48.8566, lon: 2.3522, info: 'Info about Station 7', data: 'pH, Turbidity' },
  { id: 8, name: 'Station 8', lat: 40.7128, lon: -74.0060, info: 'Info about Station 8', data: 'Nutrients, Chlorophyll' },
  { id: 9, name: 'Station 9', lat: 22.3964, lon: 114.1095, info: 'Info about Station 9', data: 'Dissolved Oxygen, Heavy Metals' },
  { id: 10, name: 'Station 10', lat: -23.5505, lon: -46.6333, info: 'Info about Station 10', data: 'Microplastics, Oil Spills' },
];

function MonitoringStation() {
  const [stations, setStations] = useState(initialStations);
  const [newStation, setNewStation] = useState({ name: '', lat: '', lon: '', info: '', data: '' });
  
  // 添加站点的函数
  const addStation = (station) => {
    setStations([...stations, { ...station, id: stations.length + 1 }]);
  };

  // 删除站点的函数
  const deleteStation = (stationId) => {
    setStations(stations.filter(station => station.id !== stationId));
  };

  // Map click event handler
  function AddStationOnClick() {
    useMapEvents({
      click(e) {
        setNewStation({ ...newStation, lat: e.latlng.lat, lon: e.latlng.lng });
      },
    });
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStation({ ...newStation, [name]: value });
  };

  const handleAddStation = () => {
    if (newStation.name && newStation.lat && newStation.lon && newStation.info && newStation.data) {
      addStation(newStation);
      setNewStation({ name: '', lat: '', lon: '', info: '', data: '' });
    }
  };

  return (
    <div className="monitoring-station-container">
      <MapContainer center={[20, 0]} zoom={2} style={{ height: "100vh", width: "75%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <AddStationOnClick />
        {stations.map(station => (
          <Marker
            key={station.id}
            position={[station.lat, station.lon]}
            icon={customIcon}
            eventHandlers={{
              click: () => {
                setNewStation(station);
              },
            }}
          >
            <Popup>
              <div>
                <h3>{station.name}</h3>
                <p>{station.info}</p>
                <p>Monitored Data: {station.data}</p>
                <button onClick={() => deleteStation(station.id)}>Delete Station</button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="station-form">
        <h3>Add New Station</h3>
        <label>
          Name:
          <input type="text" name="name" value={newStation.name} onChange={handleInputChange} />
        </label>
        <label>
          Latitude:
          <input type="text" name="lat" value={newStation.lat} onChange={handleInputChange} readOnly />
        </label>
        <label>
          Longitude:
          <input type="text" name="lon" value={newStation.lon} onChange={handleInputChange} readOnly />
        </label>
        <label>
          Info:
          <input type="text" name="info" value={newStation.info} onChange={handleInputChange} />
        </label>
        <label>
          Data:
          <input type="text" name="data" value={newStation.data} onChange={handleInputChange} />
        </label>
        <button onClick={handleAddStation}>Add Station</button>
      </div>
    </div>
  );
}

export default MonitoringStation;
