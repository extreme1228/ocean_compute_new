import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import './PollutantData.css';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-moment';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';
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

const getMonthStartEndDates = () => {
  const now = moment();
  const start = now.clone().startOf('month');
  const end = now.clone().endOf('month');
  return { start, end };
};

// 设置 Modal 的根元素
Modal.setAppElement('#root');

const PollutantData = () => {
  const [stations, setStations] = useState([]);
  const [pollutantData, setPollutantData] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [newPollutantData, setNewPollutantData] = useState({ Station_ID: '', Pollutant_Type: '', Concentration: '', Safety_Threshold: '', Timestamp: '' });
  const [selectedPollutantDataId, setSelectedPollutantDataId] = useState(null);
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

  const fetchPollutantData = async (stationId) => {
    try {
      const response = await axios.get(`http://localhost:3010/pollutants/${stationId}`, {
        params: {
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD')
        }
      });
      setPollutantData(response.data);
    } catch (error) {
      console.error('Error fetching pollutant data:', error);
    }
  };

  const addPollutantData = async (data) => {
    try {
      const response = await axios.post('http://localhost:3010/pollutants', data);
      setPollutantData([...pollutantData, { ...data, Pollutant_Data_ID: response.data.id }]);
    } catch (error) {
      console.error('Error adding pollutant data:', error);
    }
  };

  const deletePollutantData = async (id) => {
    try {
      await axios.delete(`http://localhost:3010/pollutants/${id}`);
      setPollutantData(pollutantData.filter(d => d.Pollutant_Data_ID !== id));
    } catch (error) {
      console.error('Error deleting pollutant data:', error);
    }
  };

  const handleStationClick = (station) => {
    const { start, end } = getMonthStartEndDates();
    setStartDate(start);
    setEndDate(end);
    setSelectedStation(station);
    setNewPollutantData({ ...newPollutantData, Station_ID: station.id });
    fetchPollutantData(station.id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPollutantData({ ...newPollutantData, [name]: value });
  };

  const handleAddPollutantData = () => {
    if (newPollutantData.Station_ID && newPollutantData.Pollutant_Type && newPollutantData.Concentration && newPollutantData.Safety_Threshold && newPollutantData.Timestamp) {
      const newPollutantDataEntry = {
        ...newPollutantData,
        Station_ID: parseInt(newPollutantData.Station_ID, 10),
        Concentration: parseFloat(newPollutantData.Concentration),
        Safety_Threshold: parseFloat(newPollutantData.Safety_Threshold),
        Timestamp: moment(newPollutantData.Timestamp).format('YYYY-MM-DDTHH:mm:ss')
      };
      addPollutantData(newPollutantDataEntry);
      setNewPollutantData({ Station_ID: selectedStation.id, Pollutant_Type: '', Concentration: '', Safety_Threshold: '', Timestamp: '' });
      setIsModalOpen(false);
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleDeletePollutantData = () => {
    if (selectedPollutantDataId) {
      deletePollutantData(selectedPollutantDataId);
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
    moment(d.Timestamp).isBetween(startDate, endDate, null, '[]')
  );

  const pollutantChartData = {
    labels: filteredPollutantData.map(d => moment(d.Timestamp).format('YYYY-MM-DD')),
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
                <DatePicker value={startDate} onChange={date => setStartDate(moment(date))} />
                <DatePicker value={endDate} onChange={date => setEndDate(moment(date))} />
              </div>
              <div className="charts">
                <Bar data={pollutantChartData} />
              </div>
              <div className="pollutant-data-list">
                {filteredPollutantData.map(d => (
                  <div key={d.Pollutant_Data_ID} className="pollutant-data-item">
                    <div className="pollutant-data-info">
                      <p className="pollutant-type">Type: {d.Pollutant_Type}</p>
                      <p className={`pollutant-concentration ${d.Concentration > d.Safety_Threshold ? 'exceeds-threshold' : 'within-threshold'}`}>
                        Concentration: <span>{d.Concentration}</span>
                      </p>
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
                    Station ID:
                    <input type="text" name="Station_ID" value={newPollutantData.Station_ID} onChange={handleInputChange} readOnly />
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
