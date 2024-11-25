"use client";
import React, { useState } from "react";
import { FaBed, FaRoad, FaUsers, FaGlassWhiskey } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdCellWifi } from "react-icons/md";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { TbUserShield } from "react-icons/tb";
import { useParams, Navigate, useNavigate,Link } from "react-router-dom";
const HostelIssuesCategory = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const params = useParams();

  // Define categories based on the params.categories value
  const categories =
    params.categories === "hostel"
      ? [
          {
            name: "Room",
            description: "Report issues with room facilities",
            icon: <FaBed className="text-4xl text-blue-500" />,
            route: `/client/${params.user}/issue/${params.categories}/room/form`,
          },
          {
            name: "Corridor",
            description: "Notify about corridor maintenance issues",
            icon: <FaRoad className="text-4xl text-green-500" />,
            route: `/client/${params.user}/issue/${params.categories}/corridor/form`,
          },
          {
            name: "Common Area",
            description: "Report concerns in shared spaces",
            icon: <FaUsers className="text-4xl text-purple-500" />,
            route: `/client/${params.user}/issue/${params.categories}/commonarea/form`,
          },
          {
            name: "Drinking Water",
            description: "Report issues related to drinking water supply",
            icon: <FaGlassWhiskey className="text-4xl text-teal-500" />,
            route: `/client/${params.user}/issue/${params.categories}/drinkingwater/form`,
          },
        ]
      : params.categories === "mess"
      ? [
          {
            name: "Food Quality",
            description: "Report issues regarding food quality",
            icon: <GiForkKnifeSpoon className="text-4xl text-orange-500" />,
            route: `/client/${params.user}/issue/${params.categories}/foodquality/form`,
          },
          {
            name: "Mess Owner",
            description: "Raise issues with the mess owner",
            icon: <FaUsers className="text-4xl text-red-500" />,
            route: `/client/${params.user}/issue/${params.categories}/foodowner/form`,
          },
        ]
      : params.categories === "facilities"
      ? [
          {
            name: "WiFi / Network",
            description: "Report issues with WiFi or network connectivity",
            icon: <MdCellWifi className="text-4xl text-blue-500" />,
            route: `/client/${params.user}/issue/${params.categories}/wifiissues/form`,
          },
        ]
      : params.categories === "security"
      ? [
          {
            name: "Safety & Disturbance",
            description: "Report safety or disturbance issues",
            icon: <TbUserShield className="text-4xl text-purple-600" />,
            route: `/client/${params.user}/issue/${params.categories}/security/form`,
          },
        ]
      : [];

  const handleRaiseGrievance = (category) => {
    setSelectedCategory(category);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    const categoryRoute = categories.find(
      (category) => category.name === selectedCategory
    )?.route;

    if (categoryRoute) {
      // Navigate to the corresponding category page
      navigate(categoryRoute);
    }

    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Hostel Issues</h1>
          <Link to={`/client/dashboard`}>
            <button className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300">
              <IoMdArrowRoundBack className="mr-2" />
              Back to User Panel
            </button>
          </Link>
        </div>
        <p className="text-xl text-gray-600 mb-8">
          Select a category to raise your grievance
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-center mb-4">{category.icon}</div>
                <h2 className="text-2xl font-semibold text-center mb-2">
                  {category.name}
                </h2>
                <p className="text-gray-600 text-center mb-4">
                  {category.description}
                </p>
                <button
                  onClick={() => handleRaiseGrievance(category.name)}
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                >
                  Raise a Grievance
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Confirm Grievance</h2>
            <p className="mb-6">
              Are you sure you want to raise a grievance for the{" "}
              {selectedCategory} category?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm} // Call handleConfirm on confirmation
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostelIssuesCategory;
