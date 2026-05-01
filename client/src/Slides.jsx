import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStartup } from "./Vm";

export default function Pitch() {
  const navigate = useNavigate();
  const {
    sessionId,
    completeIdea,
    diffData,
    pitchDeck, setPitchDeck,
    elevatorPitch, setElevatorPitch,
    pitchScore, setPitchScore,
    qaHistory, setQaHistory,
    idea,setIdea,diff,setDiff
  } = useStartup();

  const [activeTab, setActiveTab] = useState("deck");
  const [loading, setLoading] = useState(false);
  const [deckLoading, setDeckLoading] = useState(false);
  const [elevatorLoading, setElevatorLoading] = useState(false);
  const [qaLoading, setQaLoading] = useState(false);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [qaInput, setQaInput] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [error, setError] = useState(null);
  const qaEndRef = useRef(null);

  useEffect(() => {
    if (!completeIdea?.short_summary) {
      navigate("/");
      return;
    }
    // Auto generate pitch deck and elevator pitch on load
    if (!pitchDeck) generatePitchDeck();
    if (!elevatorPitch) generateElevatorPitch();
  }, []);

  useEffect(() => {
    qaEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [qaHistory]);

  // ── Generate Pitch Deck ───────────────────
  async function generatePitchDeck() {
    setDeckLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/pitch/deck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
      });
      if (!res.ok) throw new Error("Failed to generate pitch deck");
      const data = await res.json();
      setPitchDeck(data.slides);
    } catch (err) {
      console.error(err);
      setError("Failed to generate pitch deck.");
    } finally {
      setDeckLoading(false);
    }
  }

  // ── Generate Elevator Pitch ───────────────
  async function generateElevatorPitch() {
    setElevatorLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/pitch/elevator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
      });
      if (!res.ok) throw new Error("Failed to generate elevator pitch");
      const data = await res.json();
      setElevatorPitch(data.elevator_pitch);
    } catch (err) {
      console.error(err);
    } finally {
      setElevatorLoading(false);
    }
  }

  // ── Start Q&A ─────────────────────────────
  async function startQA() {
    if (qaHistory.length > 0) return;
    setQaLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/pitch/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, answer: null, qaHistory: [] })
      });
      if (!res.ok) throw new Error("Failed to get question");
      const data = await res.json();
      setCurrentQuestion(data.question);
      setQaHistory([{ role: "investor", text: data.question }]);
      setQuestionCount(1);
    } catch (err) {
      console.error(err);
    } finally {
      setQaLoading(false);
    }
  }

  // ── Answer Q&A ────────────────────────────
  async function handleAnswer() {
    if (!qaInput.trim() || qaLoading) return;

    const answer = qaInput.trim();
    setQaInput("");

    const updatedHistory = [
      ...qaHistory,
      { role: "founder", text: answer }
    ];
    setQaHistory(updatedHistory);
    setQaLoading(true);

    try {
      // After 5 questions → generate score
      if (questionCount >= 5) {
        await generatePitchScore(updatedHistory);
        return;
      }

      const res = await fetch("http://localhost:4000/api/pitch/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          answer,
          qaHistory: updatedHistory
        })
      });
      if (!res.ok) throw new Error("Failed to get next question");
      const data = await res.json();

      setQaHistory([
        ...updatedHistory,
        { role: "investor", text: data.question },
      ]);

      if (data.feedback) {
        setQaHistory(prev => [
          ...prev,
          { role: "feedback", text: data.feedback }
        ]);
      }

      setCurrentQuestion(data.question);
      setQuestionCount(prev => prev + 1);

    } catch (err) {
      console.error(err);
      setQaHistory(prev => [...prev, { role: "investor", text: "Error — please try again." }]);
    } finally {
      setQaLoading(false);
    }
  }

  // ── Generate Pitch Score ──────────────────
  async function generatePitchScore(history) {
    setScoreLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/pitch/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          qaHistory: history || qaHistory
        })
      });
      if (!res.ok) throw new Error("Failed to generate pitch score");
      const data = await res.json();
      setPitchScore(data);
      setActiveTab("score");
    } catch (err) {
      console.error(err);
    } finally {
      setScoreLoading(false);
      setQaLoading(false);
    }
  }

  // ── Download PPT ──────────────────────────
  
   // Use your ngrok URL (keep this in a variable)
