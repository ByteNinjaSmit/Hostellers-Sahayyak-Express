import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaUser,
  FaRegUserCircle,
  FaDoorOpen,
  FaBuilding,
  FaRegAddressCard,
  FaInfoCircle,
  FaEdit,
  FaCommentDots,
} from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { toast } from "react-toastify";

const GrievanceViewAdmin = () => {
  const { id } = useParams(); // Ensure proper type for useParams
  const [status, setStatus] = useState("Not Processed");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLog, setActionLog] = useState([]);
  const [complaintData, setComplaintData] = useState(null);
  const [category, setCategory] = useState(null);
  const { API, isHighAuth, isRector,user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchGrievance = async () => {
      try {
        const response = await fetch(`${API}/api/admin/get-issue/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch grievance data");
        }
        const data = await response.json();
        setComplaintData(data.document);
        setStatus(data.document.status);
        setCategory(data.category);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGrievance();
  }, [id]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleRemarksChange = (e) => {
    setRemarks(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (remarks.trim() === "") {
      alert("Please enter remarks before submitting.");
      return;
    }

    const actionTakenBy = user?.username;

    const newAction = {
      action: `Status updated to ${status}`,
      actionTakenBy, // Shorthand for { actionTakenBy: actionTakenBy }
      actionDate: new Date().toISOString(), // Full ISO date for better logging
      remarks: remarks.trim(),
    };

    // No need to update the action log state if you don't want to append the new action
    // setActionLog([newAction]); // If you want to reset the log to just the new action

    try {
      // Construct the body for the POST request
      const body = {
        actionLog: [newAction], // Send only the new action in the actionLog
        status, // Include the updated status
      };

      // Make the POST request to the API endpoint
      const response = await fetch(`${API}/api/admin/update-issue/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", // Set the correct content type
          // You can include authorization headers if needed, e.g.:
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
        body: JSON.stringify({
          actionLog: [newAction], // Send only the new action in the actionLog
          status,
        }), // Convert the body to JSON
      });

      if (!response.ok) {
        toast.error(response.error);
      }
      // Check if the request was successful
      if (response.ok) {
        const data = await response.json(); // Parse the response
        toast.success("Action successfully updated!");
        navigate("/admin/overview")
      } else {
        toast.error("Failed to update the issue");
      }
    } catch (error) {
      toast.error(error.message); // Display the error message using toast
      console.error("Error:", error);
    }
  };

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

  // Define status options based on the current status
  const getStatusOptions = (currentStatus) => {
    const statusHierarchy = [
      "Not Processed",
      "Urgent",
      "Cancelled",
      "Pending",
      "In Progress",
      "Procced",
      "Resolved",
    ];
    const currentIndex = statusHierarchy.indexOf(currentStatus);

    // Return options based on current status, excluding invalid selections
    return statusHierarchy.filter((option) => {
      if (currentStatus === "Cancelled" || currentStatus === "Not Resolved") {
        return true; // Block any status selection
      }
      //if (option === "Resolved" && currentStatus !== "Resolved") {
       // return true; // Show in dropdown but not selectable
      //}
      return option !== " "; // Exclude Resolved from dropdown if it is selected
    });
  };
  const getStatusStyles = (option) => {
    switch (option) {
      case "Cancelled":
        return "bg-red-200 text-red-900";
      case "Pending":
        return "bg-orange-200 text-orange-600";
      case "In Progress":
        return "bg-blue-200 text-blue-600";
      case "Procced":
        return "bg-green-200 text-green-600";
      case "Resolved":
        return "bg-green-300 text-green-900";
      case "Urgent":
        return "bg-red-200 text-red-600";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  // Determine if the action form should be visible
  const isActionFormVisible = () => {
    return !(status === "Cancelled" || status === "Not Resolved");
  };
  
  return (
    <div
      className="container mx-auto px-4 py-8 max-w-4xl"
      style={{
        backgroundImage: "linear-gradient(to bottom, #f0f4f8, #d9e2ec)",
      }}
    >
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
        <FaInfoCircle className="inline mr-2" />
        Grievance Detail
      </h1>
      <div className="flex justify-end items-center mr-2 mb-2">
        <Link to={`/admin/overview`}>
          <button className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300">
            <IoMdArrowRoundBack className="mr-2" />
            Back to Admin Overview
          </button>
        </Link>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {complaintData && (
        <>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                <FaRegAddressCard className="inline mr-2" />
                Complaint ID: {`${complaintData._id}`}
              </h2>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Complaints:
                </h3>
                <ul className="list-disc list-inside text-gray-600">
                  {complaintData.complaint.map((item, index) => (
                    <li key={index} className="text-gray-700">
                      <FaCommentDots className="inline mr-2 text-yellow-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-between bg-gray-100 p-4 rounded">
                <span
                  className={`text-lg font-semibold ${
                    complaintData.status === "Not Processed"
                      ? "text-yellow-500"
                      : complaintData.status === "Urgent"
                      ? "text-red-700"
                      : complaintData.status === "In Progress"
                      ? "text-blue-500"
                      : complaintData.status === "Pending"
                      ? "text-orange-600"
                      : complaintData.status === "Resolved"
                      ? "text-green-600"
                      : complaintData.status === "Proceeded"
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  <FaSpinner className="inline mr-1" />
                  Status: {complaintData.status}
                </span>
              </div>
              {complaintData?.image && (
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">
                    Complaint Image:
                  </h2>
                  <img
                    src={complaintData?.image}
                    alt="Image Preview"
                    className="w-full h-auto rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                <FaRegUserCircle className="inline mr-2 text-indigo-700" />
                User Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-gray-600">
                  <FaUser className="inline mr-2 text-indigo-700" />
                  <span className="font-medium">Username:</span>{" "}
                  {complaintData.user?.username}
                </div>
                <div className="text-gray-600">
                  <FaDoorOpen className="inline mr-2 text-pink-700" />
                  <span className="font-medium">Room Number:</span>{" "}
                  {complaintData.user?.room}
                </div>
                <div className="text-gray-600">
                  <FaBuilding className="inline mr-2 text-purple-700" />
                  <span className="font-medium">Hostel ID:</span>{" "}
                  {complaintData.user?.hostelId}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                <FaEdit className="inline mr-2 text-green-600" />
                Action Log
              </h2>
              <div className="space-y-4">
                {complaintData?.actionLog?.map((log, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-blue-600">
                        {log?.action}
                      </span>
                      <span className="text-sm text-gray-500">
                        Created: {formatDate(complaintData.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-gray-600">
                        Action by: {log?.actionTakenBy}
                      </div>

                      <span className="text-sm text-gray-500">
                        Updated: {formatDate(complaintData.updatedAt)}
                      </span>
                    </div>

                    {log.remarks && (
                      <div className="text-gray-600 mt-1">
                        Remarks: {log?.remarks}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                <FaCheckCircle className="inline mr-2 text-blue-600" />
                Admin Action
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="status"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-200 ease-in-out ${
                      status === "Cancelled"
                        ? "bg-red-200 text-red-800 cursor-not-allowed"
                        : status === "Not Resolved"
                        ? "bg-yellow-200 text-yellow-800 cursor-not-allowed"
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                    value={status}
                    onChange={handleStatusChange}
                    disabled={
                      status === "Cancelled" || status === "Not Resolved"|| status === "Resolved"
                    }
                  >
                    {getStatusOptions(status)?.map((option, index) => (
                      <option
                        key={index}
                        value={option}
                        disabled={
                          (option === "Resolved" ) ||
                          option === "Not Processed" ||
                          option === "Urgent" || option === "Not Resolved"
                        }
                        className={`${getStatusStyles(option)}`} // Apply styles dynamically based on option
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="remarks"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    <FaCommentDots className="inline mr-2 text-blue-600" />
                    Remarks
                  </label>
                  <textarea
                    id="remarks"
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={remarks}
                    onChange={handleRemarksChange}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none ${
                    (status === status) === "Not Resolved"
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={status === "Not Resolved"}
                >
                  Submit Action
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GrievanceViewAdmin;
