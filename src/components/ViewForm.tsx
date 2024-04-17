import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HOSTNAME } from '../HostName'; // Ensure you import the HOSTNAME from the correct path

type Question = {
  id: number;
  text: string;
  type: string;
  options?: string[];
  correctAnswer?: string | null;
};

type FormData = {
  _id: string;
  createdBy: string;
  dateCreated: string;
  formName: string;
  questions: Question[];
  title: string;
};

const ViewForm = () => {
  const { formID } = useParams<{ formID: string }>();
  const [form, setForm] = useState<FormData | null>(null);
  const [responses, setResponses] = useState<any>({});
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedVision, setSelectedVision] = useState('');
  const [selectedName, setSelectedName] = useState(''); // New state for user's name
  const didMount = useRef(false);

  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('role') === 'admin';

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5001/api/get_form/${formID}`);
        if (response.status === 200 && response.data.status === 'success') {
          const formData = response.data.form;
          console.log('Form data:', formData);
          setForm(formData);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          console.error('Form not found:', error.response.data.message);
        } else {
          console.error('Error fetching form data:', error);
        }
      }
    };

    if (formID) {
      fetchFormData();
    }
  }, [formID]);

  const renderQuestionInput = (question: Question) => {
    switch (question.type) {
      case 'multipleChoice':
      case 'trueFalse':
        return (
          <div className="flex flex-col">
            {Array.isArray(question.options) && question.options.map((option, index) => (
              <label key={index} className="inline-flex items-center mt-1">
                <input type="radio" name={`question_${question.id}`} value={option} className="mr-2" />
                {option}
              </label>
            ))}
          </div>
        );
      case 'checkboxes':
        return (
          <div className="flex flex-col">
            {Array.isArray(question.options) && question.options.map((option, index) => (
              <label key={index} className="inline-flex items-center mt-1">
                <input type="checkbox" name={`question_${question.id}`} value={option} className="mr-2" />
                {option}
              </label>
            ))}
          </div>
        );
      case 'short':
      case 'long':
        return (
          <input
            type="text"
            name={`question_${question.id}`}
            placeholder={question.type === 'short' ? 'Short answer' : 'Long answer'}
            className="w-full p-2 border rounded"
          />
        );
      default:
        return null;
    }
  };

  const handleInputChange = (questionId: number, value: string) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${HOSTNAME}/api/responses`, {
        formID,
        responses,
      });
      if (response.status === 200 && response.data && response.data.status === 'success') {
        navigate('/success'); // Redirect to success page
        console.log('Responses submitted successfully');
      } else {
        console.error('Failed to submit responses');
        // Handle failure
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error
    }
  };

  const saveResponses = async () => {
    const payload = {
      user_id: "placeholder", // Placeholder for the user ID, replace with actual user ID if available
      form_id: formID, // Assuming formID is accessible in the component
      role: selectedRole,
      years_of_experience: selectedExperience,
      age: selectedAge,
      gender: selectedGender,
      vision_impairment: selectedVision,
      responses: responses,
    };

    console.log(JSON.stringify(payload, null, 2)); // Print the JSON representation to the console

    try {
      const response = await axios.post('http://127.0.0.1:5001/api/get_responses', payload);
      if (response.status === 201) {
        alert('Responses saved successfully');
        // Additional logic after successful save
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(`Error saving responses: ${error.response?.data.message || error.message}`);
      } else {
        alert(`An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  if (!form) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center w-full bg-gradient-to-tr from-gray-100 to-blue-100">
          <header className="w-full py-4 bg-white shadow-md">
            <div className="container max-w-3xl mx-auto flex justify-between items-center px-4">
              <h1 className="text-xl font-medium text-gray-700">Previewing Form</h1>
              <div className='space-x-4'>
              {/* <Link to="/" className="text-blue-600 hover:text-blue-800">
                Home
              </Link> */}
              {isAdmin ? (
                <Link to={`/edit/${formID}`} className="text-blue-600 hover:text-blue-800">
                  Edit
                </Link>
              ) : (
                <Link to="/home" className="text-blue-600 hover:text-blue-800">
                  Home
                </Link>
              )}
              </div>
            </div>
          </header>
          <div className="container max-w-3xl mx-auto p-4 bg-white rounded-xl shadow my-4 overflow-y-scroll">
              <h1 className="text-3xl font-semibold text-center mb-0">{form.formName}</h1>
              <form className=''>
              {/* {console.log('Form questions:', form.questions)} */}
                {form.questions.map((question) => (
                  <div key={question.id} className="mb-4">
                    <hr className="my-4" />
                    <p className="mb-2 font-medium text-xl">{question.text}</p>
                    {renderQuestionInput(question)}
                  </div>
                ))}
                <button type="submit" className="w-full mt-4 bg-blue-100 hover:bg-blue-200 font-bold py-2 px-4 rounded-lg border-[2px] border-blue-500 text-blue-700 ease-linear duration-100">
                  Submit Form
                </button>
              </form>
            </div>
          </div>
        );
      };

  export default ViewForm;

