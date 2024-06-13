import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import './MonitoringData.css';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-moment';
import { DatePicker } from 'antd';
import 'antd/dist/reset.css';
import moment from 'moment';

Chart.register(...registerables);

// 自定义图标
const customIcon = new L.Icon({
  iconUrl: require('../assets/marker-icon.png'), // 请确保有相应的图标文件
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const initialStations = [];

const getMonthStartEndDates = () => {
  const now = new Date();
  const start = moment().startOf('month');
  const end = moment().endOf('month');
  return { start, end };
};

function MonitoringData() {
  const [stations, setStations] = useState(initialStations);
  const [data, setData] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [deleteStartDate, setDeleteStartDate] = useState(moment());
  const [deleteEndDate, setDeleteEndDate] = useState(moment());
  const [selectedDataId, setSelectedDataId] = useState(null);
  const [newData, setNewData] = useState({ Station_ID: '', Timestamp: '', Temperature: '', Salinity: '', pH: '', notes: '' });

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

  const fetchStationData = async (stationId) => {
    try {
      const response = await axios.get(`http://localhost:3010/data/${stationId}`, {
        params: {
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD')
        }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const addData = async (dataEntry) => {
    try {
      const response = await axios.post('http://localhost:3010/data', dataEntry);
      setData([...data, { ...dataEntry, Data_ID: response.data.id }]);
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  const deleteData = async (dataId) => {
    try {
      await axios.delete(`http://localhost:3010/data/${dataId}`);
      setData(data.filter(d => d.Data_ID !== dataId));
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleStationClick = (station) => {
    const { start, end } = getMonthStartEndDates();
    setStartDate(start);
    setEndDate(end);
    setDeleteStartDate(start);
    setDeleteEndDate(end);
    setSelectedStation(station);
    setNewData({ ...newData, Station_ID: station.id });
    fetchStationData(station.id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData({ ...newData, [name]: value });
  };

  const handleAddData = () => {
    if (newData.Station_ID && newData.Timestamp && newData.Temperature && newData.Salinity && newData.pH) {
      addData(newData);
      setNewData({ Station_ID: selectedStation.id, Timestamp: '', Temperature: '', Salinity: '', pH: '', notes: '' });
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleDeleteData = () => {
    if (selectedDataId) {
      deleteData(selectedDataId);
      setSelectedDataId(null);
    }
  };

  const filteredData = data.filter(d =>
    d.Station_ID === selectedStation?.id &&
    moment(d.Timestamp).isBetween(startDate, endDate, null, '[]')
  );

  const filteredDeleteData = data.filter(d =>
    d.Station_ID === selectedStation?.id &&
    moment(d.Timestamp).isBetween(deleteStartDate, deleteEndDate, null, '[]')
  );

  const temperatureData = {
    labels: filteredData.map(d => moment(d.Timestamp).format('YYYY-MM-DD')),
    datasets: [
      {
        label: 'Temperature',
        data: filteredData.map(d => d.Temperature),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };

  const salinityData = {
    labels: filteredData.map(d => moment(d.Timestamp).format('YYYY-MM-DD')),
    datasets: [
      {
        label: 'Salinity',
        data: filteredData.map(d => d.Salinity),
        borderColor: 'rgba(255,99,132,1)',
        fill: false,
      },
    ],
  };

  const phData = {
    labels: filteredData.map(d => moment(d.Timestamp).format('YYYY-MM-DD')),
    datasets: [
      {
        label: 'PH',
        data: filteredData.map(d => parseFloat(d.pH)),
        borderColor: 'rgba(54,162,235,1)',
        fill: false,
      },
    ],
  };

  return (
    <div className="monitoring-data-container">
      <MapContainer center={[20, 0]} zoom={2} style={{ height: "100vh", width: "70%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {stations.map(station => (
          <Marker
            key={station.id}
            position={[station.lat, station.lon]}
            icon={customIcon}
            eventHandlers={{
              click: () => handleStationClick(station),
            }}
          >
            <Popup>
              <div>
                <h3>{station.name}</h3>
                <h3>站点ID: {station.id}</h3>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="data-panel">
        <div className="data-content">
          {selectedStation && (
            <>
              <h3>Monitoring Data for {selectedStation.name}</h3>
              <div className="date-picker">
                <DatePicker value={startDate} onChange={date => setStartDate(date)} />
                <DatePicker value={endDate} onChange={date => setEndDate(date)} />
              </div>
              <div className="charts">
                <div className="chart-container">
                  <Line data={temperatureData} />
                </div>
                <div className="chart-container">
                  <Line data={salinityData} />
                </div>
                <div className="chart-container">
                  <Line data={phData} />
                </div>
              </div>
              <h3>Add New Data</h3>
              <label>
                Station ID:
                <input type="text" name="Station_ID" value={newData.Station_ID} onChange={handleInputChange} readOnly />
              </label>
              <label>
                Timestamp:
                <input type="datetime-local" name="Timestamp" value={newData.Timestamp} onChange={handleInputChange} />
              </label>
              <label>
                Temperature:
                <input type="text" name="Temperature" value={newData.Temperature} onChange={handleInputChange} />
              </label>
              <label>
                Salinity:
                <input type="text" name="Salinity" value={newData.Salinity} onChange={handleInputChange} />
              </label>
              <label>
                pH:
                <input type="text" name="pH" value={newData.pH} onChange={handleInputChange} />
              </label>
              <label>
                notes:
                <input type="text" name="notes" value={newData.notes} onChange={handleInputChange} />
              </label>
              <button onClick={handleAddData}>Add Data</button>
              <h3>Delete Data</h3>
              <div className="delete-date-picker">
                <DatePicker value={deleteStartDate} onChange={date => setDeleteStartDate(date)} />
                <DatePicker value={deleteEndDate} onChange={date => setDeleteEndDate(date)} />
              </div>
              <select className="delete-select" value={selectedDataId || ""} onChange={(e) => setSelectedDataId(parseInt(e.target.value))}>
                <option value="">Select Data to Delete</option>
                {filteredDeleteData.map(d => (
                  <option key={d.Data_ID} value={d.Data_ID}>
                    {moment(d.Timestamp).format('YYYY-MM-DD')} - Temp: {d.Temperature}, Sal: {d.Salinity}, pH: {d.pH}
                  </option>
                ))}
              </select>
              <button onClick={handleDeleteData}>Confirm Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MonitoringData;
