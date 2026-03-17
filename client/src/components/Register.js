import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('jobseeker');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4001/api/auth/register', { name, email, password, role });
      alert('Registration successful');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl mb-4">Register</h2>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 mb-4 border" required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 mb-4 border" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 mb-4 border" required />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 mb-4 border">
          <option value="jobseeker">Job Seeker</option>
          <option value="employer">Employer</option>
        </select>
        <button type="submit" className="w-full bg-green-500 text-white p-2">Register</button>
      </form>
    </div>
  );
};

export default Register;