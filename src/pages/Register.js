import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    // 账号密码验证
    if (username === '' || password === '') {
      alert('Username and password cannot be empty!');
      return;
    }
    if (/[\x00-\x1F\x7F]/.test(username) || /[\x00-\x1F\x7F]/.test(password)) {
      alert('Username and password cannot contain non-printable ASCII characters!');
      return;
    }
    if (username.length > 20 || password.length > 20) {
      alert('Username and password cannot exceed 20 characters!');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const response = await authService.register(username, password);
      alert('Registration successful!');
      navigate('/login', { replace: true });
    } catch (error) {
      alert('Registration failed!', error);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login', { replace: true });
  };

  return (
    <div style={styles.container}>
      <div style={styles.registerForm}>
        <button onClick={handleBackToLogin} style={styles.backButton}>
          &#8592; {/* Unicode 箭头符号 */}
        </button>
        <div style={styles.header}>
          <h2 style={styles.title}>用户注册</h2>
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
    position: 'relative', // 添加相对定位
  },
  header: {
    display: 'flex',
    justifyContent: 'center', // 居中对齐
    alignItems: 'center',
    width: '100%',
    marginBottom: '20px',
  },
  backButton: {
    position: 'absolute', // 绝对定位
    top: '10px',
    left: '10px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: 'black',
  },
  title: {
    margin: '0 auto', // 居中对齐
    padding: '0',
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
