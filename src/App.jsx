import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL; // or import.meta.env.VITE_API_URL if using Vite

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', location: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    const res = await axios.get(`${API_URL}/users`);
    setUsers(res.data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${API_URL}/users/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post(`${API_URL}/users`, form);
    }
    setForm({ name: '', email: '', password: '', location: '' });
    fetchUsers();
  };

  const handleEdit = user => {
    setForm(user);
    setEditingId(user._id);
  };

  const handleDelete = async id => {
    await axios.delete(`${API_URL}/users/${id}`);
    fetchUsers();
  };

  return (
    <div>
      <h2>User CRUD (MERN Stack)</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
        <button type="submit">{editingId ? 'Update' : 'Create'}</button>
      </form>
      <ul>
        {users.map(u => (
          <li key={u._id}>
            {u.name} | {u.email} | {u.location}
            <button onClick={() => handleEdit(u)}>Edit</button>
            <button onClick={() => handleDelete(u._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
