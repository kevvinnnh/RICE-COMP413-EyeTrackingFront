import {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Script from 'react-load-script';
import React, { useState} from 'react';
import { useLocation } from 'react-router-dom';
import { HOSTNAME } from '../HostName.tsx'

const EyeTracking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [showImage,setShowImage] = useState(false);
    const [eyeTrackingData, setEyeTrackingData] = useState<Array<any>>([]);

    // Handles the full screen skin lesion image 
    const fullScreenStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        objectFit: 'cover',
        zIndex: -1
    };

    // Handles the loading of the Webgazer script
    const handleScriptLoad = () => {
        setScriptLoaded(true);

    };

    useEffect(() => {
        if (scriptLoaded) {
            // Ensure webgazer is available in the global scope
            const wg = window.webgazer || webgazer;
            
            if (wg) {
                wg.setGazeListener((data, elapsedTime) => {
                    console.log(data, elapsedTime);
                    setEyeTrackingData(prevData => [...prevData, data]);
                }).begin()
                .then(() => {
                    setShowImage(true); // Set to true only after WebGazer begins
                    wg.showVideo(false); // Hide the WebGazer video preview
                })
                .catch((err) => {
                    console.error("Error starting WebGazer:", err);
                });
            } 
        }
    }, [scriptLoaded]); // Dependency array to ensure this runs only when scriptLoaded changes
    
    // Function to navigate back to DefaultForm
    const navigateToDefaultForm = async () => {
         // Cleanup function
            if (window.webgazer) {
                window.webgazer.end(); // Assuming webgazer provides a method to stop tracking
                window.webgazer.stopVideo();
                console.log("Eye tracking stopped");
            }

             // Wrap the eyeTrackingData array in an object
            const payload = {
                eyeData: eyeTrackingData
            };
            console.log(payload)

            try {
                const response = await fetch(`${HOSTNAME}/api/eyetracking`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // Add 
                    body: JSON.stringify(payload)
                });
                console.log("Response from server:", response);
            
                if (response.ok) {
                    console.log('Eye Tracking Data submitted successfully');
                    // Navigate back to the home page or to a success page
                } else {
                    console.error('Failed to submit responses');
                }
            } catch (error) {
                console.error('Network error when trying to submit responses:', error);
            }
            navigate('/default-form');
    };

    return (
        <div>
            <Script
                url="https://webgazer.cs.brown.edu/webgazer.js"
                onLoad={handleScriptLoad} 
            />
            {showImage&&<img
                // Replace with your path to image file 
                src={location.state.image}
                // className="my-4"
                style={fullScreenStyle}
                
        />}
            {/* Button to navigate back to DefaultForm */}
            <button 
                onClick={navigateToDefaultForm} 
                className="mt-4 ml-4 bg-gradient-to-tr from-green-600 to-green-400 text-white font-bold text-lg py-2 px-4 rounded transition duration-300 ease-in-out transform hover:translate-x-1 hover:shadow-lg absolute top-0 right-0"
                
            >
                Back to Survey
            </button>
        </div>
    );
};

export default EyeTracking;