import React, { useState, useEffect } from "react";
import { FaUser, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { BiError } from "react-icons/bi";
import { MdCheckCircle } from "react-icons/md";

const AttendanceSystem = () => {
  const [status, setStatus] = useState("offline");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAttendance = (action) => {
    setLoading(true);
    setError("");
    setSuccess("");

    setTimeout(() => {
      setLoading(false);
      setStatus(action);
      setSuccess(`Successfully marked: ${action}`);
    }, 1500);
  };

  const handleError = () => {
    setError("Face not detected. Please position yourself properly.");
    setTimeout(() => setError(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Face Recognition Attendance</h1>
            <div className="flex items-center space-x-2 text-gray-300">
              <FaClock className="text-xl" />
              <span className="text-lg">{currentTime}</span>
            </div>
          </div>

          {/* Camera Feed */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <img
              src="images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
              alt="Camera Feed"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-4 border-blue-500 w-64 h-64 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Status Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-300">
                <FaUser className="text-xl" />
                <span>Status:</span>
                <span className={`font-semibold ${status === "in" ? "text-green-400" : status === "out" ? "text-red-400" : "text-yellow-400"}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-300">
                <FaMapMarkerAlt className="text-xl" />
                <span>Location:</span>
                <span className="font-semibold text-blue-400">Main Office</span>
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-300">
                <FaClock className="text-xl" />
                <span>Last Action:</span>
                <span className="font-semibold text-purple-400">{currentTime}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => handleAttendance("in")}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
              aria-label="Clock In"
            >
              Clock In
            </button>
            <button
              onClick={() => handleAttendance("out")}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50"
              aria-label="Clock Out"
            >
              Clock Out
            </button>
            <button
              onClick={() => handleAttendance("break")}
              disabled={loading}
              className="bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 disabled:opacity-50"
              aria-label="Start Break"
            >
              Break Start
            </button>
            <button
              onClick={() => handleAttendance("return")}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50"
              aria-label="End Break"
            >
              Break End
            </button>
          </div>

          {/* Status Messages */}
          {loading && (
            <div className="text-center p-4 bg-blue-900/50 text-blue-300 rounded-lg animate-pulse">
              Processing...
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center space-x-2 p-4 bg-red-900/50 text-red-300 rounded-lg">
              <BiError className="text-xl" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center justify-center space-x-2 p-4 bg-green-900/50 text-green-300 rounded-lg">
              <MdCheckCircle className="text-xl" />
              <span>{success}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceSystem;