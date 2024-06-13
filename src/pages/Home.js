import React, { useState } from 'react';

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
    </div>
  );
}

export default Home;
