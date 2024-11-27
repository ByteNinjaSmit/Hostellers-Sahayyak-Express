import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import FaceRecognitionAttendance from "./pages/client/Submit-Attendance";
import FacialRecognition from "./pages/client/Face-Recognation";

const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        {/* Navbar */}
        <MainNavabar />
        {/* Routes */}
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
            {/* <Route
              exact
              path="take-attend"
              element={<FaceRecognitionAttendance />}
            /> */}
            <Route
              exact
              path="face"
              element={<FacialRecognition />}
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
              path="overview-attendance/edit-attendance/:id"
              element={<EditAttendance />}
            />
            <Route
              exact
              path="overview-attendance/view-attendance/:id"
              element={<ViewAttendance />}
            />
          </Route>

          <Route path="*" element={<Error />} />
        </Routes>

        {/* Footer */}
        <MainFooter />
      </div>
    </BrowserRouter>
  );
};

export default App;
