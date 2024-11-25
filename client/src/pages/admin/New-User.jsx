"use client";
import React, { useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUser,
  FaIdCardAlt,
  FaHome,
  FaBuilding,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../store/auth";
import { Link, useNavigate } from "react-router-dom";

const AddNewUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [hostel, setHostel] = useState("");
  const [password, setPassword] = useState("");
  const { API } = useAuth();
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case "password":
        setShowPassword(!showPassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate password fields
    if (password !== confirmPassword) {
      toast.error("Password and confirm password do not match.");
      return;
    }

    try {
      const response = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          password,
          roomNumber,
          hostelName: hostel,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to register new user");
        return;
      }

      const data = await response.json();
      toast.success(data.msg || "Registration Successful");
      setUsername("");
      setRoomNumber("");
      setHostel("");
      setPassword("");
      setConfirmPassword("");
      navigate(`/admin/hostellers`);
    } catch (error) {
      toast.error("An error occurred during registration.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-300 to-red-300 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-indigo-800">
          Register New User
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Create a new account by filling in the information below.
        </p>

        <form onSubmit={handleRegister}>
          <div className="space-y-6">
            <div className="bg-indigo-100 p-4 rounded-lg">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-indigo-700 mb-1"
              >
                <FaIdCardAlt className="inline mr-2" /> Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-3 py-2 border border-indigo-300 rounded-md bg-white text-indigo-800"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
            <div className="bg-indigo-100 p-4 rounded-lg">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-indigo-700 mb-1"
              >
                <FaUser className="inline mr-2" /> Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full px-3 py-2 border border-indigo-300 rounded-md bg-white text-indigo-800"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>

            <div className="bg-pink-100 p-4 rounded-lg">
              <label
                htmlFor="roomNumber"
                className="block text-sm font-medium text-pink-700 mb-1"
              >
                <FaHome className="inline mr-2" /> Room Number
              </label>
              <input
                type="text"
                id="roomNumber"
                name="roomNumber"
                className="w-full px-3 py-2 border border-pink-300 rounded-md bg-white text-pink-800"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="Enter your room number"
              />
            </div>

            <div className="bg-purple-100 p-4 rounded-lg">
              <label
                htmlFor="hostel"
                className="block text-sm font-medium text-purple-700 mb-1"
              >
                <FaBuilding className="inline mr-2" /> Hostel
              </label>
              <input
                type="text"
                id="hostel"
                name="hostel"
                className="w-full px-3 py-2 border border-purple-300 rounded-md bg-white text-purple-800"
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
                placeholder="Enter your hostel"
              />
            </div>

            <div className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 text-red-600">
                Set Password
              </h2>
              <div className="border-t border-red-400 mb-6"></div>

              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-green-700 mb-1"
                  >
                    <FaLock className="inline mr-2" /> Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className="w-full px-3 py-2 border border-green-300 rounded-md pr-10 bg-white text-green-800"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => togglePasswordVisibility("password")}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="text-green-500" />
                      ) : (
                        <FaEye className="text-green-500" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-blue-700 mb-1"
                  >
                    <FaLock className="inline mr-2" /> Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      className="w-full px-3 py-2 border border-blue-300 rounded-md pr-10 bg-white text-blue-800"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => togglePasswordVisibility("confirm")}
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="text-blue-500" />
                      ) : (
                        <FaEye className="text-blue-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <Link to={`/admin/hostellers`}>
              <button
                type="button"
                className="px-6 py-3 border border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              className="px-6 py-3 border border-red-500 rounded-full text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewUser;
