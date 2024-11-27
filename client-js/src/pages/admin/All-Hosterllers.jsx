import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaLock,
  FaIdCardAlt,
  FaUser,
  FaDoorOpen,
  FaBuilding,
  FaRegAddressCard,
} from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";
import AdminSidebar from "../../components/Admin-Sidebar";
import { Link } from "react-router-dom";
import { useAuth } from "../../store/auth";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { API } = useAuth();
  const itemsPerPage = 50; // Number of users to display per page

  const notifications = [
    { id: 1, message: "New complaint received (GR005)" },
    { id: 2, message: "Urgent issue reported in Hostel Block A" },
    { id: 3, message: "Complaint GR002 has been resolved" },
  ];

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleNotifications = () => setNotificationsOpen((prev) => !prev);

  // Fetch users from the API
  const fetchUsers = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/admin/get-all-user`);
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data);
      setTotalPages(Math.ceil(data.totalCount / itemsPerPage)); // Calculate total pages
    } catch (error) {
      console.error("Error fetching users:", error);
      // You might want to show a notification or message to the user here
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  // Handlers for user actions
  const handleView = (user) => {
    setSelectedUser(user);
    setIsViewing(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setLoading(true);
      try {
        // Simulated delete API call
        const response = await fetch(`${API}/api/admin/delete-user/${userId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          toast.error("Faild To Delete error");
        }
        if (response.ok) {
          fetchUsers(currentPage);
          toast.success(`User Successfully Deleted`);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        // Handle error (e.g., show notification)
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async (editedUse) => {
    setLoading(true);
    try {
      // Simulated save API call
      const response = await fetch(`/api/auth/admin/users/${editedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUser),
      });
      if (!response.ok) throw new Error("Failed to save user");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === editedUser._id ? editedUser : user
        )
      );
      setIsEditing(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
      // Handle error (e.g., show notification)
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
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
                  {notifications.map((notification) => (
                    <a
                      key={notification.id}
                      to="#"
                      className="flex items-center px-4 py-3 hover:bg-gray-100 -mx-2"
                    >
                      <p className="text-gray-600 text-sm mx-2">
                        {notification.message}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4">
          <h1 className="text-2xl font-bold mb-4">User Management</h1>
          <Link to={`/admin/new-hosteller`}>
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add New Hosteller
            </button>
          </Link>

          {/* Loading Fucntion Animation Spinner */}

          {loading && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
              <AiOutlineLoading3Quarters className="text-white text-4xl animate-spin" />
            </div>
          )}
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">User ID</th>
                <th className="py-2 px-4 text-left">Username</th>
                <th className="py-2 px-4 text-left">Hostel</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="py-2 px-4">{user._id}</td>
                  <td className="py-2 px-4">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleView(user)}
                    >
                      {user?.username}
                    </button>
                  </td>
                  <td className="py-2 px-4">{user.hostelId}</td>
                  <td className="py-2 px-4">
                    {/* <button
                      className="mr-2 text-blue-600 hover:text-blue-800"
                      onClick={() => handleView(user)}
                    >
                      <FaEye />
                    </button> */}
                    <Link to={`/admin/edit-hosteller/${user?._id}`}>
                      <button className="mr-2 text-green-600 hover:text-green-800">
                        <FaEdit />
                      </button>
                    </Link>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(user?._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* User Details Modal */}
          {isViewing && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white rounded-lg p-4 w-1/2">
                <h2 className="text-xl font-bold mb-2">User Details</h2>
                <p>
                  <FaRegAddressCard className="inline mr-2" />
                  <strong>ID:</strong> {selectedUser?._id}
                </p>
                <p>
                  <FaIdCardAlt className="inline mr-2 text-indigo-700" />
                  <strong>Name:</strong> {selectedUser?.name}
                </p>
                <p>
                  <FaUser className="inline mr-2 text-indigo-700" />
                  <strong>Username:</strong> {selectedUser?.username}
                </p>
                <p>
                  <FaDoorOpen className="inline mr-2 text-pink-700" />
                  <strong>Room Number:</strong> {selectedUser?.room}
                </p>
                <p>
                  <FaBuilding className="inline mr-2 text-purple-700" />
                  <strong>Hostel:</strong> {selectedUser?.hostelId}
                </p>
                {selectedUser?.face_image && (<img className="mt-2" src={selectedUser?.face_image} width={50} height={50} alt="" />)}
                <button
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => setIsViewing(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Edit User Modal */}
          {isEditing && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white rounded-lg p-4 w-1/2">
                <h2 className="text-xl font-bold mb-2">Edit User</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave(selectedUser);
                  }}
                >
                  <div className="mb-4">
                    <label className="block mb-1">Username:</label>
                    <input
                      type="text"
                      value={selectedUser?.username}
                      onChange={(e) =>
                        selectedUser &&
                        setSelectedUser({
                          ...selectedUser,
                          username: e.target.value,
                        })
                      }
                      className="border rounded w-full px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Hostel:</label>
                    <input
                      type="text"
                      value={selectedUser?.hostelId}
                      onChange={(e) =>
                        selectedUser &&
                        setSelectedUser({
                          ...selectedUser,
                          hostel: e.target.value,
                        })
                      }
                      className="border rounded w-full px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Room Number:</label>
                    <input
                      type="text"
                      value={selectedUser?.room}
                      onChange={(e) =>
                        selectedUser &&
                        setSelectedUser({
                          ...selectedUser,
                          hostel: e.target.value,
                        })
                      }
                      className="border rounded w-full px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Password</label>
                    <input
                      type="text"
                      value={selectedUser?.hostel}
                      onChange={(e) =>
                        selectedUser &&
                        setSelectedUser({
                          ...selectedUser,
                          hostel: e.target.value,
                        })
                      }
                      className="border rounded w-full px-2 py-1"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserManagement;
