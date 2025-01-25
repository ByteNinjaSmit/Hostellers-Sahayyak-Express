import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import MainNavabar from "./components/Navbar";
import Dashboard from "./pages/client/Dashboard";
import Login from "./pages/Login";
import { UserLayout } from "./components/layout/User-Layout";
import { AdminLayout } from "./components/layout/Admin-Layout";
import HostelIssuesCategory from "./pages/client/Issue-Categories";
import GrievanceForm from "./pages/client/Form";
import GrievanceView from "./pages/client/Single-Issue";
import EditProfilePage from "./pages/client/Edit-Profile";
import HelpSupportPage from "./pages/Contact";
import MainFooter from "./components/Footer";
import GrievanceViewPublic from "./pages/Single-Issue";
import FAQ from "./pages/Faq";
import RulesAndRegulations from "./pages/Rules";
import AdminDashboard from "./pages/admin/Dashboard";
import GrievanceManagementSystem from "./pages/admin/All-Issues";
import UserManagement from "./pages/admin/All-Hosterllers";
import AddNewUser from "./pages/admin/New-User";
import EditUserFromAdmin from "./pages/admin/Edit-User";
import EditUserOfAdmin from "./pages/admin/Edit-Profile";
import HostelAttendanceOverview from "./pages/admin/All-Attendance";
import EditAttendance from "./pages/admin/Edit-Attendance";
import NewAttendance from "./pages/admin/New-Attendance";
import ViewAttendance from "./pages/admin/View-Attendance";
import GrievanceViewAdmin from "./pages/admin/Single-Issue";
import HeroSection from "./pages/Home";

import Error from "./pages/Error";
import FacialRecognition from "./pages/client/Face";
import ImageUpload from "./pages/client/Img_Upload";
import FaceRecognitionAttendance from "./pages/client/Submit-Attendance";
import LocationTracker from "./pages/Location";
import FaceRecognitionAttendanceAdmin from "./pages/admin/Submit-Single-Attend";

// Deveoper Pages
import DeveloperDashboard from "./pages/dev/Dashboard";
import SeeAllUsers from "./pages/dev/All-Users";
import DeveloperLogin from "./pages/dev/Login-Dev";
import { DeveloperLayout } from "./components/layout/Developer-Layout";
import SeeAllAdmins from "./pages/dev/All-Admins";
import GrievanceManagementUser from "./pages/client/All-Issues";
import HostelManagement from "./pages/admin/Hostel-Location";
import StudentAttendancePage from "./pages/client/Attendance";

const App = () => {
  const location = useLocation();
  const isDeveloperRoute = location.pathname.startsWith("/developer");
  return (
    <div className="app">
      {!isDeveloperRoute && <MainNavabar />}

      <Routes>
        <Route exact path="/" element={<HeroSection />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/contact" element={<HelpSupportPage />} />
        <Route
          exact
          path="/contact/track-complaint/:id"
          element={<GrievanceViewPublic />}
        />
        <Route exact path="/faq" element={<FAQ />} />
        <Route
          exact
          path="/rule-regulations"
          element={<RulesAndRegulations />}
        />
        <Route exact path="/location" element={<LocationTracker />} />



        {/* Developer Routes */}
        <Route path="/developer/login" element={<DeveloperLogin />} />
        <Route exact path="/developer/dev" element={<DeveloperLayout />}>
          <Route exact path="dashboard" element={<DeveloperDashboard />} />
          <Route exact path="see-all-users" element={<SeeAllUsers />} />
          <Route exact path="see-all-admins" element={<SeeAllAdmins />} />
        </Route>


        {/* User Routes */}
        <Route exact path="/client" element={<UserLayout />}>
          <Route exact path="dashboard" element={<Dashboard />} />
          <Route exact path="edit-profile" element={<EditProfilePage />} />
          <Route
            exact
            path=":user/issue/:categories"
            element={<HostelIssuesCategory />}
          />
          <Route
            exact
            path=":user/issue/:categories/:issue/form"
            element={<GrievanceForm />}
          />
          <Route
            exact
            path="singleissue/:id/:user"
            element={<GrievanceView />}
          />
          <Route
            exact
            path="complaints"
            element={<GrievanceManagementUser />}
          />
          <Route exact path="face" element={<FacialRecognition />} />
          <Route exact path="face-upload" element={<ImageUpload />} />
          <Route
            exact
            path="take-attendance"
            element={<FaceRecognitionAttendance />}
          />
          <Route
            exact
            path="attendance"
            element={<StudentAttendancePage />}
          />
        </Route>
        {/* Admin Routes */}
        <Route exact path="/admin" element={<AdminLayout />}>
          <Route exact path="dashboard" element={<AdminDashboard />} />
          <Route
            exact
            path="overview"
            element={<GrievanceManagementSystem />}
          />
          <Route
            exact
            path="single-issue/view/:id"
            element={<GrievanceViewAdmin />}
          />
          <Route exact path="hostellers" element={<UserManagement />} />
          <Route exact path="new-hosteller" element={<AddNewUser />} />
          <Route
            exact
            path="edit-hosteller/:id"
            element={<EditUserFromAdmin />}
          />
          <Route exact path="edit-profile" element={<EditUserOfAdmin />} />
          <Route
            exact
            path="overview-attendance"
            element={<HostelAttendanceOverview />}
          />
          <Route
            exact
            path="overview-attendance/take-attendance"
            element={<NewAttendance />}
          />
          <Route
            exact
            path="overview-attendance/take-attendance/:userId/:hostelId/:date"
            element={<FaceRecognitionAttendanceAdmin />}
          />
          <Route
            exact
            path="overview-attendance/edit-attendance/:id"
            element={<EditAttendance />}
          />
          <Route
            exact
            path="overview-attendance/view-attendance/:id"
            element={<ViewAttendance />}
          />
          <Route
            exact
            path="update-hostel-location"
            element={<HostelManagement />}
          />
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>

      {/* Footer */}
      {!isDeveloperRoute && <MainFooter />}
    </div>
  );
};

const AppWrapper = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

export default AppWrapper;
