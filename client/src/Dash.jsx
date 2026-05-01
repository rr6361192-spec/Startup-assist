import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChartLine, FaRocket, FaLightbulb, FaFileAlt, FaUserTie, FaBookOpen, FaShareAlt, FaCheckCircle, FaLock, FaArrowRight } from "react-icons/fa";
import { MdOutlineUpload } from "react-icons/md";
import { BiTargetLock } from "react-icons/bi";
import { GiProgression } from "react-icons/gi";
import './dsa.css';
import { useStartup } from "./Vm";

function Dash() {
  const navigate = useNavigate();
  const {
    overall,
    idea,      // {msg:"complete"} when validation done
    diff,      // {msg:"differentation complte"} when diff done
  } = useStartup();

  const [userName, setUserName] = useState("Founder");

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Founder";
    setUserName(name);
  }, []);

  // ── Derive status from context ────────────
  const validationDone = idea?.msg === "complete";
  const diffDone = diff?.msg === "differentation complte";
  const pitchDone = false; // update when pitch is complete

  const getStepStatus = (stepId) => {
    if (stepId === 1) return validationDone ? "completed" : "active";
    if (stepId === 2) {
      if (diffDone) return "completed";
      if (validationDone) return "active";
      return "locked";
    }
    if (stepId === 3) {
      if (pitchDone) return "completed";
      if (diffDone) return "active";
      return "locked";
    }
  };

  const workspaceItems = [
    {
      id: 1,
      title: "Idea Canvas",
      description: "Brainstorm & Plan your startup vision",
      icon: <FaLightbulb size={24} />,
      color: "#8b5cf6",
      action: "/validate",
      buttonText: "Open Canvas"
    },
    {
      id: 2,
      title: "Pitch Deck",
      description: "Create & Edit Your Investor Slides",
      icon: <FaFileAlt size={24} />,
      color: "#6366f1",
      action: "/pitch",
      buttonText: "Edit Deck"
    },
    {
      id: 3,
      title: "Investor Contacts",
      description: "Find & Manage Investor Leads",
      icon: <BiTargetLock size={24} />,
      color: "#a78bfa",
      action: "/investors",
      buttonText: "View Database"
    },
    {
      id: 4,
      title: "Mentor Guidance",
      description: "1-on-1 sessions • Expert reviews",
      icon: <FaUserTie size={24} />,
      color: "#c084fc",
      action: "/mentors",
      buttonText: "Book Session"
    },
    {
      id: 5,
      title: "Resources & Tips",
      description: "Templates, case studies & guides",
      icon: <FaBookOpen size={24} />,
      color: "#34d399",
      action: "/resources",
      buttonText: "Explore Library"
    },
    {
      id: 6,
      title: "Save & Share",
      description: "Export progress & collaborate",
      icon: <FaShareAlt size={24} />,
      color: "#fbbf24",
      action: "/share",
      buttonText: "Share Progress"
    }
  ];

  const steps = [
    {
      id: 1,
      title: "Idea Validation",
      description: "Validate your startup idea with AI-powered analysis",
      tasks: ["Define Your Concept", "Analyze Competitors", "Target Audience Analysis"],
      path: "/Valid",
      buttonText: validationDone ? "Review →" : "Start Validation"
    },
    {
      id: 2,
      title: "Product Differentiation",
      description: "Stand out from competitors with unique value proposition",
      tasks: ["Unique Features", "Value Proposition", "Market Positioning"],
      path: "/differentiation",
      buttonText: diffDone ? "Review →" : validationDone ? "Start" : "Locked"
    },
    {
      id: 3,
      title: "Pitch Preparation",
      description: "Get investor-ready with AI-powered pitch tools",
      tasks: ["Create Your Pitch Deck", "Practice Your Pitch", "Storytelling Tips"],
      path: "/Slides",
      buttonText: pitchDone ? "Review →" : diffDone ? "Start" : "Locked"
    }
  ];

  const getStepStyles = (status) => {
    switch(status) {
      case "completed":
        return {
          border: "1px solid rgba(52,211,153,0.3)",
          background: "linear-gradient(135deg, rgba(52,211,153,0.05), rgba(16,185,129,0.02))",
          badgeColor: "#34d399",
          badgeBg: "rgba(52,211,153,0.1)",
          badgeText: "Completed ✓"
        };
      case "active":
        return {
          border: "1px solid rgba(139,92,246,0.4)",
          background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(99,102,241,0.03))",
          badgeColor: "#8b5cf6",
          badgeBg: "rgba(139,92,246,0.15)",
          badgeText: "In Progress"
        };
      default:
        return {
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(17,24,39,0.4)",
          badgeColor: "#6b7280",
          badgeBg: "rgba(107,114,128,0.1)",
          badgeText: "Locked 🔒"
        };
    }
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
      minHeight: "100vh",
      padding: "40px 20px",
      fontFamily: "'Inter', 'Instrument Sans', 'Segoe UI', sans-serif"
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

        {/* Welcome Section */}
        <div style={{
          background: "rgba(17,24,39,0.8)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "24px",
          padding: "32px 40px",
          marginBottom: "32px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px"
        }}>
          <div>
            <h1 style={{
              fontSize: "32px",
              fontWeight: "800",
              background: "linear-gradient(135deg, #fff 0%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "8px"
            }}>
              Welcome back, {userName}! 👋
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "15px" }}>
              Let's turn your startup vision into reality
            </p>
          </div>
          <div style={{
            background: "rgba(139,92,246,0.1)",
            padding: "12px 24px",
            borderRadius: "60px",
            border: "1px solid rgba(139,92,246,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <FaChartLine size={20} color="#8b5cf6" />
            <span style={{ color: "#a78bfa", fontWeight: "600", fontSize: "14px" }}>
              IDEA VALIDATION SCORE
            </span>
            <span style={{
              background: "#34d399",
              padding: "4px 10px",
              borderRadius: "20px",
              color: "#020617",
              fontWeight: "800",
              fontSize: "14px"
            }}>
              {overall || 0}
            </span>
          </div>
        </div>

        {/* Steps Section */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
          marginBottom: "48px"
        }}>
          {steps.map((step) => {
            const status = getStepStatus(step.id);
            const styles = getStepStyles(status);
            const isLocked = status === "locked";

            return (
              <div
                key={step.id}
                style={{
                  background: styles.background,
                  border: styles.border,
                  borderRadius: "20px",
                  padding: "28px",
                  cursor: isLocked ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  if (!isLocked) {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLocked) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                {/* Badge */}
                <div style={{
                  position: "absolute", top: "20px", right: "20px",
                  background: styles.badgeBg,
                  padding: "4px 12px", borderRadius: "20px",
                  fontSize: "12px", fontWeight: "600",
                  color: styles.badgeColor
                }}>
                  {styles.badgeText}
                </div>

                {/* Icon */}
                <div style={{
                  width: "50px", height: "50px",
                  background: `linear-gradient(135deg, ${styles.badgeColor}20, ${styles.badgeColor}10)`,
                  borderRadius: "15px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "20px"
                }}>
                  {status === "completed" ? (
                    <FaCheckCircle size={28} color="#34d399" />
                  ) : isLocked ? (
                    <FaLock size={24} color="#6b7280" />
                  ) : (
                    <GiProgression size={28} color="#8b5cf6" />
                  )}
                </div>

                <h3 style={{ fontSize: "22px", fontWeight: "700", color: "white", marginBottom: "8px" }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "20px", lineHeight: "1.5" }}>
                  {step.description}
                </p>

                {/* Tasks */}
                <ul style={{ listStyle: "none", padding: 0, marginBottom: "24px" }}>
                  {step.tasks.map((task, idx) => (
                    <li key={idx} style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      marginBottom: "10px", fontSize: "13px",
                      color: isLocked ? "#6b7280" : "#c9cdd8"
                    }}>
                      {status === "completed" ? (
                        <FaCheckCircle size={14} color="#34d399" />
                      ) : (
                        <span style={{ color: isLocked ? "#6b7280" : "#8b5cf6" }}>▹</span>
                      )}
                      {task}
                    </li>
                  ))}
                </ul>

                {/* Progress Bar — only for active */}
                {status === "active" && (
                  <div style={{
                    width: "100%", height: "4px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "2px", marginBottom: "20px", overflow: "hidden"
                  }}>
                    <div style={{
                      width: step.id === 1 ? "100%" : step.id === 2 ? "40%" : "10%",
                      height: "100%",
                      background: "linear-gradient(90deg, #8b5cf6, #6366f1)",
                      borderRadius: "2px"
                    }} />
                  </div>
                )}

                {/* Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isLocked) navigate(step.path);
                  }}
                  disabled={isLocked}
                  style={{
                    width: "100%", padding: "12px", borderRadius: "12px",
                    background: status === "completed"
                      ? "rgba(52,211,153,0.1)"
                      : status === "active"
                        ? "linear-gradient(135deg, #8b5cf6, #6366f1)"
                        : "#374151",
                    border: status === "completed" ? "1px solid rgba(52,211,153,0.3)" : "none",
                    color: status === "completed" ? "#34d399" : isLocked ? "#6b7280" : "white",
                    fontWeight: "600",
                    cursor: isLocked ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", gap: "8px",
                    transition: "all 0.2s"
                  }}
                >
                  {step.buttonText}
                  {!isLocked && <FaArrowRight size={12} />}
                </button>
              </div>
            );
          })}
        </div>

        {/* Workspace Section */}
        <div style={{
          background: "rgba(17,24,39,0.6)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "32px",
          marginTop: "16px"
        }}>
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "700", color: "white", marginBottom: "8px" }}>
              Your Workspace
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "14px" }}>
              Everything you need to build and scale your startup
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px"
          }}>
            {workspaceItems.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(item.action)}
                style={{
                  background: "rgba(17,24,39,0.8)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px", padding: "24px",
                  cursor: "pointer", transition: "all 0.3s ease",
                  position: "relative", overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = `${item.color}40`;
                  e.currentTarget.style.boxShadow = `0 10px 25px ${item.color}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  width: "48px", height: "48px",
                  background: `linear-gradient(135deg, ${item.color}20, ${item.color}10)`,
                  borderRadius: "12px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "16px", color: item.color
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "white", marginBottom: "8px" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "20px", lineHeight: "1.5" }}>
                  {item.description}
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(item.action); }}
                  style={{
                    padding: "8px 16px", borderRadius: "10px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: item.color, fontWeight: "600",
                    cursor: "pointer", fontSize: "13px",
                    display: "flex", alignItems: "center", gap: "6px"
                  }}
                >
                  {item.buttonText} <FaArrowRight size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px", marginTop: "32px"
        }}>
          {[
            { icon: "📊", value: `${overall || 0}`, label: "Validation Score" },
            { icon: "🎯", value: validationDone ? (diffDone ? (pitchDone ? "0" : "1") : "2") : "3", label: "Active Tasks" },
            { icon: "✅", value: [validationDone, diffDone, pitchDone].filter(Boolean).length, label: "Steps Completed" },
            { icon: "🚀", value: validationDone && diffDone && pitchDone ? "Ready!" : "In Progress", label: "Launch Status" },
          ].map((stat, i) => (
            <div key={i} style={{
              background: "rgba(17,24,39,0.6)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px", padding: "20px", textAlign: "center"
            }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>{stat.icon}</div>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "white" }}>{stat.value}</div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>{stat.label}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Dash;