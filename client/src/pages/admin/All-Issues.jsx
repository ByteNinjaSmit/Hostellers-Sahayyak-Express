"use client";
import React, { useEffect, useState } from "react";
import { FaSearch, FaFilter, FaSync, FaSort } from "react-icons/fa";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import AdminSidebar from "../../components/Admin-Sidebar";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth";

const GrievanceManagementSystem = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user, isLoggedIn, API } = useAuth();
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [hostel, setHostel] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleNotifications = () => setNotificationsOpen((prev) => !prev);
  const [isRector, setIsRector] = useState(false);

  // Set userId and isAdmin when user data changes
  useEffect(() => {
    if (isLoggedIn && user) {
      // Check if the user is an admin
      if (user.isRector || user.isHighAuth) {
        if (user.isRector) {
          setIsRector(true);
          // console.log("this is Rector");
        }
      }
    } else {
      setIsRector(false); // Clear admin status if not logged in
    }
  }, [isLoggedIn, user]);

  const getComplaints = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/admin/get-all-issue`);
      if (!response.ok) {
        throw new Error("Failed to fetch complaints");
      }
      const data = await response.json();
      setGrievances(data); // Set fetched complaints
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getComplaints();
  }, [user]);

  // console.log(`This is Rector HostelId: ${user?.hostelId}`);

  const itemsPerPage = 50;
  const totalPages = Math.ceil(grievances.length / itemsPerPage);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);
  const handleHostelChange = (e) => setHostel(e.target.value);
  const handlePageChange = (page) => setCurrentPage(page);

  const filteredGrievances = grievances.filter((grievance) => {
    return (
      (grievance._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grievance.user?.username
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      (category === "All" || grievance.category === category) &&
      (status === "All" || grievance.status === status) &&
      (hostel === "All" || grievance?.user?.hostelId === hostel)
    );
  });

  const isOlderThanTwoDaysGrievances = (grievance) => {
    const grievanceDate = new Date(grievance.createdAt).getTime(); // Get the time in milliseconds
    const currentDate = new Date().getTime(); // Get the current time in milliseconds
    const timeDifference = currentDate - grievanceDate;
    const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000; // Two days in milliseconds
    return timeDifference >= twoDaysInMilliseconds;
  };

  const paginatedGrievances = filteredGrievances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const refreshData = (e) => {
    e.preventDefault();
    getComplaints();
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-100 to-green-100">
      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md border-b">
          <button
            className="text-gray-500 focus:outline-none lg:hidden"
            onClick={toggleSidebar}
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6H20M4 12H20M4 18H11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="relative">
            <button
              className="flex items-center text-gray-500 focus:outline-none"
              onClick={toggleNotifications}
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50">
                <div className="py-2">
                  <div className="px-4 py-2 text-gray-800 font-semibold bg-gray-100">
                    Notifications
                  </div>
                  {/* Notification items */}
                </div>
              </div>
            )}
          </div>
        </header>
        <div className="mx-auto mt-4 text-start justify-start p-6">
          <h3 className="text-3xl font-medium text-gray-700 text-start">
            Grievance Management : Overview
          </h3>
        </div>

        {loading && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <AiOutlineLoading3Quarters className="text-white text-4xl animate-spin" />
          </div>
        )}

        <div className="flex-1 container mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-wrap justify-between items-center mb-4 space-y-4 md:space-y-0">
              <div className="relative w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search by ID or Name"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 w-full md:w-auto"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <div className="flex flex-wrap space-x-0 space-y-4 md:space-x-4 md:space-y-0 w-full md:w-auto">
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 w-full md:w-auto"
                  value={category}
                  onChange={handleCategoryChange}
                >
                  <option value="All">All Categories</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Mess / Tiffin">Mess / Tiffin</option>
                  <option value="Facility">Facility</option>
                  <option value="Security">Security</option>
                </select>
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 w-full md:w-auto"
                  value={status}
                  onChange={handleStatusChange}
                >
                  <option value="All">All Statuses</option>
                  <option value="Not Processed">Not Processed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Proceeded">Proceeded</option>
                  <option value="Not Resolved">Not Resolved</option>
                  <option value="Resolved">Resolved</option>
                </select>
                {!isRector && (
                  <select
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 w-full md:w-auto"
                    value={hostel}
                    onChange={handleHostelChange}
                  >
                    <option value="All">All Hostels</option>
                    <option value="G1">G1</option>
                    <option value="G2">G2</option>
                    <option value="G3">G3</option>
                    <option value="G4">G4</option>
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="A3">A3</option>
                    <option value="A4">A4</option>
                    <option value="A5">A5</option>
                    <option value="A6">A6</option>
                    <option value="A7">A7</option>
                  </select>
                )}
                <div className="flex flex-wrap space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center w-full md:w-auto">
                    <FaFilter className="mr-2" /> Apply Filters
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center w-full md:w-auto"
                    onClick={refreshData}
                  >
                    <FaSync className="mr-2" /> Refresh
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">
                      Grievance ID{" "}
                      <FaSort className="inline ml-1 cursor-pointer" />
                    </th>
                    <th className="px-4 py-2 text-left">
                      Category <FaSort className="inline ml-1 cursor-pointer" />
                    </th>
                    {!isRector && (
                      <th className="px-4 py-2 text-left">
                        Hostel Id{" "}
                        <FaSort className="inline ml-1 cursor-pointer" />
                      </th>
                    )}
                    {isRector && (
                      <th className="px-4 py-2 text-left">
                        Room No{" "}
                        <FaSort className="inline ml-1 cursor-pointer" />
                      </th>
                    )}
                    <th className="px-4 py-2 text-left">
                      User Name{" "}
                      <FaSort className="inline ml-1 cursor-pointer" />
                    </th>
                    <th className="px-4 py-2 text-left">
                      Status <FaSort className="inline ml-1 cursor-pointer" />
                    </th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {(isRector
                    ? paginatedGrievances.filter((grievance) => {
                        // const isOlderThanTwoDays = new Date(grievance?.createdAt) > new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
                        const isOlderThanTwoDays =
                          isOlderThanTwoDaysGrievances(grievance);
                        const hostelIdMatch =
                          grievance.user?.hostelId === user?.hostelId;
                        const shouldShow =
                          (grievance?.status === "Not Processed" &&
                            isOlderThanTwoDays) ||
                          grievance?.status === "Resolved" ||
                          grievance?.status === "Urgent";
                        const match = shouldShow && hostelIdMatch;
                        return match;
                      })
                    : paginatedGrievances
                  ).map((grievance, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{grievance._id}</td>
                      <td className="px-4 py-2">{grievance.category}</td>
                      {!isRector && (
                        <td className="px-4 py-2">
                          {grievance.user?.hostelId}
                        </td>
                      )}
                      {isRector && (
                        <td className="px-4 py-2">{grievance?.user?.room}</td>
                      )}
                      <td className="px-4 py-2">{grievance.user?.username}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
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
                              : "bg-yellow-200 text-yellow-800" // Default case
                          }`}
                        >
                          {grievance.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <Link to={`/admin/single-issue/view/${grievance?._id}`}>
                          <button className="text-blue-500 hover:text-blue-700">
                            View
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrievanceManagementSystem;
