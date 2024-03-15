import React from 'react';
import { useNavigate } from 'react-router-dom';


const SuccessPage = () => {
    const navigate = useNavigate();
    return (
        <div className="success-message-container">
            <h2>Survey Submitted Successfully!</h2>
            <button 
                onClick={() => navigate('/')} 
                className="home-button"
            >
            <h1>
                <a href="/" className="no-underline text-black px-2 text-lg">
                    Home
                </a>
            </h1>
            </button>
        </div>
    );
};

export default SuccessPage;