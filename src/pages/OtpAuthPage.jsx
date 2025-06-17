import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OtpAuthPage.css";
import { db } from "../Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import logo from "../assets/logo.png";

const API_KEY = "14127bc3-09f4-11ee-addf-0200cd936042"; // Replace with your actual key

const OtpAuthPage = () => {
  const [phone, setPhone] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    setError("");

    if (!phone.match(/^\d{10}$/)) {
      setError("Enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);

    try {
      const usersRef = collection(db, "nimcet_users");
      const q = query(usersRef, where("phone", "==", phone));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError("You have already generated a report with this number.");
        setIsLoading(false);
        return;
      }

      const res = await fetch(
        `https://2factor.in/API/V1/${API_KEY}/SMS/${phone}/AUTOGEN`
      );
      const data = await res.json();

      if (data.Status === "Success") {
        setSessionId(data.Details);
        setStep("otp");
      } else {
        setError(data.Details || "Failed to send OTP");
      }
    } catch (err) {
      setError("Error sending OTP. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError("");
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY/${sessionId}/${otp}`
      );
      const data = await res.json();

      if (data.Status === "Success") {
        navigate("/form", { state: { phone } });
      } else {
        setError(data.Details || "OTP verification failed");
      }
    } catch (err) {
      setError("Error verifying OTP. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-card">
        {/* 🔥 Logo on Top */}
        <img src={logo} alt="App Logo" className="otp-logo" />

        <div className="otp-card-header">
          <h2>Phone Verification</h2>
          <p>
            {step === "phone"
              ? "Enter your phone number to receive OTP"
              : "Enter the OTP sent to your phone"}
          </p>
        </div>

        <div className="otp-card-body">
          {step === "phone" ? (
            <>
              <label>Phone Number</label>
              <div className="phone-input-group">
                <span className="country-code">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  maxLength="10"
                />
              </div>
              <button onClick={sendOtp} disabled={isLoading}>
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          ) : (
            <>
              <label>Verification Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength="6"
              />
              <p className="otp-info">OTP sent to +91 {phone}</p>
              <button onClick={verifyOtp} disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                className="change-number"
                onClick={() => setStep("phone")}
              >
                Change Phone Number
              </button>
            </>
          )}

          {error && <div className="error-box">{error}</div>}
        </div>

        <div className="otp-card-footer">
          <p>You will get OTP by Call</p>
        </div>
      </div>
    </div>
  );
};

export default OtpAuthPage;
