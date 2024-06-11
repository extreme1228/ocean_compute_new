import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MonitoringData.css';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-moment';
import 'react-datepicker/dist/react-datepicker.css';
import { DatePicker } from 'antd';
import 'antd/dist/reset.css';

Chart.register(...registerables);

// 自定义图标
const customIcon = new L.Icon({
  iconUrl: require('../assets/marker-icon.png'), // 请确保有相应的图标文件
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// 初始站点数据
const initialStations = [
  { id: 1, name: 'Station test', lat: 37.7749, lon: -122.4194 },
  { id: 2, name: 'Station debug', lat: 34.0522, lon: -118.2437 },
  // 其他站点数据...
];

// 初始监测数据
const initialData = [
  { Data_ID: 1, Station_ID: 1, Timestamp: '2024-06-01T12:00:00', Temperature: 20.5, Salinity: 35.1, pH: '7.5' },
  { Data_ID: 2, Station_ID: 1, Timestamp: '2024-06-02T12:00:00', Temperature: 21.0, Salinity: 35.0, pH: '7.6' },
  { Data_ID: 3, Station_ID: 1, Timestamp: '2024-06-12T12:00:00', Temperature: 36.2, Salinity: 21.7, pH: '8.1' },
  // 其他监测数据...
];

const getMonthStartEndDates = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start, end };
};

function MonitoringData() {
  const [stations, setStations] = useState(initialStations);
  const [data, setData] = useState(initialData);
  const [selectedStation, setSelectedStation] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [deleteStartDate, setDeleteStartDate] = useState(new Date());
  const [deleteEndDate, setDeleteEndDate] = useState(new Date());
  const [selectedDataId, setSelectedDataId] = useState(null);
  const [newData, setNewData] = useState({ Station_ID: '', Timestamp: '', Temperature: '', Salinity: '', pH: '', notes: '' });

  const handleStationClick = (station) => {
    const { start, end } = getMonthStartEndDates();
    setStartDate(start);
    setEndDate(end);
    setDeleteStartDate(start);
    setDeleteEndDate(end);
    setSelectedStation(station);
    setNewData({ ...newData, Station_ID: station.id });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData({ ...newData, [name]: value });
  };

  const handleAddData = () => {
    console.log("lbw-debug1")
    if (newData.Station_ID && newData.Timestamp && newData.Temperature && newData.Salinity && newData.pH) {
      console.log("lbw-debug2")
      const newDataEntry = { ...newData, Data_ID: data.length + 1 };
      setData([...data, newDataEntry]);
      setNewData({ Station_ID: selectedStation.id, Timestamp: '', Temperature: '', Salinity: '', pH: '', notes: '' });
      console.log(data)
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleDeleteData = () => {
    if (selectedDataId) {
      setData(data.filter(d => d.Data_ID !== selectedDataId));
      setSelectedDataId(null);
    }
  };

  const filteredData = data.filter(d =>
    d.Station_ID === selectedStation?.id &&
    new Date(d.Timestamp) >= startDate &&
    new Date(d.Timestamp) <= endDate
  );

  const filteredDeleteData = data.filter(d =>
    d.Station_ID === selectedStation?.id &&
    new Date(d.Timestamp) >= deleteStartDate &&
    new Date(d.Timestamp) <= deleteEndDate
  );

  console.log(filteredData)
  const temperatureData = {
    labels: filteredData.map(d => new Date(d.Timestamp).toLocaleDateString()),
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
    labels: filteredData.map(d => new Date(d.Timestamp).toLocaleDateString()),
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
    labels: filteredData.map(d => new Date(d.Timestamp).toLocaleDateString()),
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
                <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
                <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
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
                <DatePicker selected={deleteStartDate} onChange={date => setDeleteStartDate(date)} />
                <DatePicker selected={deleteEndDate} onChange={date => setDeleteEndDate(date)} />
              </div>
              <select className="delete-select" value={selectedDataId || ""} onChange={(e) => setSelectedDataId(parseInt(e.target.value))}>
                <option value="">Select Data to Delete</option>
                {filteredDeleteData.map(d => (
                  <option key={d.Data_ID} value={d.Data_ID}>
                    {new Date(d.Timestamp).toLocaleDateString()} - Temp: {d.Temperature}, Sal: {d.Salinity}, pH: {d.pH}
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
