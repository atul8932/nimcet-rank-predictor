import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebase";

export default function FormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone;

  const [form, setForm] = useState({
    name: "",
    marks: "",
    category: "General",
    regNo: "",
    city: "",
    state: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.regNo.startsWith("NIT2025")) {
      alert(
        "❌ Registration number must start with 'NIT2025'. Please correct it."
      );
      return;
    }

    // 🔐 Check for duplicate entry based on phone number
    const q = query(
      collection(db, "nimcet_users"),
      where("phone", "==", phone)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      alert("⚠️ Report already generated for this phone number.");
      navigate("/report", { state: querySnapshot.docs[0].data() });
      return;
    }

    const marks = parseInt(form.marks);
    const category = form.category;

    const marksToRank = await import("../data/marks_to_rank.json");
    const collegeCutoffs = await import("../data/college_cutoffs.json");

    let predictedRank = null;
    for (const range of marksToRank.default) {
      if (marks >= range.low && marks <= range.high) {
        predictedRank = range.rank;
        break;
      }
    }

    let topCollege = null;
    let fallbackCollege = null;

    for (const entry of collegeCutoffs.default[category]) {
      if (predictedRank >= entry.low && predictedRank <= entry.high) {
        topCollege = entry.college;
        break;
      }
    }

    const eligible = collegeCutoffs.default[category].filter(
      (entry) => predictedRank <= entry.high
    );
    if (eligible.length > 1) fallbackCollege = eligible[1]?.college || null;

    const payload = {
      name: form.name,
      phone,
      marks,
      category,
      regNo: form.regNo,
      city: form.city,
      state: form.state,
      rank: predictedRank,
      topCollege,
      fallbackCollege,
    };

    await addDoc(collection(db, "nimcet_users"), payload);
    navigate("/report", { state: payload });
  };

  // Optional: Disable going back to form from report
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.go(1);
    };
  }, []);

  // Inline styles
  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, rgb(9, 70, 110), #dbeafe)",
    padding: "1rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const formStyle = {
    backgroundColor: "#f1f5f9",
    padding: "2rem",
    borderRadius: "1rem",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "420px",
    transition: "transform 0.3s ease",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    fontSize: "1rem",
    borderRadius: "0.75rem",
    border: "1px solid rgb(91, 134, 186)",
    backgroundColor: "#f8fafc",
  };

  const buttonStyle = {
    background: "linear-gradient(to right, #2563eb, #4f46e5)",
    color: "#fff",
    padding: "0.75rem",
    fontSize: "1rem",
    border: "none",
    borderRadius: "0.75rem",
    width: "100%",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
    transition: "all 0.3s ease",
  };

  const noteStyle = {
    fontSize: "0.8rem",
    color: "#ef4444",
    marginTop: "-0.5rem",
    marginBottom: "1rem",
  };

  return (
    <div style={containerStyle}>
      <form
        onSubmit={handleSubmit}
        style={formStyle}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <h2
          style={{
            fontSize: "1.6rem",
            fontWeight: "bold",
            marginBottom: "1.5rem",
            textAlign: "center",
            color: "#1e3a8a",
          }}
        >
          ACME AI 🤖 Based Rank/College Predictor
        </h2>

        <input
          name="name"
          onChange={handleChange}
          required
          placeholder="Full Name"
          style={{ ...inputStyle, color: "#000" }}
        />

        <input
          name="marks"
          onChange={handleChange}
          required
          type="number"
          placeholder="Total Marks in NIMCET 2025"
          style={{ ...inputStyle, color: "#000" }}
        />
        <p style={noteStyle}>
          ⚠️Please Enter Correct Marks, We Will Generate Only 1 Result For One
          Device
        </p>

        <select
          name="category"
          onChange={handleChange}
          defaultValue="General"
          style={{ ...inputStyle, color: "#000" }}
        >
          <option>General</option>
          <option>EWS</option>
          <option>OBC</option>
          <option>SC</option>
          <option>ST</option>
          <option>PWD</option>
        </select>

        <input
          name="regNo"
          onChange={handleChange}
          required
          placeholder="Enter Correct Registration Number"
          style={{ ...inputStyle, color: "#000" }}
        />
        <p style={noteStyle}>
          ⚠️Please Enter Correct Nimcet Registration Number
        </p>

        <input
          name="city"
          onChange={handleChange}
          required
          placeholder="City"
          style={{ ...inputStyle, color: "#000" }}
        />

        <input
          name="state"
          onChange={handleChange}
          required
          placeholder="State"
          style={{ ...inputStyle, color: "#000" }}
        />

        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(to right, #1d4ed8, #4338ca)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(to right, #2563eb, #4f46e5)")
          }
        >
          🚀 Generate Report
        </button>
      </form>
    </div>
  );
}
