// src/components/ViewForm.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
      <div className="flex justify-center items-center bg-gray-100">
        <div className="container max-w-2xl mx-auto p-4 bg-white rounded shadow">
          <h1 className="text-2xl font-semibold text-center mb-4 overflow-y-scroll">{form.title}</h1>
          <form className=''>
            {form.questions.map((question, index) => (
              <div key={question.id} className="mb-6">
                <p className="mb-2 font-medium">{question.text}</p>
                {renderQuestionInput(question)}
                <hr className="my-4" />
              </div>
            ))}
            <button type="submit" className="w-full mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded">
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default ViewForm;