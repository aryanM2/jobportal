import React, { useState } from 'react';
import axios from 'axios';

const PostJob = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [type, setType] = useState('full-time');
  const [requirements, setRequirements] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4001/api/jobs', { title, description, company, location, salary, type, requirements: requirements.split(',') }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Job posted');
    } catch (err) {
      alert('Failed to post job');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Post a Job</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 mb-4 border" required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 mb-4 border" required />
        <input type="text" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full p-2 mb-4 border" required />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-2 mb-4 border" required />
        <input type="text" placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full p-2 mb-4 border" />
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 mb-4 border">
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
        </select>
        <input type="text" placeholder="Requirements (comma separated)" value={requirements} onChange={(e) => setRequirements(e.target.value)} className="w-full p-2 mb-4 border" />
        <button type="submit" className="w-full bg-green-500 text-white p-2">Post Job</button>
      </form>
    </div>
  );
};

export default PostJob;