import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import LandingPage from './pages/LandingPage';
import { LoginPage, SignupPage } from './pages/AuthPages';
import MyPage from './pages/MyPage';
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
import QuickAccessPopup from './components/QuickAccessPopup';

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
                <Route path="/signup/:type" element={<SignupPage />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/search/talent" element={<SearchPage type="talent" />} />
                <Route path="/search/agencies" element={<SearchPage type="agency" />} />
                <Route path="/detail/:type/:id" element={<DetailPage />} />
                <Route path="/offers" element={<OffersPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/chat/:offerId" element={<ChatPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
                <Route path="/payment-settings" element={<PaymentSettingsPage />} />
                <Route path="/verification" element={<VerificationPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/legal" element={<LegalPage />} />
              </Routes>
            </main>
            {/* Always show bottom nav for logged in users, QuickAccess for utility */}
            <QuickAccessPopup />
            <BottomNav />
          </div>
        </Router>
      </UserProvider>
    </LanguageProvider>
  );
}

export default App;
