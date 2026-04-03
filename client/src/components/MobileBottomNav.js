import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, Building, Plus, User, FileText } from 'lucide-react';
import './MobileBottomNav.css';

const MobileBottomNav = ({ user }) => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: Home,
      show: true
    },
    {
      path: '/jobs',
      label: 'Jobs',
      icon: Briefcase,
      show: true
    },
    // Employer items
    ...(user?.role === 'employer' ? [
      {
        path: '/my-jobs',
        label: 'My Jobs',
        icon: Building,
        show: true
      },
      {
        path: '/post-job',
        label: 'Post Job',
        icon: Plus,
        show: true
      }
    ] : []),
    // Job seeker items
    ...(user?.role === 'jobseeker' ? [
      {
        path: '/my-applications',
        label: 'Applications',
        icon: FileText,
        show: true
      }
    ] : []),
    // Non-logged in user items
    ...(!user ? [
      {
        path: '/login',
        label: 'Login',
        icon: User,
        show: true
      }
    ] : [])
  ];

  if (!user && location.pathname === '/login') {
    return null; // Don't show bottom nav on login page
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50 sm:hidden">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
