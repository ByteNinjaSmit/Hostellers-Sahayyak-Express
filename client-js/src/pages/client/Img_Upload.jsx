import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../store/auth";
import { toast } from "react-toastify";
import FileBase64 from "react-file-base64";
import Resizer from "react-image-file-resizer";  // Import the Resizer module
import { useNavigate } from "react-router-dom";

const ImageUpload = () => {
  const [imageBase64, setImageBase64] = useState(null);
  const navigate = useNavigate();
  const { API, user } = useAuth();

  // Resize the image and convert it to Base64 format
  const handleFileChange = (file) => {
    // Resize the image using react-image-file-resizer
    Resizer.imageFileResizer(
      file,
      200, // width
      200, // height
      "JPEG", // output type (e.g., 'JPEG', 'PNG', 'WEBP')
      80, // quality (from 0 to 100)
      0, // rotation (0 is no rotation)
      (resizedBase64) => {
        // The resizedBase64 is directly the Base64 string, no need for FileReader
        setImageBase64(resizedBase64);
      },
      "base64" // output format (base64 string)
    );
  };


  // Send Base64 data to the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/api/user/store-image`, {
        image: imageBase64,
        userId: user._id,
      });
      if (!response.ok) {
        toast.error("Error occurred during image upload");
      }
      toast.success("Image uploaded successfully");
      navigate("/")
    } catch (error) {
      toast.error("Error uploading image", error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* FileBase64 component for file selection */}
      <FileBase64
        multiple={false}
        onDone={({ base64, file }) => handleFileChange(file)} // Passing file instead of base64 directly
        className="border-2 border-gray-300 p-2"
      />
      {imageBase64 && (
        <div>
          <img
            src={imageBase64}
            alt="Uploaded preview"
            className="w-32 h-32 object-cover"
          />
        </div>
      )}
      <button
        onClick={handleSubmit}
        disabled={!imageBase64}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Upload Image
      </button>
    </div>
  );
};

export default ImageUpload;
