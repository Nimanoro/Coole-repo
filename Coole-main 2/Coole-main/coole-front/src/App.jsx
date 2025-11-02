import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/login.jsx";
import SignupPage from "./pages/signup.jsx";
import DashboardPage from "./pages/Dashboard.jsx";
import { Navigate } from "react-router-dom";
import AdminUserPage from './admin_pages/users.jsx';
import ForgotPassword from './pages/forgot.jsx';
import ResetPassword from './pages/resetPass.jsx';
import AdminPendingLeaders from './admin_pages/pendingLeaders.jsx';
import VerifyCode from './pages/verifyCode.jsx';
import TourLeaderRegistration from './leader_pages/leaderRegistration.jsx';
import UserInterests from './pages/favorites.jsx';
import TripCreation from './leader_pages/Tripcreation.jsx';
import AllTripsPage from './pages/alltrips.jsx';
import AdminAllTickets from './admin_pages/AllTicketsView.jsx';
import AdminPendingTrips from './admin_pages/pendingTours.jsx';
import EditProfile from "./user_pages/editProfile.jsx";
import LeaderTripDetailsPage from './leader_pages/LeaderTripDetails.jsx';
import ViewTicketAdmin from "./admin_pages/adminSupport.jsx";
import TripDetails from './pages/trip.jsx';
import LeaderEditTrip from "./leader_pages/editTrip.jsx";
import './index.css';
import  UserProfilePage from './user_pages/userProfile.jsx';
import ViewTicket from './pages/view-ticket.jsx';
import AllLeaderTrips from './leader_pages/allMyTrips.jsx';
import HomePage from './pages/homepage.jsx';
import TripCategories from "./pages/TripCategories.jsx";
import CreateTicket from "./pages/create-ticket.jsx";
import UserTickets from "./pages/AllTickets.jsx";
import SearchPage from './pages/searchPage.jsx';
import TripSwipeFeed from './pages/TinderFeed.jsx';
export default function App() {
  return (
    <div>
    <div className="status-bar"></div>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin/users" element={<AdminUserPage />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/leader-registration" element={<TourLeaderRegistration />} />
          <Route path="/verify" element={<VerifyCode />} />
          <Route path="/pending-leaders" element={<AdminPendingLeaders/>} />
          <Route path="/interests" element={<UserInterests />} />
          <Route path="/update-password/:token" element={<ResetPassword />} />
          <Route path="/trip-creation" element={<TripCreation />} />
          <Route path="/all-trips" element={<AllTripsPage />} />
          <Route path="/trip/:id" element={<TripDetails />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/leader-trip-details/:id" element={<LeaderTripDetailsPage />} />  
          <Route path="/my-trips" element={<AllLeaderTrips />} />
          <Route path="/edit-trip/:id" element={<LeaderEditTrip />} />
          <Route path="/pending-trips" element={<AdminPendingTrips />} />
          <Route path="/user-profile/:id" element={<UserProfilePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/support" element={<UserTickets />} />
          <Route path = "/home" element={<HomePage />} />
          <Route path="/admin/tickets" element={<AdminAllTickets />} />
          <Route path="/category/:category" element={<TripCategories />} />
          <Route path="/admin/support/ticket/:ticketId" element={<ViewTicketAdmin />} />
          <Route path="/support/ticket/:ticketId" element={<ViewTicket />} />
          <Route path ="/support/create" element={<CreateTicket />} />
          <Route path="/swipe" element={<TripSwipeFeed />} />
          <Route path="*" element={<Navigate to="/home" />} />
          
        </Routes>
      </div>
      </div>
  );
  }