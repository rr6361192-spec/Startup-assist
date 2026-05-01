import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useStartup } from "./Vm";


  
import { 
  FaUser, 
  FaLock, 
  FaGoogle, 
  FaGithub,
  FaEye, 
  FaEyeSlash,
  FaArrowRight,
  FaCheckCircle,
  FaSpinner
} from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import axios from "axios";

const API_URL = "http://localhost:4000/api";

export default function Login() {
     const navigate = useNavigate();

      const {
          sessionId,
         completeIdea,
         diffData,
         pitchDeck, setPitchDeck,
         elevatorPitch, setElevatorPitch,
         pitchScore, setPitchScore,
         qaHistory, setQaHistory,
      


        setSessionId,
    setCompleteIdea,
    setFinalResult,
    setScores,
    overall, setOverall,
    miss, setMiss,
    report, setReport,
    finalResult,
    scores,
    ideaComplete,
    widthsFromScores,
    resetAll,
    idea,setIdea,
    diff,setDiff,
       } = useStartup();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return false;
    }
    
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
      setError("Please enter a valid email address");
      return false;
    }
    
    if (!isLogin && formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let response;
      
      if (isLogin) {
        response = await axios.post(`${API_URL}/auth/login`, {
          email: formData.email,
          password: formData.password
        });
      } else {
        response = await axios.post(`${API_URL}/auth/signup`, {
          email: formData.email,
          password: formData.password,
          name: formData.name || formData.email.split('@')[0]
        });
      }

      if (response.data.success) {
        // Store token
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        setSuccess(response.data.message);
        
        // Clear form after success
        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
          });
          setSuccess("");
          // You can redirect or show a message
          alert("Login successful! You can now access your account.");
          navigate("/Dash")
          

        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`${provider} login coming soon!`);
  };

  // Inline styles
  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      background: "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },
    card: {
      maxWidth: "450px",
      width: "100%",
      background: "rgba(17, 24, 39, 0.9)",
      backdropFilter: "blur(10px)",
      borderRadius: "24px",
      padding: "40px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      border: "1px solid rgba(255, 255, 255, 0.1)"
    },
    brand: {
      textAlign: "center",
      marginBottom: "32px"
    },
    brandIcon: {
      fontSize: "48px",
      marginBottom: "12px"
    },
    brandName: {
      fontSize: "28px",
      fontWeight: "800",
      background: "linear-gradient(135deg, #fff 0%, #a78bfa 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text"
    },
    header: {
      textAlign: "center",
      marginBottom: "32px"
    },
    headerH2: {
      fontSize: "28px",
      fontWeight: "700",
      color: "white",
      marginBottom: "8px"
    },
    headerP: {
      color: "#94a3b8",
      fontSize: "14px"
    },
    alert: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px 16px",
      borderRadius: "12px",
      marginBottom: "20px",
      fontSize: "13px"
    },
    errorAlert: {
      background: "rgba(239, 68, 68, 0.1)",
      border: "1px solid rgba(239, 68, 68, 0.3)",
      color: "#f87171"
    },
    successAlert: {
      background: "rgba(52, 211, 153, 0.1)",
      border: "1px solid rgba(52, 211, 153, 0.3)",
      color: "#34d399"
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    },
    inputGroup: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    },
    inputIcon: {
      position: "absolute",
      left: "16px",
      color: "#6b7280",
      fontSize: "18px"
    },
    input: {
      width: "100%",
      padding: "12px 16px 12px 48px",
      background: "rgba(0, 0, 0, 0.4)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "12px",
      color: "white",
      fontSize: "14px",
      transition: "all 0.2s",
      outline: "none"
    },
    passwordToggle: {
      position: "absolute",
      right: "16px",
      background: "none",
      border: "none",
      color: "#6b7280",
      cursor: "pointer",
      fontSize: "18px"
    },
    forgotPassword: {
      textAlign: "right"
    },
    forgotLink: {
      background: "none",
      border: "none",
      color: "#8b5cf6",
      fontSize: "12px",
      cursor: "pointer"
    },
    submitBtn: {
      marginTop: "8px",
      padding: "12px",
      background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
      border: "none",
      borderRadius: "12px",
      color: "white",
      fontWeight: "600",
      fontSize: "14px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: "all 0.2s"
    },
    divider: {
      position: "relative",
      textAlign: "center",
      margin: "24px 0"
    },
    dividerLine: {
      position: "absolute",
      top: "50%",
      left: 0,
      right: 0,
      height: "1px",
      background: "rgba(255, 255, 255, 0.1)"
    },
    dividerText: {
      position: "relative",
      background: "rgba(17, 24, 39, 0.9)",
      padding: "0 16px",
      color: "#6b7280",
      fontSize: "12px"
    },
    socialButtons: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
      marginBottom: "24px"
    },
    socialBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "10px",
      background: "rgba(255, 255, 255, 0.05)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "12px",
      color: "white",
      fontSize: "13px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s"
    },
    toggle: {
      textAlign: "center",
      marginBottom: "20px"
    },
    toggleP: {
      color: "#94a3b8",
      fontSize: "13px",
      marginBottom: "8px"
    },
    toggleBtn: {
      background: "none",
      border: "none",
      color: "#8b5cf6",
      fontWeight: "600",
      fontSize: "14px",
      cursor: "pointer"
    },
    terms: {
      textAlign: "center",
      fontSize: "11px",
      color: "#6b7280"
    },
    termsBtn: {
      background: "none",
      border: "none",
      color: "#8b5cf6",
      cursor: "pointer",
      fontSize: "11px"
    },
    spinner: {
      animation: "spin 1s linear infinite"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Brand */}
        <div style={styles.brand}>
          <div style={styles.brandIcon}></div>
          <h1 style={styles.brandName}>StartupAssist</h1>
        </div>

        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.headerH2}>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p style={styles.headerP}>
            {isLogin 
              ? "Sign in to continue your startup journey" 
              : "Start your startup journey today"}
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div style={{ ...styles.alert, ...styles.errorAlert }}>
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div style={{ ...styles.alert, ...styles.successAlert }}>
            <FaCheckCircle />
            <p>{success}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <div style={styles.inputGroup}>
              <FaUser style={styles.inputIcon} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <MdOutlineEmail style={styles.inputIcon} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
            />
          </div>

          <div style={styles.inputGroup}>
            <FaLock style={styles.inputIcon} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
            />
            <button
              type="button"
              style={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {!isLogin && (
            <div style={styles.inputGroup}>
              <FaLock style={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
              />
            </div>
          )}

          {isLogin && (
            <div style={styles.forgotPassword}>
              <button 
                type="button"
                onClick={() => alert("Password reset link will be sent to your email")}
                style={styles.forgotLink}
                onMouseEnter={(e) => e.target.style.color = "#a78bfa"}
                onMouseLeave={(e) => e.target.style.color = "#8b5cf6"}
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button 
            type="submit" 
            style={styles.submitBtn}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 10px 20px rgba(139, 92, 246, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {loading ? (
              <>
                <FaSpinner style={styles.spinner} />
                {isLogin ? "Signing In..." : "Creating Account..."}
              </>
            ) : (
              <>
                {isLogin ? "Sign In" : "Create Account"}
                <FaArrowRight />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>Or continue with</span>
        </div>

        {/* Social Buttons */}
        <div style={styles.socialButtons}>
          <button 
            onClick={() => handleSocialLogin("Google")}
            style={styles.socialBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.borderColor = "#ea4335";
              e.currentTarget.style.color = "#ea4335";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.color = "white";
            }}
          >
            <FaGoogle />
            Google
          </button>
          <button 
            onClick={() => handleSocialLogin("GitHub")}
            style={styles.socialBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.borderColor = "#6e5494";
              e.currentTarget.style.color = "#6e5494";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.color = "white";
            }}
          >
            <FaGithub />
            GitHub
          </button>
        </div>

        {/* Toggle */}
        <div style={styles.toggle}>
          <p style={styles.toggleP}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setSuccess("");
              setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
              });
            }}
            style={styles.toggleBtn}
            onMouseEnter={(e) => {
              e.target.style.color = "#a78bfa";
              e.target.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#8b5cf6";
              e.target.style.textDecoration = "none";
            }}
          >
            {isLogin ? "Create Account" : "Sign In"}
          </button>
        </div>

        {/* Terms */}
        <p style={styles.terms}>
          By continuing, you agree to our{" "}
          <button type="button" style={styles.termsBtn}>Terms of Service</button> and{" "}
          <button type="button" style={styles.termsBtn}>Privacy Policy</button>
        </p>
      </div>

      {/* Add keyframe animation style */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}