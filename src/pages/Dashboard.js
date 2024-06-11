

import React from 'react';
import { Link } from 'react-router-dom';
import monitoringStationImage from '../assets/monitoring-station.jpg';
import monitoringDataImage from '../assets/monitoring-data.jpg';
import pollutantDataImage from '../assets/pollutant-data.jpg';
import userManagementImage from '../assets/user-management.jpg';
import dataReportImage from '../assets/data-report.jpg';
import './Dashboard.css';

function Dashboard() {
  const cards = [
    {
      title: '监测站点信息',
      image: monitoringStationImage,
      link: '/monitoring-stations'
    },
    {
      title: '监测数据',
      image: monitoringDataImage,
      link: '/monitoring-data'
    },
    {
      title: '污染物数据',
      image: pollutantDataImage,
      link: '/pollutant-data'
    },
    {
      title: '用户管理',
      image: userManagementImage,
      link: '/user-management'
    },
    {
      title: '数据报告',
      image: dataReportImage,
      link: '/data-report'
    },
  ];
  return (
    <div className="dashboard" >
      <h2>海洋环境监测系统仪表板</h2>
      <div className="card-container">
        {cards.map((card) => (
          <Link to={card.link} className="card" key={card.title}>
            <img src={card.image} alt={card.title} className="card-image" />
            <div className="card-title">{card.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;

