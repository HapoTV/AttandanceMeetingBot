import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🔒 Auth Context and Protected Route
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// 🌐 Public site components
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Integrations from "./components/Integrations";
import About from "./components/About";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

// 🧭 Admin layout & pages
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Meetings from "./pages/Meetings";
import MeetingCall from "./pages/MeetingCall";
import Recordings from "./pages/Recordings";
import Login from "./pages/Login";
import AuthPassword from "./pages/AuthPassword";
import Notifications from "./pages/Notifications";
import Calendar from "./pages/Calendar";
import ActionItems from "./pages/ActionItems";
import Reminders from "./pages/Reminders";
import Participants from "./pages/Participants";
import Chat from "./pages/Chat";

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
<AuthProvider>
      <Router>
        <Routes>
          {/* --- Public Marketing Website --- */}
          <Route
            path="/"
            element={
              <div className="min-h-screen bg-white">
                <Header
                  mobileMenuOpen={mobileMenuOpen}
                  setMobileMenuOpen={setMobileMenuOpen}
                />
                <Hero />
                <Features />
                <Integrations />
                <About />
                <CTA />
                <Footer />
              </div>
            }
          />

          {/* --- Auth --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/create-password" element={<AuthPassword />} />

          {/* --- Meeting Calls --- */}
          <Route path="/meeting-call/:meetingId" element={<MeetingCall />} />

          {/* --- Protected Admin Area --- */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/recordings" element={<Recordings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/action-items" element={<ActionItems />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/participants" element={<Participants />} />
            <Route path="/chats" element={<Chat />} />
            <Route path="/meeting-call/:meetingId" element={<MeetingCall />} />
          </Route>
        </Routes>
      </Router>
 </AuthProvider> 
</>
  );
}

export default App;
