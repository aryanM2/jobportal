import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../api';
import { Building, MapPin, DollarSign, Clock, Calendar, Users, Briefcase, ArrowLeft, Send, Heart, Share2, CheckCircle, AlertCircle, IndianRupee, FileText } from 'lucide-react';

const JobDetails = ({ user }) => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saved, setSaved] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('');
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/jobs/${id}`);
        setJob(res.data);
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const applyForJob = async () => {
    if (!user) {
      toast.error('Please login to apply');
      return;
    }
    if (user.role !== 'jobseeker') {
      toast.error('Only job seekers can apply for jobs');
      return;
    }
    
    if (!resume) {
      toast.error('Please upload your resume to apply');
      return;
    }
    
    setApplying(true);
    setApplicationStatus('');
    
    try {
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('coverLetter', 'Applied via job portal');
      if (resume) {
        formData.append('resume', resume);
      }
      
      await axios.post(`${API_URL}/applications`, formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error('Failed to submit application. Please try again.');
      console.error('Application error:', err);
    } finally {
      setApplying(false);
    }
  };

  const toggleSaveJob = () => {
    setSaved(!saved);
  };

  const shareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Job link copied to clipboard!');
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
        {/* Back Navigation */}
        <Link to="/jobs" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 group">
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Job Header */}
              <div className="p-8 border-b border-gray-200">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Building className="h-5 w-5 mr-2" />
                        <span className="font-medium">{job.company}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-5 w-5 mr-2" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                         <IndianRupee  className="h-4 w-4 mr-1" />
                        <span>{job.salary || 'Competitive'}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-5 w-5 mr-2" />
                        <span>{job.type || 'Full-time'}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-5 w-5 mr-2" />
                        <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={toggleSaveJob}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Heart className={`h-5 w-5 ${saved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    </button>
                    <button
                      onClick={shareJob}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Share2 className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Application Status */}
                {applicationStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-700">Application submitted successfully!</span>
                  </div>
                )}
                
                {applicationStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-red-700">Failed to submit application. Please try again.</span>
                  </div>
                )}

                {/* Resume Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Resume (PDF, DOC, DOCX)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResume(e.target.files[0])}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-2 file:text-gray-700"
                    />
                    {resume && (
                      <div className="mt-2 flex items-center text-sm text-gray-600">
                        <FileText className="h-4 w-4 mr-2" />
                        <span>{resume.name}</span>
                        <button
                          type="button"
                          onClick={() => setResume(null)}
                          className="ml-2 text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="mb-6">
                  <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter (Optional)
                  </label>
                  <textarea
                    id="coverLetter"
                    value="Applied via job portal"
                    onChange={(e) => setApplicationStatus(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell us why you're interested in this position..."
                  />
                </div>

                {/* Apply Button */}
                {user && user.role === 'jobseeker' ? (
                  <button
                    onClick={applyForJob}
                    disabled={applying}
                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {applying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Applying...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Apply Now
                      </>
                    )}
                  </button>
                ) : !user ? (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-700">
                      Please <Link to="/login" className="font-semibold underline">login</Link> to apply for this job.
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Job Description */}
              <div className="p-8">
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">{job.description}</p>
                  </div>
                </section>

                {/* Requirements */}
                {job.requirements && job.requirements.length > 0 && (
                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                    <ul className="space-y-3">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Benefits */}
                {job.benefits && job.benefits.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits</h2>
                    <ul className="space-y-3">
                      {job.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Company Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{job.employer?.company?.name || job.company}</h4>
                    {job.employer?.company?.description && (
                      <p className="text-sm text-gray-600 mt-1">{job.employer.company.description}</p>
                    )}
                  </div>
                  {job.employer?.company?.website && (
                    <a
                      href={job.employer.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Visit Website
                    </a>
                  )}
                  {job.employer?.company?.size && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {job.employer.company.size} employees
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={toggleSaveJob}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <Heart className={`h-4 w-4 mr-2 ${saved ? 'fill-red-500 text-red-500' : ''}`} />
                    {saved ? 'Saved' : 'Save Job'}
                  </button>
                  <button
                    onClick={shareJob}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Job
                  </button>
                </div>
              </div>

              {/* Similar Jobs */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Jobs</h3>
                <div className="text-center py-8">
                  <Briefcase className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">More jobs like this coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;