import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const JobDetails = ({ user }) => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      const res = await axios.get(`http://localhost:4001/api/jobs/${id}`);
      setJob(res.data);
    };
    fetchJob();
  }, [id]);

  const applyForJob = async () => {
    if (!user) {
      alert('Please login to apply');
      return;
    }
    try {
      await axios.post('http://localhost:4001/api/applications', { jobId: id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Applied successfully');
    } catch (err) {
      alert('Application failed');
    }
  };

  if (!job) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-8 rounded shadow">
        <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
        <p className="text-xl text-gray-600 mb-2">{job.company} - {job.location}</p>
        <p className="text-lg mb-4">{job.salary} - {job.type}</p>
        <h2 className="text-2xl font-bold mb-2">Job Description</h2>
        <p className="mb-6">{job.description}</p>
        <h2 className="text-2xl font-bold mb-2">Requirements</h2>
        <ul className="list-disc list-inside mb-6">
          {job.requirements.map((req, index) => <li key={index}>{req}</li>)}
        </ul>
        <h2 className="text-2xl font-bold mb-2">Company Info</h2>
        <p>{job.employer.company?.name || 'N/A'}</p>
        <p>{job.employer.company?.description || 'N/A'}</p>
        <p>{job.employer.company?.website || 'N/A'}</p>
        {user && user.role === 'jobseeker' && (
          <button onClick={applyForJob} className="bg-blue-500 text-white px-6 py-3 rounded mt-6">Apply Now</button>
        )}
        {!user && (
          <p className="mt-6">Please <a href="/login" className="text-blue-600">login</a> to apply for this job.</p>
        )}
      </div>
    </div>
  );
};

export default JobDetails;