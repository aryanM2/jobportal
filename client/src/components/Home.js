import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../api';
import { Search, Briefcase, MapPin, DollarSign, Clock, Users, TrendingUp, Award, Target, ArrowRight, Building, GraduationCap, Heart, Code, BarChart, IndianRupee } from 'lucide-react';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await axios.get(`${API_URL}/jobs`);
      // Sort by date (newest first) and show first 6 as featured
      const sortedJobs = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setFeaturedJobs(sortedJobs.slice(0, 6));
    };
    fetchJobs();
  }, []);

  const categories = [
  { name: 'IT', icon: Code, color: 'blue' },
  { name: 'Marketing', icon: TrendingUp, color: 'purple' },
  { name: 'Finance', icon: DollarSign, color: 'green' },
  { name: 'Healthcare', icon: Heart, color: 'red' },
  { name: 'Education', icon: GraduationCap, color: 'yellow' }
];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16 sm:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              Find Your Dream Job
            </h1>
            <p className="text-xl md:text-2xl lg:text-4xl mb-8 text-blue-100">
              Search thousands of job opportunities from top companies and start your career journey today
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-200" />
               <input
  type="text"
  placeholder="Search jobs, companies, or keywords..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
             sm:text-lg text-black dark:text-black 
             placeholder-gray-500 bg-white"
/>
              </div>
              <button
                onClick={() => window.location.href = `/jobs?search=${search}`}
                className="flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 flex items-center justify-center"
              >
                <Search className="h-5 w-5 mr-2" />
                Search Jobs
                <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-purple-600 mb-2">5,000+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-green-600 mb-2">50,000+</div>
              <div className="text-gray-600">Job Seekers</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Jobs</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the latest opportunities from top companies
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map(job => (
              <div key={job._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <Building className="h-4 w-4 mr-1" />
                        {job.company}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm mb-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Briefcase className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {job.description.substring(0, 120)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <IndianRupee  className="h-4 w-4 mr-1" />
                        <span>{job.salary || 'Competitive'}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{job.type || 'Full-time'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link 
                      to={`/job/${job._id}`} 
                      className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 group"
                    >
                      View Details
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link 
              to="/jobs" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Job Categories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore opportunities across different industries
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map(cat => {
              const Icon = cat.icon;
              const colorClasses = {
                blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
                purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
                green: 'bg-green-100 text-green-600 hover:bg-green-200',
                red: 'bg-red-100 text-red-600 hover:bg-red-200',
                yellow: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
              };
              
              return (
                <Link
                  key={cat.name}
                  to={`/jobs?category=${cat.name}`}
                  className={`group p-6 rounded-xl text-center transition-all duration-300 ${colorClasses[cat.color]} hover:shadow-lg transform hover:-translate-y-1`}
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-white rounded-lg group-hover:scale-110 transition-transform">
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{cat.name}</h3>
                  <p className="text-sm opacity-80">Browse Jobs</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Join thousands of job seekers and employers finding their perfect match
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 inline-flex items-center justify-center group"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/login" 
                className="px-8 py-4 bg-transparent text-white border-2 border-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;