import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, ListGroup } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const host = 'http://localhost:3001/users';
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ username: '', email: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(host);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users: ', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(host, formData);
      fetchUsers();
      setFormData({ username: '', email: '' }); // Clear form after submission
      toast.success('User created successfully!');
    } catch (error) {
      console.error('Error creating user: ', error);
      toast.error('Error creating user');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${host}/${userId}`);
      fetchUsers();
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user: ', error);
      toast.error('Error deleting user');
    }
  };

  return (
    <div className="body">
      <div className="container">
        <h1 className="text-center mb-4">CRUD App</h1>
        <Form className="form-container" onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Username:</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Button type="submit" variant="primary">Create User</Button>
        </Form>
        <h2 className="mb-3">Users</h2>
        <ListGroup>
          {users.map((user) => (
            <ListGroup.Item key={user.id}>
              {user.username} - {user.email}
              <Button
                variant="danger"
                size="sm"
                className="float-right"
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
      </div>
    </div>
  );
}

export default App;
