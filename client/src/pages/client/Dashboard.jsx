"use client";

import React, { useEffect, useState } from "react";
import {
  FaUserCog,
  FaBuilding,
  FaUtensils,
  FaTools,
  FaShieldAlt,
  FaExclamationCircle,
  FaCheckCircle,
  FaPencilAlt,
  FaQuestionCircle,
  FaHeadset,
  FaUser,
  FaBook,
  FaDoorOpen,
} from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Link,NavLink,useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth";


const Dashboard = () => {
  const { isLoggedIn, user,API } = useAuth();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [complaintData, setComplaintData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Set user data on component mount
    setUserId(user?._id);
    // Fetch complaints data from API when the user is available
      getComplaints();

  }, [isLoggedIn,user]);

  

  // Function to fetch complaints
  const getComplaints = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/user/get-all-issue/${user._id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch complaints");
      }
      const data = await response.json();
      setComplaintData(data); // Set fetched complaints
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const grievanceCategories = [
    {
      icon: <FaUserCog />,
      name: "Profile",
      description: "Click to view and edit your profile.",
      link: `/client/edit-profile`,
      buttonText: "Edit",
    },
    {
      icon: <FaBuilding />,
      name: "Hostel Issues",
      description:
        "Report problems related to rooms, common-area, or maintenance of hostel.",
      link: `/client/${userId}/issue/hostel`,
      buttonText: "Raise a Grievance",
    },
    {
      icon: <FaUtensils />,
      name: "Mess / Tiffin Issues",
      description: "Raise concerns about issues related to mess/tiffin.",
      link: `/client/${userId}/issue/mess`,
      buttonText: "Raise a Grievance",
    },
    {
      icon: <FaTools />,
      name: "Issues in Facilities",
      description:
        "Report issues with facilies, utilities, or amenities such as drinking water , wifi connectivity.",
      link: `/client/${userId}/issue/facilities`,
      buttonText: "Raise a Grievance",
    },
    {
      icon: <FaShieldAlt />,
      name: "Security and Other",
      description: "Notify about security issues or safety hazards.",
      link: `/client/${userId}/issue/security`,
      buttonText: "Raise a Grievance",
    },
    {
      icon: <FaPencilAlt />,
      name: "Action",
      description: "Click if problem isn't resolved.",
      link: "/client/grievance/action",
      buttonText: "Raise a Grievance",
    },
    {
      icon: <FaPencilAlt />,
      name: "Action",
      description: "View Your Last or All Complaint History.",
      link: "/client/complaints",
      buttonText: "Raise a Grievance",
    },
    {
      icon: <FaCheckCircle />,
      name: "Track Complaint",
      description: "Click to check the status of your complaint.",
      link: "/contact?case=track",
      buttonText: "Track",
    },
    {
      icon: <FaBook />,
      name: "About Us",
      description: "Click to see about us.",
      link: "/contact?case=about",
      buttonText: "View",
    },
    {
      icon: <FaQuestionCircle />,
      name: "Faq",
      description: "Click to see frequently asked questions.",
      link: "/contact?case=faq",
      buttonText: "View",
    },
    {
      icon: <FaHeadset />,
      name: "Help and Support",
      description: "Click to get help.",
      link: "/contact?case=contact",
      buttonText: "View",
    },
  ];

  const statistics = [
    {
      label: "Total Grievances",
      value: complaintData.length,
      icon: <FaExclamationCircle />,
    },
    {
      label: "Resolved",
      value: complaintData.filter(
        (grievance) => grievance.status === "Resolved"
      ).length,
      icon: <FaCheckCircle />,
    },
    {
      label: "Pending",
      value: complaintData.filter(
        (grievance) => grievance.status === "Not Processed"
      ).length,
      icon: <FaPencilAlt />,
    },
  ];

  const quickLinks = [
    { label: "FAQ", icon: <FaQuestionCircle />, link: "/faq" },
    { label: "Contact Support", icon: <FaHeadset />, link: "/support" },
    { label: "Policy Guidelines", icon: <FaBook />, link: "/policies" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-blue-600">
          Dashboard
        </h1>
        <p className="text-xl text-gray-600 text-center">
          Welcome back, {user?.username} to the Hostellers Grievance System
        </p>
        {/* Show here username Hostek id Room Number using icons and justify even */}
        <div className="sm:w-[55%] mr-auto ml-auto flex justify-evenly items-center text-xl space-x-4 mt-4">
          <div className="flex items-center font-medium text-indigo-700">
            <FaUser className="inline mr-2" />
            <span className=" text-indigo-800 border-indigo-300">
              {user?.username}
            </span>
          </div>
          <div className="flex items-center font-medium text-purple-700">
            <FaBuilding className="inline mr-2" />
            <span className=" border-purple-300 text-purple-800">
              {user?.hostelId}
            </span>
          </div>
          <div className="flex items-center text-pink-700 font-medium">
            <FaDoorOpen className="inline mr-2" />
            <span className="border-pink-300 text-pink-800">
              {user?.room}
            </span>
          </div>
        </div>
      </header>

      {/* Loading component */}
      {loading && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <AiOutlineLoading3Quarters className="text-white text-4xl animate-spin" />
        </div>
      )}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">
          Grievance Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {grievanceCategories.map((category, index) => (
            <div
              key={index}
              className="flex flex-col justify-between bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div>
                <div className="text-4xl mb-4 text-blue-500">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
              </div>
              <button
                className="self-center bg-blue-500 w-[50%] text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                onClick={() => navigate(category.link)}
              >
                {category.buttonText}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Show Collected complaints */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">
          Recent Grievances
        </h2>
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Complaint Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {complaintData.length > 0 ? (
                complaintData.map((grievance, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-100 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-bold">
                      {grievance.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">
                      {Array.isArray(grievance.complaint) ? (
                        <ul className="list-disc list-inside">
                          {grievance.complaint.map((item, idx) => (
                            <li key={idx} className="text-gray-700">
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-700">
                          {grievance.complaint}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-sm leading-5 font-semibold rounded-full ${
                          grievance.status === "Resolved"
                          ? "bg-green-300 text-green-900"
                          : grievance.status === "Urgent"
                          ? "bg-red-200 text-red-800"
                          : grievance.status === "Cancelled"
                          ? "bg-orange-200 text-orange-800"
                          : grievance.status === "Pending"
                          ? "bg-orange-200 text-orange-800"
                          : grievance.status === "In Progress"
                          ? "bg-blue-200 text-blue-600"
                          : grievance.status === "Procced"
                          ? "bg-green-200 text-green-600"
                          : "bg-yellow-200 text-yellow-800"

                          }`}
                      >
                        {grievance.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {new Date(grievance.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/client/singleissue/${grievance._id}/${user._id}`}
                      >
                        <button className="text-blue-600 hover:text-blue-900">
                          View Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-6 py-4 text-center text-gray-500"
                    colSpan={5}
                  >
                    No recent grievances found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">
          Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statistics.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md flex items-center"
            >
              <div className="text-4xl mr-4 text-blue-500">{stat.icon}</div>
              <div>
                <p className="text-xl font-semibold">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">
          Quick Links
        </h2>
        <div className="flex flex-wrap gap-4">
          {quickLinks.map((link, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md flex items-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-3xl mr-4 text-blue-500">{link.icon}</div>
              <div>
                <p className="text-xl font-semibold">
                  <Link to={link.link}>{link.label}</Link>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;