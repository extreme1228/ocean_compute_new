import React, { useState , useEffect } from 'react';
import './UserManagement.css';
import Modal from 'react-modal';
import { isAdmin } from '../services/authService'; 

const initialUsers = [
  { id: 1, username: 'user1', password: 'password1', email: 'user1@example.com', role: 'User' },
  { id: 2, username: 'user2', password: 'password2', email: 'user2@example.com', role: 'Admin' },
  // 其他用户数据...
];

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', email: '', role: '' });
  const [isAuthorized, setIsAuthorized] = useState(false);


  useEffect(() => {
    setIsAuthorized(isAdmin()); // 检查用户是否有管理员权限
  }, []);
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

  const handleAddUser = () => {
    if (newUser.username && newUser.password && newUser.email && newUser.role) {
      const newUserEntry = { ...newUser, id: users.length + 1 };
      setUsers([...users, newUserEntry]);
      setNewUser({ username: '', password: '', email: '', role: '' });
      setIsAddUserModalOpen(false);
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
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
          <div key={user.id} className="user-item">
            <div className="user-info">
              <p>Username: {user.username}</p>
              <p>Email: {user.email}</p>
              <button onClick={() => openDetailModal(user)} className="view-details-button">View Details</button>
              <button onClick={() => handleDeleteUser(user.id)} className="delete-button">Delete</button>
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
          <p>Username: {selectedUser.username}</p>
          <p>Email: {selectedUser.email}</p>
          <p>Role: {selectedUser.role}</p>
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
            <input type="email" name="email" value={newUser.email} onChange={handleInputChange} />
          </label>
          <label>
            Role:
            <input type="text" name="role" value={newUser.role} onChange={handleInputChange} />
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
