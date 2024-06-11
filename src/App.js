import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import About from './pages/About';
import Header from './components/Header';
import { checkAuth } from './utils/auth';
import Register from './pages/Register';
import MonitoringStation from './components/MonitoringStation';
import MonitoringData from './components/MonitoringData'
import PollutantData from './components/PollutantData'
import UserManagement from './components/UserManagement';
import DataReport from './components/DataReport';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = checkAuth(); // 调用检查登录状态的函数
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      navigate('/dashboard'); // 使用 replace 参数
    }
  }, []);

  return (
    <div>
      {isLoggedIn && <Header setIsLoggedIn={setIsLoggedIn} />}
      <Routes>
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register />} /> {/* 添加注册路由 */}
        <Route path="/dashboard/*" element={isLoggedIn ? <Dashboard /> : <Navigate replace to="/login" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/monitoring-stations" element={<MonitoringStation />} />
        <Route path="/monitoring-data" element={<MonitoringData />} />
        <Route path="/pollutant-data" element={<PollutantData />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/data-report" element={<DataReport />} />
        <Route path="/about" element={<About />} />
        <Route path="/" element={isLoggedIn ? <Navigate replace to="/dashboard" /> : <Navigate replace to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;

