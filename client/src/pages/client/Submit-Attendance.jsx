import { useState, useRef, useEffect } from "react";
import {
  FaCamera,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaMapMarkerAlt,
  FaUser,
} from "react-icons/fa";

import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import * as faceapi from "face-api.js";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { drawMesh } from "./utilities";

const FaceRecognitionAttendance = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [locationStatus, setLocationStatus] = useState("checking");
  const [recognitionStatus, setRecognitionStatus] = useState("waiting");
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("offline");
  const [currentTime, setCurrentTime] = useState("");
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [model, setModel] = useState(null);
  const [facesDetected, setFacesDetected] = useState(false);
  const [keypoints, setKeypoints] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  useEffect(() => {
    // Simulate location check
    setTimeout(() => {
      setLocationStatus("verified");
    }, 2000);
  }, []);

  // Storing For Sample One Keypoint Data

  const tolerance =1;  

  const compareKeypoints = (currentKeypoints) => {
    const tolerance = 0.01;
    for (let i = 0; i < currentKeypoints.length; i++) {
      if (
        Math.abs(currentKeypoints[i].x - KeypointsDataExample1[i].x) > tolerance ||
        Math.abs(currentKeypoints[i].y - KeypointsDataExample1[i].y) > tolerance ||
        Math.abs(currentKeypoints[i].z - KeypointsDataExample1[i].z) > tolerance
      ) {
        return false;
      }
    }
    return true;
  };

  // ------------------------
  // Face Detection Using TensorFlow
  // ------------------------

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  // Load the face mesh model
  const runFacemesh = async () => {
    try {
      console.log("Loading model...");
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      const detectorConfig = {
        runtime: "tfjs", // You can try 'tfjs' if 'mediapipe' is problematic
        solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
      };

      const detector = await faceLandmarksDetection.createDetector(
        model,
        detectorConfig
      );

      console.log("Model loaded and detector created successfully!");
      // Start the face detection process
      detectFaces(detector);
    } catch (error) {
      console.error("Error loading face mesh model:", error);
    }
  };

  // Function to start webcam and detect faces
  const detectFaces = async (detector) => {
    try {
      const webcam = await tf.data.webcam(webcamRef.current, {
        resizeWidth: 640,
        resizeHeight: 480,
      });

      const detect = async () => {
        const img = await webcam.capture(); // Capture frame
        const faces = await detector.estimateFaces(img);

        if (faces.length > 0) {
          setFacesDetected(true);
          // console.log("Faces Detected:", faces); // Printing log Data
          console.log(`Old Data`);
          console.log(KeypointsDataExample1);
          console.log(`Current Data`);
          console.log(faces[0].keypoints);
          
          const currentKeypoints = faces[0].keypoints;
          console.log(currentKeypoints);
          if (compareKeypoints(currentKeypoints)) {
            setIsAuthenticated(true);
            console.log('is Authenticated');
            setRecognitionStatus("recognized");
            setIsCameraActive(false);
          } else {
            setIsAuthenticated(false);
            console.log(`is Not Authenticated`);
            
          }

        } else {
          setFacesDetected(false);
        }

        img.dispose(); // Dispose tensor to free memory

        const ctx = canvasRef.current.getContext("2d");
        drawMesh(faces, ctx);
        requestAnimationFrame(detect); // Loop for continuous detection
      };

      detect(); // Start detecting faces
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  // Start camera function
  const handleStartCamera = () => {
    setIsCameraActive(true);
  };

  // useEffect hook to run face mesh when the camera is active
  useEffect(() => {
    if (isCameraActive) {
      runFacemesh();
    }
  }, [isCameraActive]);

  const handleMarkAttendance = () => {
    if (recognitionStatus === "recognized" && locationStatus === "verified") {
      setAttendanceMarked(true);
      setTimeout(() => {
        setAttendanceMarked(false);
        setIsCameraActive(false);
        setRecognitionStatus("waiting");
      }, 3000);
    } else {
      setError("Please ensure face recognition and location are verified");
      setTimeout(() => setError(null), 3000);
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
                <video
                  ref={webcamRef}
                  autoPlay
                  playsInline
                  width="640"
                  height="480"
                  muted
                  style={{
                    position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zIndex: 1,
                  }}
                />
                <canvas
                  ref={canvasRef}
                  width="640"
                  height="480"
                  style={{
                    position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zIndex: 2, // Canvas should be on top of the video
                  }}
                />
                <p>Status: {recognitionStatus}</p>
                {!isAuthenticated && <p>Please face the camera to authenticate.</p>}
                {isAuthenticated && <p>Authentication Successful!</p>}
                <p>{isFaceDetected ? "Face detected!" : "No face detected."}</p>
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
                  className={`text-2xl ${
                    locationStatus === "verified"
                      ? "text-green-500"
                      : "text-yellow-500"
                  }`}
                />
                <div>
                  <h3 className="font-semibold">Location Status</h3>
                  <p className="text-sm text-gray-600">
                    {locationStatus === "verified"
                      ? "Within attendance zone"
                      : "Checking location..."}
                  </p>
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
              onClick={handleMarkAttendance}
              disabled={
                recognitionStatus !== "recognized" ||
                locationStatus !== "verified"
              }
              className={`w-full md:w-auto px-8 py-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                recognitionStatus === "recognized" &&
                locationStatus === "verified"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              aria-label="Mark attendance"
            >
              Mark Attendance
            </button>
            <button
              // onClick={() => handleAttendance("out")}
              // disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50"
              aria-label="Clock Out"
            >
              Leave
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

export default FaceRecognitionAttendance;
