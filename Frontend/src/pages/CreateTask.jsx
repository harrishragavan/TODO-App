import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ThemeToggle from '../components/ThemeToggle';
import { ArrowLeftIcon } from '@heroicons/react/24/solid'; // Make sure to install @heroicons/react

const CreateTask = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    date: '',
    description: '',
  });

  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const API_URL = 'https://todo-app-43ep.onrender.com/api/todos';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const contentType = res.headers.get('content-type');
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error: ${res.status} - ${errorText}`);
      }

      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        toast.success(data.message || 'Task created successfully!');
        navigate('/dashboard');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Create Error:', err.message);
      toast.error('Failed to create task. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white dark:from-gray-900 dark:to-gray-950 px-4 py-6 transition-all">
      <div className="max-w-xl mx-auto">
        {/* Top Right Toggle */}
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
            🎉 New Task Wizard!
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
              placeholder="Task Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border rounded-lg resize-none dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
            />

            <button
              type="submit"
              disabled={!formData.name || !formData.type || !formData.date}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:scale-[1.02] transition-transform duration-200 disabled:opacity-50"
            >
              🚀 Create Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
