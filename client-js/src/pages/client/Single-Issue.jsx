import React, { useState, useEffect } from "react";
import {
  FaExclamationTriangle,
  FaCheck,
  FaComment,
  FaTrash,
} from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link,useParams,useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../store/auth";


const GrievanceView = () => {
  const { id,user } = useParams(); // Get the single issue ID from the URL params
  const navigate = useNavigate(); // Initialize router for navigation
  const [grievance, setGrievance] = useState(null); // Initialize state to hold grievance data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const [category, setCategory] = useState(null);
  const {API} = useAuth();

  useEffect(() => {
    const fetchGrievance = async () => {
      try {
        const response = await fetch(
          `${API}/api/user/get-issue/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch grievance data");
        }
        const data = await response.json();
        setGrievance(data.document); // Set the fetched grievance data from document
        setCategory(data.category);
      } catch (error) {
        setError(error.message); // Set error message if fetch fails
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };

    fetchGrievance(); // Call the fetch function
  }, [id]); // Dependency array includes singleIssueId

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

  // Assuming `grievance.createdAt` is in a valid date format like ISO string
  const isOlderThanTwoDays = () => {
    const grievanceDate = new Date(grievance.createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate - grievanceDate;
    const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000; // Two days in milliseconds
    return timeDifference >= twoDaysInMilliseconds;
  };

  const handleResolve = async () => {

    const confirmed = window.confirm(
      "Are you sure you want to Resolved this grievance?"
    );

    if (confirmed) {
      try {
        const response = await fetch(
          `${API}/api/user/update-issue/${id}`,
          {
            method: "PATCH",
            body: JSON.stringify({ status: "Resolved" })
          }
        );

        if (!response.ok) {
          toast.error("Failed to Resolved grievance");
        }

        // Optionally, redirect or update state after deletion
        setGrievance({ ...grievance, status: "Resolved" });
        toast.success("Grievance Resolved successfully!");
        navigate(`/client/dashboard`); // Redirect to grievances list or home page
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    }

  };

  const handleEscalate = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to Escalate this grievance?"
    );

    if (confirmed) {
      try {
        const response = await fetch(
          `${API}/api/user/update-issue/${id}`,
          {
            method: "PATCH",
            body: JSON.stringify({ status: "Urgent" })
          }
        );

        if (!response.ok) {
          toast.error("Failed to Escalate grievance");
        }

        // Optionally, redirect or update state after deletion
        toast.success("Grievance Escalate successfully!");
        navigate(`/client/dashboard`); // Redirect to grievances list or home page
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  const handleAddComment = () => {
    // Implement add comment functionality
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this grievance?"
    );

    if (confirmed) {
      try {
        const response = await fetch(
          `${API}/api/user/delete-issue/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          toast.error("Failed to delete grievance");
        }

        // Optionally, redirect or update state after deletion
        toast.success("Grievance deleted successfully!");
        navigate(`/client/dashboard`); // Redirect to grievances list or home page
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if fetch fails
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
            Category:- {category}
          </p>
        </div>
        <div className="flex justify-end items-center mr-2">
          <Link to={`/client/dashboard`}>
            <button className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300">
              <IoMdArrowRoundBack className="mr-2" />
              Back to User Panel
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
          {
            grievance?.image &&(
              <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">Complaint Image:</h2>
                        <img
                          src={grievance?.image}
                          alt="Image Preview"
                          className="w-full h-auto rounded-lg border border-gray-300"
                        />
                      </div>
            )
          }
          <div className="mb-6">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${grievance.status === "Resolved"
                ? "bg-green-200 text-green-800"
                : grievance.status === "Not Processed"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-blue-200 text-blue-800"
                }`}
            >
              {grievance.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleResolve}
              className={`flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${grievance.status !== "Procced" ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out`}
              aria-label="Resolve Grievance"
              disabled={grievance.status !== "Procced"}
            >
              <FaCheck className="mr-2" /> Resolve Grievance
            </button>
            <button
              onClick={handleEscalate}
              className={`flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${isOlderThanTwoDays() && grievance?.status === "Not Processed" ? "bg-yellow-600 hover:bg-yellow-700" : "bg-gray-400 cursor-not-allowed"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-150 ease-in-out`}
              aria-label="Escalate Grievance"
              disabled={!(isOlderThanTwoDays() && grievance?.status === "Not Processed")}
            >
              <FaExclamationTriangle className="mr-2" /> Escalate Grievance
            </button>

            <button
              onClick={handleAddComment}
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              aria-label="Add Comment"
            >
              <FaComment className="mr-2" /> Add Comment
            </button>
            <button
              onClick={handleDelete}
              className={`flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${grievance.status !== "Not Processed" ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out`}
              aria-label="Delete Grievance"
              disabled={grievance.status !== "Not Processed"}
            >
              <FaTrash className="mr-2" /> Delete Grievance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrievanceView;