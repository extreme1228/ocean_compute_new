import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      await authService.register(username, password);
      alert('Registration successful!');
      navigate('/login', { replace: true });
    } catch (error) {
      alert('Registration failed!');
    }
  };

  const handleBackToLogin = () => {
    navigate('/login', { replace: true });
  };

  return (
    <div style={styles.container}>
      <div style={styles.registerForm}>
        <div style={styles.header}>
          <button onClick={handleBackToLogin} style={styles.backButton}>
            &#8592; {/* Unicode 箭头符号 */}
          </button>
          <h2 style={styles.title}>注册 - 海洋环境监测平台</h2>
        </div>
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
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          style={styles.inputField}
        />
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
  registerForm: {
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
  header: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginBottom: '20px',
  },
  backButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  title: {
    margin: 0,
    fontSize: '24px',
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
  registerButton: {
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
  }
};

export default Register;