const PYTHON_URL = "https://accompany-cryptic-coral.ngrok-free.dev";

async function downloadPPT() {
  try {
    setLoading(true);
    
    const res = await fetch(`${PYTHON_URL}/generate-ppt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: completeIdea?.title || "Startup Pitch",
        num_slides: pitchDeck?.length || 10,
        slides: pitchDeck  // Your 10 slides from the AI
      })
    });
    
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`HTTP ${res.status}: ${error}`);
    }
    
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${completeIdea?.title || "pitch"}_deck.pptx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log("✅ PPT downloaded successfully!");
    
  } catch (err) {
    console.error("Download error:", err);
    setError("Failed to download PPT: " + err.message);
  } finally {
    setLoading(false);
  }
}
  

  const tabs = [
    { id: "deck", label: "📊 Pitch Deck" },
    { id: "elevator", label: "🎤 Elevator Pitch" },
    { id: "qa", label: "💬 Investor Q&A" },
    { id: "score", label: "🏆 Pitch Score" },
  ];

  const slideIcons = {
    "Title": "🚀",
    "Problem": "😟",
    "Solution": "💡",
    "Market Size": "🌍",
    "Product": "📱",
    "Business Model": "💰",
    "Competitors": "🏢",
    "Your Edge": "⚡",
    "Traction": "📈",
    "The Ask": "🤝",
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
      minHeight: "100vh",
      padding: "40px 20px",
      fontFamily: "'Inter', 'Instrument Sans', 'Segoe UI', sans-serif",
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <button
              onClick={() => navigate("/differentiation")}
              style={{
                background: "none", border: "none",
                color: "#94a3b8", cursor: "pointer",
                fontSize: "13px", marginBottom: "10px",
                display: "flex", alignItems: "center", gap: "6px", padding: 0
              }}
            >
              ← Back to Product Differentiation
            </button>
            <h1 style={{
              fontSize: "36px", fontWeight: "800",
              background: "linear-gradient(135deg, #fff 0%, #a78bfa 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              marginBottom: "6px"
            }}>
              Pitch Preparation
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "15px" }}>
              Get investor-ready with AI-powered pitch tools
            </p>
          </div>

          {/* Progress */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            {[
              { label: "Idea Validation", done: true },
              { label: "Product Diff", done: true },
              { label: "Pitch Prep", active: true }
            ].map((step, i) => (
              <React.Fragment key={i}>
                <div style={{
                  padding: "5px 12px", borderRadius: "20px",
                  fontSize: "12px", fontWeight: "600",
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
          <div style={{
            background: "rgba(17,24,39,0.8)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "12px", padding: "12px 18px",
            marginBottom: "20px",
            display: "flex", alignItems: "center", gap: "10px"
          }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34d399", flexShrink: 0 }} />
            <span style={{ fontSize: "12px", color: "#6b7280" }}>Pitching:</span>
            <span style={{ fontSize: "13px", color: "#e8eaf0", fontWeight: "500" }}>
              {completeIdea.title} — {completeIdea.short_summary}
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            padding: "14px 16px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "12px", color: "#f87171",
            fontSize: "13px", marginBottom: "20px"
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Main Card */}
        <div style={{
          background: "rgba(17,24,39,0.8)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "24px", overflow: "hidden"
        }}>

          {/* Tabs */}
          <div style={{
            padding: "20px 28px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            display: "flex", gap: "8px", flexWrap: "wrap"
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === "qa" && qaHistory.length === 0) startQA();
                }}
                style={{
                  padding: "8px 18px", borderRadius: "10px",
                  background: activeTab === tab.id ? "linear-gradient(135deg, #8b5cf6, #6366f1)" : "rgba(255,255,255,0.05)",
                  border: activeTab === tab.id ? "none" : "1px solid rgba(255,255,255,0.1)",
                  color: activeTab === tab.id ? "white" : "#94a3b8",
                  cursor: "pointer", fontSize: "13px", fontWeight: "600",
                }}
              >
                {tab.label}
                {tab.id === "score" && pitchScore && (
                  <span style={{ marginLeft: "6px", fontSize: "11px", background: "#0d2e1f", color: "#34d399", padding: "2px 6px", borderRadius: "10px" }}>
                    {pitchScore.overall_score}/100
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── PITCH DECK TAB ── */}
          {activeTab === "deck" && (
            <div style={{ padding: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: "white", marginBottom: "4px" }}>
                    Pitch Deck
                  </div>
                  <div style={{ fontSize: "13px", color: "#94a3b8" }}>
                    10 investor-ready slides generated from your idea
                  </div>
                </div>
                <button
                  onClick={downloadPPT}
                  disabled={!pitchDeck}
                  style={{
                    padding: "10px 20px", borderRadius: "10px",
                    background: pitchDeck ? "linear-gradient(135deg, #8b5cf6, #6366f1)" : "#374151",
                    border: "none", color: "white",
                    fontWeight: "600", cursor: pitchDeck ? "pointer" : "not-allowed",
                    fontSize: "13px", display: "flex", alignItems: "center", gap: "8px"
                  }}
                >
                  ⬇️ Download .pptx
                </button>
              </div>

              {deckLoading ? (
                <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
                  <div style={{ fontSize: "40px", marginBottom: "16px" }}>📊</div>
                  <div style={{ fontSize: "16px", color: "white", marginBottom: "8px" }}>Generating your pitch deck...</div>
                  <div style={{ fontSize: "13px" }}>AI is crafting 10 investor-ready slides</div>
                </div>
              ) : pitchDeck ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
                  {pitchDeck.map((slide, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#1a1d26",
                        border: "1px solid #252834",
                        borderRadius: "14px",
                        padding: "20px",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(124,110,247,0.4)";
                        e.currentTarget.style.transform = "translateY(-3px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#252834";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                        <div style={{
                          width: "32px", height: "32px", borderRadius: "8px",
                          background: "rgba(99,102,241,0.2)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "16px", flexShrink: 0
                        }}>
                          {slideIcons[slide.title] || "📄"}
                        </div>
                        <div>
                          <div style={{ fontSize: "10px", color: "#6b7280", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            Slide {i + 1}
                          </div>
                          <div style={{ fontSize: "14px", fontWeight: "700", color: "#e8eaf0" }}>
                            {slide.title}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: "12px", color: "#8892b0", lineHeight: "1.7" }}>
                        {slide.content?.split("\n").map((line, j) => (
                          line.trim() && (
                            <div key={j} style={{ display: "flex", gap: "6px", marginBottom: "4px" }}>
                              <span style={{ color: "#6366f1", flexShrink: 0 }}>•</span>
                              <span>{line.trim()}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
                  <div style={{ fontSize: "40px", marginBottom: "16px" }}>📊</div>
                  <p>No pitch deck yet. Click generate to create one.</p>
                  <button
                    onClick={generatePitchDeck}
                    style={{
                      marginTop: "16px", padding: "10px 20px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                      border: "none", color: "white",
                      fontWeight: "600", cursor: "pointer", fontSize: "13px"
                    }}
                  >
                    Generate Pitch Deck
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── ELEVATOR PITCH TAB ── */}
          {activeTab === "elevator" && (
            <div style={{ padding: "28px" }}>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "white", marginBottom: "4px" }}>
                Elevator Pitch
              </div>
              <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "20px" }}>
                Your 30-second pitch — memorize it and say it with confidence
              </div>

              {elevatorLoading ? (
                <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
                  <div style={{ fontSize: "40px", marginBottom: "16px" }}>🎤</div>
                  <div style={{ fontSize: "16px", color: "white", marginBottom: "8px" }}>Crafting your elevator pitch...</div>
                </div>
              ) : elevatorPitch ? (
                <>
                  <div style={{
                    background: "linear-gradient(140deg, #1a1d26, #1d1640 60%, #1a1d26)",
                    border: "1px solid rgba(124,110,247,0.3)",
                    borderRadius: "16px", padding: "28px",
                    marginBottom: "20px", position: "relative"
                  }}>
                    <div style={{ fontSize: "10px", color: "#818cf8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
                      🎤 Your 30-Second Pitch
                    </div>
                    <div style={{ fontSize: "16px", color: "#cdd3f0", lineHeight: "1.8", fontWeight: "400" }}>
                      {elevatorPitch.script}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "20px" }}>
                    {[
                      { label: "Hook", value: elevatorPitch.hook, icon: "🎯" },
                      { label: "Problem", value: elevatorPitch.problem, icon: "😟" },
                      { label: "Solution", value: elevatorPitch.solution, icon: "💡" },
                      { label: "Ask", value: elevatorPitch.ask, icon: "🤝" },
                    ].map((part, i) => part.value && (
                      <div key={i} style={{
                        background: "#1a1d26", border: "1px solid #252834",
                        borderRadius: "12px", padding: "16px"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                          <span style={{ fontSize: "16px" }}>{part.icon}</span>
                          <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            {part.label}
                          </div>
                        </div>
                        <div style={{ fontSize: "13px", color: "#c9cdd8", lineHeight: "1.5" }}>
                          {part.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(elevatorPitch.script);
                      alert("Elevator pitch copied to clipboard!");
                    }}
                    style={{
                      padding: "10px 20px", borderRadius: "10px",
                      background: "rgba(99,102,241,0.1)",
                      border: "1px solid rgba(99,102,241,0.3)",
                      color: "#818cf8", fontWeight: "600",
                      cursor: "pointer", fontSize: "13px"
                    }}
                  >
                    📋 Copy to Clipboard
                  </button>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
                  <div style={{ fontSize: "40px", marginBottom: "16px" }}>🎤</div>
                  <p>No elevator pitch yet.</p>
                  <button
                    onClick={generateElevatorPitch}
                    style={{
                      marginTop: "16px", padding: "10px 20px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                      border: "none", color: "white",
                      fontWeight: "600", cursor: "pointer", fontSize: "13px"
                    }}
                  >
                    Generate Elevator Pitch
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── INVESTOR Q&A TAB ── */}
          {activeTab === "qa" && (
            <div style={{ padding: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: "white", marginBottom: "4px" }}>
                    Investor Q&A Simulator
                  </div>
                  <div style={{ fontSize: "13px", color: "#94a3b8" }}>
                    Practice with a tough AI investor — {questionCount}/5 questions
                  </div>
                </div>
                <div style={{
                  display: "flex", gap: "6px"
                }}>
                  {[1,2,3,4,5].map(n => (
                    <div key={n} style={{
                      width: "28px", height: "6px", borderRadius: "3px",
                      background: n <= questionCount ? "#6366f1" : "#252834"
                    }} />
                  ))}
                </div>
              </div>

              <div style={{
                height: "400px", overflowY: "auto",
                display: "flex", flexDirection: "column", gap: "12px",
                marginBottom: "16px", paddingRight: "4px"
              }}>
                {qaHistory.length === 0 && !qaLoading && (
                  <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
                    <div style={{ fontSize: "40px", marginBottom: "16px" }}>💬</div>
                    <p style={{ marginBottom: "16px" }}>Ready to practice with an AI investor?</p>
                    <button
                      onClick={startQA}
                      style={{
                        padding: "10px 20px", borderRadius: "10px",
                        background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                        border: "none", color: "white",
                        fontWeight: "600", cursor: "pointer", fontSize: "13px"
                      }}
                    >
                      Start Q&A Session
                    </button>
                  </div>
                )}

                {qaHistory.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: msg.role === "founder" ? "flex-end"
                        : msg.role === "feedback" ? "center" : "flex-start"
                    }}
                  >
                    {msg.role === "feedback" ? (
                      <div style={{
                        background: "rgba(79,209,197,0.1)",
                        border: "1px solid rgba(79,209,197,0.2)",
                        borderRadius: "10px", padding: "10px 14px",
                        fontSize: "12px", color: "#4fd1c5",
                        maxWidth: "80%", lineHeight: "1.5"
                      }}>
                        💡 Feedback: {msg.text}
                      </div>
                    ) : (
                      <div style={{
                        maxWidth: "70%",
                        padding: "12px 16px",
                        fontSize: "14px", lineHeight: "1.5",
                        background: msg.role === "founder"
                          ? "linear-gradient(135deg, #8b5cf6, #6366f1)"
                          : "#1a1d26",
                        border: msg.role === "investor" ? "1px solid #252834" : "none",
                        color: "white",
                        borderRadius: msg.role === "founder" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                      }}>
                        <div style={{ fontSize: "11px", opacity: 0.7, marginBottom: "4px" }}>
                          {msg.role === "founder" ? "You" : "AI Investor"}
                        </div>
                        {msg.text}
                      </div>
                    )}
                  </div>
                ))}

                {qaLoading && (
                  <div style={{ display: "flex" }}>
                    <div style={{
                      padding: "12px 16px",
                      borderRadius: "4px 16px 16px 16px",
                      background: "#1a1d26",
                      border: "1px solid #252834",
                      color: "#94a3b8", fontSize: "13px"
                    }}>
                      Investor is thinking...
                    </div>
                  </div>
                )}

                <div ref={qaEndRef} />
              </div>

              {qaHistory.length > 0 && questionCount < 5 && (
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    value={qaInput}
                    onChange={(e) => setQaInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAnswer()}
                    placeholder="Type your answer..."
                    style={{
                      flex: 1, padding: "12px 16px",
                      background: "rgba(0,0,0,0.4)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "12px", color: "white",
                      fontSize: "14px", outline: "none", fontFamily: "inherit"
                    }}
                  />
                  <button
                    onClick={handleAnswer}
                    disabled={qaLoading || !qaInput.trim()}
                    style={{
                      padding: "12px 22px", borderRadius: "12px",
                      background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                      border: "none", color: "white",
                      fontWeight: "600", cursor: "pointer", fontSize: "14px"
                    }}
                  >
                    Answer →
                  </button>
                </div>
              )}

              {questionCount >= 5 && !pitchScore && (
                <div style={{ textAlign: "center", marginTop: "16px" }}>
                  <button
                    onClick={() => generatePitchScore(qaHistory)}
                    disabled={scoreLoading}
                    style={{
                      padding: "12px 24px", borderRadius: "12px",
                      background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                      border: "none", color: "white",
                      fontWeight: "600", cursor: "pointer", fontSize: "14px"
                    }}
                  >
                    {scoreLoading ? "Generating score..." : "🏆 Get My Pitch Score"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── PITCH SCORE TAB ── */}
          {activeTab === "score" && (
            <div style={{ padding: "28px" }}>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "white", marginBottom: "4px" }}>
                Pitch Score
              </div>
              <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "20px" }}>
                How investor-ready is your pitch?
              </div>

              {scoreLoading ? (
                <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
                  <div style={{ fontSize: "40px", marginBottom: "16px" }}>🏆</div>
                  <div style={{ fontSize: "16px", color: "white", marginBottom: "8px" }}>Scoring your pitch...</div>
                </div>
              ) : pitchScore ? (
                <>
                  {/* Overall score ring */}
                  <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "28px", flexWrap: "wrap" }}>
                    <div style={{ position: "relative", width: "110px", height: "110px", flexShrink: 0 }}>
                      <svg style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
                        <circle cx="55" cy="55" r="48" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                        <circle
                          cx="55" cy="55" r="48" fill="none"
                          stroke={pitchScore.overall_score >= 70 ? "#34d399" : pitchScore.overall_score >= 50 ? "#fbbf24" : "#f87171"}
                          strokeWidth="8"
                          strokeDasharray={`${2 * Math.PI * 48}`}
                          strokeDashoffset={`${2 * Math.PI * 48 * (1 - (pitchScore.overall_score || 0) / 100)}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div style={{
                        position: "absolute", top: "50%", left: "50%",
                        transform: "translate(-50%, -50%)", textAlign: "center"
                      }}>
                        <div style={{ fontSize: "28px", fontWeight: "800", color: "white" }}>
                          {pitchScore.overall_score}
                        </div>
                        <div style={{ fontSize: "10px", color: "#94a3b8" }}>/ 100</div>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "20px", fontWeight: "700", color: "white", marginBottom: "6px" }}>
                        {pitchScore.overall_score >= 70 ? "Investor Ready! 🚀"
                          : pitchScore.overall_score >= 50 ? "Almost There! 💪"
                          : "Needs Work 📝"}
                      </div>
                      <div style={{ fontSize: "14px", color: "#94a3b8", maxWidth: "400px", lineHeight: "1.6" }}>
                        {pitchScore.verdict}
                      </div>
                    </div>
                  </div>

                  {/* Score breakdown */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "24px" }}>
                    {pitchScore.scores && Object.entries(pitchScore.scores).map(([key, val]) => {
                      const score = val.score || 0;
                      const color = score >= 70 ? "#34d399" : score >= 50 ? "#fbbf24" : "#f87171";
                      return (
                        <div key={key} style={{
                          background: "#1a1d26", border: "1px solid #252834",
                          borderRadius: "12px", padding: "16px"
                        }}>
                          <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: "600", textTransform: "capitalize", marginBottom: "8px" }}>
                            {key.replace(/_/g, " ")}
                          </div>
                          <div style={{
                            width: "100%", height: "6px",
                            background: "rgba(255,255,255,0.08)",
                            borderRadius: "3px", overflow: "hidden", marginBottom: "6px"
                          }}>
                            <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: "3px" }} />
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ fontSize: "16px", fontWeight: "800", color }}>{score}</div>
                            <div style={{ fontSize: "11px", color: "#6b7280" }}>{val.feedback}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Improvements */}
                  {pitchScore.improvements?.length > 0 && (
                    <div style={{
                      background: "#1a1d26", border: "1px solid #252834",
                      borderRadius: "14px", padding: "20px", marginBottom: "16px"
                    }}>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: "#e8eaf0", marginBottom: "12px" }}>
                        🔧 How to Improve
                      </div>
                      {pitchScore.improvements.map((imp, i) => (
                        <div key={i} style={{
                          display: "flex", gap: "10px",
                          padding: "10px 0",
                          borderBottom: i < pitchScore.improvements.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none"
                        }}>
                          <span style={{ color: "#6366f1", flexShrink: 0 }}>→</span>
                          <span style={{ fontSize: "13px", color: "#c9cdd8", lineHeight: "1.5" }}>{imp}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Retry button */}
                  <button
                    onClick={() => {
                      setQaHistory([]);
                      setQuestionCount(0);
                      setPitchScore(null);
                      setCurrentQuestion(null);
                      setActiveTab("qa");
                      startQA();
                    }}
                    style={{
                      padding: "10px 20px", borderRadius: "10px",
                      background: "rgba(99,102,241,0.1)",
                      border: "1px solid rgba(99,102,241,0.3)",
                      color: "#818cf8", fontWeight: "600",
                      cursor: "pointer", fontSize: "13px"
                    }}
                  >
                    🔄 Practice Again
                  </button>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
                  <div style={{ fontSize: "40px", marginBottom: "16px" }}>🏆</div>
                  <p>Complete the Investor Q&A to get your pitch score.</p>
                  <button
                    onClick={() => setActiveTab("qa")}
                    style={{
                      marginTop: "16px", padding: "10px 20px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                      border: "none", color: "white",
                      fontWeight: "600", cursor: "pointer", fontSize: "13px"
                    }}
                  >
                    Go to Investor Q&A
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}