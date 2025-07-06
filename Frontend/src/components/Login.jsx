import React, { useEffect } from 'react';
import LoginIllustration from '../assets/login.png'; // Ensure correct path

const Login = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      window.location.href = "/dashboard";
    }
  }, []);

  const handleGoogleLogin = () => {
    window.open("https://todo-app-43ep.onrender.com/api/auth/google", "_self");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-100 via-slate-100 to-gray-200 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300 ease-in-out">
        
        {/* Left - Illustration */}
        <div className="hidden md:flex w-full md:w-1/2 bg-yellow-100 dark:bg-yellow-200 items-center justify-center p-6">
          <img
            src={LoginIllustration}
            alt="Login Illustration"
            className="w-4/5 h-auto object-contain transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Right - Google Login Only */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold text-center mb-6 text-gray-800 dark:text-white tracking-wide animate-pulse">
            Welcome Back!
          </h2>

          <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-6">
            Sign in with your <span className="font-bold text-red-600">Google Account</span> to manage your tasks.
          </p>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 text-white py-3 text-lg rounded-lg hover:bg-red-600 transition duration-300 shadow-md hover:shadow-lg"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
