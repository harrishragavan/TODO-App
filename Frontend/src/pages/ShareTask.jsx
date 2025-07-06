import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const ShareTask = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    deadline: '',
    receiverEmail: '',
  });

  const [sharedTasks, setSharedTasks] = useState([]);
  const token = localStorage.getItem('token');
  const API_URL = 'https://todo-app-43ep.onrender.com/api/share';

  useEffect(() => {
    fetchSharedTasks();
  }, []);

  const fetchSharedTasks = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSharedTasks(data || []);
    } catch (err) {
      console.error('Fetch shared tasks failed:', err);
    }
  };

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

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Task shared!');
        setFormData({ name: '', type: '', deadline: '', receiverEmail: '' });
        fetchSharedTasks();
      } else {
        toast.error(data.message || 'Failed to share task');
      }
    } catch (err) {
      toast.error('Error sharing task');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-950 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">Share a Task</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Share Task Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Task Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              type="text"
              placeholder="Task Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-3 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full p-3 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              type="email"
              placeholder="Receiver's Email"
              value={formData.receiverEmail}
              onChange={(e) => setFormData({ ...formData, receiverEmail: e.target.value })}
              className="w-full p-3 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Share Task
            </button>
          </form>
        </div>

        {/* Shared Tasks List */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Shared Tasks</h2>
          {sharedTasks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No tasks shared yet.</p>
          ) : (
            <ul className="space-y-3">
              {sharedTasks.map((task) => (
                <li key={task._id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
                  <div className="text-lg font-semibold text-gray-800 dark:text-white">{task.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">Type: {task.type}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    Deadline: {new Date(task.deadline).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    Sent to: <span className="font-medium">{task.receiverEmail}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareTask;
