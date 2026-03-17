import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Applications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const res = await axios.get('http://localhost:4001/api/applications/employer', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setApplications(res.data);
    };
    fetchApplications();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:4001/api/applications/${id}`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setApplications(applications.map(app => app._id === id ? { ...app, status } : app));
    } catch (err) {
      alert('Failed to update');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Applications</h2>
      {applications.map(app => (
        <div key={app._id} className="bg-white p-4 mb-4 rounded shadow">
          <h3>{app.job.title}</h3>
          <p>Applicant: {app.applicant.name} ({app.applicant.email})</p>
          <p>Status: {app.status}</p>
          <button onClick={() => updateStatus(app._id, 'accepted')} className="bg-green-500 text-white p-2 mr-2">Accept</button>
          <button onClick={() => updateStatus(app._id, 'rejected')} className="bg-red-500 text-white p-2">Reject</button>
        </div>
      ))}
    </div>
  );
};

export default Applications;