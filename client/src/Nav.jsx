import React from 'react'
import { FaRocket } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { FaChartLine, FaLightbulb, FaFileAlt, FaUserTie, FaBookOpen, FaShareAlt, FaCheckCircle, FaLock, FaArrowRight } from "react-icons/fa";
import { MdOutlineUpload } from "react-icons/md";
import { BiTargetLock } from "react-icons/bi";
import { GiProgression } from "react-icons/gi";
import './dsa.css';


  
function Nav() {
  const navigate = useNavigate();
  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems:'flex-start',
          padding: "1rem 2rem",
          background: "linear-gradient(90deg, #0078ff, #7b3fff)", // colorful background
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontWeight: "800",
            fontSize: "1.8rem",   // bigger logo text
            color: "#fff"
          }}
        >
          <span style={{ fontSize: "2rem", marginRight: "0.5rem",marginTop:'5px' }}> <FaRocket size={40} color="#ff009d" /></span>
          StartupAssist
        </div>
      
        {/* Navigation Links */}
        <nav style={{ display: "flex", gap: "3rem", fontSize: "1.1rem",position:'relative',left:'410px' }}>
          <a href="#features" style={{ textDecoration: "none", color: "#fff", fontWeight: "500" }}>Features</a>
          <a href="#how" style={{ textDecoration: "none", color: "#fff", fontWeight: "500" }}>How It Works</a>
          <a href="#pricing" style={{ textDecoration: "none", color: "#fff", fontWeight: "500" }}>Pricing</a>
        </nav>
      
        {/* Get Started Button */}
        <button
          style={{
            backgroundColor: "#fff",
            color: "#7b3fff",
            border: "none",
            padding: "0.6rem 1.4rem",
            borderRadius: "6px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
          }}
       onClick={()=>{navigate("/Login")}} >
          Get Started
        </button>
      </header>
    </div>
  )
}

export default Nav
