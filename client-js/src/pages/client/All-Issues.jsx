import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiEye,
  FiEdit,
  FiArrowLeft,
} from "react-icons/fi";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const GrievanceManagementUser = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, user, API } = useAuth();
  const [complaintData, setComplaintData] = useState([]);

  useEffect(() => {
    // Fetch complaints data from API when the user is available
    if (user) {
      getComplaints();
    }
  }, [user]);

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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  const filteredGrievances = complaintData.filter((grievance) => {
    const matchesSearch = grievance?._id
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || grievance.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const itemsPerPage = 15;
  const totalPages = Math.ceil(filteredGrievances.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredGrievances.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Added Back to Dashboard Button */}
      <div className="flex justify-end mb-4">
        <Link to={`/client/dashboard`}>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <FiArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </Link>
      </div>
      {loading && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                <AiOutlineLoading3Quarters className="text-white text-4xl animate-spin" />
              </div>
            )}
      <div className="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by grievance ID or keywords..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="relative w-full md:w-48">
          <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
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
        </div>

        <button
          onClick={handleRefresh}
          className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 transition-colors"
        >
          <FiRefreshCw className="inline-block" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grievance ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((grievance, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {grievance?._id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(grievance.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                    {grievance?.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {Array.isArray(grievance.complaint) ? (
                    <span className="text-gray-700">
                      {grievance.complaint.join(", ")}
                    </span>
                  ) : (
                    <span className="text-gray-700">{grievance.complaint}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Link to={`/client/singleissue/${grievance._id}/${user._id}`}>
                  <button
                    className="text-blue-600 hover:text-blue-900"
                    title="View Details"
                  >
                    <FiEye className="inline-block w-5 h-5" />
                  </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <AiOutlineArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex space-x-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <AiOutlineArrowRight className="w-5 h-5" />
          </button>
        </div>
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1} to{" "}
          {Math.min(endIndex, filteredGrievances.length)} of{" "}
          {filteredGrievances.length} entries
        </div>
      </div>
    </div>
  );
};

export default GrievanceManagementUser;
