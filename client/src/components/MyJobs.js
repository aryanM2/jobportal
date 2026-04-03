import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../api';
import { Briefcase, MapPin, DollarSign, Clock, Calendar, Edit, Trash2, Eye, Users, CheckCircle, XCircle, Clock as PendingIcon } from 'lucide-react';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({ total: 0, active: 0, closed: 0, draft: 0 });

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/jobs/my`, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      // Sort by date (newest first)
      const sortedJobs = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setJobs(sortedJobs);
      calculateStats(sortedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error.response?.data || error.message);
      
      // Show user-friendly error message
      if (error.response?.status === 403) {
        toast.error('Access denied. You must be logged in as an employer to view this page.');
      } else if (error.response?.status === 401) {
        toast.error('Please log in to continue.');
      } else {
        toast.error('Failed to fetch jobs. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (jobList) => {
    const total = jobList.length;
    const active = jobList.filter(job => job.status === 'active').length;
    const closed = jobList.filter(job => job.status === 'closed').length;
    const draft = jobList.filter(job => job.status === 'draft').length;
    
    // Handle jobs without status (assume active by default)
    const withStatus = jobList.filter(job => job.status);
    const withoutStatus = jobList.filter(job => !job.status);
    
    setStats({ 
      total, 
      active: active + (withoutStatus.length), // Count jobs without status as active
      closed, 
      draft 
    });
  };

  const deleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await axios.delete(`${API_URL}/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setJobs(jobs.filter(job => job._id !== jobId));
        calculateStats(jobs.filter(job => job._id !== jobId));
      } catch (error) {
        console.error('Error deleting job:', error);
        toast.error('Failed to delete job. Please try again.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <XCircle className="h-4 w-4" />;
      case 'draft': return <PendingIcon className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter || (filter === 'active' && !job.status);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Job Postings</h1>
          <p className="text-gray-600">Manage and track all your job postings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Closed</p>
                <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
              </div>
              <XCircle className="h-8 w-8 text-gray-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Draft</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
              </div>
              <PendingIcon className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {['all', 'active', 'closed', 'draft'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No job postings yet' : `No ${filter} jobs`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Start by posting your first job opportunity'
                : `You don't have any ${filter} job postings`}
            </p>
            <a
              href="/post-job"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Post a New Job
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map(job => (
              <div key={job._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(job.status)}`}>
                          {getStatusIcon(job.status)}
                          {job.status ? job.status.charAt(0).toUpperCase() + job.status.slice(1) : 'Active'}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-2" />
                          {job.company}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2" />
                          {job.salary || 'Competitive'}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {job.type || 'Full-time'}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Posted {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          {job.applications?.length || 0} applications
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <a
                        href={`/job/${job._id}`}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </a>
                      <a
                        href={`/edit-job/${job._id}`}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Edit className="h-4 w-4 text-gray-600" />
                      </a>
                      <button
                        onClick={() => deleteJob(job._id)}
                        className="p-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  
                  {job.applications && job.applications.length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Recent Applications</h4>
                      <div className="space-y-2">
                        {job.applications.slice(0, 3).map(app => (
                          <div key={app._id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-xs font-medium text-blue-600">
                                  {app.applicant.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{app.applicant.name}</p>
                                <p className="text-xs text-gray-600">{app.applicant.email}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                              {app.status || 'pending'}
                            </span>
                          </div>
                        ))}
                        {job.applications.length > 3 && (
                          <p className="text-sm text-gray-600 text-center">
                            +{job.applications.length - 3} more applications
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
