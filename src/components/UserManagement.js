import React, { useState, useEffect } from 'react';
import './UserManagement.css';
import Modal from 'react-modal';
import axios from 'axios';
import { isAdmin } from '../services/authService'; 

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', user_type: '', contact_info: '' });
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    setIsAuthorized(isAdmin()); // 检查用户是否有管理员权限
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3010/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const openDetailModal = (user) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  const openAddUserModal = () => {
    setIsAddUserModalOpen(true);
  };

  const closeAddUserModal = () => {
    setIsAddUserModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = async () => {
    if (newUser.username && newUser.password) {
      try {
        const response = await axios.post('http://localhost:3010/users', newUser);
        const newUserEntry = { ...newUser, id: response.data.id };
        setUsers([...users, newUserEntry]);
        setNewUser({ username: '', password: '', user_type: '', contact_info: '' });
        setIsAddUserModalOpen(false);
        fetchUsers(); 
      } catch (error) {
        console.error('Error adding user:', error);
      }
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3010/users/${id}`);
      setUsers(users.filter(user => user.User_ID !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="not-authorized-container">
        <div className="not-authorized-card">
          <h2>Access Denied</h2>
          <p>You are not authorized to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management-container">
      <h2>User Management</h2>
      <button onClick={openAddUserModal} className="add-user-button">Add User</button>
      <div className="user-list">
        {users.map(user => (
          <div key={user.User_ID} className="user-item">
            <div className="user-info">
              <p>Username: {user.Username}</p>
              <p>Password: {user.Password}</p>
              <p>Email: {user.Contact_Info}</p>
              <button onClick={() => openDetailModal(user)} className="view-details-button">View Details</button>
              <button onClick={() => handleDeleteUser(user.User_ID)} className="delete-button">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {selectedUser && (
        <Modal
          isOpen={isDetailModalOpen}
          onRequestClose={closeDetailModal}
          contentLabel="User Details"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <h2>User Details</h2>
          <p>Username: {selectedUser.Username}</p>
          <p>Password: {selectedUser.Password}</p>
          <p>Email: {selectedUser.Contact_Info}</p>
          <p>Role: {selectedUser.User_Type}</p>
          <button onClick={closeDetailModal} className="close-button">Close</button>
        </Modal>
      )}
      <Modal
        isOpen={isAddUserModalOpen}
        onRequestClose={closeAddUserModal}
        contentLabel="Add User"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Add New User</h2>
        <form className="modal-form">
          <label>
            Username:
            <input type="text" name="username" value={newUser.username} onChange={handleInputChange} />
          </label>
          <label>
            Password:
            <input type="password" name="password" value={newUser.password} onChange={handleInputChange} />
          </label>
          <label>
            Email:
            <input type="email" name="contact_info" value={newUser.contact_info} onChange={handleInputChange} />
          </label>
          <label>
            Role:
            <input type="text" name="user_type" value={newUser.user_type} onChange={handleInputChange} />
          </label>
          <div className="modal-buttons">
            <button type="button" onClick={handleAddUser} className="confirm-button">Add User</button>
            <button type="button" onClick={closeAddUserModal} className="cancel-button">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;
