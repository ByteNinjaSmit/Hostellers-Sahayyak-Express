import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { useAuth } from "../../store/auth";
import Webcam from "react-webcam";

const FacialRecognition = () => {
  const { API, user } = useAuth();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [userImage, setUserImage] = useState(null);
  const [isDetected, setIsDetected] = useState(false);
  const [isFaceMatched, setIsFaceMatched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModelLoad, setIsModelLoad] = useState(false);
  const [userImageGot, setUserImageGot] = useState(false);

  // Fetch user image from the server
  useEffect(() => {
    const getUserImage = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API}/api/user/get-image/${user._id}`);
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
  useEffect(() => {
    const runFacialRecognition = async () => {
      // Load models for face detection
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.ageGenderNet.loadFromUri("/models"),
      ]);
      setIsModelLoad(true);

      console.log("Models Loaded Successfully");

      // Load the user image for reference (convert base64 to image)
      if (userImageGot) {
        const refFace = await faceapi.fetchImage(userImage);

        // Create a FaceMatcher instance
        const refFaceAiData = await faceapi
          .detectAllFaces(refFace)
          .withFaceLandmarks()
          .withFaceDescriptors();
        const faceMatcher = new faceapi.FaceMatcher(refFaceAiData);

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
              const drawBox = new faceapi.draw.DrawBox(detection.box, {
                label: user?.name, // replace with user.name
              });
              drawBox.draw(canvas);
            });
          }
        }, 1000); // Check every 1000ms (1 second)

        // Cleanup the interval when component is unmounted or userImageGot changes
        return () => clearInterval(intervalId);
      }
    };

    if (userImageGot && !isDetected && !isFaceMatched) {
      runFacialRecognition();
    }
  }, [userImageGot, user, isDetected,isFaceMatched]);

  return (
    <div className="facial-recognition flex flex-col items-center justify-center space-y-6">
      <div className="relative max-w-[45%]">
        {/* Webcam video capture */}
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="640"
          height="480"
          videoConstraints={{
            facingMode: "user", // Use front camera
          }}
          audio={false}
        />

        {/* Canvas overlay on the webcam video */}
        <canvas
          id="canvas"
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full z-10 border-4 border-gray-300 rounded-lg"
        />
      </div>

      {/* Reference image (User's Image) */}
      <img
        className="w-24 h-24 rounded-full border-4 border-gray-300 shadow-lg"
        src={userImage || "default-image.jpg"} // Fallback to a default image if userImage is not loaded
        alt="Reference Face"
      />
    </div>
  );
};

export default FacialRecognition;
