// DefaultForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HOSTNAME } from '../HostName.tsx'
import {DEFAULT_ANSWERS} from './DefaultFormQuestion.tsx'

const DefaultForm = () => {
    // Assume there's a state to manage form responses, etc.
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

    useEffect(() => {
        if (localStorage.getItem("formSelections") == null || didMount.current) {
            return;
        }
        const previousSelections = JSON.parse(localStorage.getItem("formSelections") || "")
        setResponses(previousSelections.responses)
        setSelectedRole(previousSelections.selectedRole)
        setSelectedExperience(previousSelections.selectedExperience)
        setSelectedAge(previousSelections.selectedAge)
        setSelectedGender(previousSelections.selectedGender)
        setSelectedVision(previousSelections.selectedVision)
        setSelectedName(previousSelections.selectedName)
        didMount.current = true;

    }, []);

    useEffect(() => {
        if (!didMount.current){
            return;
        }
        localStorage.setItem("formSelections", JSON.stringify({responses: responses,
            selectedRole: selectedRole,
            selectedExperience: selectedExperience,
            selectedAge: selectedAge,
            selectedGender: selectedGender,
            selectedVision: selectedVision,
            selectedName: selectedName}))

    }, [responses, selectedRole, selectedExperience, selectedAge, selectedGender, selectedVision, selectedName])

    // Function to handle form submission
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // You would handle form submission here
        // For example, POST to backend
        try {
            const response = await fetch(`${HOSTNAME}/api/responses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Add 
                body: JSON.stringify({
                    ...responses, 
                    email: localStorage.getItem('email'),
                    name: selectedName, // Include the user's name in the submission
                    role: selectedRole, 
                    experienceLevel: selectedExperience, 
                    age: selectedAge, 
                    gender: selectedGender, 
                    vision: selectedVision,
                    formId: localStorage.getItem('currentFormId'),
                    formName: localStorage.getItem('formName')
                })
            });
            console.log("Response from server:", response);
        
            if (response.ok) {
                localStorage.removeItem("formSelections");
                console.log('Responses submitted successfully');
                // Navigate back to the home page or to a success page
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

    // Handlers for updating the state based on form inputs, etc.
    return (
        <form onSubmit={handleSubmit}>
        {/* Your form inputs and labels go here */}
        <button type="submit" className="...">
            Submit Responses
        </button>
        </form>
    )};

    return (
        <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Welcome to our survey</h1>
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
                            setSelectedName(e.target.value)
                        }}
                    />
                </label>
            </div>
            <div className="bg-white border-[1px] rounded-lg p-2 flex flex-col w-full">
                {/* Consistent styling with EditFormQuestion.tsx */}
                <label className="text-sm font-medium text-gray-700">
                    Please select your role:
                    <select 
                        name="role" 
                        className="p-2.5 text-sm border-[0px] bg-gray-100 rounded-md w-full"
                        value={selectedRole}
                        onChange={(e) => {
                            setSelectedRole(e.target.value)
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
                            setSelectedExperience(e.target.value)
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
                    {/* <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option> */}
                    </select>
                </label>
            </div>

            {/* Demographic questions */}
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
                            setSelectedAge(e.target.value)
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
                            setSelectedGender(e.target.value)
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
                            setSelectedVision(e.target.value)
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

            {/* Skin Lesion Diagnosis Questions*/}
            {DEFAULT_ANSWERS.map((question,idx) => (
            <div className="bg-white border-[1px] rounded-lg p-2 flex flex-col w-full mb-4">
                <label className="text-sm font-medium text-gray-700">
                    {idx+1}. What is the diagnosis for this skin lesion on the individual’s <em>{question.position}</em>?
                </label>
                {/* <img
                    // Replace with your path to image file 
                    src={question.image}
                    className="my-4"
                /> */}
                {/* Button to navigate to EyeTracking, placed after each image */}
                <button
                    type="button"
                    className="mb-4 bg-gradient-to-tr from-green-600 to-green-400 text-white font-bold text-lg py-2 px-4 rounded transition duration-300 ease-in-out"
                    onClick={() => navigate('/eyetracking', {state:{image:question.image,question_num:idx+1}})}
                >
                    Go to EyeTracking
                </button>

                <div className="flex flex-col">
                {question.answer_choices.map((answer,index) => (
                    <label className="inline-flex items-center">
                    <input 
                        type="radio" 
                        key={idx.toString()+index.toString()}
                        name={idx.toString()} 
                        value={responses[idx]} 
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
            }


            <button type="submit" className="mt-4 bg-gradient-to-tr from-blue-600 to-blue-400 text-white font-bold text-lg py-2 px-4 rounded transition duration-300 ease-in-out transform hover:translate-x-1 hover:shadow-lg">
                Submit Responses
            </button>
        </form>
    </div>
);
};

export default DefaultForm;
