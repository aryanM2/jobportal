import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await axios.get('http://localhost:4001/api/jobs');
      setFeaturedJobs(res.data.slice(0, 3)); // Show first 3 as featured
    };
    fetchJobs();
  }, []);

  const categories = ['IT', 'Marketing', 'Finance', 'Healthcare', 'Education'];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Find Your Dream Job</h1>
          <p className="text-xl mb-8">Search thousands of job opportunities</p>
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-3 w-1/2 text-black"
            />
            <Link to={`/jobs?search=${search}`} className="bg-white text-blue-600 px-6 py-3 ml-2 rounded">Search</Link>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredJobs.map(job => (
              <div key={job._id} className="bg-white p-6 rounded shadow">
                <h3 className="text-xl font-bold">{job.title}</h3>
                <p className="text-gray-600">{job.company} - {job.location}</p>
                <p className="mt-2">{job.description.substring(0, 100)}...</p>
                <Link to={`/job/${job._id}`} className="text-blue-600 mt-4 inline-block">View Details</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Job Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map(cat => (
              <div key={cat} className="bg-white p-6 rounded shadow text-center">
                <h3 className="text-xl font-bold">{cat}</h3>
                <Link to={`/jobs?category=${cat}`} className="text-blue-600">Browse Jobs</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-8">Join thousands of job seekers and employers</p>
        <Link to="/register" className="bg-blue-600 text-white px-8 py-4 rounded text-xl mr-4">Register</Link>
        <Link to="/login" className="bg-green-600 text-white px-8 py-4 rounded text-xl">Login</Link>
      </section>
    </div>
  );
};

export default Home;