import React, { useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUser,
  FaHome,
  FaIdCardAlt,
  FaRegUserCircle ,
  FaBuilding,
} from "react-icons/fa";

import { toast } from 'react-toastify';
import { Link,useParams,useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth";


const EditProfilePage = () => {
  const { user,API } = useAuth();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate(); // Navigation hook to redirect on successful login
  const params = useParams();
  const [imageBase64, setImageBase64] = useState(null);

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case "old":
        setShowOldPassword(!showOldPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // Validate password fields
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await fetch(
        `${API}/api/auth/change/password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newpassword: newPassword,
            username: user?.username,
            id: user?._id,
          }),
        }
      );

      if (!response.ok) {
        // throw new Error("Failed to update password");
        toast.error("Failed to update password");
      }
      if (response.ok) {
        const data = await response.json();
        toast.success(data.msg || "Login Successful");
        // Optionally, reset the form or perform other actions
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        navigate(`/client/dashboard`);
      }
    } catch (error) {
      toast.error("An error occurred while updating the password.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-300 to-red-300 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-indigo-800">
          Edit Profile
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Update your profile information and password below.
        </p>

        <form onSubmit={handleUpdateProfile}>
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
                value={user?.name}
                disabled
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
                value={user?.username}
                disabled
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
                value={user?.room}
                disabled
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
                value={user?.hostelId}
                disabled
              />
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-blue-700 mb-1"
              >
                <FaRegUserCircle  className="inline mr-2" /> User Image
              </label>
              {user?.face_image && (
                <div className="justify-center m-auto">
                  <img
                    src={user?.face_image}
                    alt="Uploaded preview"
                    className="w-32 h-32 object-cover mt-2 justify-center"
                  />
                </div>
              )}
            </div>
            <div className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 text-red-600">
                Change Password
              </h2>
              <div className="border-t border-red-400 mb-6"></div>

              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <label
                    htmlFor="oldPassword"
                    className="block text-sm font-medium text-red-700 mb-1"
                  >
                    <FaLock className="inline mr-2" /> Old Password
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      id="oldPassword"
                      name="oldPassword"
                      className="w-full px-3 py-2 border border-red-300 rounded-md pr-10 bg-white text-red-800"
                      placeholder="Enter your old password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => togglePasswordVisibility("old")}
                    >
                      {showOldPassword ? (
                        <FaEyeSlash className="text-red-500" />
                      ) : (
                        <FaEye className="text-red-500" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-green-700 mb-1"
                  >
                    <FaLock className="inline mr-2" /> New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      className="w-full px-3 py-2 border border-green-300 rounded-md pr-10 bg-white text-green-800"
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => togglePasswordVisibility("new")}
                    >
                      {showNewPassword ? (
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
                    <FaLock className="inline mr-2" /> Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      className="w-full px-3 py-2 border border-blue-300 rounded-md pr-10 bg-white text-blue-800"
                      placeholder="Confirm your new password"
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
            <Link to={`/client/dashboard`}>
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
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;