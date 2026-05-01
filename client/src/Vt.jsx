import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStartup } from "./Vm";

export default function VMPage() {
  const navigate = useNavigate();
  const { sessionId, completeIdea, diffData, setDiffData,idea,setIdea,diff,setDiff } = useStartup();

  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [activeTab, setActiveTab] = useState("competitors");

  useEffect(() => {
    console.log("completeIdea:", completeIdea);
    if (!completeIdea?.short_summary) {
      navigate("/");
      return;
    }
    if (!diffData) {
      handleDifferentiation();
    }
  }, []);

  async function handleDifferentiation() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:4000/api/differentiation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ✅ Send shortSummary
        body: JSON.stringify({ shortSummary: completeIdea.short_summary })
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const result = await res.json();
      console.log("🔍 Diff result:", result);
      setDiffData(result);
      setDiff({msg:"differentation complte"})

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Make sure the backend is running on port 4000.");
    } finally {
      setLoading(false);
    }
  }

  const tabs = [
    { id: "competitors", label: "🏢 Competitors" },
    { id: "uvp",         label: "⚡ UVP" },
    { id: "positioning", label: "📍 Positioning" },
    { id: "takeaways",   label: "🏆 Takeaways" },
  ];

  return (
    <div style={{
      background: "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
      minHeight: "100vh", padding: "40px 20px",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "13px", marginBottom: "10px", padding: 0 }}>
              ← Back to Idea Validation
            </button>
            <h1 style={{ fontSize: "36px", fontWeight: "800", background: "linear-gradient(135deg, #fff 0%, #a78bfa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "6px" }}>
              Product Differentiation
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "15px" }}>How your idea stands out in the market</p>
          </div>

          {/* Progress */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            {[
              { label: "Idea Validation", done: true },
              { label: "Product Diff",    active: true },
              { label: "Pitch Prep",      done: false }
            ].map((step, i) => (
              <React.Fragment key={i}>
                <div style={{
                  padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                  background: step.done ? "#0d2e1f" : step.active ? "#1e1560" : "#1a1d26",
                  color: step.done ? "#34d399" : step.active ? "#818cf8" : "#6b7280",
                  border: `1px solid ${step.done ? "#1a4a30" : step.active ? "#2d2080" : "#252834"}`
                }}>
                  {step.done ? "✓ " : ""}{step.label}
                </div>
                {i < 2 && <span style={{ color: "#374151" }}>›</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Idea pill */}
        {completeIdea && (
          <div style={{ background: "rgba(17,24,39,0.8)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "12px 18px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34d399", flexShrink: 0 }} />
            <span style={{ fontSize: "12px", color: "#6b7280" }}>Working with:</span>
            <span style={{ fontSize: "13px", color: "#e8eaf0", fontWeight: "500" }}>{completeIdea.short_summary}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 40px", background: "rgba(17,24,39,0.8)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>🔍</div>
            <div style={{ color: "white", fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Analyzing the market...</div>
            <div style={{ color: "#94a3b8", fontSize: "14px" }}>Finding competitors, building UVP, identifying audience</div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ padding: "14px 16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", color: "#f87171", fontSize: "13px", marginBottom: "20px" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Results */}
        {diffData && !loading && (
          <div style={{ background: "rgba(17,24,39,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", overflow: "hidden" }}>

            {/* Tabs */}
            <div style={{ padding: "20px 28px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  padding: "8px 18px", borderRadius: "10px",
                  background: activeTab === tab.id ? "linear-gradient(135deg, #8b5cf6, #6366f1)" : "rgba(255,255,255,0.05)",
                  border: activeTab === tab.id ? "none" : "1px solid rgba(255,255,255,0.1)",
                  color: activeTab === tab.id ? "white" : "#94a3b8",
                  cursor: "pointer", fontSize: "13px", fontWeight: "600",
                }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Competitors */}
            {activeTab === "competitors" && (
              <div style={{ padding: "28px" }}>
                <div style={{ fontSize: "18px", fontWeight: "700", color: "white", marginBottom: "16px" }}>
                  Competitor Analysis
                  <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "400", marginLeft: "10px" }}>
                    {diffData.competitors?.length} found
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
                  {diffData.competitors?.map((c, i) => (
                    <div key={i} style={{ background: "#1a1d26", border: "1px solid #252834", borderRadius: "14px", padding: "18px", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(124,110,247,0.4)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#252834"; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <div style={{ fontSize: "15px", fontWeight: "700", color: "#e8eaf0" }}>{c.name}</div>
                        <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "20px", background: "#1e3a5f", color: "#60a5fa", fontWeight: "600" }}>#{i + 1}</span>
                      </div>
                      {c.description && <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "12px", lineHeight: "1.5" }}>{c.description}</div>}
                      <div style={{ marginBottom: "8px" }}>
                        <div style={{ fontSize: "10px", color: "#4fd1c5", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "5px" }}>Strengths</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                          {c.strengths?.map((s, j) => (
                            <span key={j} style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px", background: "#0d2e1f", color: "#4fd1c5", border: "1px solid rgba(79,209,197,.2)" }}>{s}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "10px", color: "#fc8181", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "5px" }}>Weaknesses</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                          {c.weaknesses?.map((w, j) => (
                            <span key={j} style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px", background: "#2d1515", color: "#fc8181", border: "1px solid rgba(252,129,129,.2)" }}>{w}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* UVP */}
            {activeTab === "uvp" && (
              <div style={{ padding: "28px" }}>
                <div style={{ fontSize: "18px", fontWeight: "700", color: "white", marginBottom: "16px" }}>Unique Value Proposition</div>
                <div style={{ background: "linear-gradient(140deg, #1a1d26, #1d1640 60%, #1a1d26)", border: "1px solid rgba(124,110,247,0.3)", borderRadius: "14px", padding: "24px", marginBottom: "20px" }}>
                  <div style={{ fontSize: "10px", color: "#818cf8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>Your UVP</div>
                  <div style={{ borderLeft: "3px solid #6366f1", paddingLeft: "16px", fontSize: "16px", color: "#cdd3f0", fontWeight: "500", lineHeight: "1.7" }}>
                    "{typeof diffData.uvp === "string" ? diffData.uvp : diffData.uvp?.statement}"
                  </div>
                </div>
                {diffData.uvp?.points && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                    {diffData.uvp.points.map((p, i) => (
                      <div key={i} style={{ background: "#1a1d26", border: "1px solid #252834", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                        <div style={{ fontSize: "24px", marginBottom: "8px" }}>{i === 0 ? "🎯" : i === 1 ? "💡" : "💰"}</div>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: "#cdd3f0", marginBottom: "6px" }}>{p.title}</div>
                        <div style={{ fontSize: "12px", color: "#8892b0", lineHeight: "1.5" }}>{p.desc}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Positioning */}
            {activeTab === "positioning" && (
              <div style={{ padding: "28px" }}>
                <div style={{ fontSize: "18px", fontWeight: "700", color: "white", marginBottom: "16px" }}>Market Positioning Map</div>
                <div style={{ background: "#1a1d26", border: "1px solid #252834", borderRadius: "14px", padding: "20px", position: "relative", height: "340px" }}>
                  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.12 }}>
                    <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#B4B2A9" strokeWidth="1" />
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#B4B2A9" strokeWidth="1" />
                  </svg>
                  <div style={{ position: "absolute", top: "8px", left: "50%", transform: "translateX(-50%)", fontSize: "11px", color: "#6b7280" }}>High Value</div>
                  <div style={{ position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)", fontSize: "11px", color: "#6b7280" }}>Low Value</div>
                  <div style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", fontSize: "11px", color: "#6b7280" }}>Affordable</div>
                  <div style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", fontSize: "11px", color: "#6b7280" }}>Expensive</div>

                  {diffData.positioning?.your_product && (() => {
                    const p = diffData.positioning.your_product;
                    return (
                      <div style={{ position: "absolute", left: `${50 + (p.x - 50) * 0.7}%`, top: `${50 - (p.y - 50) * 0.7}%`, transform: "translate(-50%,-50%)", zIndex: 2 }}>
                        <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#6366f1", border: "2px solid #818cf8", boxShadow: "0 0 14px #6366f1" }} />
                        <div style={{ position: "absolute", top: "22px", left: "50%", transform: "translateX(-50%)", fontSize: "10px", fontWeight: "700", color: "#818cf8", whiteSpace: "nowrap" }}>Your App</div>
                      </div>
                    );
                  })()}

                  {diffData.positioning?.competitors?.map((p, i) => (
                    <div key={i} style={{ position: "absolute", left: `${50 + (p.x - 50) * 0.7}%`, top: `${50 - (p.y - 50) * 0.7}%`, transform: "translate(-50%,-50%)" }}>
                      <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#4fd1c5", border: "2px solid #374151" }} />
                      <div style={{ position: "absolute", top: "16px", left: "50%", transform: "translateX(-50%)", fontSize: "10px", color: "#6b7280", whiteSpace: "nowrap" }}>{p.name}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#6b7280" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#6366f1", boxShadow: "0 0 8px #6366f1" }} /> Your app
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#6b7280" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#4fd1c5" }} /> Competitors
                  </div>
                </div>
              </div>
            )}

            {/* Takeaways */}
            {activeTab === "takeaways" && (
              <div style={{ padding: "28px" }}>
                <div style={{ fontSize: "18px", fontWeight: "700", color: "white", marginBottom: "16px" }}>Key Takeaways</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginBottom: "24px" }}>
                  {diffData.takeaways?.map((t, i) => (
                    <div key={i} style={{ background: "#1a1d26", border: "1px solid #252834", borderRadius: "14px", padding: "18px", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(124,110,247,.35)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#252834"; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                      <div style={{ fontSize: "24px", marginBottom: "10px" }}>{i === 0 ? "🎯" : i === 1 ? "💡" : i === 2 ? "🌍" : "🛡️"}</div>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: "#cdd3f0", marginBottom: "8px" }}>{t.title}</div>
                      <div style={{ fontSize: "13px", color: "#8892b0", lineHeight: "1.6" }}>{t.desc}</div>
                    </div>
                  ))}
                </div>
                {diffData.next_steps && (
                  <div style={{ background: "linear-gradient(135deg, #131629, #1a1e35)", border: "1px solid rgba(124,110,247,.2)", borderRadius: "14px", padding: "20px" }}>
                    <div style={{ fontSize: "15px", fontWeight: "700", color: "#e8eaf6", marginBottom: "8px" }}>🗺️ Next Steps</div>
                    <div style={{ fontSize: "13px", color: "#8892b0", lineHeight: "1.7" }}>{diffData.next_steps}</div>
                  </div>
                )}
              </div>
            )}

            {/* Move to Pitch */}
            <div style={{ margin: "0 28px 28px", padding: "20px 24px", background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "14px" }}>
              <div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "white", marginBottom: "4px" }}>✅ Product Differentiation Complete!</div>
                <div style={{ fontSize: "13px", color: "#94a3b8" }}>Ready to prepare your investor pitch?</div>
              </div>
              <button onClick={() => navigate("/Slides")} style={{ padding: "12px 22px", borderRadius: "12px", background: "linear-gradient(135deg, #8b5cf6, #6366f1)", border: "none", color: "white", fontWeight: "700", cursor: "pointer", fontSize: "14px", boxShadow: "0 6px 20px rgba(139,92,246,0.4)" }}>
                Move to Pitch Preparation →
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}