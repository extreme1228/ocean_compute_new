import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import defaultAvatar from '../assets/data-report.jpg';
import { logout } from '../utils/auth';

function Home() {
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || null);
  const [userInfo, setUserInfo] = useState({
    id: localStorage.getItem('id') || 'extreme1228',
    city: localStorage.getItem('city') || 'Shanghai, China',
    phone: localStorage.getItem('phone') || '123-456-7890',
    bio: localStorage.getItem('bio') || 'From Tongji University',
    email:localStorage.getItem('email') || '2151769@tongji.edu.cn',
    lastAccessTime: localStorage.getItem('lastAccessTime') || new Date().toLocaleString(),
    registrationTime: localStorage.getItem('registrationTime') || new Date().toLocaleString()
  });
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
      localStorage.setItem('avatar', reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
    localStorage.setItem(name, value);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const lineData = [
    { name: 'June 1', value: 12 },
    { name: 'June 2', value: 19 },
    { name: 'June 3', value: 3 },
    { name: 'June 4', value: 5 },
    { name: 'June 5', value: 2 },
  ];

  const pieData = [
    { name: 'Category A', value: 400 },
    { name: 'Category B', value: 300 },
    { name: 'Category C', value: 300 },
    { name: 'Category D', value: 200 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="home-container">
      <div className="profile-section">
        <div className="profile-card">
          <div className="profile-info">
            <p>
              <strong>ID:</strong>
              <input type="text" name="id" value={userInfo.id} onChange={handleChange} className="input-field" />
            </p>
            <p>
              <strong>城市:</strong>
              <input type="text" name="city" value={userInfo.city} onChange={handleChange} className="input-field" />
            </p>
            <p>
              <strong>手机号:</strong>
              <input type="text" name="phone" value={userInfo.phone} onChange={handleChange} className="input-field" />
            </p>
            <p>
              <strong>个人简介:</strong>
              <input type="text" name="bio" value={userInfo.bio} onChange={handleChange} className="input-field" />
            </p>
            <p>
              <strong>电子邮箱:</strong>
              <input type="text" name="bio" value={userInfo.email} onChange={handleChange} className="input-field" />
            </p>
            <p>
              <strong>最近访问时间:</strong>
              <span className="info-text">{userInfo.lastAccessTime}</span>
            </p>
            <p>
              <strong>注册时间:</strong>
              <span className="info-text">{userInfo.registrationTime}</span>
            </p>
            <button onClick={handleLogout} className="logout-button">退出登录</button>
          </div>
          <div className="profile-avatar">
            <img src={avatar || defaultAvatar} alt="avatar" className="avatar-image" />
            <input type="file" onChange={handleFileChange} />
          </div>
        </div>
        
      </div>
      <div className="data-visualization">
        <h2>最近的海洋数据</h2>
        <div className="charts">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Home;
