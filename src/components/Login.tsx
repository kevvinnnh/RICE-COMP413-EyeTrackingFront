// Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Make a GET request to verify the email and token
    const response = await fetch(`http://localhost:5001/api/verify_invite?email=${email}&token=${password}`, {
        method: 'GET',
    });

    if (response.ok) {
        // If the email and token are verified, proceed with the login
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('email', email);
        navigate('/home', { replace: true }); // Use replace to prevent navigation back to login
    } else {
        // If the verification fails, alert the user
        const result = await response.json();
        alert(result.message || 'Failed to login. Please check your email and/or password.');
    }
};

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="p-6 max-w-sm w-full bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
