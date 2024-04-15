// src/components/ViewForm.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

type Question = {
  id: number;
  text: string;
  type: string;
  options?: string[];
  correctAnswer?: string | null;
};

type FormResponse = {
  _id: string;
  createdBy: string;
  dateCreated: string;
  formName: string;
  questions: Question[];
  title: string;
};

const ViewForm = () => {
  const { formID } = useParams<{ formID: string }>();
  const [form, setForm] = useState<FormResponse | null>(null);

  const isAdmin = localStorage.getItem('role') === 'admin';

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5001/api/get_form/${formID}`);
        if (response.status === 200 && response.data && response.data.status === 'success') {
          setForm(response.data.form); // Set the nested 'form' object to state
        }
      } catch (error) {
        console.error('Error fetching form:', error);
        // Handle error (e.g., show notification to the user)
      }
    };
  
    fetchForm();
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