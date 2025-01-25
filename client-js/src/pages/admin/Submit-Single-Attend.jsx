import { useState, useRef, useEffect } from "react";
import {
  FaCamera,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import * as faceapi from "face-api.js";
import { useAuth } from "../../store/auth";
import Webcam from "react-webcam";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGeolocated } from "react-geolocated";
import axios from "axios";
const FaceRecognitionAttendanceAdmin = () => {
  const { API, user } = useAuth();
  const [isCameraActive, setIsCameraActive] = useState(false);
  // const [locationStatus, setLocationStatus] = useState("checking");
  const [recognitionStatus, setRecognitionStatus] = useState("waiting");
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  // --------------------------
  // Location Within range Logic in Specefic diameter
  //-----------------------
  const [isWithinRange, setIsWithinRange] = useState(false);
  const [currentDistance, setCurrentDistance] = useState(null);
  const [locationStatus, setLocationStatus] = useState("unknown");
  const [targetLatitude, setTargetLatitude] = useState(null);
  const [targetLongitude, setTargetLongitude] = useState(null);
  const [allowedRadius, setAllowedRadius] = useState(null);
// console.log(user.hostelId);

  const getLocation = async()=>{
    try {
      const response = await axios.get(`${API}/api/admin/get-hostel-location/${user.hostelId}`)
      const data = response.data;
      setTargetLatitude(data.latitude);
      setTargetLongitude(data.longitude);
      setAllowedRadius(data.radius);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    getLocation();
  },[])

  // const targetLatitude = 19.488729; //This is Limit
  // const targetLongitude = 74.926598; // This Is Limit
  // const allowedRadius = 50; // 50 Meter Radius

  // Haversine formula to calculate distance between two coordinates
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Distance in meters
  };

  // // Get user's current position

  // Function to verify user's location
  const {
    coords, // Latitude and Longitude
    isGeolocationAvailable,
    isGeolocationEnabled,
    errorMessage,
  } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true, // Disable high accuracy mode for faster results
      timeout: 2000, // Timeout in milliseconds (set to 3 seconds for quicker response)
      maximumAge: 0, // Prevent cached location usage
    },
    watchPosition: true, // Get location only once
  });

  // Check if the user is within range
  const verifyLocation = () => {
    if (coords) {
      const { latitude, longitude } = coords;
      const distance = haversineDistance(
        latitude,
        longitude,
        targetLatitude,
        targetLongitude
      );
      setCurrentDistance(distance);

      if (distance <= allowedRadius) {
        setLocationStatus("Verified");
        setIsWithinRange(true);
      } else {
        setLocationStatus("Out of range");
        setIsWithinRange(false);
      }
    } else {
      setLocationStatus("Location not available.");
      setIsWithinRange(false);
    }
  };

  //----------------------
  // Face Recognation Model
  // --------------------
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [userImage, setUserImage] = useState(null);
  const [isDetected, setIsDetected] = useState(false);
  const [isFaceMatched, setIsFaceMatched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModelLoad, setIsModelLoad] = useState(false);
  const [userImageGot, setUserImageGot] = useState(false);

  const { userId, hostelId, date } = useParams();

  // Check in range or not

  // Fetch user image from the server
  useEffect(() => {
    const getUserImage = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API}/api/user/get-image/${userId}`);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const imageData = await response.json();
        setUserImage(imageData[0].face_image);
        setUserImageGot(true);
      } catch (error) {
        console.error("Error fetching user image:", error);
      } finally {
        setLoading(false);
      }
    };
    getUserImage();
  }, [user, API]);

  // Run facial recognition after the user image is fetched
  const runFacialRecognition = async () => {
    // Load models for face detection
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.ageGenderNet.loadFromUri("/models"),
    ]);

    console.log("Models Loaded Successfully");

    // Load the user image for reference (convert base64 to image)
    if (userImageGot) {
      const refFace = await faceapi.fetchImage(userImage);

      // Create a FaceMatcher instance
      const refFaceAiData = await faceapi
        .detectAllFaces(refFace)
        .withFaceLandmarks()
        .withFaceDescriptors();
      const faceMatcher = new faceapi.FaceMatcher(refFaceAiData, 0.5);

      // Capture and compare frames continuously
      const intervalId = setInterval(async () => {
        // Capture current webcam image
        const currentWebcamImage = webcamRef.current.getScreenshot();
        if (currentWebcamImage) {
          const facesToCheck = await faceapi.fetchImage(currentWebcamImage);

          // Detect faces and descriptors for the captured webcam image
          const facesToCheckAiData = await faceapi
            .detectAllFaces(facesToCheck)
            .withFaceLandmarks()
            .withFaceDescriptors();

          setIsDetected(true);
          console.log("Faces Detected");

          // Resize results
          const canvas = document.getElementById("canvas");
          faceapi.matchDimensions(canvas, facesToCheck);

          // Resize and compare detected faces
          const resizedFacesToCheckAiData = faceapi.resizeResults(
            facesToCheckAiData,
            facesToCheck
          );

          resizedFacesToCheckAiData.forEach((face) => {
            const { detection, descriptor } = face;
            const label = faceMatcher.findBestMatch(descriptor).toString();

            if (label.includes("unknown")) {
              setIsFaceMatched(false);
              return;
            }

            // If a match is found
            setIsFaceMatched(true);
            setRecognitionStatus(`recognized`);
            setStatus("Present");

            verifyLocation();

            const drawBox = new faceapi.draw.DrawBox(detection.box, {
              label: "Hosteller", // replace with user.name
            });
            drawBox.draw(canvas);
            setIsCameraActive(false);
            clearInterval(intervalId);
          });
        }
      }, 1000); // Check every 1000ms (1 second)

      // Cleanup the interval when component is unmounted or userImageGot changes
      return () => clearInterval(intervalId);
    }
  };

  // Start camera function
  const handleStartCamera = () => {
    setIsCameraActive(true);
    // checkLocation();
  };

  // useEffect hook to run face mesh when the camera is active
  useEffect(() => {
    if (isCameraActive && userImageGot && coords ) {
      // Load the face mesh model
      runFacialRecognition();
      // checkLocation();
    }
  }, [isCameraActive, userImageGot,coords]);

  //--------------------
  // Other Functions
  // -----------------

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ---------------------
  // Attendance Submit Handle Submit
  // ------------------------
  const handleAttendanceSubmit = async (e, newStatus) => {
    e.preventDefault();

    try {
      // Send the POST request with the data
      const response = await fetch(`${API}/api/admin/save-attendance-one-by-one`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure the server knows you're sending JSON
        },
        body: JSON.stringify({
          userId,
          date,
          hostelId,
          status: newStatus,
        }), // Convert the data to a JSON string
      });

      // Handle response
      if (response.ok) {
        console.log("Attendance submitted successfully:");
        toast.success("Attendance submitted successfully")
        navigate("/admin/overview-attendance/take-attendance");
      } else {
        console.log("Error submitting attendance:", response.status);
        toast.error("Error submitting attendance");
      }
    } catch (error) {
      console.error("Error during the fetch request:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 text-center">
              Face Recognition Attendance System
            </h1>
            <div className="flex items-center space-x-2 text-blue-900 font-semibold">
              <FaClock className="text-xl" />
              <span className="text-lg ">{currentTime}</span>
            </div>
          </div>
          {/* Camera Feed Section */}
          <div
            className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden"
            role="region"
            aria-label="Camera feed display"
          >
            {isCameraActive ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width="720"
                  height="720"
                  videoConstraints={{
                    facingMode: "user", // Use front camera
                  }}
                  audio={false}
                />
                <canvas
                  id="canvas"
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full z-10 border-4 border-gray-300 rounded-lg"
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <button
                  onClick={handleStartCamera}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                  aria-label="Start camera"
                >
                  <FaCamera className="text-xl" />
                  <span>Start Camera</span>
                </button>
              </div>
            )}
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt
                  className={`text-2xl ${locationStatus === "verified"
                      ? "text-green-500"
                      : "text-yellow-500"
                    }`}
                />
                <div>
                  <h3 className="font-semibold">Location Status</h3>
                  <p className="text-sm text-gray-600">
                    {locationStatus === "Verified"
                      ? "Within attendance zone"
                      : "Checking location..."}
                  </p>
                  {locationStatus === "Out of range" && (
                    <div className="text-red-500 text-sm mb-4">
                      You are out of the allowed location range!
                    </div>
                  )}
                  Location: {locationStatus}
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {recognitionStatus === "recognized" ? (
                  <FaCheckCircle className="text-2xl text-green-500" />
                ) : (
                  <FaTimesCircle className="text-2xl text-gray-400" />
                )}
                <div>
                  <h3 className="font-semibold">Recognition Status</h3>
                  <p className="text-sm text-gray-600">
                    {recognitionStatus === "recognized"
                      ? "Face recognized"
                      : "Waiting for face detection"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Marking Section */}
          <div className="flex flex-col justify-between space-y-4">
            <button
              onClick={(e) => handleAttendanceSubmit(e, "Present")}
              disabled={
                recognitionStatus !== "recognized" ||
                locationStatus !== "Verified" ||
                !isWithinRange
              }
              className={`w-full md:w-auto px-8 py-4 rounded-lg font-semibold text-white transition-all bg-green-600 hover:bg-green-800 duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed `}
              aria-label="Mark attendance"
            >
              Mark Attendance : Present
            </button>
            <button
              onClick={(e) => handleAttendanceSubmit(e, "Leave")}
              disabled={
                !!(
                  recognitionStatus === "recognized" &&
                  locationStatus === "Verified" &&
                  isWithinRange
                )
              }
              className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:cursor-not-allowed  disabled:opacity-50"
              aria-label="Clock Out"
            >
              Leave
            </button>
            <button
              onClick={(e) => handleAttendanceSubmit(e, "Absent")}
              disabled={
                (recognitionStatus === "recognized" &&
                  locationStatus === "Verified" &&
                  isWithinRange)
              }
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed  focus:ring-opacity-50 disabled:opacity-50"
              aria-label="Clock Out"
            >
              Absent
            </button>
            <button
              onClick={(e) => handleAttendanceSubmit(e, "Late")}
              disabled={
                !!(
                  recognitionStatus === "recognized" &&
                  locationStatus === "Verified" &&
                  isWithinRange
                )
              }
              className="bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 disabled:cursor-not-allowed  focus:ring-yellow-500 focus:ring-opacity-50 disabled:opacity-50"
              aria-label="Clock Out"
            >
              Late
            </button>
            {attendanceMarked && (
              <div className="flex items-center space-x-2 text-green-500 animate-bounce">
                <FaCheckCircle />
                <span>Attendance marked successfully!</span>
              </div>
            )}

            {error && (
              <div
                className="text-red-500 bg-red-50 p-3 rounded-lg animate-shake"
                role="alert"
              >
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceRecognitionAttendanceAdmin;
