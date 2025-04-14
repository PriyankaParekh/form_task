import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function ThankYou() {
  const navigate = useNavigate();

  function handleNavigate() {
    localStorage.removeItem('FormData');
    localStorage.removeItem('FormSubmitted');
    navigate('/');
  }

  useEffect(() => {
    const savedFormData = JSON.parse(localStorage.getItem("FormSubmitted")) || false;
      if(!savedFormData){
        navigate('/');
      }
  }, [navigate]);

  return (
    <div className="content flex h-screen justify-center items-center">
      <div className="wrapper-1">
        <div className="wrapper-2">
          <h1 className="h1">THANK YOU !</h1>
          <p className="text-uppercase">Thanks for Submitting Form </p>
          <button onClick={handleNavigate} className="bg-blue-500 hover:bg-blue-700 uppercase text-white font-bold py-2 px-4 my-5 rounded-sm shadow-lg">
          Submit Another Response?
        </button>
          <Link to='/details'><h6 className="text-uppercase">Wanna see your information?</h6></Link>
        </div>
      </div>
    </div>
  );
}

export default ThankYou;
