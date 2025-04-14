import React, { useState, useEffect } from "react";
import { obj } from "../../utils/obj";
import { useNavigate } from "react-router-dom";

function Details() {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    try {
      const savedFormData = JSON.parse(localStorage.getItem("FormData")) || {};
      const submittedForm = JSON.parse(localStorage.getItem("FormSubmitted")) || false;
      if(!submittedForm){
        navigate('/');
      } else{
        navigate('/details');
      }
      setFormData(savedFormData?.formData);
    } catch (error) {
      console.log("Error retrieving form data:", error);
    }
  }, []);

  const navigate=useNavigate();

  function handleClick() {
    localStorage.removeItem('FormData');
    localStorage.removeItem('FormSubmitted');
    navigate('/');
  }

  function handleBack() {
    navigate('/thankyou');
  }

  return (
    <div className="max-w-2xl text-lg text-gray-600 mx-auto mt-8">
      <h1 className="text-center font-medium uppercase text-2xl mb-4">YOUR INFORMATION</h1>
      <div className="space-y-8">
        {formData ? (
          obj?.steps?.slice(0, -1).map(
            (
              step,
              index // Exclude the last step
            ) => (
              <div key={index} className="border rounded p-4">
                <h2 className="text-xl font-medium mb-2">{step.title}</h2>
                <ul>
                  {obj?.fields[step?.step]?.map((field, fieldIndex) => (
                    <li key={fieldIndex} className="flex items-center mb-2">
                      <span className="mr-2">{field?.label}:</span>{" "}
                      <span>{formData[field?.name]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )
        ) : (
          <p className="text-lg">No form data available.</p>
        )}

      </div>
      <div>
      <button onClick={handleBack} className="float-start bg-slate-500 hover:bg-slate-700 uppercase text-white font-bold py-2 px-4 my-10 rounded-sm shadow-lg">
          Back
        </button>
        <button onClick={handleClick} className="float-end bg-blue-500 hover:bg-blue-700 uppercase text-white font-bold py-2 px-4 my-10 rounded-sm shadow-lg">
          Submit Another Response?
        </button>
        </div>
    </div>
  );
}

export default Details;
