import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import JobList from './components/JobList';
import JobDetails from './components/JobDetails';
import Applications from './components/Applications';
import MyJobs from './components/MyJobs';
import MyApplications from './components/MyApplications';
import PostJob from './components/PostJob';
import About from './components/About';
import Contact from './components/Contact';
import MobileBottomNav from './components/MobileBottomNav';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode token to get user info
        const decodedToken = jwtDecode(token);
        // Check if token is expired
        if (decodedToken.exp * 1000 > Date.now()) {
          setUser({
            id: decodedToken.id,
            name: decodedToken.name,
            email: decodedToken.email,
            role: decodedToken.role
          });
        } else {
          // Token expired, remove it
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, []);

  // Add useEffect to monitor localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Decode token to get user info
          const decodedToken = jwtDecode(token);
          // Check if token is expired
          if (decodedToken.exp * 1000 > Date.now()) {
            setUser({
              id: decodedToken.id,
              name: decodedToken.name,
              email: decodedToken.email,
              role: decodedToken.role
            });
          } else {
            // Token expired, remove it
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      // Cleanup function
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Function to refresh user state from token
  const refreshUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setUser({
            id: decodedToken.id,
            name: decodedToken.name,
            email: decodedToken.email,
            role: decodedToken.role
          });
        } else {
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} logout={logout} />
        <main className="pb-16 sm:pb-0">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/jobs" element={<JobList user={user} />} />
            <Route path="/job/:id" element={<JobDetails user={user} />} />
            <Route path="/about" element={<About user={user} />} />
            <Route path="/contact" element={<Contact user={user} />} />
            <Route path="/applications" element={<Applications user={user} />} />
            <Route path="/my-jobs" element={<MyJobs user={user} />} />
            <Route path="/my-applications" element={<MyApplications user={user} />} />
            <Route path="/post-job" element={<PostJob user={user} />} />
            <Route path="/post-job" element={user && user.role === 'employer' ? <PostJob /> : <Navigate to="/login" />} />
            <Route path="/applications" element={user && user.role === 'employer' ? <Applications /> : <Navigate to="/login" />} />
            <Route path="/my-jobs" element={user && user.role === 'employer' ? <MyJobs /> : <Navigate to="/login" />} />
            <Route path="/my-applications" element={user && user.role === 'jobseeker' ? <MyApplications /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        <MobileBottomNav user={user} />
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </Router>
  );
}

export default App;
