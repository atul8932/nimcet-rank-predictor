import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import marksToRank from "../data/marks_to_rank.json";
import collegeCutoffs from "../data/college_cutoffs.json";

import logo from "../assets/logo.png";
import photo1 from "../assets/image1.jpg";
import photo2 from "../assets/image2.jpg";
import photo3 from "../assets/image3.jpg";
import photo4 from "../assets/image4.jpg";

const ReportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reportRef = useRef();
  const [currentSlide, setCurrentSlide] = useState(0);
  const data = location.state;

  const photos = [
    {
      id: 1,
      url: photo1,
      link: "https://acmea.courses.store/404876",
      alt: "ACME Topper 1",
    },
    {
      id: 2,
      url: photo2,
      link: "https://acmea.courses.store/404876",
      alt: "ACME Topper 2",
    },
    {
      id: 3,
      url: photo3,
      link: "https://acmea.on-app.in/app/home?orgCode=acmea&referrer=utm_source=copy-link&utm_medium=tutor-app-referral",
      alt: "ACME Topper 3",
    },
    {
      id: 4,
      url: photo4,
      link: "https://acmea.on-app.in/app/home?orgCode=acmea&referrer=utm_source=copy-link&utm_medium=tutor-app-referral",
      alt: "ACME Topper 4",
    },
  ];

  useEffect(() => {
    if (!data) navigate("/");
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % photos.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [data, navigate, photos.length]);

  const handleDownloadPDF = () => {
    const element = reportRef.current;
    html2pdf()
      .from(element)
      .set({
        margin: 0.3,
        filename: `${data.name}_NIMCET_Report.pdf`,
        html2canvas: { scale: 1.5 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .save();
  };

  if (!data) return null;

  const getPredictedRankRange = (marks) => {
    const record = marksToRank.find(
      (r) => marks >= r.min_marks && marks <= r.max_marks
    );
    return record
      ? { rankLow: record.rank_low, rankHigh: record.rank_high }
      : null;
  };

  const getEligibleColleges = (rankLow, category) => {
    const list = collegeCutoffs[category] || [];
    const sortedList = [...list].sort((a, b) => a.low - b.low);
    const topEligible = sortedList.find(
      (college) => college.low <= rankLow && rankLow <= college.high
    );
    const fallback = sortedList.find((college) => rankLow < college.low);
    return {
      top: topEligible ? topEligible.college : "Not Eligible",
      fallback: fallback ? fallback.college : "None",
    };
  };

  const rankRange = getPredictedRankRange(data.marks);
  const predictedRank = rankRange
    ? `${rankRange.rankLow} - ${rankRange.rankHigh}`
    : "Not Available";
  const { top, fallback } = rankRange
    ? getEligibleColleges(rankRange.rankLow, data.category)
    : { top: "Not Available", fallback: "Not Available" };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "#f8f9fa",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "1rem",
      fontFamily: "'Inter', sans-serif",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "0.5rem",
      padding: "2rem",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      width: "100%",
      maxWidth: "600px",
      marginBottom: "1.5rem",
    },
    logo: {
      width: "120px",
      display: "block",
      margin: "0 auto 1rem",
    },
    title: {
      fontSize: "1.8rem",
      fontWeight: "700",
      color: "#2563eb",
      margin: "0 0 0.5rem 0",
      textAlign: "center",
    },
    subtitle: {
      fontSize: "1.2rem",
      fontWeight: "600",
      color: "#4b5563",
      margin: "0 0 1.5rem 0",
      textAlign: "center",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      margin: "1rem 0",
    },
    tableRow: {
      borderBottom: "1px solid #e5e7eb",
    },
    tableHeader: {
      padding: "0.75rem",
      textAlign: "left",
      fontWeight: "600",
      color: "#1e40af",
      backgroundColor: "#f1f5f9",
      width: "50%",
    },
    tableCell: {
      padding: "0.75rem",
      textAlign: "left",
      color: "#374151",
    },
    button: {
      background: "#2563eb",
      color: "white",
      padding: "0.75rem 1.5rem",
      fontSize: "1rem",
      borderRadius: "0.3rem",
      border: "none",
      cursor: "pointer",
      fontWeight: "500",
      display: "block",
      margin: "1.5rem auto",
      width: "100%",
      maxWidth: "200px",
    },
    celebrationSection: {
      borderTop: "1px solid #e5e7eb",
      padding: "1.5rem 0",
      margin: "1.5rem 0",
      textAlign: "center",
    },
    celebrationTitle: {
      fontSize: "1.2rem",
      fontWeight: "600",
      color: "#2563eb",
      marginBottom: "0.5rem",
    },
    celebrationText: {
      color: "#4b5563",
      fontSize: "1rem",
      lineHeight: "1.5",
    },
    sliderContainer: {
      width: "100%",
      maxWidth: "600px",
      overflow: "hidden",
      margin: "1rem 0",
      borderRadius: "0.5rem",
      position: "relative",
      height: "300px",
      backgroundColor: "#f1f5f9",
    },
    sliderTrack: {
      display: "flex",
      transition: "transform 0.6s ease-in-out",
      height: "100%",
    },
    photoSlide: {
      minWidth: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "10px",
      boxSizing: "border-box",
    },
    photo: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      borderRadius: "0.3rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    whyChoose: {
      textAlign: "center",
      color: "#1e40af",
      fontWeight: "600",
      marginTop: "1rem",
    },
  };

  return (
    <div style={styles.container}>
      <div ref={reportRef} style={styles.card}>
        <img src={logo} alt="ACME Logo" style={styles.logo} />
        <h1 style={styles.title}>ACME AI Based</h1>
        <h2 style={styles.subtitle}>Rank/College Predictor</h2>

        <table style={styles.table}>
          <tbody>
            <tr style={styles.tableRow}>
              <th style={styles.tableHeader}>Application Number</th>
              <td style={styles.tableCell}>{data.regNo}</td>
            </tr>
            <tr style={styles.tableRow}>
              <th style={styles.tableHeader}>Name</th>
              <td style={styles.tableCell}>{data.name}</td>
            </tr>
            <tr style={styles.tableRow}>
              <th style={styles.tableHeader}>Category</th>
              <td style={styles.tableCell}>{data.category}</td>
            </tr>
            <tr style={styles.tableRow}>
              <th style={styles.tableHeader}>Marks</th>
              <td style={styles.tableCell}>{data.marks}</td>
            </tr>
            <tr style={styles.tableRow}>
              <th style={styles.tableHeader}>Predicted AIR</th>
              <td style={styles.tableCell}>{predictedRank}</td>
            </tr>
            <tr style={styles.tableRow}>
              <th style={styles.tableHeader}>Top Eligible College</th>
              <td style={styles.tableCell}>
                {top}
                {fallback !== "None" && ` or ${fallback}`}
              </td>
            </tr>
          </tbody>
        </table>

        <button style={styles.button} onClick={handleDownloadPDF}>
          Download PDF Report
        </button>

        {top !== "Not Eligible" && (
          <div style={styles.celebrationSection}>
            You have a good chance at <strong>{top}✅</strong>!
            <div style={styles.celebrationTitle}>
              🎉 Congratulations To Be An Nitian 🎉
            </div>
            <div style={styles.celebrationText}>
              <br />
              Join us with your parents at the{" "}
              <strong>ACME Award Ceremony</strong> to celebrate and receive your
              achievement award and Gifts 🎁
            </div>
          </div>
        )}
      </div>

      <div style={styles.sliderContainer}>
        <div
          style={{
            ...styles.sliderTrack,
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {photos.map((photo) => (
            <div key={photo.id} style={styles.photoSlide}>
              <a href={photo.link} target="_blank" rel="noopener noreferrer">
                <img src={photo.url} alt={photo.alt} style={styles.photo} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
