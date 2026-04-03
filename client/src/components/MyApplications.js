import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Briefcase, MapPin, Calendar, CheckCircle, XCircle, Clock, Eye, MessageSquare, ExternalLink, User, Building, FileText } from 'lucide-react';
import { API_URL } from '../api';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0 });

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/applications/my-applications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Sort by date (newest first)
      const sortedApplications = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setApplications(sortedApplications);
      calculateStats(sortedApplications);
    } catch (error) {
      console.error('Error fetching applications:', error.response?.data || error.message);
      toast.error('Failed to fetch applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (appList) => {
    const total = appList.length;
    const pending = appList.filter(app => app.status === 'pending').length;
    const accepted = appList.filter(app => app.status === 'accepted').length;
    const rejected = appList.filter(app => app.status === 'rejected').length;
    setStats({ total, pending, accepted, rejected });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const withdrawApplication = async (applicationId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        await axios.delete(`${API_URL}/applications/delete/${applicationId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setApplications(applications.filter(app => app._id !== applicationId));
        calculateStats(applications.filter(app => app._id !== applicationId));
      } catch (error) {
        console.error('Error withdrawing application:', error);
        toast.error('Failed to withdraw application. Please try again.');
      }
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track the status of all your job applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'accepted', 'rejected'].map(status => (
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

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Start applying to jobs to track your applications here'
                : `You don't have any ${filter} applications`}
            </p>
            <a
              href="/jobs"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Jobs
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map(application => (
              <div key={application._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{application.job.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2" />
                          {application.job.company}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {application.job.location}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Applied {new Date(application.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {application.job.type || 'Full-time'}
                        </div>
                        {application.resume && (
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            <span>Resume: {application.resume.originalName}</span>
                            <a
                              href={`${API_URL.replace('/api', '')}/uploads/${application.resume.filename}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Download
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <a
                        href={`/job/${application.job._id}`}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </a>
                      {application.status === 'pending' && (
                        <button
                          onClick={() => withdrawApplication(application._id)}
                          className="p-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <XCircle className="h-4 w-4 text-red-600" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Cover Letter Preview */}
                  {application.coverLetter && (
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Your Cover Letter
                      </h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg line-clamp-3">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}
                  
                  {/* Application Timeline */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Application Timeline</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Application Submitted</p>
                          <p className="text-xs text-gray-600">{new Date(application.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      {application.status !== 'pending' && (
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${
                            application.status === 'accepted' ? 'bg-green-600' : 'bg-red-600'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {application.status === 'accepted' ? 'Application Accepted' : 'Application Rejected'}
                            </p>
                            <p className="text-xs text-gray-600">
                              {new Date(application.updatedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
