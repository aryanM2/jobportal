import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const JobList = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    location: '',
    salary: '',
    type: '',
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || ''
  });

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await axios.get('http://localhost:4001/api/jobs');
      setJobs(res.data);
      setFilteredJobs(res.data);
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs.filter(job => {
      return (
        (filters.location === '' || job.location.toLowerCase().includes(filters.location.toLowerCase())) &&
        (filters.salary === '' || job.salary.toLowerCase().includes(filters.salary.toLowerCase())) &&
        (filters.type === '' || job.type === filters.type) &&
        (filters.category === '' || job.title.toLowerCase().includes(filters.category.toLowerCase()) || job.description.toLowerCase().includes(filters.category.toLowerCase())) &&
        (filters.search === '' || job.title.toLowerCase().includes(filters.search.toLowerCase()) || job.description.toLowerCase().includes(filters.search.toLowerCase()))
      );
    });
    setFilteredJobs(filtered);
  }, [filters, jobs]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyForJob = async (jobId) => {
    if (!user) {
      alert('Please login to apply');
      return;
    }
    try {
      await axios.post('http://localhost:4001/api/applications', { jobId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Applied successfully');
    } catch (err) {
      alert('Application failed');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Job Listings</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            name="search"
            placeholder="Search jobs..."
            value={filters.search}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={filters.category}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="salary"
            placeholder="Salary"
            value={filters.salary}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
          </select>
        </div>
      </div>

      {/* Job List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map(job => (
          <div key={job._id} className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-bold">{job.title}</h3>
            <p className="text-gray-600">{job.company} - {job.location}</p>
            <p className="text-sm">{job.salary} - {job.type}</p>
            <p className="mt-2">{job.description.substring(0, 100)}...</p>
            <div className="mt-4 flex justify-between">
              <Link to={`/job/${job._id}`} className="text-blue-600">View Details</Link>
              {user && user.role === 'jobseeker' && (
                <button onClick={() => applyForJob(job._id)} className="bg-blue-500 text-white px-4 py-2 rounded">Apply</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobList;