import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import JobList from './components/JobList';
import JobDetails from './components/JobDetails';
import PostJob from './components/PostJob';
import Applications from './components/Applications';
import About from './components/About';
import Contact from './components/Contact';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode token to get user info, but for simplicity, assume it's set
      // In real app, verify token with backend
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4 text-white">
          <div className="container mx-auto flex justify-between">
            <Link to="/" className="text-xl font-bold">Job Portal</Link>
            <div>
              <Link to="/jobs" className="mr-4">Jobs</Link>
              <Link to="/about" className="mr-4">About</Link>
              <Link to="/contact" className="mr-4">Contact</Link>
              {!user ? (
                <>
                  <Link to="/login" className="mr-4">Login</Link>
                  <Link to="/register">Register</Link>
                </>
              ) : (
                <>
                  <span className="mr-4">Welcome, {user.name}</span>
                  {user.role === 'employer' && <Link to="/post-job" className="mr-4">Post Job</Link>}
                  {user.role === 'employer' && <Link to="/applications" className="mr-4">Applications</Link>}
                  <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
                </>
              )}
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<JobList user={user} />} />
          <Route path="/job/:id" element={<JobDetails user={user} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/post-job" element={user && user.role === 'employer' ? <PostJob /> : <Navigate to="/login" />} />
          <Route path="/applications" element={user && user.role === 'employer' ? <Applications /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
