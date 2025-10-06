import React, { useState } from "react";
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
import Recordings from "./pages/Recordings";
import Login from "./pages/Login";
import Messages from "./pages/Messages";
import Calendar from "./pages/Calendar";
import Agenda from "./pages/Agenda";
import Reminders from "./pages/Reminders";
import Participants from "./pages/Participants";

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
{/* ---   <AuthProvider> --- */}
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

          {/* --- Protected Admin Area --- */}
          <Route
            element={
              //<ProtectedRoute>
                <MainLayout />
             // </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/recordings" element={<Recordings />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/participants" element={<Participants />} />
          </Route>
        </Routes>
      </Router>
{/* --- </AuthProvider> --- */}
</>
  );
}

export default App;
