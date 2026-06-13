/**
 * PdfTemplate.jsx
 *
 * RULES:
 * 1. Use ONLY inline styles with hex/rgb colors — NO Tailwind color classes.
 *    Tailwind v4 emits oklch() colors; html2canvas cannot parse them → blank PDF.
 * 2. Keep the element rendered off-screen (position:fixed, left:-9999px)
 *    NOT display:none — a hidden element has 0×0 dimensions and produces a blank PDF.
 */
import React, { forwardRef } from "react";
import logo from "../assets/logo.png";

const C = {
  white:      "#ffffff",
  pageBg:     "#f8fafc",
  border:     "#e2e8f0",
  borderThin: "#f1f5f9",
  text:       "#0f172a",
  muted:      "#64748b",
  light:      "#94a3b8",
  blueDark:   "#1e3a8a",
  blue:       "#2563eb",
  indigo:     "#4338ca",
  greenDark:  "#065f46",
  green:      "#059669",
  greenPale:  "#ecfdf5",
  greenLight: "#d1fae5",
  slateLight: "#f8fafc",
  slate200:   "#e2e8f0",
  slate400:   "#94a3b8",
  slate800:   "#1e293b",
};

export const PdfTemplate = forwardRef(({ data, rankRange, colleges }, ref) => {
  if (!data) return null;

  const predictedRank = rankRange
    ? `${rankRange.rankLow} – ${rankRange.rankHigh}`
    : "Not Available";

  return (
    <div
      ref={ref}
      style={{
        /* Off-screen but RENDERED — html2canvas needs real dimensions */
        position:   "fixed",
        top:        "0px",
        left:       "-9999px",
        width:      "780px",
        minHeight:  "1050px",
        zIndex:     -100,
        /* Layout */
        fontFamily:    "Arial, Helvetica, sans-serif",
        backgroundColor: C.white,
        color:         C.text,
        padding:       "48px",
        boxSizing:     "border-box",
      }}
    >
      {/* ── Header ─────────────────────────────── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                    borderBottom:`4px solid ${C.blue}`, paddingBottom:"24px", marginBottom:"32px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
          <img src={logo} alt="ACME" style={{ height:"64px", width:"auto" }} />
          <div>
            <div style={{ fontSize:"20px", fontWeight:"800", color:C.blueDark, lineHeight:1.2 }}>
              ACME MCA Entrance Academy
            </div>
            <div style={{ fontSize:"11px", color:C.muted, marginTop:"4px",
                          textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:"600" }}>
              Official NIMCET Rank Prediction Report
            </div>
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:"11px", color:C.muted, fontWeight:"600" }}>Date Generated</div>
          <div style={{ fontSize:"15px", fontWeight:"600", color:C.text, margin:"2px 0" }}>
            {new Date().toLocaleDateString("en-GB")}
          </div>
          <div style={{ fontSize:"10px", color:C.light }}>Ref: {data.regNo}</div>
        </div>
      </div>

      {/* ── Student Profile ─────────────────────── */}
      <Section title="Student Profile">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px",
                      backgroundColor:C.slateLight, padding:"20px", borderRadius:"10px",
                      border:`1px solid ${C.border}` }}>
          {[
            ["Full Name",        data.name],
            ["Registration No.", data.regNo],
            ["Category",         data.category],
            ["Location",         `${data.city}, ${data.state}`],
          ].map(([lbl, val]) => (
            <div key={lbl}>
              <div style={{ fontSize:"10px", color:C.muted, textTransform:"uppercase",
                            letterSpacing:"0.06em", marginBottom:"4px" }}>{lbl}</div>
              <div style={{ fontSize:"15px", fontWeight:"700", color:C.text }}>{val}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Prediction Results ──────────────────── */}
      <Section title="AI Prediction Results">
        <div style={{ display:"flex", gap:"16px" }}>
          <StatBox bg={C.blue} label="NIMCET Marks" value={data.marks} sub="Out of 1000" />
          <StatBox bg={C.indigo} label="Predicted AIR" value={predictedRank} sub="All India Rank" />
        </div>
      </Section>

      {/* ── College Recommendations ──────────────── */}
      <Section title="College Recommendations">
        <CollegeBox
          bg={C.greenPale} border={C.greenLight}
          icon="✓" iconBg={C.green}
          label="Top Eligible College" labelColor={C.green}
          name={colleges.top} nameColor={C.greenDark}
        />
        {colleges.fallback && colleges.fallback !== "None" && colleges.fallback !== "Not Available" && (
          <div style={{ marginTop:"12px" }}>
            <CollegeBox
              bg={C.slateLight} border={C.slate200}
              icon="i" iconBg={C.slate400}
              label="Fallback Option" labelColor={C.muted}
              name={colleges.fallback} nameColor={C.slate800}
            />
          </div>
        )}
      </Section>

      {/* ── Footer ──────────────────────────────── */}
      <div style={{ borderTop:`2px solid ${C.borderThin}`, paddingTop:"20px", marginTop:"32px" }}>
        <div style={{ textAlign:"center", fontSize:"11px", color:C.muted, marginBottom:"4px" }}>
          This is an AI-generated prediction based on historical NIMCET cutoffs. Actual results may vary.
        </div>
        <div style={{ textAlign:"center", fontSize:"10px", color:C.light }}>
          © {new Date().getFullYear()} ACME MCA Entrance Academy. All rights reserved.
        </div>
      </div>
    </div>
  );
});

PdfTemplate.displayName = "PdfTemplate";

/* ── Sub-components (pure inline styles, hex only) ── */
function Section({ title, children }) {
  return (
    <div style={{ marginBottom:"28px" }}>
      <div style={{ fontSize:"13px", fontWeight:"700", color:C.slate800, textTransform:"uppercase",
                    letterSpacing:"0.06em", borderBottom:`2px solid ${C.borderThin}`,
                    paddingBottom:"8px", marginBottom:"16px" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function StatBox({ bg, label, value, sub }) {
  return (
    <div style={{ flex:1, backgroundColor:bg, color:"#ffffff", borderRadius:"12px",
                  padding:"20px", textAlign:"center" }}>
      <div style={{ fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.06em",
                    opacity:0.85, marginBottom:"6px" }}>{label}</div>
      <div style={{ fontSize:"34px", fontWeight:"900", lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:"10px", opacity:0.7, marginTop:"6px" }}>{sub}</div>
    </div>
  );
}

function CollegeBox({ bg, border, icon, iconBg, label, labelColor, name, nameColor }) {
  return (
    <div style={{ backgroundColor:bg, border:`1px solid ${border}`, borderRadius:"10px",
                  padding:"20px", display:"flex", alignItems:"flex-start", gap:"14px" }}>
      <div style={{ width:"36px", height:"36px", borderRadius:"50%", backgroundColor:iconBg,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    flexShrink:0, color:"#ffffff", fontWeight:"700", fontSize:"16px" }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize:"10px", fontWeight:"700", color:labelColor,
                      textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"6px" }}>
          {label}
        </div>
        <div style={{ fontSize:"20px", fontWeight:"800", color:nameColor }}>{name}</div>
      </div>
    </div>
  );
}
