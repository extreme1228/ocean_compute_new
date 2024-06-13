import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate 替换 useHistory
import { authService } from '../services/authService';
import { login } from '../utils/auth';

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

   const handleLogin = async () => {
    try {
      const response = await authService.login(username, password);
      if (response.success) {
        login();
        setIsLoggedIn(true);
        console.log(response.userId)
        localStorage.setItem('user_id', response.userId); // 存储 user_id 到 localStorage
        navigate('/dashboard', { replace: true });
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert('Login failed!');
    }
  };

  const handleRegister = () => {
    navigate('/register', { replace: true });
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginForm}>
        <h2>海洋环境监测平台</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          style={styles.inputField}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={styles.inputField}
        />
        <button onClick={handleLogin} style={styles.loginButton}>Login</button>
        <button onClick={handleRegister} style={styles.registerButton}>Register</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'url(/images/login_background.jpg) no-repeat center center fixed', // 注意路径的修改
    backgroundSize: 'cover',
  },
  loginForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '90%',
    maxWidth: '400px',
    padding: '40px',
    borderRadius: '10px',
    backgroundColor: 'white',
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
  },
  inputField: {
    width: '100%',
    height: '50px',
    padding: '0 15px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '25px',
    fontSize: '16px',
  },
  loginButton: {
    width: '100%',
    padding: '10px 0',
    fontSize: '18px',
    borderRadius: '25px',
    color: 'white',
    backgroundColor: '#007bff',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    outline: 'none',
    marginBottom: '10px', // 添加一个底部外边距以分隔按钮
  },
  registerButton: {
    width: '100%',
    padding: '10px 0',
    fontSize: '18px',
    borderRadius: '25px',
    color: 'white',
    backgroundColor: '#28a745',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    outline: 'none',
  },
};

export default Login;
