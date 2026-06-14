import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import marksToRank from "../data/marks_to_rank.json";
import collegeCutoffs from "../data/college_cutoffs.json";
import { useTheme } from "../context/ThemeContext";
import { generatePdf } from "../utils/generatePdf";
import logo from "../assets/logo.png";
import topper1 from "../assets/topper1.jpg";
import topper2 from "../assets/topper2.jpg";
import ad1 from "../assets/ad_course1.png";
import ad2 from "../assets/ad_course2.png";
import ad3 from "../assets/ad_course3.png";

const ReportPage = () => {
  const location          = useLocation();
  const navigate          = useNavigate();
  const [slide, setSlide] = useState(0);
  const [pdfBusy, setPdfBusy] = useState(false);
  const { theme }         = useTheme();
  const dark              = theme === "dark";
  const data              = location.state;

  const photos = [
    { id:1, url:topper1, link:"https://acmeacademy.in", alt:"ACME Top Achiever 1" },
    { id:2, url:topper2, link:"https://acmeacademy.in", alt:"ACME Top Achiever 2" }
  ];

  useEffect(() => {
    if (!data) navigate("/");
    const t = setInterval(() => setSlide(p => (p+1)%photos.length), 3000);
    return () => clearInterval(t);
  }, [data, navigate, photos.length]);

  if (!data) return null;

  /* ── Rank & college lookup ── */
  const rankRecord = marksToRank.find(r => data.marks >= r.min_marks && data.marks <= r.max_marks);
  const rr         = rankRecord ? { rankLow: rankRecord.rank_low, rankHigh: rankRecord.rank_high } : null;
  const rankStr    = rr ? `${rr.rankLow} – ${rr.rankHigh}` : "N/A";

  const catList          = [...(collegeCutoffs[data.category] || [])].sort((a,b) => a.high - b.high);
  const eligibleColleges = catList.filter(c => rr && rr.rankLow <= c.high);
  const topC             = eligibleColleges.length > 0 ? eligibleColleges[0] : null;
  const fallbackC        = eligibleColleges.length > 1 ? eligibleColleges[1] : null;
  const colleges         = { top: topC?.college || "Not Eligible", fallback: fallbackC?.college || "None" };

  /* ── PDF download ── */
  const handleDownloadPDF = async () => {
    setPdfBusy(true);
    try {
      await generatePdf({ data, rr, colleges, logoSrc: logo });
    } catch(e) {
      console.error("PDF generation failed:", e);
      alert("PDF generation failed. Please try again.");
    } finally {
      setPdfBusy(false);
    }
  };

  /* ── Design tokens ── */
  const pageBg   = dark ? "#0f172a" : "#f1f5f9";
  const cardBg   = dark ? "#1e293b" : "#ffffff";
  const cardBdr  = dark ? "#334155" : "#e2e8f0";
  const txtMain  = dark ? "#f1f5f9" : "#0f172a";
  const txtMuted = dark ? "#94a3b8" : "#64748b";
  const txtLight = dark ? "#64748b" : "#94a3b8";

  const cardStyle = (extra = {}) => ({
    background: cardBg, borderRadius: "16px", border: `1px solid ${cardBdr}`,
    boxShadow: dark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 2px 16px rgba(0,0,0,0.06)",
    overflow: "hidden", transition: "background 0.3s", ...extra,
  });

  return (
    <div style={{ flex:1, overflowY:"auto", background:pageBg,
      transition:"background 0.3s", padding:"24px 16px" }}>
      <div style={{ maxWidth:"1100px", margin:"0 auto" }}>

        {/* ── Header ── */}
        <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center",
          justifyContent:"space-between", gap:"16px", marginBottom:"28px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
            <div style={{ background:cardBg, borderRadius:"14px", padding:"8px",
              border:`1px solid ${cardBdr}`, flexShrink:0 }}>
              <img src={logo} alt="ACME" style={{ height:"44px", width:"44px", objectFit:"contain" }}/>
            </div>
            <div>
              <h1 style={{ fontSize:"clamp(20px,4vw,28px)", fontWeight:"900",
                color:txtMain, margin:0, letterSpacing:"-0.5px" }}>
                Prediction Dashboard
              </h1>
              <p style={{ fontSize:"14px", color:txtMuted, margin:"4px 0 0" }}>
                Hello, <strong style={{ color:txtMain }}>{data.name}</strong>! Here are your AI-driven results.
              </p>
            </div>
          </div>

          <button onClick={handleDownloadPDF} disabled={pdfBusy}
            style={{ display:"flex", alignItems:"center", gap:"8px", padding:"12px 22px",
              borderRadius:"12px", border:"none", cursor: pdfBusy ? "wait" : "pointer",
              background: pdfBusy ? "#93c5fd" : "linear-gradient(90deg,#2563eb,#4f46e5)",
              color:"#fff", fontWeight:"700", fontSize:"14px",
              boxShadow:"0 4px 14px rgba(37,99,235,0.35)", flexShrink:0 }}>
            {pdfBusy ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                style={{ animation:"spin 0.8s linear infinite" }}>
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="4"/>
                <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
            )}
            {pdfBusy ? "Generating PDF…" : "Download PDF Report"}
          </button>
        </div>

        {/* ── Responsive grid ── */}
        <div className="report-grid" style={{ display:"grid",
          gridTemplateColumns:"minmax(0,2fr) minmax(0,1fr)", gap:"20px", alignItems:"start" }}>
          <style>{`@media(max-width:768px){.report-grid{grid-template-columns:1fr!important;}}`}</style>

          {/* LEFT */}
          <div style={{ display:"flex", flexDirection:"column", gap:"18px" }}>

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
              <div style={cardStyle({ padding:"22px", position:"relative" })}>
                <div style={{ position:"absolute", top:"-24px", right:"-24px", width:"80px",
                  height:"80px", borderRadius:"50%", background:"rgba(37,99,235,0.07)" }}/>
                <p style={{ fontSize:"11px", fontWeight:"700", color:txtMuted,
                  textTransform:"uppercase", letterSpacing:"0.06em", margin:"0 0 8px" }}>
                  Total Marks
                </p>
                <h2 style={{ fontSize:"44px", fontWeight:"900", color:"#2563eb",
                  margin:0, lineHeight:1 }}>
                  {data.marks}
                </h2>
                <p style={{ fontSize:"12px", color:txtMuted, marginTop:"8px" }}>
                  Category: <strong style={{ color:txtMain }}>{data.category}</strong>
                </p>
              </div>

              <div style={cardStyle({ padding:"22px", position:"relative",
                background: dark
                  ? "linear-gradient(135deg,rgba(30,58,138,0.3),rgba(67,56,202,0.3))"
                  : "linear-gradient(135deg,#eff6ff,#eef2ff)" })}>
                <div style={{ position:"absolute", top:"-24px", right:"-24px", width:"80px",
                  height:"80px", borderRadius:"50%", background:"rgba(99,102,241,0.08)" }}/>
                <p style={{ fontSize:"11px", fontWeight:"700", color:"#6366f1",
                  textTransform:"uppercase", letterSpacing:"0.06em", margin:"0 0 8px" }}>
                  Predicted AIR
                </p>
                <h2 style={{ fontSize:"clamp(22px,3.5vw,36px)", fontWeight:"900",
                  color: dark?"#a5b4fc":"#4338ca", margin:0, lineHeight:1.1 }}>
                  {rankStr}
                </h2>
                <p style={{ fontSize:"12px", color: dark?"#818cf8":"#6366f1", marginTop:"8px" }}>
                  Expected All India Rank
                </p>
              </div>
            </div>

            {/* College Recommendations */}
            <div style={cardStyle()}>
              <div style={{ padding:"16px 20px", borderBottom:`1px solid ${cardBdr}` }}>
                <h3 style={{ fontSize:"15px", fontWeight:"700", color:txtMain, margin:0 }}>
                  College Recommendations
                </h3>
              </div>
              <div style={{ padding:"18px", display:"flex", flexDirection:"column", gap:"12px" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:"14px", padding:"14px",
                  borderRadius:"12px",
                  background: dark ? "rgba(5,150,105,0.1)" : "#ecfdf5",
                  border:`1px solid ${dark ? "rgba(5,150,105,0.2)" : "#a7f3d0"}` }}>
                  <div style={{ width:"38px", height:"38px", borderRadius:"10px", flexShrink:0,
                    background: dark?"rgba(5,150,105,0.2)":"#d1fae5",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"
                      stroke={dark?"#34d399":"#059669"} strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 8h8"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize:"10px", fontWeight:"700",
                      color: dark?"#34d399":"#059669",
                      textTransform:"uppercase", letterSpacing:"0.06em", margin:"0 0 4px" }}>
                      Top Eligible College
                    </p>
                    <p style={{ fontSize:"19px", fontWeight:"800",
                      color: dark?"#a7f3d0":"#064e3b", margin:0 }}>
                      {colleges.top}
                    </p>
                  </div>
                </div>

                {colleges.fallback && colleges.fallback !== "None" && (
                  <div style={{ display:"flex", alignItems:"flex-start", gap:"14px", padding:"14px",
                    borderRadius:"12px", background: dark?"rgba(51,65,85,0.5)":"#f8fafc",
                    border:`1px solid ${cardBdr}` }}>
                    <div style={{ width:"38px", height:"38px", borderRadius:"10px", flexShrink:0,
                      background: dark?"rgba(71,85,105,0.4)":"#e2e8f0",
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"
                        stroke={txtMuted} strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontSize:"10px", fontWeight:"700", color:txtMuted,
                        textTransform:"uppercase", letterSpacing:"0.06em", margin:"0 0 4px" }}>
                        Fallback Option
                      </p>
                      <p style={{ fontSize:"16px", fontWeight:"700", color:txtMain, margin:0 }}>
                        {colleges.fallback}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ display:"flex", flexDirection:"column", gap:"18px" }}>
            {/* Profile card */}
            <div style={cardStyle({ padding:"20px" })}>
              <p style={{ fontSize:"10px", fontWeight:"700", color:txtMuted,
                textTransform:"uppercase", letterSpacing:"0.07em", margin:"0 0 16px" }}>
                Applicant Profile
              </p>
              {[
                ["Full Name",        data.name],
                ["Registration No.", data.regNo],
                ["Location",         `${data.city}, ${data.state}`],
              ].map(([lbl,val]) => (
                <div key={lbl} style={{ marginBottom:"14px" }}>
                  <p style={{ fontSize:"10px", color:txtLight, margin:"0 0 2px" }}>{lbl}</p>
                  <p style={{ fontSize:"15px", fontWeight:"600", color:txtMain,
                    margin:0, wordBreak:"break-word" }}>{val}</p>
                </div>
              ))}
            </div>

            {/* Carousel */}
            <div style={{ borderRadius:"16px", overflow:"hidden", border:`1px solid ${cardBdr}`,
              background:"#0f172a" }}>
              <div style={{ padding:"10px 16px", background:"#1e293b",
                borderBottom:"1px solid #334155", textAlign:"center" }}>
                <p style={{ fontSize:"10px", fontWeight:"700", color:"#94a3b8",
                  textTransform:"uppercase", letterSpacing:"0.08em", margin:0 }}>
                  ACME Top Achievers
                </p>
              </div>
              <div style={{ position:"relative", aspectRatio:"1", width:"100%", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ display:"flex", height:"100%", width:"100%",
                  transform:`translateX(-${slide*100}%)`,
                  transition:"transform 0.6s ease" }}>
                  {photos.map(p => (
                    <div key={p.id} style={{ width:"100%", height:"100%", flexShrink:0 }}>
                      <a href={p.link} target="_blank" rel="noopener noreferrer"
                        style={{ display:"block", width:"100%", height:"100%" }}>
                        <img src={p.url} alt={p.alt}
                          style={{ width:"100%", height:"100%", objectFit:"contain", background:"#0f172a" }}/>
                      </a>
                    </div>
                  ))}
                </div>
                <div style={{ position:"absolute", bottom:"10px", left:0, right:0,
                  display:"flex", justifyContent:"center", gap:"6px" }}>
                  {photos.map((_,i) => (
                    <div key={i} onClick={() => setSlide(i)}
                      style={{ cursor:"pointer", height:"5px", borderRadius:"3px",
                        transition:"width 0.3s, background 0.3s",
                        width: i===slide ? "18px" : "5px",
                        background: i===slide ? "#ffffff" : "rgba(255,255,255,0.3)" }}/>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Advertisement Section ── */}
        <div style={{
          marginTop: "32px",
          ...cardStyle({ padding:"28px" }),
          background: dark ? "linear-gradient(135deg, #1e293b, #0f172a)" : "linear-gradient(135deg, #ffffff, #f8fafc)",
          border: `1px solid ${dark ? "rgba(59,130,246,0.3)" : "rgba(59,130,246,0.2)"}`,
          boxShadow: dark ? "0 10px 30px rgba(0,0,0,0.3)" : "0 10px 30px rgba(59,130,246,0.08)"
        }}>
          <div style={{ textAlign:"center", marginBottom:"24px" }}>
            <div style={{ display:"inline-block", background:"#fee2e2", color:"#ef4444", padding:"4px 12px", borderRadius:"20px", fontSize:"12px", fontWeight:"800", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"12px" }}>
              Level Up Your Prep
            </div>
            <h3 style={{ fontSize:"clamp(18px, 3vw, 24px)", fontWeight:"800", color: txtMain, margin:"0 0 8px" }}>
              Didn't make it to your dream college this year?
            </h3>
            <p style={{ fontSize:"15px", color: txtMuted, margin:0, maxWidth:"600px", marginInline:"auto" }}>
              Don't worry! You still have a chance to ace your exams with our premium courses designed specifically for NIMCET & CUET 2027.
            </p>
          </div>
          
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:"20px" }}>
            {/* Course 1 */}
            <a href="https://acmea.courses.store/615002" target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none", display:"flex" }}>
              <div style={{ flex:1, borderRadius:"16px", background: dark?"rgba(15,23,42,0.6)":"#f1f5f9", border:`1px solid ${cardBdr}`, display:"flex", flexDirection:"column", overflow:"hidden", transition:"transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={(e)=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=dark?"0 12px 24px rgba(0,0,0,0.4)":"0 12px 24px rgba(0,0,0,0.08)"}}
                onMouseLeave={(e)=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none"}}>
                <img src={ad1} alt="Lakshya Dropper Batch" style={{ width:"100%", aspectRatio:"1", objectFit:"cover", borderBottom:`1px solid ${cardBdr}` }} />
                <div style={{ padding:"20px", display:"flex", flexDirection:"column", flex:1 }}>
                  <div style={{ display:"flex", gap:"8px", marginBottom:"10px", flexWrap:"wrap" }}>
                    <span style={{ fontSize:"10px", fontWeight:"800", background:"#fee2e2", color:"#dc2626", padding:"4px 8px", borderRadius:"6px", textTransform:"uppercase" }}>Dropper Batch</span>
                    <span style={{ fontSize:"10px", fontWeight:"800", background:"#fef08a", color:"#854d0e", padding:"4px 8px", borderRadius:"6px", textTransform:"uppercase" }}>Extra ₹2,000 Off</span>
                  </div>
                  <h4 style={{ fontSize:"16px", fontWeight:"800", color: txtMain, margin:"0 0 8px", lineHeight:1.4 }}>
                    NIMCET 2027 Lakshya Dropper Batch | NIMCET-2027 & CUET
                  </h4>
                  <div style={{ flex:1 }}></div>
                  <div style={{ marginTop:"16px", display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
                    <div>
                      <span style={{ fontSize:"12px", color:txtMuted, textDecoration:"line-through", marginRight:"6px" }}>₹20,000</span>
                      <span style={{ fontSize:"22px", fontWeight:"900", color: dark?"#34d399":"#059669" }}>₹18,000</span>
                    </div>
                    <div style={{ width:"32px", height:"32px", borderRadius:"50%", background:"#2563eb", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            </a>
            
            {/* Course 2 */}
            <a href="https://acmea.courses.store/380094" target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none", display:"flex" }}>
              <div style={{ flex:1, borderRadius:"16px", background: dark?"rgba(15,23,42,0.6)":"#f1f5f9", border:`1px solid ${cardBdr}`, display:"flex", flexDirection:"column", overflow:"hidden", transition:"transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={(e)=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=dark?"0 12px 24px rgba(0,0,0,0.4)":"0 12px 24px rgba(0,0,0,0.08)"}}
                onMouseLeave={(e)=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none"}}>
                <img src={ad2} alt="VOD Course" style={{ width:"100%", aspectRatio:"1", objectFit:"cover", borderBottom:`1px solid ${cardBdr}` }} />
                <div style={{ padding:"20px", display:"flex", flexDirection:"column", flex:1 }}>
                  <div style={{ display:"flex", gap:"8px", marginBottom:"10px", flexWrap:"wrap" }}>
                    <span style={{ fontSize:"10px", fontWeight:"800", background:"#f3e8ff", color:"#7e22ce", padding:"4px 8px", borderRadius:"6px", textTransform:"uppercase" }}>VOD Course</span>
                    <span style={{ fontSize:"10px", fontWeight:"800", background:"#fef08a", color:"#854d0e", padding:"4px 8px", borderRadius:"6px", textTransform:"uppercase" }}>Extra ₹500 Off</span>
                  </div>
                  <h4 style={{ fontSize:"16px", fontWeight:"800", color: txtMain, margin:"0 0 8px", lineHeight:1.4 }}>
                    VOD COURSE | NIMCET 2027 | CUET 2027 (ASSC-ACME Self...)
                  </h4>
                  <div style={{ flex:1 }}></div>
                  <div style={{ marginTop:"16px", display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
                    <div>
                      <span style={{ fontSize:"12px", color:txtMuted, textDecoration:"line-through", marginRight:"6px" }}>₹7,000</span>
                      <span style={{ fontSize:"22px", fontWeight:"900", color: dark?"#34d399":"#059669" }}>₹6,500</span>
                    </div>
                    <div style={{ width:"32px", height:"32px", borderRadius:"50%", background:"#2563eb", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            </a>
            
            {/* Course 3 */}
            <a href="https://acmea.courses.store/290322" target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none", display:"flex" }}>
              <div style={{ flex:1, borderRadius:"16px", background: dark?"rgba(15,23,42,0.6)":"#f1f5f9", border:`1px solid ${cardBdr}`, display:"flex", flexDirection:"column", overflow:"hidden", transition:"transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={(e)=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=dark?"0 12px 24px rgba(0,0,0,0.4)":"0 12px 24px rgba(0,0,0,0.08)"}}
                onMouseLeave={(e)=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none"}}>
                <img src={ad3} alt="Test Series" style={{ width:"100%", aspectRatio:"1", objectFit:"cover", borderBottom:`1px solid ${cardBdr}` }} />
                <div style={{ padding:"20px", display:"flex", flexDirection:"column", flex:1 }}>
                  <div style={{ display:"flex", gap:"8px", marginBottom:"10px", flexWrap:"wrap" }}>
                    <span style={{ fontSize:"10px", fontWeight:"800", background:"#dbeafe", color:"#1d4ed8", padding:"4px 8px", borderRadius:"6px", textTransform:"uppercase" }}>Test Series</span>
                    <span style={{ fontSize:"10px", fontWeight:"800", background:"#e0e7ff", color:"#4338ca", padding:"4px 8px", borderRadius:"6px", textTransform:"uppercase" }}>Best Seller</span>
                  </div>
                  <h4 style={{ fontSize:"16px", fontWeight:"800", color: txtMain, margin:"0 0 8px", lineHeight:1.4 }}>
                    ACME Premium Test Series<br/><span style={{fontSize:"13px", fontWeight:"600", color:txtLight}}>Target: NIMCET, CUET & MAH-CET</span>
                  </h4>
                  <div style={{ flex:1 }}></div>
                  <div style={{ marginTop:"16px", display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
                    <div>
                      <span style={{ fontSize:"22px", fontWeight:"900", color: dark?"#34d399":"#059669" }}>₹4,633</span>
                    </div>
                    <div style={{ width:"32px", height:"32px", borderRadius:"50%", background:"#2563eb", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
          
          <div style={{ textAlign:"center", marginTop:"24px", paddingTop:"20px", borderTop:`1px solid ${cardBdr}` }}>
            <a href="https://acmea.courses.store" target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:"8px", fontSize:"15px", fontWeight:"700", color:"#2563eb", textDecoration:"none", padding:"8px 16px", borderRadius:"8px", transition:"background 0.2s" }}
               onMouseEnter={(e)=>e.currentTarget.style.background=dark?"rgba(37,99,235,0.1)":"#eff6ff"}
               onMouseLeave={(e)=>e.currentTarget.style.background="transparent"}>
              Also for more courses visit acmea.courses.store
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
