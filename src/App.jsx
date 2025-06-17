import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OtpAuthPage from "./pages/OtpAuthPage";
import FormPage from "./pages/FormPage";
import ReportPage from "./pages/ReportPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OtpAuthPage />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
