
// src/components/EditFormQuestion.tsx
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';

interface EditFormQuestionProps {
  question: { id: number; text: string; type: string; options?: string[] };
  onTextChange: (text: string) => void;
  onTypeChange: (type: string) => void;
  onOptionsChange?: (options: string[]) => void; // Add this line
  onImageUpload: (image: File) => void;
}

const EditFormQuestion: React.FC<EditFormQuestionProps> = ({ question, onTextChange, onTypeChange, onOptionsChange, onImageUpload }) => {
    const [image, setImage] = useState<File | null>(null);
  

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files[0];
        console.log(file);
        setImage(file);
        onImageUpload(file); // Lifting the state up if needed
      }
    };
    
    const handleApi = () => {
      if (image) {
        const formData = new FormData();
        formData.append('image', image);
    
        // Directly using axios here
        axios.post('url', formData).then((res) => {
          console.log(res);
        }).catch((error) => {
          console.error(error);
        });
      }
    };
    
    const [options, setOptions] = useState<string[]>(question.options || []);
    
    // Function to handle option text change
    const handleOptionChange = (text: string, index: number) => {
      const updatedOptions = [...options]; // Use the local options state
      updatedOptions[index] = text;
      setOptions(updatedOptions); // Update the local state
      onOptionsChange && onOptionsChange(updatedOptions); // Call the onOptionsChange prop to update the parent state
    };
    
    // Update the local options state when the question's options prop changes
    useEffect(() => {
      setOptions(question.options || []);
    }, [question.options]);
    
  
    return (
    <div className="bg-white border-[1px] rounded-lg p-2 flex flex-col w-full">
      <div className="flex w-full space-x-2 items-center mb-2">
        <div className="flex-grow h-full">
          <div className='mb-1 px-1'>
            <label className="text-sm font-medium text-gray-400">Question</label>
          </div>
          <input
            type="text"
            value={question.text}
            onChange={(e) => onTextChange(e.target.value)}
            className="text-lg w-full h-full px-2
            border-[0px] rounded-md border-gray-100 hover:bg-gray-100 focus:bg-gray-100 outline-none
            transition duration-300 ease-in-out transform "
            placeholder="Type your question..."
            style={{ height: '48px' }} // Ensuring the input height matches the select height
          />
        </div>
        <div className='w-48'>
        <div className='mb-1 px-1'>
            <label className="text-sm font-medium text-gray-400">Style</label>
          </div>
          <select
            value={question.type}
            onChange={(e) => onTypeChange(e.target.value)}
            className="p-2.5 text-sm border-[0px] border-gray-100 bg-gray-100 rounded-md w-full cursor-pointer"
            style={{ height: '48px' }} // Ensuring the select height matches the input height
          >
            <option value="trueFalse">True / False</option>
            <option value="multipleChoice">Multiple Choice</option>
            <option value="checkboxes">Checkboxes</option>
            <option value="text">Text</option>
            {/* Add more options as needed */}
          </select>
        </div>
      </div>
      {(question.type === 'multipleChoice' || question.type === 'checkboxes') && (
        <div className="flex flex-col w-full space-y-2">
          {/* <label className="text-sm font-medium text-gray-700">Answers Choices</label> */}
          {[...Array(4)].map((_, index) => (
            <input
              key={index}
              type="text"
              value={options[index] || ''}
              onChange={(e) => handleOptionChange(e.target.value, index)}

              className="text-sm w-full p-2 bg-gray-100 border-[2px] rounded-md border-gray-100 hover:border-gray-200
              focus:border-blue-500 focus:bg-gray-100 outline-none transition duration-300 ease-in-out transform"
              placeholder={`Answer ${index + 1}`}
            />
          ))}
        </div>
  
        )}  {/* Image upload section */}
      <div className="mb-4">
        <label htmlFor="imageUpload" className="text-sm font-medium text-gray-400">
          Upload Image
        </label>
        <input
          id="imageUpload"
          type="file"
          name="image"
          onChange={handleImage}
          className="text-sm w-full p-2 bg-gray-100 border-[2px] rounded-md border-gray-100 hover:border-gray-200
          focus:border-blue-500 focus:bg-gray-100 outline-none transition duration-300 ease-in-out"
        />
        <button
          onClick={handleApi}
          className="mt-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Submit Image
        </button>
      </div>
      {/* ... rest of the component */}
    </div>
  );
};

export default EditFormQuestion;
