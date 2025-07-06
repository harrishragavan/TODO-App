import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ThemeToggle from '../components/ThemeToggle';

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const API_URL = 'https://todo-app-43ep.onrender.com/api/todos';

  useEffect(() => {
    fetchTodos();
  }, [filterStatus, sortBy, order, page]);

  const fetchTodos = async () => {
    try {
      const query = new URLSearchParams({
        completed: filterStatus,
        sortBy,
        order,
        page,
        limit: 5,
      });

      const res = await fetch(`${API_URL}?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok && Array.isArray(data.todos)) {
        setTodos(data.todos);
        setTotalPages(data.totalPages || 1);
      } else {
        setTodos([]);
        setTotalPages(1);
      }
    } catch (err) {
      toast.error('Failed to fetch tasks');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out');
    navigate('/login');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete this task?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Task deleted');
        fetchTodos();
      } else {
        toast.error(data.message || 'Delete failed');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  const toggleCompleted = async (id, completed) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed }),
      });
      fetchTodos();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  // Chart logic
  const typeCounts = todos.reduce((acc, t) => {
    acc[t.type] = (acc[t.type] || 0) + 1;
    return acc;
  }, {});

  const taskByDate = todos.reduce((acc, t) => {
    const dateKey = new Date(t.date).toISOString().split('T')[0];
    acc[dateKey] = (acc[dateKey] || 0) + 1;
    return acc;
  }, {});

  const sortedDates = Object.keys(taskByDate).sort();

  const lineData = {
    labels: sortedDates,
    datasets: [
      {
        label: 'Tasks Created',
        data: sortedDates.map((d) => taskByDate[d]),
        fill: true,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels: Object.keys(typeCounts),
    datasets: [
      {
        label: 'Tasks by Type',
        data: Object.values(typeCounts),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderRadius: 8,
      },
    ],
  };

  const btnBase = "inline-flex items-center px-4 py-2 text-sm font-semibold rounded-md shadow transition duration-200";
  const btnPrimary = `${btnBase} bg-blue-600 text-white hover:bg-blue-700`;
  const btnDanger = `${btnBase} bg-rose-500 text-white hover:bg-rose-600`;
  const btnWarn = `${btnBase} bg-yellow-500 text-white hover:bg-yellow-600`;
  const btnGray = `${btnBase} bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500`;
  const btnPurple = `${btnBase} bg-purple-600 text-white hover:bg-purple-700`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 z-20 p-4 flex flex-wrap justify-between items-center">
        <h1 className="text-4xl font-funky text-purple-600 tracking-wider drop-shadow-md">Task Manager</h1>
        <div className="flex flex-wrap gap-3 mt-2 sm:mt-0">
          <ThemeToggle />
          <Link to="/create-task" className={btnPrimary}>+ New Task</Link>
          <Link to="/share-task" className={btnPurple}>Share Task</Link>
          <button onClick={handleLogout} className={btnDanger}>Logout</button>
        </div>
      </header>

      {/* Filters */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="p-3 border rounded-md bg-white dark:bg-gray-700 dark:text-white">
            <option value="">All</option>
            <option value="true">Completed</option>
            <option value="false">Incomplete</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-3 border rounded-md bg-white dark:bg-gray-700 dark:text-white">
            <option value="">Sort by</option>
            <option value="date">Date</option>
            <option value="type">Type</option>
          </select>
          <select value={order} onChange={(e) => setOrder(e.target.value)} className="p-3 border rounded-md bg-white dark:bg-gray-700 dark:text-white">
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-white">Tasks Over Time</h3>
            {sortedDates.length > 0 ? (
              <div className="w-full h-[240px]">
                <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            ) : <p className="text-sm text-gray-400">No task data</p>}
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-white">Tasks by Type</h3>
            {Object.keys(typeCounts).length > 0 ? (
              <div className="w-full h-[240px]">
                <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            ) : <p className="text-sm text-gray-400">No task types yet</p>}
          </div>
        </div>

        {/* Tasks */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {todos.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-300">No tasks found.</p>
          ) : (
            todos.map((todo) => (
              <div key={todo._id} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl p-5 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all">
                <div className="space-y-1">
                  <h2 className={`text-lg font-bold ${todo.completed ? 'line-through text-green-500' : ''}`}>{todo.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{todo.type}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(todo.date).toLocaleDateString()}</p>
                  {todo.description && <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">{todo.description}</p>}
                  <label className="flex items-center text-sm gap-2 mt-2">
                    <input type="checkbox" checked={todo.completed} onChange={() => toggleCompleted(todo._id, !todo.completed)} className="accent-green-600" />
                    Completed
                  </label>
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  <Link to={`/edit-task/${todo._id}`} className={btnWarn}>Edit</Link>
                  <button onClick={() => handleDelete(todo._id)} className={btnDanger}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-10">
            <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} className={btnGray} disabled={page === 1}>⬅ Prev</button>
            <span className="text-sm text-gray-600 dark:text-gray-300">Page {page} of {totalPages}</span>
            <button onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))} className={btnGray} disabled={page === totalPages}>Next ➡</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
