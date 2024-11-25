import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaChevronDown,
  FaEye,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import AdminSidebar from "../../components/Admin-Sidebar";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth";

export default function HostelAttendanceOverview() {
  const [date, setDate] = useState(null);
  const [hostel, setHostel] = useState("All");
  const [availableHostels, setAvailableHostels] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const { user, isLoggedIn, API } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isAttendanceTakenToday, setIsAttendanceTakenToday] = useState(false);
  const [isRector, setIsRector] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleNotifications = () => setNotificationsOpen((prev) => !prev);
  // const [isEditable, setIsEditable] = useState(false);

  // Fetch data From API
  const getAllAttendance = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/admin/get-all-attendance`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Check the status to handle different error cases
        const errorMessage =
          response.status === 404
            ? "Attendance data not found."
            : "An error occurred while fetching attendance data.";
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setAttendanceData(data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      // toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllAttendance();
  }, [API]);

  const filteredData = attendanceData?.filter(
    (entry) =>
      (hostel === "All" || entry.hostel === hostel) &&
      (!date || entry.date === format(date, "yyyy-MM-dd"))
  );

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

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      //   hour: "2-digit",
      //   minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check Current is Avalable or not
  useEffect(() => {
    const checkAttendanceForToday = () => {
      if (!attendanceData || !user?.hostelId) return;

      const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

      // Check if there's an attendance record for today and user's hostel
      const hasTodayAttendance = attendanceData?.some(
        (record) =>
          record?.hostel === user?.hostelId && record.date.startsWith(today)
      );

      setIsAttendanceTakenToday(hasTodayAttendance);
    };

    checkAttendanceForToday();
  }, [attendanceData, user?.hostelId]);

  // Setting Unique Hostel Only Those Are present
  useEffect(() => {
    // Extract unique hostel names from attendanceData
    const uniqueHostels = Array.from(
      new Set(attendanceData?.map((record) => record.hostel))
    );
    setAvailableHostels(uniqueHostels);
  }, [attendanceData]);

  // Edit Limit
  const isEditable = (createdAt) => {
    const createdAtDate = new Date(createdAt);
    const currentTime = new Date();
    const timeDifference =
      (currentTime.getTime() - createdAtDate.getTime()) / (1000 * 60 * 60); // difference in hours
    return timeDifference <= 2;
  };

  return (
    <div className="min-h-screen flex bg-gray-100 ">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />
      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300`}
      >
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
        <header className="mx-auto mt-4 text-start justify-start">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">
            Hostel Attendance Overview
          </h1>
          <p className="text-sm sm:text-base text-center text-gray-600">
            Manage and view attendance for all hostels.
          </p>
          {loading && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
              <AiOutlineLoading3Quarters className="text-white text-4xl animate-spin" />
            </div>
          )}
        </header>
        {isRector && (
          <div className="mb-6 sm:mb-8 lg:mb-12 p-4">
            <Link
              to={`/admin/overview-attendance/take-attendance`}
            >
              <button
                disabled={isAttendanceTakenToday}
                className={`w-full sm:w-auto bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105
              ${isAttendanceTakenToday ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <FaCalendarAlt className="mr-2" />
                {isAttendanceTakenToday
                  ? "Attendance Already Taken"
                  : "Take Today's Attendance"}
              </button>
            </Link>
          </div>
        )}

        <div className="mb-6 sm:mb-8 lg:mb-12 space-y-4 sm:space-y-0 sm:flex sm:items-end sm:space-x-4 p-6 ">
          {!isRector && (
            <div className="flex-1">
              <label
                htmlFor="hostel-select"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Hostel
              </label>
              <div className="relative">
                <select
                  id="hostel-select"
                  className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  value={hostel}
                  onChange={(e) => setHostel(e.target.value)}
                >
                  <option value="All">All Hostels</option>
                  {availableHostels.map((hostelName) => (
                    <option key={hostelName} value={hostelName}>
                      {hostelName}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FaChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          )}

          <div className="flex-1">
            <label
              htmlFor="date-select"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Date
            </label>
            <div className="relative">
              <button
                id="date-select"
                className="block w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                {date ? format(date, "PPP") : "Pick a date"}
              </button>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FaCalendarAlt className="h-4 w-4" />
              </div>
              {showCalendar && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200">
                  <div className="p-2">
                    <input
                      type="date"
                      className="w-full p-2 border rounded"
                      onChange={(e) => {
                        setDate(new Date(e.target.value));
                        setShowCalendar(false);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <button className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center transition duration-300 ease-in-out">
            <FaCalendarAlt className="mr-2" />
            Apply Filters
          </button>
        </div>
        <div className="flex flex-col p-6 max-h-full">
          <div className="overflow-x-auto ">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-300">
                <tr>
                  <th className="py-2 px-3 sm:px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  {!isRector && (
                    <th className="py-2 px-3 sm:px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Hostel
                    </th>
                  )}
                  <th className="py-2 px-3 sm:px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Present
                  </th>
                  <th className="py-2 px-3 sm:px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Absent
                  </th>
                  <th className="py-2 px-3 sm:px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Leave
                  </th>
                  <th className="py-2 px-3 sm:px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Late
                  </th>
                  <th className="py-2 px-3 sm:px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(isRector
                  ? filteredData?.filter(
                      (entry) => entry?.hostel === user?.hostelId
                    )
                  : filteredData
                )?.map((entry, index) => (
                  <tr key={index}>
                    <td className="py-2 px-3 sm:px-4 whitespace-nowrap text-sm">
                      {formatDate(entry.date)}
                    </td>

                    {/* Show hostel column only if user is not a rector */}
                    {!isRector && (
                      <td className="py-2 px-3 sm:px-4 whitespace-nowrap text-sm">
                        {entry.hostel}
                      </td>
                    )}

                    <td className="py-2 px-3 sm:px-4 whitespace-nowrap text-sm">
                      {
                        entry?.students?.filter((s) => s.status === "Present")
                          .length
                      }
                    </td>
                    <td className="py-2 px-3 sm:px-4 whitespace-nowrap text-sm">
                      {
                        entry?.students?.filter((s) => s.status === "Absent")
                          .length
                      }
                    </td>
                    <td className="py-2 px-3 sm:px-4 whitespace-nowrap text-sm">
                      {
                        entry?.students?.filter((s) => s.status === "Leave")
                          .length
                      }
                    </td>
                    <td className="py-2 px-3 sm:px-4 whitespace-nowrap text-sm">
                      {
                        entry?.students?.filter((s) => s.status === "Late")
                          .length
                      }
                    </td>

                    <td className="py-2 px-3 sm:px-4 whitespace-nowrap text-sm">
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        {/* View Button */}
                        <Link
                          to={`/admin/overview-attendance/view-attendance/${entry?._id}`}
                        >
                          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs flex items-center justify-center transition duration-300 ease-in-out">
                            <FaEye className="mr-1" /> View
                          </button>
                        </Link>

                        {/* Edit Button with conditional disabling */}
                        <Link
                          to={`/admin/overview-attendance/edit-attendance/${entry._id}`}
                          passto
                        >
                          <button
                            disabled={!isEditable(entry.createdAt)}
                            className={`bg-green-500 text-white font-bold py-1 px-2 rounded text-xs flex items-center justify-center transition duration-300 ease-in-out ${
                              !isEditable(entry.createdAt)
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-green-700"
                            }`}
                          >
                            <FaEdit className="mr-1" /> Edit
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 p-6">
          <div className="flex space-x-2">
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l flex items-center transition duration-300 ease-in-out">
              <FaChevronLeft className="mr-2" /> Previous
            </button>
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r flex items-center transition duration-300 ease-in-out">
              Next <FaChevronRight className="ml-2" />
            </button>
          </div>
          <div className="text-sm text-gray-500">
            Showing 1 to {filteredData?.length} of {filteredData?.length}{" "}
            entries
          </div>
        </div>
      </div>
    </div>
  );
}
