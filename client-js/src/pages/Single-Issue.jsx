import React, { useState, useEffect } from "react";
import {
  FaExclamationTriangle,
  FaCheck,
  FaComment,
  FaTrash,
} from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth";

const GrievanceViewPublic = () => {
  const { id } = useParams(); // Get the single issue ID from the URL params
  const navigate = useNavigate(); // Initialize router for navigation
  const [grievance, setGrievance] = useState(null); // State to hold grievance data
  const [category, setCategory] = useState(null); // State for category
  const [loading, setLoading] = useState(true); // State for loading status
  const { API } = useAuth();

  useEffect(() => {
    const fetchGrievance = async () => {
      try {
        const response = await fetch(`${API}/api/user/get-issue/${id}`);
        if (!response.ok) {
          toast.error("Failed to fetch grievance data");
        }
        const data = await response.json();
        setGrievance(data.document); // Set fetched grievance data
        setCategory(data.category); // Set category
      } catch (error) {
        toast.error("Failed to fetch grievance data"); // Set error message if fetch fails
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };

    fetchGrievance(); // Call the fetch function
  }, [id]); // Dependency array includes the issue ID

  // Formatting function for dates
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if the grievance is older than two days
  const isOlderThanTwoDays = () => {
    if (!grievance) return false;
    const grievanceDate = new Date(grievance?.createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - grievanceDate.getTime();
    const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000; // Two days in milliseconds
    return timeDifference >= twoDaysInMilliseconds;
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (!grievance) {
    return <div>No grievance found.</div>; // Fallback if no grievance is fetched
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <header className="bg-blue-600 py-6">
          <h1 className="text-3xl font-bold text-center text-white">
            Grievance Details
          </h1>
        </header>
        <div className="mb-6 text-center bg-yellow-200">
          <p className="text-2xl p-2 text-black font-bold ">
            Category: {category}
          </p>
        </div>
        <div className="flex justify-end items-center mr-2">
          <Link to="/">
            <button className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300">
              <IoMdArrowRoundBack className="mr-2" />
              Back to Home Page
            </button>
          </Link>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-4">
            Grievance ID: {grievance._id}
          </p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Complaints:</h2>
            <ul className="list-disc pl-5">
              {grievance.complaint.map((item, index) => (
                <li key={index} className="text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-600">
              User ID: {grievance.user._id}
            </span>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Created: {formatDate(grievance.createdAt)}
              </p>
              <p className="text-sm text-gray-600">
                Updated: {formatDate(grievance.updatedAt)}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                grievance.status === "Resolved"
                  ? "bg-green-200 text-green-800"
                  : grievance.status === "Not Processed"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-blue-200 text-blue-800"
              }`}
            >
              {grievance.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrievanceViewPublic;
