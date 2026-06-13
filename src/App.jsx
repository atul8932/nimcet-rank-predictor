import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";
import { Navbar } from "./components/Navbar";

const OtpAuthPage = lazy(() => import("./pages/OtpAuthPage"));
const FormPage    = lazy(() => import("./pages/FormPage"));
const ReportPage  = lazy(() => import("./pages/ReportPage"));
const AdminPage   = lazy(() => import("./pages/AdminPage"));

const PageLoader = () => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
    <div style={{ width:48, height:48, border:"4px solid #bfdbfe", borderTopColor:"#2563eb", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
    <p style={{ marginTop:16, color:"#64748b", fontWeight:500 }}>Loading…</p>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      {/*
        Use height:100dvh (not min-height!) so flex children can stretch to fill viewport.
        min-height does NOT establish a definite height for flex-grow to work.
      */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",          // ← definite height — enables flex-grow in children
        overflow: "auto",
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
        transition: "background-color 0.3s, color 0.3s",
      }}>
        <Router>
          <Navbar />
          {/* main stretches to fill remaining height — pages don't need to re-establish height */}
          <main style={{ flex: 1, display:"flex", flexDirection:"column", overflow:"auto" }}>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/"       element={<OtpAuthPage />} />
                <Route path="/form"   element={<ProtectedRoute><FormPage /></ProtectedRoute>} />
                <Route path="/report" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
                <Route path="/admin"  element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
              </Routes>
            </Suspense>
          </main>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
