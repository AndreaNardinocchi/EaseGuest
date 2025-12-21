import { Routes, Route } from "react-router-dom";
import SiteHeader from "./components/siteHeader/siteHeader";
import HomePage from "./pages/homepage";
import SearchResults from "./pages/searchResults";
import RoomDetail from "./pages/roomDetails";
import AuthContextProvider from "./context/authContext";
import LoginPage from "./pages/loginPage";
import SignUpPage from "./pages/signUpPage";
import AccountPage from "./pages/accountPage";
import ProfilePage from "./pages/profilePage";
import FavoritesPage from "./pages/favoritesPage";
import ProtectedRoute from "./routes/protectedRoutes";
import BookingConfirmation from "./pages/bookingConfirmationPage";
// import AdminDashboard from "./pages/adminDashboard";
import AdminRoute from "./routes/AdminRoute";
import ReviewPage from "./pages/bookingReviewPage";
import RoomsPage from "./pages/roomsPage";
import AboutPage from "./pages/aboutUs";
import FacilitiesPage from "./pages/facilities";
// import AdminBookings from "./components/adminBookings/adminBookingsPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import AdminUsersPage from "./pages/adminUsersPage";
import AdminRoomsPage from "./pages/adminRoomsPage";
import AdminReviewsPage from "./pages/adminReviewsPage";
// import AdminDashboard from "./pages/adminDashboard";
// import ProtectedRoute from "./routes/protectedRoutes";

const App = () => {
  return (
    <>
      <AuthContextProvider>
        <SiteHeader />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/book" element={<BookingForm />} /> */}
          {/* You can add more pages here later */}
          <Route path="/search-results" element={<SearchResults />} />

          <Route path="/room/:roomId" element={<RoomDetail />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/facilities" element={<FacilitiesPage />} />

          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking-confirmation/:id"
            element={
              <ProtectedRoute>
                <BookingConfirmation />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          /> */}
          <Route
            path="/admin/bookings"
            element={
              <AdminRoute>
                <AdminBookingsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/rooms"
            element={
              <AdminRoute>
                <AdminRoomsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <AdminRoute>
                <AdminReviewsPage />
              </AdminRoute>
            }
          />

          {/* Changed from AdminRoute to ProtectedRoute so normal users can access */}
          <Route
            path="/review/:id"
            element={
              <ProtectedRoute>
                <ReviewPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthContextProvider>
    </>
  );
};

export default App;
