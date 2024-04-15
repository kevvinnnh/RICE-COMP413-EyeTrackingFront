// import React from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
            <h2 className="text-2xl font-semibold text-blue-500 mb-4">
                Survey Submitted Successfully!
            </h2>
            <button 
                onClick={() => navigate('/home')} 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300"
            >
                Home
            </button>
        </div>
    );
};

export default SuccessPage;
