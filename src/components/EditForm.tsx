// src/components/EditForm.tsx
import React, { useState } from 'react';
import EditFormQuestion from './EditFormQuestion';
import { useParams } from 'react-router-dom';

// Define a type for your question
type Question = {
  id: number;
  text: string;
  type: string;
};

const EditForm = () => {
  const { formID } = useParams();
  const [title, setTitle] = useState('Untitled Form');
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const addNewQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      text: '',
      type: 'short', // default question type, can be 'short', 'long', 'multipleChoice', etc.
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleQuestionTextChange = (index: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[index].text = text;
    setQuestions(newQuestions);
  };

  // TODO: type shouldn't be string, it should be a more specific type
  const handleQuestionTypeChange = (index: number, type: string) => {
    const newQuestions = [...questions];
    newQuestions[index].type = type;
    setQuestions(newQuestions);
  };

  return (
    <>
      <nav className="flex justify-between items-center shadow-md p-2">
      <h1>
        <a href="/" className="no-underline text-black px-2 text-lg">
          Home
        </a>
      </h1>
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        className="text-2xl font-semibold duration-300 ease-in-out transform border-b-4
        border-gray-200 hover:border-gray-200 focus:border-blue-500 outline-none w-96"
        placeholder="Name your form"
      />
      <button className="py-2 text-sm px-4">
        Logout
      </button>
      </nav>
      <div className='max-w-4xl mx-auto p-4'>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <EditFormQuestion
              key={question.id}
              question={question}
              onTextChange={(text) => handleQuestionTextChange(index, text)}
              onTypeChange={(type) => handleQuestionTypeChange(index, type)}
            />
          ))}
          <button
            onClick={addNewQuestion}
            className="mt-4 bg-gradient-to-tr from-blue-600 to-blue-400 text-white font-bold text-lg py-2 px-4 rounded transition duration-300 ease-in-out transform hover:translate-x-1 hover:shadow-lg"
          >
            <span className='pr-2'>+</span>Add a new question
          </button>
        </div>
      </div>
    </>
  );
};

export default EditForm;