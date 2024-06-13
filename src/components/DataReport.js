import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { DatePicker } from 'antd';
import moment from 'moment';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import 'antd/dist/reset.css';
import './DataReport.css';

const templates = [
  { id: 1, name: 'Template 1' },
  { id: 2, name: 'Template 2' },
  // 添加更多模板
];

const customIcon = new L.Icon({
  iconUrl: require('../assets/marker-icon.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const DataReport = () => {
  const [stations, setStations] = useState([]);
  const [data, setData] = useState([]);
  const [pollutantData, setPollutantData] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [reportContent, setReportContent] = useState('');
  const [preview, setPreview] = useState('');
  const [startDate, setStartDate] = useState(moment().startOf('month'));
  const [endDate, setEndDate] = useState(moment().endOf('month'));

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

  const fetchData = async (stationId) => {
    try {
      const response = await axios.get(`http://localhost:3010/data/${stationId}`, {
        params: { startDate: startDate.format('YYYY-MM-DD'), endDate: endDate.format('YYYY-MM-DD') }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  const handleStationClick = (station) => {
    setSelectedStation(station);
    fetchData(station.id);
    fetchPollutantData(station.id);
  };

  const handleTemplateChange = (e) => {
    const template = templates.find(t => t.id === parseInt(e.target.value));
    setSelectedTemplate(template);
  };

  const handleContentChange = (e) => {
    setReportContent(e.target.value);
  };

  const generatePreview = () => {
    const filteredData = filterData();
    const filteredPollutantData = filterPollutantData();
    const dataContent = filteredData.map(d => `Date: ${d.Timestamp}, Temperature: ${d.Temperature}, Salinity: ${d.Salinity}, pH: ${d.pH}`).join('\n');
    const pollutantContent = filteredPollutantData.map(d => `Date: ${d.Timestamp}, Pollutant: ${d.Pollutant_Type}, Concentration: ${d.Concentration}`).join('\n');
    setPreview(`Report for ${selectedStation.name} based on ${selectedTemplate.name}\n\n${reportContent}\n\nData:\n${dataContent}\n\nPollutant Data:\n${pollutantContent}`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(preview, 10, 10);
    doc.save('report.pdf');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet([{ content: preview }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, 'report.xlsx');
  };

  const filterData = () => {
    return data.filter(d =>
      moment(d.Timestamp).isBetween(startDate, endDate, undefined, '[]')
    );
  };

  const filterPollutantData = () => {
    return pollutantData.filter(d =>
      moment(d.Timestamp).isBetween(startDate, endDate, undefined, '[]')
    );
  };

  return (
    <div className="report-generator-container">
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
                <p>Station ID: {station.id}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="data-panel">
        <div className="data-content">
          {selectedStation && (
            <>
              <h3>Data Report for {selectedStation.name}</h3>
              <div className="date-picker">
                <DatePicker
                  value={startDate}
                  onChange={date => setStartDate(date)}
                  style={{ marginRight: '10px' }}
                />
                <DatePicker
                  value={endDate}
                  onChange={date => setEndDate(date)}
                />
              </div>
              <div className="template-selection">
                <label>Select Template:</label>
                <select onChange={handleTemplateChange}>
                  <option value="">Select a template</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
                </select>
              </div>
              {selectedTemplate && (
                <div className="customization">
                  <label>Enter Report Content:</label>
                  <textarea onChange={handleContentChange} value={reportContent}></textarea>
                  <button onClick={generatePreview}>Generate Preview</button>
                </div>
              )}
              {preview && (
                <div className="preview">
                  <h3>Report Preview</h3>
                  <pre>{preview}</pre>
                  <div className="export-buttons">
                    <button onClick={exportToPDF} style={{ marginRight: '10px' }}>Export to PDF</button>
                    <button onClick={exportToExcel} style={{ marginLeft: '10px' }}>Export to Excel</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataReport;
