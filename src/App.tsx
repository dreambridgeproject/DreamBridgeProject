import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import LandingPage from './pages/LandingPage';
import { LoginPage, SignupPage, ResetPasswordPage } from './pages/AuthPages';
import MyPage from './pages/MyPage';
import JobsPage from './pages/JobsPage';
import JobManagementPage from './pages/JobManagementPage';
import AgencyTalentManagementPage from './pages/AgencyTalentManagementPage';
import JobApplicationsPage from './pages/JobApplicationsPage';
import SearchPage from './pages/SearchPage';
import DetailPage from './pages/DetailPage';
import OffersPage from './pages/OffersPage';
import ChatPage from './pages/ChatPage';
import FavoritesPage from './pages/FavoritesPage';
import NotificationsPage from './pages/NotificationsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import PaymentSettingsPage from './pages/PaymentSettingsPage';
import VerificationPage from './pages/VerificationPage';
import AdminDashboard from './pages/AdminDashboard';
import LegalPage from './pages/LegalPage';
import AttendanceResponsePage from './pages/AttendanceResponsePage';
import JobDetailPage from './pages/JobDetailPage';
import QuickAccessPopup from './components/QuickAccessPopup';
import { type ReactNode } from 'react';

// Admin Route Protection
const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useUser();

  if (loading) return null;

  const isAdmin = user?.email === 'admin@dreambridge.jp' || user?.email?.includes('admin@');

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Requires a logged-in, admin-approved (verification_status === 'verified') user.
// Guests are sent to the landing page instead of seeing empty search results /
// app content; logged-in but not-yet-approved users are sent to the existing
// /verification page, which already renders the right state (form, pending, or done).
const RequireApproved = ({ children }: { children: ReactNode }) => {
  const { user, currentUser, loading, profileLoading } = useUser();

  if (loading || profileLoading) return null;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const isAdmin = user.email === 'admin@dreambridge.jp' || user.email?.includes('admin@');

  if (!isAdmin && currentUser?.verification_status !== 'verified') {
    return <Navigate to="/verification" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <LanguageProvider>
      <UserProvider>
        <Router>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
            <Header />
            <main style={{ flex: 1, paddingBottom: '90px' }}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/signup/:type" element={<SignupPage />} />
                <Route path="/mypage" element={<RequireApproved><MyPage /></RequireApproved>} />
                <Route path="/jobs" element={<RequireApproved><JobsPage /></RequireApproved>} />
                <Route path="/jobs/manage" element={<RequireApproved><JobManagementPage /></RequireApproved>} />
                <Route path="/jobs/detail/:id" element={<RequireApproved><JobDetailPage /></RequireApproved>} />
                <Route path="/agency/talents" element={<RequireApproved><AgencyTalentManagementPage /></RequireApproved>} />
                <Route path="/jobs/applications" element={<RequireApproved><JobApplicationsPage /></RequireApproved>} />
                <Route path="/search/talent" element={<RequireApproved><SearchPage type="talent" /></RequireApproved>} />
                <Route path="/search/agencies" element={<RequireApproved><SearchPage type="agency" /></RequireApproved>} />
                <Route path="/search/casting" element={<RequireApproved><SearchPage type="casting" /></RequireApproved>} />
                <Route path="/detail/:type/:id" element={<RequireApproved><DetailPage /></RequireApproved>} />
                <Route path="/offers" element={<RequireApproved><OffersPage /></RequireApproved>} />
                <Route path="/chat" element={<RequireApproved><ChatPage /></RequireApproved>} />
                <Route path="/chat/:offerId" element={<RequireApproved><ChatPage /></RequireApproved>} />
                <Route path="/favorites" element={<RequireApproved><FavoritesPage /></RequireApproved>} />
                <Route path="/notifications" element={<RequireApproved><NotificationsPage /></RequireApproved>} />
                <Route path="/subscription" element={<RequireApproved><SubscriptionPage /></RequireApproved>} />
                <Route path="/payment-settings" element={<RequireApproved><PaymentSettingsPage /></RequireApproved>} />
                <Route path="/verification" element={<VerificationPage />} />
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                <Route path="/legal" element={<LegalPage />} />
                <Route path="/attendance-response" element={<AttendanceResponsePage />} />
              </Routes>
            </main>
            <QuickAccessPopup />
            <BottomNav />
          </div>
        </Router>
      </UserProvider>
    </LanguageProvider>
  );
}

export default App;
