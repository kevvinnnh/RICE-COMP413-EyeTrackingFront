import FormCard from './FormCard';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { HOSTNAME } from '../HostName.tsx'

// Define a type for the form objects
interface Form {
  _id: {
    $oid: string;
  };
  dateCreated: string;
  formID: string;
  formName?: string;
  formTitle?: string;
}

const Home: React.FC = () => {
  // Initialize state to hold the number of form cards
  const [formCardsCount, setFormCardsCount] = useState(1);
  const navigate = useNavigate();

  // State to hold the fetched forms
  const [forms, setForms] = useState<Form[]>([]);

  // Fetch forms from the backend when the component mounts
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5001/api/forms');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setForms(data.forms); // Update the state with the fetched forms
      } catch (error) {
        console.error('Failed to fetch forms:', error);
      }
    };

    fetchForms();
  }, []); // The empty array ensures this effect runs only once after the initial render

  // Function to handle the button click to add a new form card
  const addFormCard = async () => {
    // Only allow admin to add form cards
    if (localStorage.getItem('role') !== 'admin') return;

    try {
      // Send a POST request to your backend endpoint
      const response = await fetch('http://127.0.0.1:5001/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formName: 'Untitled Form' }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Form added successfully');
        setFormCardsCount(formCardsCount + 1);
        navigate(`/edit/${data.insertedId}`);
      } else {
        console.error('Failed to add the form');
      }
    } catch (error) {
      console.error('Network error when trying to add the form:', error);
    }
  };

  // Function to handle the button click to navigate to the prepopulated form
  const navigateToDefaultForm = () => {
    const form_id = Math.floor(Math.random() * 10000000).toString();
    localStorage.setItem('currentFormId', form_id);
    const form_name = 'Default Form';
    localStorage.setItem('formName', form_name);
    navigate('/default-form'); // Use navigate to change route
  };

  const navigateToInvite = () => {
    // Only allow admin to invite participants
    if (localStorage.getItem('role') !== 'admin') return;

    navigate('/invite'); // This is the route we will set up for inviting participants
  };

  const requestModelTraining = async () => {
    const payload = {
      email: localStorage.getItem('email'),
    };
    console.log(payload)

    try {
        const response = await fetch(`${HOSTNAME}/api/train_model`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Add 
            body: JSON.stringify(payload)
        });
        console.log("Response from server:", response);
    
        if (response.ok) {
            console.log('Model trained successfully');
            // Navigate back to the home page or to a success page
        } else {
            console.error('Failed to train model');
        }
    } catch (error) {
        console.error('Network error when trying to train model:', error);
    }
  }

  const logout = () => {
    // Clear the simulated login flag
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  const isAdmin = localStorage.getItem('role') === 'admin';

  return (
    <>
      <nav className="flex justify-between items-center shadow-md p-2 mb-2">
        <h1 className="text-lg font-semibold px-2">
          EpiDerm
        </h1>
        {isAdmin && (
          <div>
            <button
              onClick={navigateToInvite}
              className="py-2 text-sm px-4 mr-4 bg-blue-500 text-white rounded"
            >
            Invite Participants
            </button>
          </div>
        )}
        <button
          onClick={logout}
          className="py-2 text-sm px-4 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-black">
          My Forms
        </h1>
        {/* Add Form Button moved here */}
        {isAdmin && (
          <button
            onClick={addFormCard}
            className="mt-4 bg-gradient-to-tr from-blue-600 to-blue-400 text-white font-bold text-lg py-2 px-4 rounded transition duration-300 ease-in-out transform hover:translate-x-1 hover:shadow-lg"
          >
            <span className='pr-2'>+</span>Create a new form
          </button>
        )}
        {/* Button to go to the default form */}
        <button
          onClick={navigateToDefaultForm}
          className="mt-4 ml-4 bg-gradient-to-tr from-green-600 to-green-400 text-white font-bold text-lg py-2 px-4 rounded transition duration-300 ease-in-out transform hover:translate-x-1 hover:shadow-lg"
        >
          Start Default Survey
        </button>
        <button
          onClick={requestModelTraining}
          className="mt-4 ml-4 bg-gradient-to-tr from-green-600 to-green-400 text-white font-bold text-lg py-2 px-4 rounded transition duration-300 ease-in-out transform hover:translate-x-1 hover:shadow-lg"
        >
          Train Model
        </button>
          {isAdmin && (
          <div className="pt-4 pb-4 mb-4">
            <div className="grid grid-cols-3 gap-4">
              {/* Generate form cards based on state */}
              {forms.map((form) => (
                <FormCard key={form._id.$oid} formID={form._id.$oid} formName={String(form.formName || form.formTitle)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
  
  export default Home;