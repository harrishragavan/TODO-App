import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid'; // Ensure this package is installed
import ThemeToggle from '../components/ThemeToggle';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    date: '',
    description: '',
  });

  const API_URL = `https://todo-app-43ep.onrender.com/api/todos/${id}`;

  useEffect(() => {
    fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.name) {
          setFormData({
            name: data.name,
            type: data.type,
            date: data.date.split('T')[0],
            description: data.description || '',
          });
        }
      })
      .catch((err) => console.error('Failed to fetch task', err));
  }, [API_URL, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        navigate('/dashboard');
      } else {
        alert(data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white dark:from-gray-900 dark:to-gray-950 px-4 py-6 transition-all">
      <div className="max-w-xl mx-auto">
        {/* Top Controls */}
        <div className="flex justify-between items-center mb-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <ThemeToggle />
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-4xl font-funky text-pink-600 dark:text-yellow-400 text-center drop-shadow-lg tracking-wide mb-8 animate-pulse">
            ✏️ Edit Your Task
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Task Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type="text"
              placeholder="Type (e.g. Work)"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <textarea
              placeholder="Task Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border rounded-lg resize-none dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
            ></textarea>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:scale-[1.02] transition-transform duration-200"
            >
              ✅ Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
