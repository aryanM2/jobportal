import React, { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, send to backend
    alert('Message sent!');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-8 rounded shadow">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="mb-4">Have questions? We'd love to hear from you.</p>
            <p className="mb-2"><strong>Email:</strong> support@jobportal.com</p>
            <p className="mb-2"><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Address:</strong> 123 Job Street, Career City, CC 12345</p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  rows="5"
                  required
                ></textarea>
              </div>
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;