import FormCard from './FormCard';
import { useNavigate } from 'react-router-dom';
import { TEST_FORMS } from './TestForms';
import { useState, useEffect } from 'react';

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
    try {
      // Send a POST request to your backend endpoint
      const response = await fetch('http://127.0.0.1:5001/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // You might want to send specific data in the body
        body: JSON.stringify({ formName: 'Untitled Form' }),
      }).then(response=>{
         // TODO: Make sure that response contains the formID
        console.log(response);
    
        if (response.ok) {
          // If the form was added successfully, update the state
          console.log('Form added successfully');
          console.log(response.ok);
          setFormCardsCount(formCardsCount + 1);
        } else {
          // Handle any errors returned from the server
          console.error('Failed to add the form');
        } return response
        }
      ).then(response=>{
        const data = response.json()
        return data
      }).then(data=>{
        // console.log(data)
        console.log("data:", data)
        console.log("data ID:", data.insertedId)
        navigate(`/edit/${data.insertedId}`);
      })

    } catch (error) {
      // Handle any network errors
      console.error('Network error when trying to add the form:', error);
    }
  };

  // Function to handle the button click to navigate to the prepopulated form
  const navigateToDefaultForm = () => {
    navigate('/default-form'); // Use navigate to change route
  };
  const navigateToInvite = () => {
    navigate('/invite'); // This is the route we will set up for inviting participants
  };

  const logout = () => {
    // Clear the simulated login flag
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  return (
    <>


      <nav className="flex justify-between items-center shadow-md p-2 mb-2">
        <h1 className="text-lg font-semibold px-2">
          EpiDerm
        </h1>
        <div>
          <button
            onClick={navigateToInvite}
            className="py-2 text-sm px-4 mr-4 bg-blue-500 text-white rounded"
          >
          Invite Participants
          </button>
          <button
            onClick={logout}
            className="py-2 text-sm px-4 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </div>
      </nav>

      
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-black">
          My Forms
          {/* <span className='text-gray-400 pl-2'>({formCardsCount})</span> */}
        </h1>
        <button
          onClick={addFormCard}
          className="mt-4 bg-gradient-to-tr from-blue-600 to-blue-400 text-white font-bold text-lg py-2 px-4 rounded transition duration-300 ease-in-out transform hover:translate-x-1 hover:shadow-lg"
        >
          <span className='pr-2'>+</span>Create a new form
        </button>
        {/*ADDED STARTING HERE*/}
        {/* Button to go to the default form */}
        <button
          onClick={navigateToDefaultForm}
          className="mt-4 ml-4 bg-gradient-to-tr from-green-600 to-green-400 text-white font-bold text-lg py-2 px-4 rounded transition duration-300 ease-in-out transform hover:translate-x-1 hover:shadow-lg"
        >
          Start Default Survey
        </button>
        {/*ADDED ENDING HERE*/}
        <div className="pt-4 pb-4 mb-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Generate form cards based on state */}
            {forms.map((form) => (
                console.log("FORM:", form),
               <FormCard key={form._id.$oid} formID={form._id.$oid} formName={String(form.formName || form.formTitle)} />
            ))
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;