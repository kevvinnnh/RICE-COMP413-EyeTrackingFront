import { useState } from 'react';
import FormCard from './FormCard';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  // Initialize state to hold the number of form cards
  const [formCardsCount, setFormCardsCount] = useState(1);
  const navigate = useNavigate();

  // Function to handle the button click to add a new form card
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

  // Function to handle the button click to navigate to the prepopulated form
  const navigateToDefaultForm = () => {
    navigate('/default-form'); // Use navigate to change route
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

            {/* Skin Lesion Diagnosis Questions
            {DEFAULT_ANSWERS.map((form,idx) => (
            <div className="bg-white border-[1px] rounded-lg p-2 flex flex-col w-full mb-4">
                <label className="text-sm font-medium text-gray-700">
                    {idx+1}. What is the diagnosis for this skin lesion on the individual’s <em>{question.position}</em>?
                </label>
                <img
                    // Replace with your path to image file 
                    src={question.image}
                    className="my-4"
                />
                <div className="flex flex-col">
                {question.answer_choices.map((answer,index) => (
                    <label className="inline-flex items-center">
                    <input 
                        type="radio" 
                        name={idx.toString()} 
                        value={answer} 
                        className="form-radio" 
                        onChange={() => {
                            // all_answers is a dictionary
                            const all_answers = responses
                            //Should change to number not string eventually 
                            all_answers[idx] = answer
                            setResponses(all_answers)
                        }}
                    />
                    <span className="ml-2">{answer}</span>
                    </label>
                ))
                }
                </div>
            </div>
            ))
            } */}
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