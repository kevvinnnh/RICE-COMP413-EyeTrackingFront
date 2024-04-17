import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
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
}


// this sets up the initial state and prepare the component to fetch form data based on the formID
// parameter from the URL
const ViewForm = () => {
  // double check if we need to specify if formID is a number/string
  const { formID } = useParams<{ formID: string }>();
  const [selectedForm, setForm] = useState<FormData | null>(null);
  const [title, setTitle] = useState('Untitled Form');
  const [questions, setQuestions] = useState<Question[]>([]);



  // figure out if we need this info
  const [responses, setResponses] = useState<any>({});
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedVision, setSelectedVision] = useState('');
  const [selectedName, setSelectedName] = useState(''); // New state for user's name
  const didMount = useRef(false);

  const [, setSubmissionStatus] = useState('');
  const navigate = useNavigate();

  // verify that admin shouldn't be able to submit forms
  const isAdmin = localStorage.getItem('role') === 'admin';
  if (!isAdmin) {
    return <div>You are not authorized to view this page.</div>;
  }

// figure out if we need to get anything from local storage

//   useEffect(() => {
//     if (localStorage.getItem("formSelections") == null || didMount.current) {
//         return;
//     }
//     const previousSelections = JSON.parse(localStorage.getItem("formSelections") || "")
//     setResponses(previousSelections.responses)
//     setSelectedRole(previousSelections.selectedRole)
//     setSelectedExperience(previousSelections.selectedExperience)
//     setSelectedAge(previousSelections.selectedAge)
//     setSelectedGender(previousSelections.selectedGender)
//     setSelectedVision(previousSelections.selectedVision)
//     setSelectedName(previousSelections.selectedName)
//     setForm(previousSelections.selectedForm)
//     didMount.current = true;

// }, []);

// useEffect(() => {
//   if (!didMount.current){
//       return;
//   }
//   localStorage.setItem("formSelections", JSON.stringify({responses: responses,
//       selectedRole: selectedRole,
//       selectedExperience: selectedExperience,
//       selectedAge: selectedAge,
//       selectedGender: selectedGender,
//       selectedVision: selectedVision,
//       selectedName: selectedName,
//       selectedForm: selectedForm}))

// }, [responses, selectedRole, selectedExperience, selectedAge, selectedGender, selectedVision, selectedName, selectedForm])


  // the useEffect is responsible for fetching form data from the backend when the formID changes
  useEffect(() => {
    const fetchFormData = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:5001/api/get_form/${formID}`);
          if (response.status === 200 && response.data.status === 'success') {
            const formData = response.data.form;
            console.log('Form data:', formData);
            setTitle(formData.formName || "Untitled Form");
            setQuestions(formData.questions || []);
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.error('Form not found:', error.response.data.message);
            // Handle form not found (e.g., show notification to the user)
          } else {
            console.error('Error fetching form data:', error);
            // Handle other errors (e.g., show notification to the user)
          }
        }
      };

    if (formID) {
      fetchFormData();
    }
  }, [formID]); // Only re-run the effect if formID changes

  // create function for detecting them filling in answers
  const handleInputChange = (questionId: number, value: string) => {
    // this handles
    setResponses({ ...FormData, [questionId]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // fix this
      const response = await axios.post(`${HOSTNAME}/api/responses`, {
        formID,
        responses: FormData,
        // Include additional data if needed (e.g., user info)
      });
      if (response.status === 200 && response.data && response.data.status === 'success') {
        // Handle success, maybe redirect to a success page
        history.push('/success');
      } else {
        // Handle failure
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error
    }
  };


  if (!form) {
    return <div>Loading...</div>;
  }
  // fix this 
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

  );
;

export default ViewForm;


