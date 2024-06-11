import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './PollutantData.css';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-moment';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';
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

// 初始污染物数据
const initialPollutantData = [
  { Pollutant_Data_ID: 1, Station_ID: 1, Pollutant_Type: 'PM2.5', Concentration: 12.5, Safety_Threshold: 35.0, Timestamp: '2024-06-01T12:00:00' },
  { Pollutant_Data_ID: 2, Station_ID: 1, Pollutant_Type: 'NO2', Concentration: 40.2, Safety_Threshold: 100.0, Timestamp: '2024-06-02T12:00:00' },
  // 其他污染物数据...
];



const getMonthStartEndDates = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start, end };
};
// 设置 Modal 的根元素
Modal.setAppElement('#root');

const PollutantData = () => {
  const [stations, setStations] = useState(initialStations);
  const [pollutantData, setPollutantData] = useState(initialPollutantData);
  const [selectedStation, setSelectedStation] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [newPollutantData, setNewPollutantData] = useState({ Station_ID: '', Pollutant_Type: '', Concentration: '', Safety_Threshold: '', Timestamp: '' });
  const [selectedPollutantDataId, setSelectedPollutantDataId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStationClick = (station) => {
    const { start, end } = getMonthStartEndDates();
    setStartDate(start);
    setEndDate(end);
    setSelectedStation(station);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPollutantData({ ...newPollutantData, [name]: value });
  };

  const handleAddPollutantData = () => {
    console.log(newPollutantData)
    if (newPollutantData.Station_ID && newPollutantData.Pollutant_Type && newPollutantData.Concentration && newPollutantData.Safety_Threshold && newPollutantData.Timestamp) {
      const newPollutantDataEntry = {
        ...newPollutantData,
        Pollutant_Data_ID: pollutantData.length + 1,
        Station_ID: parseInt(newPollutantData.Station_ID, 10),
        Concentration: parseFloat(newPollutantData.Concentration),
        Safety_Threshold: parseFloat(newPollutantData.Safety_Threshold)
      };
      setPollutantData([...pollutantData, newPollutantDataEntry]);
      setNewPollutantData({ Station_ID: '', Pollutant_Type: '', Concentration: '', Safety_Threshold: '', Timestamp: '' });
      setIsModalOpen(false);
      console.log(pollutantData);
    } else {
      alert('Please fill in all fields.');
    }
  };


  const handleDeletePollutantData = () => {
    if (selectedPollutantDataId) {
      setPollutantData(pollutantData.filter(d => d.Pollutant_Data_ID !== selectedPollutantDataId));
      setSelectedPollutantDataId(null);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const filteredPollutantData = pollutantData.filter(d =>
    d.Station_ID === selectedStation?.id &&
    new Date(d.Timestamp) >= startDate &&
    new Date(d.Timestamp) <= endDate
  );
  console.log(filteredPollutantData)
  const pollutantChartData = {
    labels: filteredPollutantData.map(d => new Date(d.Timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Concentration',
        data: filteredPollutantData.map(d => d.Concentration),
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.6)',
        hoverBorderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <div className="pollutant-data-container">
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
              <h3>Pollutant Data for {selectedStation.name}</h3>
              <div className="date-picker">
                <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
                <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
              </div>
              <div className="charts">
                <Bar data={pollutantChartData} />
              </div>
              <div className="pollutant-data-list">
              {filteredPollutantData.map(d => (
                <div key={d.Pollutant_Data_ID} className="pollutant-data-item">
                  <div className="pollutant-data-info">
                    <p className="pollutant-type">Type: {d.Pollutant_Type}</p>
                    <p className="pollutant-concentration">Concentration: <span>{d.Concentration}</span></p>
                    <p className="pollutant-threshold">Threshold: <span>{d.Safety_Threshold}</span></p>
                  </div>
                  <button className="delete-button" onClick={() => setSelectedPollutantDataId(d.Pollutant_Data_ID)}>Delete</button>
                  {selectedPollutantDataId === d.Pollutant_Data_ID && (
                    <div className="confirmation-buttons">
                      <button onClick={handleDeletePollutantData} className='confirm-delete-button'>Confirm Delete</button>
                      <button onClick={() => setSelectedPollutantDataId(null)} className='cancel-delete-button'>Cancel</button>
                    </div>
                  )}
                </div>
              ))}
            </div>

              <button onClick={handleOpenModal}>Add New Pollutant Data</button>
              <Modal
              isOpen={isModalOpen}
              onRequestClose={handleCloseModal}
              contentLabel="Add Pollutant Data"
              className="modal"
              overlayClassName="modal-overlay"
            >
              <h2>Add New Pollutant Data</h2>
              <form className="modal-form">
                <label>
                  Staion ID:
                  <input type="text" name="Station_ID" value={newPollutantData.Station_ID} onChange={handleInputChange} />
                </label>
                <label>
                  Pollutant Type:
                  <input type="text" name="Pollutant_Type" value={newPollutantData.Pollutant_Type} onChange={handleInputChange} />
                </label>
                <label>
                  Concentration:
                  <input type="text" name="Concentration" value={newPollutantData.Concentration} onChange={handleInputChange} />
                </label>
                <label>
                  Safety Threshold:
                  <input type="text" name="Safety_Threshold" value={newPollutantData.Safety_Threshold} onChange={handleInputChange} />
                </label>
                <label>
                  Timestamp:
                  <input type="datetime-local" name="Timestamp" value={newPollutantData.Timestamp} onChange={handleInputChange} />
                </label>
                <div className="modal-buttons">
                  <button type="button" onClick={handleAddPollutantData}>Add Data</button>
                  <button type="button" onClick={handleCloseModal}>Close</button>
                </div>
              </form>
            </Modal>
             
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PollutantData;
