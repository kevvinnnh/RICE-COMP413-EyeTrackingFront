import { useState } from 'react';
import FormCard from './FormCard';

const Home: React.FC = () => {
  // Initialize state to hold the number of form cards
  const [formCardsCount, setFormCardsCount] = useState(1);

  // Function to handle the button click
  const addFormCard = async () => {
    try {
      // Send a POST request to your backend endpoint
      const response = await fetch('http://localhost:5001/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // You might want to send specific data in the body
        body: JSON.stringify({ formName: 'Untitled Form' }),
      });

      console.log(response);
  
      if (response.ok) {
        // If the form was added successfully, update the state
        console.log('Form added successfully');
        console.log(response.ok);
        setFormCardsCount(formCardsCount + 1);
      } else {
        // Handle any errors returned from the server
        console.error('Failed to add the form');
      }
    } catch (error) {
      // Handle any network errors
      console.error('Network error when trying to add the form:', error);
    }
  };

  return (
    <>
      <nav className="flex justify-between items-center shadow-md p-2 mb-2">
        <h1 className="text-lg font-semibold px-2">
          EpiDerm
        </h1>
        <button className="py-2 text-sm px-4">
          Logout
        </button>
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
        <div className="pt-4 pb-4 mb-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Generate form cards based on state */}
            {Array.from({ length: formCardsCount }, (_, index) => (
              <FormCard key={index} formID={"Untitled Form"} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;