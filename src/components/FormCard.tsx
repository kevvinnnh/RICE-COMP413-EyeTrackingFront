// src/components/FormCard.tsx

import React from 'react';

import { useNavigate } from 'react-router-dom';

const FormCard: React.FC<{ formID: string, formName: string }> = ({ formID, formName }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/edit/${formID}`);
  };

  const formTitle = formName || 'Untitled Form';

  return (
    <div
      onClick={handleClick}
      className="bg-gradient-to-tl from-blue-100 to-gray-100 rounded h-40
      transition duration-200 ease-in-out transform cursor-pointer flex flex-col justify-between
      border-[1px]
      border-gray-200 hover:border-blue-500
      "
    >
      {/* Content of the form card */}
      <div>
        {/* <p>Title</p> */}
        {/* Other content */}
      </div>
      {/* Footer with title */}
      <div className="bg-white border-t-[1px] p-2 rounded-b-[3.5px]">
        <p className="text-md text-gray-700">
          {formTitle}
        </p>
      </div>
    </div>
  );
};

export default FormCard;