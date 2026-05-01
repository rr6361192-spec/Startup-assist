import React, {useContext,useState, useEffect, useRef, Children } from "react";
import Vt from "./Vt";
import { createContext } from "react";
export const StartupContext = createContext();
function Valid() {
  const [reply, setReply] = useState(null);
  const [miss, setMiss] = useState([]);
  const [value, setValue] = useState("");
  const [widths, setWidths] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [gaps, setGaps] = useState(0);
  const [activeTab, setActiveTab] = useState("scores");
  const [sessionId, setSessionId] = useState(null);
  const [showExamples, setShowExamples] = useState(true);
  const [overall, setOverall] = useState(null);
  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const chatEndRef = useRef(null);

  const tags = [
    { text: "Remote work SaaS", color: "#8b5cf6", idea: "A SaaS tool that helps remote teams manage async work and avoid meeting overload. Teams pay $20/month per user." },
    { text: "EdTech AI tutor", color: "#6366f1", idea: "An AI tutor that personalises learning paths for K-12 students based on their mistakes and learning speed." },
    { text: "Health marketplace", color: "#10b981", idea: "A marketplace connecting freelance physiotherapists with elderly patients at home. Subscription model, ₹999/month." },
    { text: "Climate fintech", color: "#06b6d4", idea: "A carbon credit trading platform for small businesses to offset their emissions easily. B2B SaaS pricing." },
  ];

  const classColor = {
    UNCLEAR: "#02a1f7",
    SOMEWHAT: "#00ffae",
    UNKNOWN: "#e98400",
    WEAK: "#00cee9",
    STRONG: "#02f77d",
    MISSING: "#f87171",
  };

  const scoreLabels = {
    problem_clarity: "Problem",
    solution_fit: "Solution",
    market_size: "Market",
    competitive_moat: "Moat",
    revenue_stability: "Revenue",
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  useEffect(() => {
    if (!reply?.scores) return;

    const keys = Object.keys(reply.scores);
    const reset = {};
    keys.forEach((k) => (reset[k] = 0));
    setWidths(reset);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const filled = {};
        Object.entries(reply.scores).forEach(([k, v]) => {
          filled[k] = v.score || 0;
        });
        setWidths(filled);
      });
    });
  }, [reply]);

  async function handleAnalyse() {
    if (!value.trim()) return;

    setLoading(true);
    setError(null);
    setReply(null);
    setChatHistory([]);
    setGaps(0);
    setActiveTab("scores");
    setSessionId(null);
    setReport(null);

    try {
      const res = await fetch("http://localhost:4000/api/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: value }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      const analysis = data.analysis || data;
      const gapp = data.gaps || [];

      setMiss(gapp);
      setOverall(data.overall);
      setReply(analysis);
      setGaps(analysis.missing_areas?.length || 0);
      setSessionId(data.sessionId);
      setShowExamples(false);

      if (data.firstMessage) {
        setChatHistory([{ role: "ai", text: data.firstMessage }]);
      }

      // No gaps — idea complete immediately
      if (data.status === "IDEA_COMPLETE" && data.finalResult) {
        setReply((prev) => ({
          ...prev,
          scores: data.finalResult.final_scores,
          complete_idea: data.finalResult.complete_idea,
          market_viability: data.finalResult.market_viability,
          strengths: data.finalResult.strengths,
          assumptions: data.finalResult.assumptions,
          remaining_gaps: data.finalResult.remaining_gaps,
        }));
        setOverall(data.finalResult.overall_score);

        const filled = {};
        Object.entries(data.finalResult.final_scores).forEach(([k, v]) => {
          filled[k] = v.score || 0;
        });
        setWidths(filled);
        
        // Use report from backend if available
        if (data.report && Object.keys(data.report).length > 0) {
          setReport(data.report);
        } else {
          setReport(buildReport(data.finalResult));
        }
        
        setActiveTab("report");
      }

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Make sure the backend is running on port 4000.");
    } finally {
      setLoading(false);
    }
  }

  function buildReport(finalResult) {
    return {
      idea: finalResult.complete_idea?.title || finalResult.complete_idea?.short_summary,
      competitors: [],
      uvp: {
        statement: finalResult.complete_idea?.competitive_advantage || "",
        points: [
          {
            title: "Problem",
            desc: finalResult.complete_idea?.problem
          },
          {
            title: "Solution",
            desc: finalResult.complete_idea?.solution
          },
          {
            title: "Revenue",
            desc: finalResult.complete_idea?.revenue_model
          }
        ]
      },
      positioning: {
        your_product: { x: 50, y: 50 },
        competitors: [],
        market_gap: { x: 30, y: 70 }
      },
      features: Object.entries(finalResult.final_scores || {}).map(([key, val]) => ({
        name: key.replace(/_/g, " "),
        values: {
          score: val.score,
          classification: val.classification
        }
      })),
      takeaways: finalResult.strengths?.map(s => ({
        title: s.dimension?.replace(/_/g, " ") || "",
        desc: s.finding
      })) || [],
      next_steps: finalResult.market_viability?.reasoning || ""
    };
  }

  async function handleChat() {
    if (!chatInput.trim() || chatLoading || !sessionId) return;

    const userMsg = chatInput.trim();
    setChatInput("");
    setChatHistory((prev) => [...prev, { role: "founder", text: userMsg }]);
    setChatLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, sessionId }),
      });

      if (!res.ok) throw new Error("Chat error");
      const data = await res.json();
      
      setChatHistory((prev) => [...prev, { role: "ai", text: data.reply }]);

      // Update live scores
      if (data.liveScores) {
        setReply((prev) => ({ ...prev, scores: data.liveScores }));
        setOverall(data.overall);

        const filled = {};
        Object.entries(data.liveScores).forEach(([k, v]) => {
          filled[k] = v.score || 0;
        });
        setWidths(filled);
      }

      // Idea complete
      if (data.status === "IDEA_COMPLETE" && data.finalResult) {
        setReportLoading(true);
        
        setReply((prev) => ({
          ...prev,
          scores: data.finalResult.final_scores,
          complete_idea: data.finalResult.complete_idea,
          market_viability: data.finalResult.market_viability,
          strengths: data.finalResult.strengths,
          assumptions: data.finalResult.assumptions,
          remaining_gaps: data.finalResult.remaining_gaps,
        }));
        setOverall(data.finalResult.overall_score);

        const filled = {};
        Object.entries(data.finalResult.final_scores).forEach(([k, v]) => {
          filled[k] = v.score || 0;
        });
        setWidths(filled);
        
        // Use the report from backend if available
        if (data.report && Object.keys(data.report).length > 0) {
          console.log("Received report from backend:", data.report);
          setReport(data.report);
      
        } else {
          console.log("No report from backend, building fallback");
          setReport(buildReport(data.finalResult));
        }
        
        setReportLoading(false);
        setActiveTab("report");
      }

    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [...prev, { role: "ai", text: "Error — please try again." }]);
      setReportLoading(false);
    } finally {
      setChatLoading(false);
    }
  }

  function handleClear() {
    setValue("");
    setReply(null);
    setWidths({});
    setChatHistory([]);
    setError(null);
    setGaps(0);
    setActiveTab("scores");
    setSessionId(null);
    setShowExamples(true);
    setOverall(null);
    setMiss([]);
    setReport(null);
    setReportLoading(false);
  }

  return (
<StartupContext.Provider value={{
      sessionId, setSessionId,
      completeIdea, setCompleteIdea,
      finalResult, setFinalResult,
      scores, setScores,
      overall, setOverall,
      miss, setMiss,
      report, setReport,
      competitors, setCompetitors,
      uvp, setUvp,
      targetAudience, setTargetAudience,
      positioning, setPositioning,
    }}>
      {Children}</StartupContext.Provider>

  )
  return(
    <div style={{
      background: "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
      minHeight: "100vh",
      padding: "40px 20px",
      fontFamily: "'Inter', 'Instrument Sans', 'Segoe UI', sans-serif",
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-block", marginBottom: "16px" }}>
            <span style={{
              background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
              padding: "4px 12px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: "600",
              color: "white"
            }}>
              AI-Powered Startup Analysis
            </span>
          </div>
          <h1 style={{
            fontSize: "48px",
            fontWeight: "800",
            background: "linear-gradient(135deg, #fff 0%, #a78bfa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "16px"
          }}>
            Validate Your Startup Idea
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "18px", maxWidth: "600px", margin: "0 auto" }}>
            Get instant feedback, identify gaps, and refine your business model with AI
          </p>
        </div>

        {/* Input Card */}
        <div style={{
          background: "rgba(17,24,39,0.8)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "24px",
          padding: "32px",
          marginBottom: "32px",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
        }}>
          <textarea
            placeholder="Describe your startup idea in detail...&#10;&#10;Example: &#10;'A platform that connects freelance graphic designers with small businesses who need quick logo designs. We take 20% commission per transaction. Target market: 50M small businesses globally.'"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{
              width: "100%",
              height: "140px",
              background: "rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "16px",
              padding: "16px",
              color: "#e2e8f0",
              outline: "none",
              resize: "vertical",
              fontSize: "14px",
              lineHeight: "1.6",
              fontFamily: "inherit",
              marginBottom: "20px"
            }}
          />

          {/* Quick Examples */}
          {showExamples && (
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "500" }}>Quick Examples</span>
                <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.1)" }} />
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {tags.map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => setValue(tag.idea)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "12px",
                      background: `rgba(${parseInt(tag.color.slice(1,3), 16)}, ${parseInt(tag.color.slice(3,5), 16)}, ${parseInt(tag.color.slice(5,7), 16)}, 0.1)`,
                      border: `1px solid ${tag.color}40`,
                      color: tag.color,
                      fontSize: "13px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = tag.color;
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `rgba(${parseInt(tag.color.slice(1,3), 16)}, ${parseInt(tag.color.slice(3,5), 16)}, ${parseInt(tag.color.slice(5,7), 16)}, 0.1)`;
                      e.currentTarget.style.color = tag.color;
                    }}
                  >
                    {tag.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={handleAnalyse}
              disabled={loading || !value.trim()}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "12px",
                background: loading ? "#4b5563" : "linear-gradient(135deg, #8b5cf6, #6366f1)",
                border: "none",
                color: "white",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "14px",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {loading ? " Analysing..." : " Analyse Your Idea"}
            </button>

            <button
              onClick={handleClear}
              style={{
                padding: "14px 24px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.05)",
                color: "white",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
            >
              Clear
            </button>
          </div>

          {error && (
            <div style={{
              marginTop: "16px",
              padding: "12px 16px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "12px",
              color: "#f87171",
              fontSize: "13px",
            }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Results */}
        {reply?.scores && (
          <div style={{
            background: "rgba(17,24,39,0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "24px",
            overflow: "hidden",
          }}>

            {/* Header */}
            <div style={{
              padding: "32px",
              background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(99,102,241,0.05))",
              borderBottom: "1px solid rgba(255,255,255,0.1)"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  <div style={{ position: "relative", width: "100px", height: "100px" }}>
                    <svg style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
                      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="45" fill="none"
                        stroke="#f5a623" strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - (overall || 0) / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div style={{
                      position: "absolute", top: "50%", left: "50%",
                      transform: "translate(-50%, -50%)", textAlign: "center"
                    }}>
                      <div style={{ fontSize: "28px", fontWeight: "800", color: "white" }}>{overall || 0}</div>
                      <div style={{ fontSize: "10px", color: "#94a3b8" }}>SCORE</div>
                    </div>
                  </div>
                  <div>
                    <h2 style={{ fontSize: "24px", fontWeight: "700", color: "white", marginBottom: "4px" }}>
                      Idea Analysis Complete
                    </h2>
                    <p style={{ color: "#94a3b8", fontSize: "14px" }}>
                      {overall >= 70 ? "Strong potential! Here's your breakdown:" :
                       overall >= 50 ? "Good start. Focus on these areas:" :
                       "Needs work. Check these critical gaps:"}
                    </p>
                  </div>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: "8px", background: "rgba(0,0,0,0.4)", padding: "4px", borderRadius: "12px" }}>
                  {[
                    { id: "scores", label: " Scores" },
                    { id: "gaps", label: ` Gaps (${miss?.length || 0})` },
                    { id: "chat", label: " AI Chat" },
                    { id: "report", label: " Full Report" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        padding: "8px 20px",
                        borderRadius: "8px",
                        background: activeTab === tab.id ? "linear-gradient(135deg, #8b5cf6, #6366f1)" : "transparent",
                        border: "none",
                        color: activeTab === tab.id ? "white" : "#94a3b8",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "600",
                        transition: "all 0.2s",
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scores Tab */}
            {activeTab === "scores" && (
              <div style={{ padding: "32px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                  {Object.entries(reply.scores).map(([key, item]) => {
                    const normalizedClass = item.classification?.trim().toUpperCase().replace(/[\s-]+/g, "_") || "";
                    const color = classColor[normalizedClass] || "#d82929";

                    return (
                      <div
                        key={key}
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "16px",
                          padding: "20px",
                          transition: "transform 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.borderColor = `${color}40`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontSize: "24px" }}>{getIconForDimension(key)}</span>
                            <span style={{ color: "white", fontWeight: "600", fontSize: "15px" }}>
                              {scoreLabels[key] || key}
                            </span>
                          </div>
                          <span style={{
                            color: color,
                            fontSize: "13px",
                            fontWeight: "700",
                            padding: "4px 12px",
                            borderRadius: "8px",
                            background: `${color}18`,
                            border: `1px solid ${color}40`,
                          }}>
                            {item.classification || "Unknown"}
                          </span>
                        </div>

                        <div style={{ marginBottom: "12px" }}>
                          <div style={{
                            width: "100%", height: "8px",
                            background: "rgba(255,255,255,0.08)",
                            borderRadius: "4px", overflow: "hidden",
                          }}>
                            <div style={{
                              width: `${widths[key] || 0}%`,
                              height: "100%",
                              background: color,
                              borderRadius: "4px",
                              transition: "width 1s cubic-bezier(0.22, 1, 0.36, 1)",
                              boxShadow: `0 0 10px ${color}`,
                            }} />
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                            <span style={{ color: "#94a3b8", fontSize: "11px" }}>Score</span>
                            <span style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>
                              {Math.round(widths[key] || 0)}/100
                            </span>
                          </div>
                        </div>

                        {item.reasoning && (
                          <div style={{
                            padding: "10px 12px",
                            background: "rgba(0,0,0,0.3)",
                            borderRadius: "8px",
                            color: "#94a3b8",
                            fontSize: "12px",
                            lineHeight: "1.5"
                          }}>
                            {item.reasoning}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div style={{
                  marginTop: "32px", padding: "20px",
                  background: "rgba(139,92,246,0.05)",
                  borderRadius: "16px",
                  border: "1px solid rgba(139,92,246,0.2)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "20px" }}>💡</span>
                    <h3 style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>AI Recommendation</h3>
                  </div>
                  <p style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: "1.6" }}>
                    {overall >= 70 ?
                      "Your idea shows strong fundamentals. Focus on the gaps identified to strengthen your positioning before seeking funding." :
                      overall >= 50 ?
                      "You have a solid foundation but need to address critical gaps. Use the AI chat to refine your thinking on weak areas." :
                      "Consider pivoting or significantly refining your approach. Use the chat feature to explore alternative angles and validate assumptions."}
                  </p>
                </div>
              </div>
            )}

            {/* Gaps Tab */}
            {activeTab === "gaps" && (
              <div style={{ padding: "32px" }}>
                {miss.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                    <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}></span>
                    <p>No critical gaps found! Your idea is well defined.</p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "20px" }}>
                    {miss.map((gap, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "20px",
                          borderRadius: "16px",
                          background: gap.severity === "CRITICAL" ? "rgba(233,89,0,0.08)" : "rgba(250,200,0,0.05)",
                          border: gap.severity === "CRITICAL" ? "1px solid rgba(233,89,0,0.2)" : "1px solid rgba(250,200,0,0.2)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "20px" }}>{gap.severity === "CRITICAL" ? "🔴" : "🟡"}</span>
                            <div style={{
                              color: gap.severity === "CRITICAL" ? "#e95900" : "#f5c400",
                              fontWeight: "700", fontSize: "14px", textTransform: "capitalize"
                            }}>
                              {gap.dimension?.replace(/_/g, " ")}
                            </div>
                          </div>
                          <span style={{
                            fontSize: "11px", fontWeight: "700",
                            padding: "3px 10px", borderRadius: "20px",
                            background: gap.severity === "CRITICAL" ? "rgba(233,89,0,0.2)" : "rgba(250,200,0,0.15)",
                            color: gap.severity === "CRITICAL" ? "#e95900" : "#f5c400",
                          }}>
                            {gap.severity}
                          </span>
                        </div>

                        <div style={{ color: "#cbd5e1", fontSize: "13px", lineHeight: "1.5", marginBottom: "10px" }}>
                          {gap.what_is_missing}
                        </div>

                        <div style={{
                          padding: "10px 12px",
                          background: "rgba(0,0,0,0.3)",
                          borderRadius: "8px", marginBottom: "8px"
                        }}>
                          <div style={{ color: "#94a3b8", fontSize: "11px", marginBottom: "4px" }}>Why it matters</div>
                          <div style={{ color: "#f0a030", fontSize: "13px" }}>{gap.why_it_matters}</div>
                        </div>

                        <div style={{
                          padding: "10px 12px",
                          background: "rgba(0,0,0,0.3)",
                          borderRadius: "8px"
                        }}>
                          <div style={{ color: "#94a3b8", fontSize: "11px", marginBottom: "4px" }}>How to fix</div>
                          <div style={{ color: "#34d399", fontSize: "13px" }}>{gap.fix_hint}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Chat Tab */}
            {activeTab === "chat" && (
              <div style={{ padding: "32px", display: "flex", flexDirection: "column", height: "600px" }}>
                <div style={{ flex: 1, overflowY: "auto", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {chatHistory.length === 0 && (
                    <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                      <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}></span>
                      <p>Start a conversation with the AI to refine your idea</p>
                      <p style={{ fontSize: "13px", marginTop: "8px" }}>Answer the questions to validate your assumptions</p>
                    </div>
                  )}
                  {chatHistory.map((msg, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: msg.role === "founder" ? "flex-end" : "flex-start",
                      }}
                    >
                      <div style={{
                        maxWidth: "70%",
                        padding: "12px 16px",
                        fontSize: "14px",
                        lineHeight: "1.5",
                        background: msg.role === "founder"
                          ? "linear-gradient(135deg, #8b5cf6, #6366f1)"
                          : "rgba(255,255,255,0.06)",
                        border: msg.role === "ai" ? "1px solid rgba(255,255,255,0.1)" : "none",
                        color: "white",
                        borderRadius: msg.role === "founder" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                      }}>
                        <div style={{ fontSize: "11px", opacity: 0.7, marginBottom: "4px" }}>
                          {msg.role === "founder" ? "You" : "Alex — AI Coach"}
                        </div>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div style={{ display: "flex" }}>
                      <div style={{
                        padding: "12px 16px",
                        borderRadius: "4px 16px 16px 16px",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#94a3b8",
                        fontSize: "13px",
                      }}>
                        Alex is thinking...
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div style={{ display: "flex", gap: "12px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleChat()}
                    placeholder={sessionId ? "Type your response here..." : "Analyse an idea first to start chatting"}
                    disabled={!sessionId}
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      background: "rgba(0,0,0,0.4)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "12px",
                      color: "white",
                      fontSize: "14px",
                      outline: "none",
                      fontFamily: "inherit",
                    }}
                  />
                  <button
                    onClick={handleChat}
                    disabled={chatLoading || !chatInput.trim() || !sessionId}
                    style={{
                      padding: "12px 24px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                      border: "none",
                      color: "white",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontSize: "14px",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (!chatLoading && chatInput.trim() && sessionId) {
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    Send →
                  </button>
                </div>
              </div>
            )}

            {/* Report Tab */}
            {activeTab === "report" && (
              <div style={{ padding: "32px" }}>
                {reportLoading ? (
                  <div style={{
                    textAlign: "center",
                    padding: "60px",
                    color: "#94a3b8"
                  }}>
                    <div style={{
                      display: "inline-block",
                      width: "40px",
                      height: "40px",
                      border: "3px solid rgba(139,92,246,0.3)",
                      borderTopColor: "#8b5cf6",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      marginBottom: "16px"
                    }} />
                    <p>Generating your comprehensive report...</p>
                    <style>{`
                      @keyframes spin {
                        to { transform: rotate(360deg); }
                      }
                    `}</style>
                  </div>
                ) : report ? (
                  <Vt report={report} />
                ) : (
                  <div style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#94a3b8"
                  }}>
                    <span style={{
                      fontSize: "48px",
                      display: "block",
                      marginBottom: "16px"
                    }}>
                      
                    </span>
                    <p>Complete the chat validation first to generate your full report.</p>
                    <p style={{ fontSize: "13px", marginTop: "8px" }}>
                      Answer all questions in the AI Chat tab to unlock this report.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* Empty State */}
        {!reply && !loading && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "32px"
          }}>
            {[
              { icon: "🎯", title: "Clear Problem Statement", desc: "Define the specific problem you're solving" },
              { icon: "💡", title: "Unique Solution", desc: "Explain what makes your solution different" },
              { icon: "💰", title: "Revenue Model", desc: "How will you make money?" },
              { icon: "👥", title: "Target Market", desc: "Who are your customers?" }
            ].map((tip, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(17,24,39,0.6)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  padding: "20px",
                  textAlign: "center"
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>{tip.icon}</div>
                <h3 style={{ color: "white", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>{tip.title}</h3>
                <p style={{ color: "#94a3b8", fontSize: "12px" }}>{tip.desc}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

function getIconForDimension(dimension) {
  const icons = {
    problem_clarity: "🎯",
    solution_fit: "💡",
    market_size: "🌍",
    competitive_moat: "🛡️",
    revenue_stability: "💰",
  };
  return icons[dimension] || "📊";
}

export default Valid;