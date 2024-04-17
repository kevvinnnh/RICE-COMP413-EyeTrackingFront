import React, { useState, useEffect } from 'react';
import { HOSTNAME } from '../HostName';

// Define interfaces for typing the state related to surveys, participants, and responses

interface Survey {
    _id: string;
    formName: string;
}

interface Participant {
    userId: string;
    name: string;
    email: string;
}

interface Response {
    question: string;
    answer: string;
}

const Dashboard = () => {
    // State for storing surveys, the selected survey, participants, selected participant, and responses
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
    const [responses, setResponses] = useState<Response[]>([]);
    
    // Effect to fetch surveys from the server when the component mounts
    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const response = await fetch(`${HOSTNAME}/api/forms`);
                if (response.ok) {
                    const data = await response.json();
                    setSurveys(data.forms);
                } else {
                    throw new Error('Failed to fetch surveys');
                }
            } catch (error) {
                console.error('Error fetching surveys', error);
            }
        };
        fetchSurveys();
    }, []);

    // Redering cnentompo
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold leading-tight text-gray-900">Dashboard</h1>
                <div className="mt-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Surveys</h2>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {surveys.map(survey => (
                            <button 
                                key={survey._id}
                                onClick={() => setSelectedSurvey(survey)}
                                className="px-6 py-3 bg-blue-500 rounded-md text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                {survey.formName}
                            </button>
                        ))}
                    </div>
                </div>
                {selectedSurvey && (
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold text-gray-700">Participants for {selectedSurvey.formName}</h3>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {participants.map(participant => (
                                <button 
                                    key={participant.userId} 
                                    onClick={() => setSelectedParticipant(participant)}
                                    className="px-6 py-3 bg-green-500 rounded-md text-white font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                >
                                    {participant.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {selectedParticipant && (
                    <div className="mt-6">
                        <h4 className="text-lg font-semibold text-gray-700">Responses from {selectedParticipant.name}</h4>
                        <ul className="mt-4 space-y-3">
                            {responses.map((response, index) => (
                                <li key={index} className="text-gray-600">
                                    Question: {response.question}, Answer: {response.answer}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
