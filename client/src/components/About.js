import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-8 rounded shadow">
        <h1 className="text-3xl font-bold mb-6">About Job Portal</h1>
        <p className="text-lg mb-4">
          Job Portal is a comprehensive platform connecting job seekers with employers worldwide.
          Our mission is to simplify the job search process and help companies find the best talent.
        </p>
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="mb-4">
          To empower individuals to find meaningful employment and help businesses build successful teams.
        </p>
        <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
        <p className="mb-4">
          To be the leading job portal that transforms how people find and secure jobs globally.
        </p>
        <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
        <ul className="list-disc list-inside">
          <li>Extensive job listings across various industries</li>
          <li>User-friendly interface for job seekers and employers</li>
          <li>Advanced search and filtering options</li>
          <li>Secure application process</li>
          <li>Profile management for both job seekers and employers</li>
        </ul>
      </div>
    </div>
  );
};

export default About;