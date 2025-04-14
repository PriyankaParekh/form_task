import React, { useState, useEffect } from "react";
import { ProgressBar } from "../progressbar";
import { StepsComponent } from "../stepscomponent";
import { obj } from "../../utils/obj";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DynamicForm } from "../dynamic-form";

function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState(null);
  const [err, setErr] = useState({});
  const [data, setData] = useState({});
  const navigate = useNavigate();  

  useEffect(() => {
    async function fetchConfigData() {
      const savedData = JSON.parse(localStorage.getItem("FormData")) || {};
      console.log(savedData);
      if (!obj || obj === undefined || Object.keys(obj).length === 0) {
        setConfig(null);
        return;
      }
      setConfig(obj);
      if (savedData.currentStep) {
        setCurrentStep(savedData.currentStep);
      } else {
        setCurrentStep(0);
      }
      setData(savedData.formData || {});
    }
    fetchConfigData();
    const formSubmitted = localStorage.getItem("FormSubmitted")||false;
    if (formSubmitted === "true") {
      navigate("/thankyou");
    }
  }, []);


  useEffect(() => {
    // Function to set default values in data state
    function setDefaultValues() {
      if (!obj || !obj?.fields || !obj?.steps[currentStep]) return;
      
      const defaultFormData = {};
      const stepFields = obj?.fields[obj?.steps[currentStep]?.step];

      if (!stepFields) return;

      stepFields.forEach((field) => {
        if (field?.default_value) {
          defaultFormData[field?.name] = field?.default_value;
        }
      });

      setData(prevData => ({
        ...prevData,
        ...defaultFormData,
      }));
    }

    // Call the function to set default values when the component mounts or the current step changes
    setDefaultValues();
  }, []);

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "firstName":
      case "lastName":
        return /^[A-Za-z ]+$/.test(value);
      case "phone":
        return /^[0-9 ]{10}$/.test(value);
      case "email":
        return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(value);
      case "userBio":
        return /^[A-Za-z0-9.,\w-\n ]+$/.test(value);
      default:
        return true; 
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fieldNames = Object.keys(data);
    const newErrors = {};
    let isValid = true;
  
    fieldNames?.forEach((fieldName) => {
      const value = data[fieldName];
      const trimmedValue = typeof value === 'string' ? value.trim() : value;
      if (!validateField(fieldName, trimmedValue)) {
        newErrors[fieldName] = true;
        isValid = false;
      }
      setData((prevData) => ({
        ...prevData,
        [fieldName]: trimmedValue,
      }));
    });
  
    const requiredFields = config?.fields[
      config?.steps[currentStep]?.step
    ]?.filter((field) => field.required);
    requiredFields?.forEach((field) => {
      if (!data[field?.name]?.trim()) {
        newErrors[field?.name] = true;
        isValid = false;
      }
    });
  
    if (isValid) {
      if (currentStep < config?.steps?.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        toast("Form submitted successfully!");
        localStorage.setItem("FormSubmitted", "true");
        navigate("/thankyou");
      }
      localStorage.setItem(
        "FormData",
        JSON.stringify({ currentStep: currentStep, formData: data })
      );
    } else {
      setErr(newErrors);
      toast("Invalid data");
    }
  };
  

  const handleInputChange = (fieldName, value) => {
    setData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
    setErr((prevErrors) => ({
      ...prevErrors,
      [fieldName]: false,
    }));
  };

  const generateFormFields = () => {
    if (!config) return null;
    const step = config?.steps[currentStep];
    const fields = config?.fields[step?.step];

    return fields?.map((field, index) => {
      return (
        <DynamicForm
        key={index}
        field={field}
        data={data}
        handleInputChange={handleInputChange}
        err={err}
        setData={setData}
      />
      );
    });
  };

  const progressPercentage = ((currentStep + 1) / config?.steps?.length) * 100;
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      <div className="grid uppercase text-center place-items-center">
        {!config && (
          <div className="grid place-items-center h-screen">
            <h5 className="text-2xl font-semibold text-gray-600">
              YOU HAVE NOTHING TO SEE
            </h5>
          </div>
        )}
        {config && config?.steps[currentStep] && (
          <>
            <ProgressBar progressPercentage={progressPercentage} />
            <StepsComponent
              currentPage={currentStep + 1}
              totalPages={config?.steps?.length}
              config={config}
              data={data}
              setData={setData}
            />
            <div className="divvv grid place-items-center w-full">
              <div className="border formDataDiv border-gray-300 p-6 rounded">
                <h2 className="text-2xl text-gray-800 font-bold mb-4">
                  {config?.steps[currentStep]?.title}
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  {config?.steps[currentStep]?.description}
                </p>
                <form onSubmit={handleSubmit} role="form" className="mx-auto max-w-md">
                  {generateFormFields()}

                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className={`mt-5 float-start bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ${
                      currentStep === 0
                        ? "disabled:opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={currentStep === 0}
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className="mt-5 float-right bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    {currentStep === config?.steps?.length - 1
                      ? "Submit"
                      : "Next"}
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Home;
