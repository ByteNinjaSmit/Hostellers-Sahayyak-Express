import React, { useState, useEffect, Suspense } from "react";
import { FaQuestionCircle, FaFileAlt, FaSearch, FaPhoneAlt, FaInfoCircle, FaCog } from "react-icons/fa";
import { Link,useNavigate,useParams,useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth";


const HelpSupportPage = () => {
  const [activeTab, setActiveTab] = useState("form");
  const{API} = useAuth();
  const navigate = useNavigate(); // Router instance for navigation
  const [trackId, setTrackId] = useState(""); // State to store complaint ID
  const [caseType, setCaseType] = useState(""); // State to store search parameter value
  const [isClient, setIsClient] = useState(false); // Flag to check if the component is on the client side

  // Set the client-side flag once the component is mounted
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Access search parameters only after the component has mounted (client-side)
  useEffect(() => {
    if (isClient) {
      const searchParams = new URLSearchParams(window.location.search);
      const caseParam = searchParams.get('case');
      if (caseParam) {
        setActiveTab(caseParam);
      }
    }
  }, [isClient]);

  const handleTrackComplaint = async () => {
    if (!trackId) {
      toast.error("Please enter a valid complaint ID");
      return;
    }

    try {
      const response = await fetch(`${API}/api/user/get-issue/${trackId}`);
      if (response.ok) {
        navigate(`/contact/track-complaint/${trackId}`);
      } else {
        toast.error("Please enter a valid complaint ID.");
      }
    } catch (error) {
      toast.error("An error occurred while tracking the complaint.");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "form":
        return (
          <div className="space-y-4">
            <img
              src="https://media.istockphoto.com/photos/complaint-picture-id475991835?k=6&m=475991835&s=170667a&w=0&h=g6cSyjh5iSgBFxqdVTytnvXuHXP888W0Lkv-OAFT178="
              alt="Filling form"
              className="w-full h-48 object-cover rounded-lg"
            />
            <h3 className="text-xl font-semibold">How to Fill the Grievance Form</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Log in to your student portal</li>
              <li>Navigate to the &quot;Grievance&quot; section</li>
              <li>Click on &quot;Submit Your Complaint Now&quot;</li>
              <li>Fill out the grievance form, specifying your issue</li>
              <li>Upload any supporting images if necessary</li>
              <li>Review your submission and click &quot;Submit&quot;</li>
            </ol>
          </div>
        );
      case "track":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Track Your Complaint</h3>
            <p>Enter your complaint ID to track its status:</p>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Complaint ID"
                value={trackId} // Bind the input to the state
                onChange={(e) => setTrackId(e.target.value)} // Update state on input change
                className="flex-grow px-4 py-2 border rounded-lg"
              />
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={handleTrackComplaint} // Handle track button click
              >
                Track
              </button>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-semibold">Status: In Progress</h4>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-blue-600 h-2.5 rounded-full w-2/3"></div>
              </div>
            </div>
          </div>
        );
      case "faq":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
            <div className="space-y-2">
              {[{
                q: "How long does it take to process a grievance?",
                a: "Typically, grievances are processed within 7-10 working days."
              },
              {
                q: "Can I submit anonymous complaints?",
                a: "Yes, all complaints must be submitted with valid student credentials are anonymous to the rector."
              },
              {
                q: "What types of grievances can I report?",
                a: "You can report all types of issues related to hostel facilities, mess, security, or any other hostel-related concerns."
              },
              {
                q: "What should i do if my issue is not resolved?",
                a: "If your issue isn't resolved in time, its severity will automatically increase, and it will be sent to a higher authority. Otherwise, you can file an 'action' on that issue."
              }
                ,
              {
                q: "Who review my grievance?",
                a: "First, the issue is reviewed by the hostel rector. If it isn't resolved, it is then transferred to the higher hostel authority."
              }
                ,
              {
                q: "Is there any limit to the number of complaint i can file?",
                a: "There is no limit, but please submit only genuine issues."
              }
              ].map((item, index) => (
                <details key={index} className="bg-gray-100 p-4 rounded-lg">
                  <summary className="font-semibold cursor-pointer">{item.q}</summary>
                  <p className="mt-2">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        );
      case "contact":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold">Hostel Chief Warden : Pankaj Patil Sir</h4>
                <p>Phone: +91 9422370964</p>
                <p>Email: pankajpatil@sanjivanicoe.org.in</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold">Hostel Clerk : Suralkar Sir</h4>
                <p>Phone: +91 9322447307</p>
                <p>Email: clerk@sanjivanicoe.org.in</p>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1474&q=80"
              alt="Emergency contact"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        );
      case "about":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">About Us</h3>
            <img
              src="https://media.istockphoto.com/vectors/young-man-outside-hostel-flat-vector-illustration-vector-id1191236486?k=6&m=1191236486&s=612x612&w=0&h=HAMwVDNKK6p9h5sYD5HMTsBjHdq0wyZK1499r52gZTw="
              alt="College campus"
              className="w-full h-75 object-cover rounded-lg"
            />
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp; Welcome to the Hostel Grievance System of Sanjivani College of Engineering.
              Sanjivani College of Engineering is dedicated to fostering a supportive and enriching environment for our students.
              To enhance the hostel experience for both boys and girls, we have established the Hostel Grievance System—an online platform designed to address and resolve student concerns related to hostel facilities and services.
            </p>

            <h2><strong>Our Purpose</strong></h2>
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;The Hostel Grievance System aims to provide a transparent and efficient way for students to voice their grievances.<br></br>
              &nbsp;&nbsp;&nbsp;&nbsp;We believe that a comfortable living environment is essential for academic success and overall well-being.<br></br>
              &nbsp;&nbsp;&nbsp;&nbsp;This system ensures that every concern is acknowledged and addressed in a timely manner.
            </p>
            <h2><strong>Key Features</strong></h2>
            <ul>
              <li>&nbsp;&nbsp;&nbsp;&nbsp;<span>Simple Submission Process</span>: Easily submit grievances through our user-friendly interface.</li>
              <li>&nbsp;&nbsp;&nbsp;&nbsp;<span>Confidential Handling</span>: All submissions are treated with confidentiality to protect student privacy.</li>
              <li>&nbsp;&nbsp;&nbsp;&nbsp;<span>Timely Responses</span>: Our dedicated team works diligently to ensure that grievances are resolved quickly and effectively.</li>
            </ul>
            <p>
              At Sanjivani College of Engineering, your comfort is our priority.
              We encourage all students to utilize this system to help us create a better living experience for everyone.
              Thank you for being an integral part of our community!
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-semibold">Our Process:</h4>
              <ul className="list-disc list-inside mt-2">
                <li>Receive complaints</li>
                <li>Investigate issues</li>
                <li>Implement solutions</li>
                <li>Follow up with students</li>
              </ul>
            </div>
          </div>
        );
      case "troubleshoot":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Troubleshoot</h3>
            <div className="space-y-2">
              {[{
                problem: "Unable to log in",
                solution: "Reset your password or contact the Computer Department."
              },
              {
                problem: "Grievance form not submitting",
                solution: "Check your internet connection and try again. If the issue persists, clear your browser cache."
              },
              {
                problem: "Cannot upload documents",
                solution: "Ensure your file is in a supported format (PDF, JPG, PNG) and under 5MB in size."
              }
              ].map((item, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold">{item.problem}</h4>
                  <p>{item.solution}</p>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Suspense >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Help & Support</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-4">
            {[{
              id: "form",
              icon: FaFileAlt,
              label: "How to Fill the Grievance Form"
            },
            {
              id: "track",
              icon: FaSearch,
              label: "Track Complaint"
            },
            {
              id: "faq",
              icon: FaQuestionCircle,
              label: "FAQ"
            },
            {
              id: "contact",
              icon: FaPhoneAlt,
              label: "Emergency Contact"
            },
            {
              id: "about",
              icon: FaInfoCircle,
              label: "About Us"
            },
            {
              id: "troubleshoot",
              icon: FaCog,
              label: "Troubleshoot"
            }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 w-full p-4 rounded-lg ${activeTab === item.id ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
              >
                <item.icon />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
              {renderContent()}
            </div>
        </div>
      </div>
    </Suspense>
  );
};

export default HelpSupportPage;