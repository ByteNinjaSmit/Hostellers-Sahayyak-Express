import React from "react";
import { FaQuestionCircle, FaInfoCircle, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../store/auth";

const HeroSection = () => {
  const {isLoggedIn } = useAuth();
  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-green-400 min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }}></div>
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="w-full lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Resolve Your Grievances Seamlessly
            </h1>
            <p className="text-xl sm:text-2xl text-white mb-8">
              An easy and secure way to submit, track, and resolve all your hostel-related issues.
            </p>
            {isLoggedIn ? (
              <Link to={`/client/dashboard`}>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                  Submit Your Complaint Now
                </button>
              </Link>
            ) : (
              <Link to="/login">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                  Submit Your Complaint Now
                </button>
              </Link>
            )}
            <div className="mt-8 flex justify-center lg:justify-start space-x-6">
              <Link to="contact" className="flex items-center text-white hover:text-yellow-300 transition duration-300">
                <FaQuestionCircle className="mr-2" />
                How It Works
              </Link>
              <Link to="faq" className="flex items-center text-white hover:text-yellow-300 transition duration-300">
                <FaInfoCircle className="mr-2" />
                View FAQ
              </Link>
              <Link to="/contact" className="flex items-center text-white hover:text-yellow-300 transition duration-300">
                <FaEnvelope className="mr-2" />
                Contact Us
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <img
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Grievance System Illustration"
              className="max-w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;