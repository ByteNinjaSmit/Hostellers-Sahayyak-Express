import { useState, useEffect } from "react"; // Import Link for navigation
import { Spinner } from "@nextui-org/react"; // Using Spinner for loading state
import { toast } from "react-toastify";
import { useAuth } from "../store/auth";
import { Link, useNavigate, Navigate, NavLink } from "react-router-dom";

export default function Login() {
  const [role, setRole] = useState(""); // Stores the selected role (student, rector, higher authority)
  const [username, setUsername] = useState(""); // Stores the input username
  const [password, setPassword] = useState(""); // Stores the input password
  const [loading, setLoading] = useState(false); // Tracks the loading state during login
  const { storeTokenInCookies, isLoggedIn, API } = useAuth(); // Custom hook from AuthContext

  
  const [error, setError] = useState(""); // Stores any login errors
  const navigate = useNavigate(); // Navigation hook to redirect on successful login

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  // Handle form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError("");

    setLoading(true);
    if (role === "student") {
      try {
        const response = await fetch(`${API}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const res_data = await response.json();

        if (response.ok) {
          toast.success("Login Successful");
          storeTokenInCookies(res_data.token);
        } else {
          toast.error(
            res_data.extraDetails ? res_data.extraDetails : res_data.message
          );
        }
      } catch (error) {
        console.log(error);
        toast.error("Error logging in");
      } finally {
        setLoading(false);
      }
    }
    if (role === "rector" || role === "higher-authority") {
      try {
        const response = await fetch(`${API}/api/auth/login/faculty`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password, role }),
        });

        const res_data = await response.json();

        if (response.ok) {
          toast.success("Login Successful");
          storeTokenInCookies(res_data.token);
          navigate("/");
        } else {
          // setError(res_data.error || "Login failed");
          toast.error(
            res_data.extraDetails ? res_data.extraDetails : res_data.message
          );
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 p-4 relative">
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left section with image */}
        <div className="w-full md:w-1/2 h-64 md:h-auto hidden md:block">
          <img
            src="https://images.freeimages.com/clg/istock/previews/9065/90651093-hostel-building-flat-illustration.jpg"
            alt="Login Image"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right section with form */}
        <div className="w-full md:w-1/2 p-10 lg:p-16 flex flex-col justify-center bg-gray-50">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4JIbjdos9HQaTUn3Xm9CBB5fCBxvsOBlTjA&s"
              alt="Logo"
              className="w-24 h-24 lg:w-36 lg:h-36"
            />
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6 text-center">
            Login
          </h2>

          {/* Form for login */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="role"
                className="block text-lg lg:text-xl text-gray-700 font-medium"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base lg:text-lg p-3"
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="student">Student</option>
                <option value="rector">Rector</option>
                <option value="higher-authority">Higher Authority</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-lg lg:text-xl text-gray-700 font-medium"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base lg:text-lg p-3"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-lg lg:text-xl text-gray-700 font-medium"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base lg:text-lg p-3"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-3 px-6 rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-base lg:text-lg"
            >
              {loading ? <Spinner size="sm" /> : "Login"}
            </button>
          </form>

          {error && (
            <p className="mt-4 text-red-500 text-center lg:text-lg">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
