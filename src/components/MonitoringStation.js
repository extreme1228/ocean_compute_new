import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import Modal from 'react-modal';
import 'leaflet/dist/leaflet.css';
import './MonitoringStation.css';

// 自定义图标
const customIcon = new L.Icon({
  iconUrl: require('../assets/marker-icon.png'), // 请确保有相应的图标文件
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

Modal.setAppElement('#root'); // 设置根元素，避免屏幕阅读器问题

function MonitoringStation() {
  const [stations, setStations] = useState([]);
  const [newStation, setNewStation] = useState({ name: '', lat: '', lon: '', info: '', data: '' });
  const [editingStation, setEditingStation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const userId = localStorage.getItem('user_id'); // 从localStorage中获取user_id
      const response = await axios.get(`http://localhost:3010/stations/${userId}`);
      setStations(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  const addStation = async (station) => {
    try {
      const userId = localStorage.getItem('user_id'); // 从localStorage中获取user_id
      const response = await axios.post('http://localhost:3010/stations', { ...station, userId });
      setStations([...stations, { ...station, id: response.data.id }]);
    } catch (error) {
      console.error('Error adding station:', error);
    }
  };

  const updateStation = async (station) => {
    try {
      const userId = localStorage.getItem('user_id'); // 从localStorage中获取user_id
      await axios.put(`http://localhost:3010/stations/${userId}/${station.id}`, station);
      fetchStations();
    } catch (error) {
      console.error('Error updating station:', error);
    }
  };

  const deleteStation = async (stationId) => {
    try {
      const userId = localStorage.getItem('user_id'); // 从localStorage中获取user_id
      await axios.delete(`http://localhost:3010/stations/${userId}/${stationId}`);
      setStations(stations.filter(station => station.id !== stationId));
    } catch (error) {
      console.error('Error deleting station:', error);
    }
  };

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

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingStation({ ...editingStation, [name]: value });
  };

  const handleAddStation = () => {
    if (newStation.name && newStation.lat && newStation.lon && newStation.info && newStation.data) {
      addStation(newStation);
      setNewStation({ name: '', lat: '', lon: '', info: '', data: '' });
    }
  };

  const handleUpdateStation = () => {
    if (editingStation) {
      updateStation(editingStation);
      setEditingStation(null);
      setIsModalOpen(false);
    }
  };

  const handleEditStation = (station) => {
    setEditingStation(station);
    setIsModalOpen(true);
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
                <button onClick={() => handleEditStation(station)}>Edit Station</button>
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
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Edit Station"
        className="modal"
        overlayClassName="modal-overlay"
      >
        {editingStation && (
          <div className="modal-content">
            <h3>Edit Station</h3>
            <label>
              Name:
              <input type="text" name="name" value={editingStation.name} onChange={handleEditInputChange} />
            </label>
            <label>
              Latitude:
              <input type="text" name="lat" value={editingStation.lat} onChange={handleEditInputChange} readOnly />
            </label>
            <label>
              Longitude:
              <input type="text" name="lon" value={editingStation.lon} onChange={handleEditInputChange} readOnly />
            </label>
            <label>
              Info:
              <input type="text" name="info" value={editingStation.info} onChange={handleEditInputChange} />
            </label>
            <label>
              Data:
              <input type="text" name="data" value={editingStation.data} onChange={handleEditInputChange} />
            </label>
            <button onClick={handleUpdateStation}>Update Station</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default MonitoringStation;
