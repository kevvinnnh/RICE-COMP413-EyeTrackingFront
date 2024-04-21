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

type UserResponse = {
  _id: string;
  user_id: string;
  form_id: string;
  role: string;
  years_of_experience: number;
  age: number;
  gender: string;
  vision_impairment: string[];
  correctness_score: number;
  // eye_tracking_data: EyeTrackingData[]; // Assuming eye_tracking_data is an array of EyeTrackingData objects
  responses: UserAnswer[];
}

type UserAnswer = {
  questionId: number;
  answer: string;
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
  const [selectedName, setSelectedName] = useState('');
  const didMount = useRef(false);

  const navigate = useNavigate();
  const [, setSubmissionStatus] = useState('');
  const isAdmin = localStorage.getItem('role') === 'admin';
//eye trackingbutton
  const handleEyeTrackingButtonClick = (image: string, questionNum: number) => {
    navigate('/eyetracking', { state: { image, questionNum } });

  useEffect(() => {
    if (localStorage.getItem("formSelections") == null || didMount.current) {
      return;
    }
    const previousSelections = JSON.parse(localStorage.getItem("formSelections") || "");
    setResponses(previousSelections.responses);
    setSelectedRole(previousSelections.selectedRole);
    setSelectedExperience(previousSelections.selectedExperience);
    setSelectedAge(previousSelections.selectedAge);
    setSelectedGender(previousSelections.selectedGender);
    setSelectedVision(previousSelections.selectedVision);
    setSelectedName(previousSelections.selectedName);
    didMount.current = true;
  }, []);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5001/api/get_form/${formID}`);
        if (response.status === 200 && response.data.status === 'success') {
          const formData = response.data.form;
          setForm(formData);
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    if (formID) {
      fetchFormData();
    }
  }, [formID]);

  const handleInputChange = (questionId: number, value: string) => {
    console.log(`User selected option: Question ID ${questionId}, Option: ${value}`);
    setResponses({ ...responses, [questionId]: value });
  };

  const handleCheckboxChange = (questionId: number, value: string, checked: boolean) => {
    console.log(`User clicked on checkbox option: Question ID ${questionId}, Option: ${value}, Checked: ${checked}`);
    setResponses((prevResponses: any) => ({
      ...prevResponses,
      [questionId]: checked
        ? [...(prevResponses[questionId] || []), value]
        : (prevResponses[questionId] || []).filter((option: string) => option !== value),
    }));
  };

  const buildUserResponses = () => {
    const userResponses: UserAnswer[] = [];
    form?.questions.forEach((question) => {
      const { id } = question;
      const answer = responses[id] || '';
      userResponses.push({ questionId: id, answer });
    });
    return userResponses;
  };


  // const handleSubmit = async (event: React.FormEvent) => {
  //   event.preventDefault();
  //   try {
  //     const userResponses: UserAnswer[] = buildUserResponses(); // Build user responses array

  //     const userResponse: UserResponse = {
  //       _id: '', // Replace with appropriate ID if needed
  //       user_id: localStorage.getItem('user_id') || '', // Get user ID from local storage
  //       form_id: localStorage.getItem('currentFormId') || '', // Get form ID from local storage
  //       role: selectedRole,
  //       years_of_experience: Number(selectedExperience),
  //       age: Number(selectedAge),
  //       gender: selectedGender,
  //       vision_impairment: selectedVision.split(','), // Assuming selectedVision is a comma-separated string
  //       correctness_score: 0, // You may need to calculate this based on user responses
  //       responses: userResponses,
  //     };

  //     const response = await fetch(`${HOSTNAME}/api/submit_response`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(userResponse),
  //     });

  //     if (response.ok) {
  //       localStorage.removeItem("formSelections");
  //       console.log('Responses submitted successfully');
  //       navigate('/success');
  //       setSubmissionStatus('success');
  //     } else {
  //       console.error('Failed to submit responses');
  //       setSubmissionStatus('failure');
  //     }
  //   } catch (error) {
  //     console.error('Error submitting form:', error);
  //   }
  // };


  const renderQuestionInput = (question: Question) => {
    switch (question.type) {
      case 'multipleChoice':
      case 'trueFalse':
        return (
          <div className="flex flex-col">
            {Array.isArray(question.options) && question.options.map((option, index) => (
              <label key={index} className="inline-flex items-center mt-1">
                <input
                  type="radio"
                  name={`question_${question.id}`}
                  value={option}
                  className="mr-2"
                  onChange={(event) => handleInputChange(question.id, event.target.value)}
                />
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
                <input
                  type="checkbox"
                  name={`question_${question.id}`}
                  value={option}
                  className="mr-2"
                  onChange={(event) => handleCheckboxChange(question.id, event.target.value, event.target.checked)}
                />
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
            onChange={(event) => handleInputChange(question.id, event.target.value)}
          />
        );
      default:
        return null;
    }
  };

  // const handleSubmit = async (event: React.FormEvent) => {
  //   event.preventDefault();
  //   try {
  //     const response = await fetch(`${HOSTNAME}/api/get_responses`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         ...responses,
  //         email: localStorage.getItem('email'),
  //         name: selectedName,
  //         role: selectedRole,
  //         experienceLevel: selectedExperience,
  //         age: selectedAge,
  //         gender: selectedGender,
  //         vision: selectedVision,
  //         formId: localStorage.getItem('currentFormId'),
  //         formName: localStorage.getItem('formName')
  //       })
  //     });

  //     if (response.ok) {
  //       localStorage.removeItem("formSelections");
  //       console.log('Responses submitted successfully');
  //       navigate('/success');
  //       setSubmissionStatus('success');
  //     } else {
  //       console.error('Failed to submit responses');
  //       setSubmissionStatus('failure');
  //     }
  //   } catch (error) {
  //     console.error('Error submitting form:', error);
  //     setSubmissionStatus('failure');
  //   }
  // };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const userResponses: UserAnswer[] = buildUserResponses(); // Build user responses array

      const userResponse: UserResponse = {
        _id: '', // Replace with appropriate ID if needed
        user_id: localStorage.getItem('user_id') || '', // Get user ID from local storage
        form_id: localStorage.getItem('currentFormId') || '', // Get form ID from local storage
        role: selectedRole,
        years_of_experience: Number(selectedExperience),
        age: Number(selectedAge),
        gender: selectedGender,
        vision_impairment: selectedVision.split(','), // Assuming selectedVision is a comma-separated string
        correctness_score: 0, // You may need to calculate this based on user responses
        responses: userResponses,
      };

      const response = await fetch(`${HOSTNAME}/api/get_responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userResponse),
      });

      if (response.ok) {
        localStorage.removeItem("formSelections");
        console.log('Responses submitted successfully');
        navigate('/success');
        setSubmissionStatus('success');
      } else {
        console.error('Failed to submit responses');
        setSubmissionStatus('failure');
      }
    } catch (error) {
      console.error('Network error when trying to submit responses:', error);
      setSubmissionStatus('failure');
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name question */}
          <div className="bg-white border-[1px] rounded-lg p-2 flex flex-col w-full">
            <label className="text-sm font-medium text-gray-700">
              What is your name?
              <input
                type="text"
                name="name"
                className="p-2.5 text-sm border-[0px] bg-gray-100 rounded-md w-full"
                placeholder="Enter your name"
                value={selectedName}
                onChange={(e) => {
                  setSelectedName(e.target.value);
                }}
              />
            </label>
          </div>
          {/* Role question */}
          <div className="bg-white border-[1px] rounded-lg p-2 flex flex-col w-full">
            <label className="text-sm font-medium text-gray-700">
              Please select your role:
              <select
                name="role"
                className="p-2.5 text-sm border-[0px] bg-gray-100 rounded-md w-full"
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                }}
              >
                <option value=""></option>
                <option value="physician">Physician</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </div>
          {/* Experience Level question */}
          <div className="bg-white border-[1px] rounded-lg p-2 flex flex-col w-full">
            <label className="text-sm font-medium text-gray-700">
              Experience Level:
              <select
                name="experienceLevel"
                className="p-2.5 text-sm border-[0px] bg-gray-100 rounded-md w-full"
                value={selectedExperience}
                onChange={(e) => {
                  setSelectedExperience(e.target.value);
                }}
              >
                <option value=""></option>
                <option value="pgy1">PGY-1 (Intern Year)</option>
                <option value="pgy2To4">PGY-2 to PGY-4 (Dermatology Residency)</option>
                <option value="fellowship">Fellowship (Post-Residency)</option>
                <option value="boardCertified">Board Certified (Post-Residency)</option>
                <option value="earlyCareer">Early Career (0-5 years post-residency)</option>
                <option value="midCareer">Mid-Career (5-15 years post-residency)</option>
                <option value="senior">Senior/Advanced (Over 15 years post-residency)</option>
              </select>
            </label>
          </div>
          {/* Age question */}
          <div className="bg-white border-[1px] rounded-lg p-2 flex flex-col w-full mb-4">
            <label className="text-sm font-medium text-gray-700">
              What is your age?
              <input
                type="number"
                name="age"
                className="p-2.5 text-sm border-[0px] bg-gray-100 rounded-md w-full"
                placeholder="Enter your age"
                value={selectedAge}
                onChange={(e) => {
                  setSelectedAge(e.target.value);
                }}
              />
            </label>
          </div>
          {/* Gender question */}
          <div className="bg-white border-[1px] rounded-lg p-2 flex flex-col w-full mb-4">
            <label className="text-sm font-medium text-gray-700">
              What is your gender?
              <select
                name="gender"
                className="p-2.5 text-sm border-[0px] bg-gray-100 rounded-md w-full"
                value={selectedGender}
                onChange={(e) => {
                  setSelectedGender(e.target.value);
                }}
              >
                <option value=""></option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
          </div>
          {/* Vision conditions question */}
          <div className="bg-white border-[1px] rounded-lg p-2 flex flex-col w-full mb-4">
            <label className="text-sm font-medium text-gray-700">
              Do you have any vision conditions?
              <select
                name="vision"
                className="p-2.5 text-sm border-[0px] bg-gray-100 rounded-md w-full"
                value={selectedVision}
                onChange={(e) => {
                  setSelectedVision(e.target.value);
                }}
              >
                <option value=""></option>
                <option value="no">No</option>
                <option value="myopia">Myopia (Nearsightedness)</option>
                <option value="hyperopia">Hyperopia (Farsightedness)</option>
                <option value="astigmatism">Astigmatism</option>
                <option value="presbyopia">Presbyopia</option>
                <option value="cataracts">Cataracts</option>
                <option value="glaucoma">Glaucoma</option>
                <option value="macularDegeneration">Macular Degeneration</option>
                <option value="diabeticRetinopathy">Diabetic Retinopathy</option>
              </select>
            </label>
          </div>
          {/* Other form questions */}
          {form.questions.map((question) => (
            <div key={question.id} className="mb-4">
              <hr className="my-4" />
              <p className="mb-2 font-medium text-xl">{question.text}</p>
              {/* Render different question input types */}
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
