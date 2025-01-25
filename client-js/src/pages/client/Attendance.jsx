import React, { useEffect, useState } from "react"
import { FiCheckCircle, FiClock, FiCheck, FiX, FiFolder } from "react-icons/fi"
import { AiOutlineCalendar } from "react-icons/ai"
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import axios from "axios";
import { useAuth } from "../../store/auth";
import { Link } from "react-router-dom";

export default function StudentAttendancePage() {
  const { user, API } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [currentDate, setCurrentDate] = useState(null);
  const [isMarked, setIsMarked] = useState(false);
  const [isPerfectTime, setIsPerfectTime] = useState(false);

  // Navigation
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(30);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = attendanceRecords.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil(attendanceRecords.length / entriesPerPage);

  const markAttendance = () => {
    const newRecord = {
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
      status: "Present",
    }
    setAttendanceRecords([newRecord, ...attendanceRecords])
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  const getAttendance = async () => {
    try {
      const response = await axios.get(`${API}/api/user/get-attendance-record/${user._id}`);
      if (response.status === 200) {
        const data = response.data;
        // console.log(data);
        setAttendanceRecords(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAttendance();
    // Current Date
    if (currentDate === null) {
      const now = new Date();

      // Get IST by adding 5 hours 30 minutes to UTC
      const offset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
      const indianTime = new Date(now.getTime() + offset);

      // Set time to 00:00:00.000 for the IST date
      indianTime.setUTCHours(0, 0, 0, 0);

      // Convert to ISO string and ensure the format matches the required 'T00:00:00.000Z'
      const isoString = indianTime.toISOString(); // Format: '2025-01-25T00:00:00.000Z'

      setCurrentDate(isoString);
    }
  }, [])



  // console.log(user._id);
  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  useEffect(() => {
    const foundRecord = attendanceRecords.find(
      (record) => record.date === currentDate
    );

    if (foundRecord && foundRecord.status === "Present") {
      setIsMarked(true);
    }

    // Get current time in India (IST)
    const now = new Date();
    const indiaOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const indiaTime = new Date(now.getTime() + indiaOffset);

    // Get the hours and minutes in IST
    const hours = indiaTime.getHours();
    const minutes = indiaTime.getMinutes();

    // Check if current time is between 8:30 PM (20:30) and 9:30 PM (21:30)
    if ((hours === 20 && minutes >= 30) || (hours === 21 && minutes <= 30)) {
      setIsPerfectTime(true);
    } else {
      setIsPerfectTime(false);
    }
  }, [attendanceRecords, currentDate]);


  return (
    <div className="container mx-auto px-4 py-8">
      {showSuccessMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md flex items-center justify-between animate-fadeIn">
          <span className="flex items-center">
            <FiCheckCircle className="mr-2" />
            Attendance marked successfully!
          </span>
          <button onClick={() => setShowSuccessMessage(false)} className="text-green-700 hover:text-green-900">
            <FiX />
          </button>
        </div>
      )}

      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 shadow-sm">View Attendance</h1>
      {
        (!isMarked && isPerfectTime ) && (
          <div className="flex justify-center mb-8">
            <Link to={`/client/take-attendance`}>
              <button
                // onClick={markAttendance}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md inline-flex items-center transition duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                aria-label="Mark Today's Attendance"
              >
                <FiCheckCircle className="mr-2" />
                Mark Today's Attendance
              </button>
            </Link>
          </div>
        )
      }


      {currentEntries.length > 0 ? (
        <div className="overflow-x-auto bg-gray-100 rounded-lg shadow-md">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">
                  <div className="flex items-center">
                    <AiOutlineCalendar className="mr-2" />
                    Date
                  </div>
                </th>
                <th className="py-3 px-6 text-left">
                  <div className="flex items-center">
                    <FiCheckCircle className="mr-2" />
                    Status
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {attendanceRecords.map((record, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 hover:bg-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <div className="flex items-center">
                      <AiOutlineCalendar className="mr-2" />
                      <span className="font-medium">{formatDate(record.date)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span
                      className={`${record.status === "Present" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        } py-1 px-3 rounded-full text-xs flex items-center w-max`}
                    >
                      {record.status === "Present" ? <FiCheck className="mr-1" /> : <FiX className="mr-1" />}
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10">
          <FiFolder className="mx-auto text-gray-400 text-5xl mb-4" />
          <p className="text-gray-600 mb-4">No attendance records found.</p>
          <button
            onClick={markAttendance}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md inline-flex items-center transition duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiCheckCircle className="mr-2" />
            Mark Attendance Now
          </button>
        </div>
      )}

      <div className="mt-6 flex flex-col md:flex-row justify-end items-center gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#3A0CA3]">
            Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, attendanceRecords.length)} of {attendanceRecords.length} results
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md bg-[#F0F1F3] hover:bg-[#F0F1F3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <MdNavigateBefore size={20} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md bg-[#F0F1F3] hover:bg-[#F0F1F3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <MdNavigateNext size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

