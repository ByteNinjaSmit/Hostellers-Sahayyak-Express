"use client";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Search, Save, RefreshCw } from "lucide-react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";
import { useAuth } from "../../store/auth";
import { Link, useNavigate } from "react-router-dom";

const statusOptions = [
  { value: "present", label: "Present", color: "bg-green-500" },
  { value: "absent", label: "Absent", color: "bg-red-500" },
  { value: "leave", label: "Leave", color: "bg-yellow-500" },
  { value: "late", label: "Late", color: "bg-blue-500" },
];

export default function NewAttendance() {
  const { user, API, isLoggedIn, isRector } = useAuth();
  const navigate = useNavigate();
  const [mockStudents, setMockStudents] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("All Rooms");
  const [searchQuery, setSearchQuery] = useState("");
  const [attendanceData, setAttendanceData] = useState({});
  const [isFloorOpen, setIsFloorOpen] = useState(false);
  const [attendanceFilter, setAttendanceFilter] = useState("");
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  // Fetching Students Particular Hostel
  const getmockStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/admin/get-hostel-users/${user?.hostelId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch complaints");
      }
      const data = await response.json();
      setMockStudents(data); // Set fetched complaints
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  // Extracting unique room numbers
  const uniqueRooms = new Set(mockStudents.map((student) => student?.room));
  const rooms = Array.from(uniqueRooms);
  // Update the filteredStudents logic
  const filteredStudents = mockStudents.filter((student) => {
    const isInSelectedRoom =
      selectedRoom === "All Rooms" || student?.room === selectedRoom;
    const isStatusMatch = statusFilter
      ? attendanceData[student?._id] === statusFilter
      : true;
    const isAttendanceMatch =
      attendanceFilter === "attended"
        ? attendanceData[student?._id]
        : attendanceFilter === "remaining"
        ? !attendanceData[student?._id]
        : true;

    return (
      isInSelectedRoom &&
      (student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student?.room.includes(searchQuery)) &&
      isStatusMatch &&
      isAttendanceMatch
    );
  });

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleBulkAction = (status) => {
    const updatedData = {};
    filteredStudents.forEach((student) => {
      updatedData[student?._id] = status;
    });
    setAttendanceData((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };

  const handleClearAll = () => {
    const clearedData = {};
    filteredStudents.forEach((student) => {
      clearedData[student?._id] = "";
    });
    setAttendanceData((prev) => ({
      ...prev,
      ...clearedData,
    }));
  };

  const calculateSummary = () => {
    const summary = {
      Present: 0,
      Absent: 0,
      Leave: 0,
      Late: 0,
    };

    Object.values(attendanceData)?.forEach((status) => {
      // Safely increment the correct status counter
      if (status in summary) {
        summary[status++];
      }
    });

    return summary;
  };

  const summary = calculateSummary();
  //   When click on submit log data in console
  const handleSaveAttendance = async () => {
    // Create the attendance array with structured objects
    const attendanceArray = Object.entries(attendanceData).map(
      ([studentId, status]) => ({
        studentId,
        status,
      })
    );

    // Create the final attendance log object
    const attendanceLog = {
      date: selectedDate, // The selected date
      attendanceList: attendanceArray, // The attendance array created above
    };

    // Log the attendance data to the console
    try {
      const response = await fetch(`${API}/api/admin/save-attendance-all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: attendanceLog.date,
          hostel: user?.hostelId, // Adjust this value as needed
          students: attendanceLog.attendanceList.map((item) => ({
            student: item.studentId,
            status: item.status.charAt(0).toUpperCase() + item.status.slice(1), // Capitalize the first letter
            remarks: "", // Add remarks if needed, or leave empty
          })),
        }),
      });

      if (!response.ok) {
        toast.error("Failed to submit attendance");
      }
      if (response.ok) {
        const result = await response.json();
        toast.success(`${result.message}`);
      }
    } catch (error) {
      console.log("Error submitting attendance:", error);
    } finally {
      navigate(`/admin/overview-attendance`);
    }
  };
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Customize the alert message
      event.preventDefault();
      event.returnValue = "If you reload, your data will be lost!";
    };

    // Add the event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    getmockStudents();
  }, [user,isRector]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6 lg:space-y-8">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl lg:text-4xl">
          Hostel Attendance Management
        </h1>
        {loading && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <AiOutlineLoading3Quarters className="text-white text-4xl animate-spin" />
          </div>
        )}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)} // Keep this for potential future use
            className="w-full rounded-md border border-gray-300 px-3 py-2 sm:w-auto"
            max={selectedDate} // Restrict the selection to today
            min={selectedDate} // Restrict the selection to today
            readOnly // Make it read-only to prevent user modification
          />

          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setIsRoomOpen(!isRoomOpen)}
              className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-auto"
            >
              {selectedRoom}
              {isRoomOpen ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-2 h-4 w-4" />
              )}
            </button>
            {isRoomOpen && (
              <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg sm:w-48">
                <ul className="max-h-60 overflow-auto rounded-md py-1 text-base">
                  <li
                    onClick={() => {
                      setSelectedRoom("All Rooms"); // Set to "All Rooms"
                      setIsRoomOpen(false);
                    }}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  >
                    All Rooms
                  </li>
                  {rooms.map((room) => (
                    <li
                      key={room}
                      onClick={() => {
                        setSelectedRoom(room);
                        setIsRoomOpen(false);
                      }}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    >
                      {room}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {/* Status Filter Dropdown */}
          <select
            onChange={(e) => setStatusFilter(e.target.value)}
            value={statusFilter}
            className="w-full rounded-md border border-gray-300 px-3 py-2 sm:w-auto"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="relative w-full sm:w-auto">
            <select
              onChange={(e) => setAttendanceFilter(e.target.value)}
              value={attendanceFilter}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">All Students</option>
              <option value="attended">Attended Students</option>
              <option value="remaining">Remaining Students</option>
            </select>
          </div>
        </div>

        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="rounded-lg bg-white p-4 shadow-md sm:p-6">
          <div className="mb-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <h2 className="text-xl font-semibold text-gray-800">
              Attendance Sheet Of {user?.hostelId}
            </h2>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              <select
                onChange={(e) => handleBulkAction(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:w-auto"
              >
                <option value="">Mark All As</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleClearAll}
                className="w-full rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 sm:w-auto"
              >
                Clear All
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b text-left text-sm font-medium text-gray-500">
                  <th className="pb-2 pr-4">Name</th>
                  <th className="pb-2 pr-4">Room</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 pr-4">{student?.name}</td>
                    <td className="py-3 pr-4">{student?.room}</td>
                    <td className="py-3">
                      <select
                        value={attendanceData[student?._id] || ""}
                        onChange={(e) =>
                          handleAttendanceChange(student?._id, e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 px-2 py-1 sm:w-auto"
                      >
                        <option value="">Select</option>
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {attendanceData[student?._id] && (
                        <span
                          className={`ml-2 inline-block h-3 w-3 rounded-full ${
                            statusOptions.find(
                              (o) => o.value === attendanceData[student?._id]
                            )?.color
                          }`}
                        ></span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col space-y-4 rounded-lg bg-white p-4 shadow-md sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:p-6">
          <div className="grid grid-cols-2 gap-4 sm:flex sm:space-x-4 lg:space-x-8">
            {Object.entries(summary).map(([status, count]) => (
              <div key={status} className="text-center">
                <div className="text-2xl font-bold lg:text-3xl">{count}</div>
                <div className="text-sm text-gray-500 capitalize lg:text-base">
                  {status}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleSaveAttendance}
            className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 sm:w-auto"
          >
            <Save className="mr-2 h-5 w-5" />
            Save Attendance
          </button>
        </div>
      </div>
    </div>
  );
}
