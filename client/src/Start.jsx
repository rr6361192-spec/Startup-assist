// App.js
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./kpp.css";
import heroImage from "./assets/image7.png";
import heroImag from "./assets/image6.png";
import heroIma from "./assets/image8.png";
import heroIm from "./assets/image9.png";

// Import mentor images (add your actual mentor images)
import mentor1 from "./assets/image3.png";
import mentor2 from "./assets/image4.png";
import mentor3 from "./assets/image5.png";

 //ie-up company logos (add your actual logo images)
import googleLogo from "./assets/google.png";
import microsoftLogo from "./assets/image.png";
import amazonLogo from "./assets/amazon.png";
import metaLogo from "./assets/meta.png";
import teslaLogo from "./assets/tesla.png";
import openaiLogo from "./assets/op.png" 


function Start() {
  const navigate = useNavigate();
  const marqueeRef = useRef(null);

  // Companies data for marquee animation
  const companies = [
    { name: "Google", logo: googleLogo },
    { name: "Microsoft", logo: microsoftLogo },
    { name: "Amazon", logo: amazonLogo },
    { name: "Meta", logo: metaLogo },
    { name: "Tesla", logo: teslaLogo },
    { name: "OpenAI", logo: openaiLogo },
    { name: "Google", logo: googleLogo },
    { name: "Microsoft", logo: microsoftLogo },
    { name: "Amazon", logo: amazonLogo },
    { name: "Meta", logo: metaLogo },
    { name: "Tesla", logo: teslaLogo },
    { name: "OpenAI", logo: openaiLogo }
  ];

  // Mentors data
  const mentors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      role: "AI Research Director",
      company: "Google AI",
      experience: "15+ years in AI/ML",
      expertise: ["Machine Learning", "NLP", "Computer Vision"],
      avatar: mentor1,
      bio: "Former Stanford professor leading AI innovation at Google. Has mentored 50+ successful AI startups.",
      linkedin: "https://linkedin.com/in/sarahjohnson",
      twitter: "https://twitter.com/sarahjohnson"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Startup Growth Expert",
      company: "Y Combinator",
      experience: "10+ unicorn startups",
      expertise: ["Growth Strategy", "Fundraising", "Product-Market Fit"],
      avatar: mentor2,
      bio: "YC alum who raised $50M for his previous startup. Now helps founders scale from 0 to 100.",
      linkedin: "https://linkedin.com/in/michaelchen",
      twitter: "https://twitter.com/michaelchen"
    },
    {
      id: 3,
      name: "Rama Singh",
      role: "Venture Partner",
      company: "Sequoia Capital",
      experience: "$2B+ portfolio value",
      expertise: ["Investment Strategy", "Due Diligence", "Exit Strategy"],
      avatar: mentor3,
      bio: "Led investments in 20+ successful exits. Passionate about early-stage deep tech startups.",
      linkedin: "https://linkedin.com/in/priyapatel",
      twitter: "https://twitter.com/priyapatel"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Submit Your Idea",
      description: "Share your startup idea or business concept with our AI platform",
      icon: "💡",
      action: "Start Validation",
      path: "/validate",
      color: "#8b5cf6"
    },
    {
      number: "02",
      title: "AI Analysis & Scoring",
      description: "Get instant AI-powered analysis across 5 key dimensions",
      icon: "🤖",
      action: "View Demo",
      demo: true,
      color: "#6366f1"
    },
    {
      number: "03",
      title: "Refine with AI Coach",
      description: "Chat with our AI coach to improve weak areas",
      icon: "💬",
      action: "Chat with Alex",
      path: "/validate",
      color: "#a78bfa"
    },
    {
      number: "04",
      title: "Get Full Report",
      description: "Receive comprehensive validation report and actionable insights",
      icon: "📊",
      action: "Sample Report",
      demo: true,
      color: "#c084fc"
    }
  ];

  // Marquee animation effect
  useEffect(() => {
    const marquee = marqueeRef.current;
    if (marquee) {
      let scrollAmount = 0;
      const animate = () => {
        scrollAmount += 0.5;
        if (scrollAmount >= marquee.scrollWidth / 2) {
          scrollAmount = 0;
        }
        marquee.style.transform = `translateX(-${scrollAmount}px)`;
        requestAnimationFrame(animate);
      };
      const animation = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animation);
    }
  }, []);

  return (
    <>
      <section style={{
        background: "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
        minHeight: "100vh",
        fontFamily: "'Inter', 'Instrument Sans', 'Segoe UI', sans-serif",
        overflowX: "hidden"
      }}>
        
        {/* Glowing orb effects */}
        <div style={{
          position: "fixed",
          top: "10%",
          right: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.15), transparent)",
          pointerEvents: "none",
          zIndex: 0
        }}></div>
        <div style={{
          position: "fixed",
          bottom: "10%",
          left: "-10%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.1), transparent)",
          pointerEvents: "none",
          zIndex: 0
        }}></div>

       
         
        {/* Hero Section */}
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "60px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "40px",
          position: "relative",
          zIndex: 5
        }}>
          <div style={{ flex: 1, minWidth: "300px" }}>
            <div style={{
              display: "inline-flex",
              padding: "6px 12px",
              background: "rgba(124,110,247,0.1)",
              border: "1px solid rgba(124,110,247,0.2)",
              borderRadius: "20px",
              marginBottom: "24px",
              alignItems: "center",
              gap: "8px"
            }}>
              <span style={{ fontSize: "16px" }}>⚡</span>
              <span style={{ color: "#818cf8", fontSize: "13px", fontWeight: "600" }}>
                AI-Powered Platform — Trusted by 10,000+ Founders
              </span>
            </div>
            <h1 style={{
              fontSize: "56px",
              fontWeight: "800",
              background: "linear-gradient(135deg, #fff 0%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "20px",
              lineHeight: "1.2"
            }}>
              Validate Your Startup<br />Idea in Minutes
            </h1>
            <p style={{
              fontSize: "18px",
              color: "#94a3b8",
              lineHeight: "1.6",
              marginBottom: "32px",
              maxWidth: "600px"
            }}>
              Get AI-powered feedback, market insights, and investor-ready pitch decks. 
              From idea validation to funding — all in one platform.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <button
                onClick={() => navigate("/validate")}
                style={{
                  padding: "14px 32px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                  border: "none",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "transform 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                Validate Your Idea <span>→</span>
              </button>
              <button
                onClick={() => window.scrollTo({ top: document.querySelector('#how-it-works').offsetTop, behavior: 'smooth' })}
                style={{
                  padding: "14px 32px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                How It Works
              </button>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginTop: "32px",
              padding: "16px 0"
            }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: i === 1 ? 0 : "-8px",
                    border: "2px solid #020617",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "white"
                  }}>
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>
                  Trusted by 10,000+ founders
                </div>
                <div style={{ color: "#6b7280", fontSize: "12px" }}>
                  ⭐ 4.9/5 from 2,345 reviews
                </div>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: "300px", textAlign: "center" }}>
            <img 
              src={heroImage} 
              alt="Hero" 
              style={{
                width: "100%",
                maxWidth: "550px",
                borderRadius: "24px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                transform: "perspective(1000px) rotateY(-5deg)",
                transition: "transform 0.3s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "perspective(1000px) rotateY(0deg)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "perspective(1000px) rotateY(-5deg)"}
            />
          </div>
        </div>

        {/* Tie-up Companies Marquee */}
        <div style={{
          padding: "40px 0",
          background: "rgba(0,0,0,0.3)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          overflow: "hidden",
          position: "relative"
        }}>
          <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "100px",
            background: "linear-gradient(90deg, #020617, transparent)",
            zIndex: 2,
            pointerEvents: "none"
          }}></div>
          <div style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "100px",
            background: "linear-gradient(270deg, #020617, transparent)",
            zIndex: 2,
            pointerEvents: "none"
          }}></div>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <p style={{ color: "#6b7280", fontSize: "12px", fontWeight: "600", letterSpacing: "2px" }}>
              TRUSTED BY INNOVATIVE COMPANIES
            </p>
          </div>
          <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
            <div ref={marqueeRef} style={{ display: "inline-block", whiteSpace: "nowrap", transition: "transform 0.1s linear" }}>
              {companies.map((company, idx) => (
                <div key={idx} style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  margin: "0 30px",
                  verticalAlign: "middle"
                }}>
                  <img 
                    src={company.logo} 
                    alt={company.name}
                    style={{ height: "30px", width: "auto", opacity: 0.6, filter: "grayscale(1)" }}
                  />
                  <span style={{ color: "#6b7280", fontSize: "14px", fontWeight: "500" }}>{company.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" style={{
          padding: "80px 40px",
          maxWidth: "1400px",
          margin: "0 auto"
        }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <span style={{
              padding: "4px 12px",
              background: "rgba(139,92,246,0.1)",
              borderRadius: "20px",
              color: "#a78bfa",
              fontSize: "12px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}>
              SIMPLE PROCESS
            </span>
            <h2 style={{
              fontSize: "40px",
              fontWeight: "700",
              color: "white",
              marginTop: "16px",
              marginBottom: "16px"
            }}>
              How It Works
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "18px", maxWidth: "600px", margin: "0 auto" }}>
              Get your startup validated in 4 simple steps
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
            position: "relative"
          }}>
            {/* Connecting line */}
            <div style={{
              position: "absolute",
              top: "30%",
              left: "10%",
              right: "10%",
              height: "2px",
              background: "linear-gradient(90deg, #8b5cf6, #6366f1, #a78bfa)",
              display: "none",
              zIndex: 0
            }}></div>
            
            {steps.map((step, index) => (
              <div
                key={index}
                style={{
                  background: "rgba(17,24,39,0.8)",
                  border: `1px solid ${step.color}40`,
                  borderRadius: "20px",
                  padding: "32px",
                  position: "relative",
                  zIndex: 5,
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.borderColor = step.color;
                  e.currentTarget.style.boxShadow = `0 20px 40px ${step.color}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = `${step.color}40`;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "50px",
                  height: "50px",
                  background: `linear-gradient(135deg, ${step.color}, ${step.color}80)`,
                  borderRadius: "15px",
                  marginBottom: "20px"
                }}>
                  <span style={{ fontSize: "24px" }}>{step.icon}</span>
                </div>
                <div style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  fontSize: "14px",
                  fontWeight: "800",
                  color: `${step.color}40`
                }}>
                  {step.number}
                </div>
                <h3 style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "white",
                  marginBottom: "12px"
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: "14px",
                  color: "#94a3b8",
                  lineHeight: "1.6",
                  marginBottom: "20px"
                }}>
                  {step.description}
                </p>
                <button
                  onClick={() => step.demo ? alert("Demo coming soon!") : navigate(step.path)}
                  style={{
                    background: "none",
                    border: "none",
                    color: step.color,
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: 0
                  }}
                >
                  {step.action} <span>→</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Mentor Section */}
        <div id="mentors" style={{
          padding: "80px 40px",
          background: "rgba(17,24,39,0.5)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
              <span style={{
                padding: "4px 12px",
                background: "rgba(139,92,246,0.1)",
                borderRadius: "20px",
                color: "#a78bfa",
                fontSize: "12px",
                fontWeight: "600",
                letterSpacing: "1px"
              }}>
                EXPERT GUIDANCE
              </span>
              <h2 style={{
                fontSize: "40px",
                fontWeight: "700",
                color: "white",
                marginTop: "16px",
                marginBottom: "16px"
              }}>
                Learn from Top Mentors
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "18px", maxWidth: "600px", margin: "0 auto" }}>
                Get 1-on-1 guidance from industry experts who've been there
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "32px"
            }}>
              {mentors.map((mentor) => (
                <div
                  key={mentor.id}
                  style={{
                    background: "rgba(17,24,39,0.8)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "24px",
                    padding: "28px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.borderColor = "rgba(139,92,246,0.4)";
                    e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
                    <div style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                      padding: "2px"
                    }}>
                      <img 
                        src={mentor.avatar} 
                        alt={mentor.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          objectFit: "cover"
                        }}
                      />
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "white",
                        marginBottom: "4px"
                      }}>
                        {mentor.name}
                      </h3>
                      <p style={{ fontSize: "13px", color: "#a78bfa", fontWeight: "500" }}>
                        {mentor.role}
                      </p>
                      <p style={{ fontSize: "12px", color: "#6b7280" }}>
                        {mentor.company}
                      </p>
                    </div>
                  </div>
                  
                  <p style={{
                    fontSize: "14px",
                    color: "#94a3b8",
                    lineHeight: "1.6",
                    marginBottom: "16px"
                  }}>
                    {mentor.bio}
                  </p>

                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>
                      ⚡ {mentor.experience}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {mentor.expertise.map((skill, i) => (
                        <span key={i} style={{
                          padding: "4px 10px",
                          background: "rgba(139,92,246,0.1)",
                          borderRadius: "12px",
                          fontSize: "11px",
                          color: "#a78bfa",
                          fontWeight: "500"
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "16px" }}>
                    <button
                      onClick={() => window.open(mentor.linkedin, "_blank")}
                      style={{
                        flex: 1,
                        padding: "8px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "500",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      🔗 LinkedIn
                    </button>
                    <button
                      onClick={() => window.open(mentor.twitter, "_blank")}
                      style={{
                        flex: 1,
                        padding: "8px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "500",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      🐦 Twitter
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "48px" }}>
              <button
                onClick={() => alert("Book a mentorship session!")}
                style={{
                  padding: "12px 28px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                  border: "none",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                Book a Mentorship Session →
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" style={{
          padding: "80px 40px",
          maxWidth: "1400px",
          margin: "0 auto"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "32px"
          }}>
            {[
              { title: "AI-Powered Analysis", desc: "Get instant scoring across 5 key dimensions with actionable insights", icon: "🤖", color: "#8b5cf6" },
              { title: "Market Intelligence", desc: "Real-time market trends, competitor analysis, and TAM calculations", icon: "📊", color: "#6366f1" },
              { title: "Pitch Deck Generator", desc: "Create investor-ready pitch decks automatically from your idea", icon: "📑", color: "#a78bfa" },
              { title: "Investor Q&A Simulator", desc: "Practice with tough investor questions and get feedback", icon: "💬", color: "#c084fc" },
              { title: "Expert Mentorship", desc: "Connect with industry experts who've built successful startups", icon: "👨‍🏫", color: "#8b5cf6" },
              { title: "Funding Database", desc: "Access curated list of VCs and angel investors", icon: "💰", color: "#6366f1" }
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(17,24,39,0.6)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "20px",
                  padding: "28px",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.borderColor = `${feature.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                }}
              >
                <div style={{
                  width: "50px",
                  height: "50px",
                  background: `linear-gradient(135deg, ${feature.color}, ${feature.color}80)`,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  marginBottom: "20px"
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "white", marginBottom: "10px" }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "1.6" }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <footer style={{
          padding: "80px 40px",
          textAlign: "center",
          background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(99,102,241,0.05))",
          borderTop: "1px solid rgba(255,255,255,0.1)"
        }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{
              fontSize: "40px",
              fontWeight: "700",
              color: "white",
              marginBottom: "16px"
            }}>
              Ready to Launch Your Startup?
            </h2>
            <p style={{
              fontSize: "18px",
              color: "#94a3b8",
              marginBottom: "32px"
            }}>
              Join 10,000+ founders who have successfully validated their ideas and raised funding
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => navigate("/validate")}
                style={{
                  padding: "14px 32px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                  border: "none",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "transform 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                Start Free Trial →
              </button>
              <button
                onClick={() => alert("Schedule a demo!")}
                style={{
                  padding: "14px 32px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                Schedule Demo
              </button>
            </div>
            <p style={{
              fontSize: "12px",
              color: "#6b7280",
              marginTop: "32px"
            }}>
              No credit card required • Free 14-day trial • Cancel anytime
            </p>
          </div>
        </footer>
      </section>
    </>
  );
}

export default Start;