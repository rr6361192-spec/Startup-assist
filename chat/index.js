import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose"


dotenv.config();


const app = express();
const PORT = process.env.PORT || 4000;




app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204
}));
app.use(express.json());

const GROQ_API_KEY = process.env.KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const CACHE_TTL = 5 * 60 * 1000;

const sessions = new Map();
const cache = new Map()





// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// JWT Secret
const JWT_SECRET = process.env.KEY || "your_super_secret_jwt_key_change_this";
const JWT_EXPIRES_IN = "7d";

// ─────────────────────────────────────────────
// MONGODB SCHEMAS
// ─────────────────────────────────────────────

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Blacklisted Token Schema
const blacklistedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Auto remove after 24 hours
  }
});

// Create models
const User = mongoose.model('User', userSchema);
const BlacklistedToken = mongoose.model('BlacklistedToken', blacklistedTokenSchema);

// ─────────────────────────────────────────────
// CONNECT TO MONGODB ATLAS
// ─────────────────────────────────────────────
async function connectDB() {
  try {
    await mongoose.connect(process.env.URI);
    console.log('✅ MongoDB Atlas connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`📍 Host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Atlas connection error:', error.message);
    process.exit(1);
  }
}

// ─────────────────────────────────────────────
// AUTHENTICATION MIDDLEWARE
// ─────────────────────────────────────────────
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  // Check if token is blacklisted
  const isBlacklisted = await BlacklistedToken.findOne({ token });
  if (isBlacklisted) {
    return res.status(401).json({ error: "Token has been invalidated" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(403).json({ error: "Invalid token" });
  }
};

// ─────────────────────────────────────────────
// SIGNUP ROUTE
// ─────────────────────────────────────────────
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    if (!email.match(/^\S+@\S+\.\S+$/)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name: name || email.split('@')[0]
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      },
      token
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────
// LOGIN ROUTE
// ─────────────────────────────────────────────
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      },
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────
// GET CURRENT USER
// ─────────────────────────────────────────────
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────
// LOGOUT ROUTE
// ─────────────────────────────────────────────
app.post("/api/auth/logout", authenticateToken, async (req, res) => {
  try {
    await BlacklistedToken.create({ token: req.token });
    
    res.json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────
// HEALTH CHECK
// ─────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Auth server running",
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// ─────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────
async function startServer() {
  await connectDB();
  
  
}

startServer();




// ── Request Queue ──────────────────────────────────────
class RequestQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.lastRequest = 0;
    this.minInterval = 2000;
  }
  add(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.process();
    });
  }
  async process() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;
    while (this.queue.length > 0) {
      const { fn, resolve, reject } = this.queue.shift();
      const wait = this.minInterval - (Date.now() - this.lastRequest);
      if (wait > 0) {
        console.log(`⏳ Waiting ${wait}ms...`);
        await new Promise(r => setTimeout(r, wait));
      }
      try {
        this.lastRequest = Date.now();
        resolve(await fn());
      } catch (err) {
        reject(err);
      }
    }
    this.processing = false;
  }
}

const requestQueue = new RequestQueue();

// ── Groq call ──────────────────────────────────────────
async function callGroq(prompt, isJson = true) {
  if (!GROQ_API_KEY || GROQ_API_KEY === "your_groq_api_key_here") {
    console.log("⚠️ No API key, using mock");
    return getMockResponse(prompt);
  }
  const cacheKey = `${prompt.substring(0, 200)}_${isJson}`;
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      console.log("💾 Cache hit");
      return cached.data;
    }
    cache.delete(cacheKey);
  }
  return requestQueue.add(() => makeGroqRequest(prompt, isJson, cacheKey));
}

async function makeGroqRequest(prompt, isJson, cacheKey, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      console.log(`📡 Groq attempt ${attempt + 1}/${retries}`);
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: isJson
                ? "You are a JSON API. Return ONLY valid JSON. No markdown, no explanations."
                : "You are Alex, a friendly startup coach. Keep responses short (max 2 sentences)."
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 800
        })
      });

      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get("retry-after") || "10");
        console.log(`⏰ Rate limited. Waiting ${retryAfter}s...`);
        await new Promise(r => setTimeout(r, retryAfter * 1000));
        continue;
      }

      if (!response.ok) throw new Error(`Groq: ${response.status}`);

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("Empty response");

      let result;
      if (isJson) {
        const match = content.match(/\{[\s\S]*\}/);
        result = JSON.parse(match ? match[0] : content);
      } else {
        result = content;
      }

      cache.set(cacheKey, { data: result, timestamp: Date.now() });
      console.log("✅ Groq OK");
      return result;

    } catch (err) {
      console.error(`❌ Attempt ${attempt + 1}:`, err.message);
      if (attempt < retries - 1) {
        const backoff = Math.pow(2, attempt) * 1000;
        console.log(`🔄 Retry in ${backoff}ms...`);
        await new Promise(r => setTimeout(r, backoff));
      }
    }
  }
  console.log("❌ All retries failed, using mock");
  return getMockResponse(prompt);
}

// ── Mock ───────────────────────────────────────────────
function getMockResponse(prompt) {
  if (prompt.includes("Score each") || prompt.includes("analyze")) {
    return {
      scores: {
        problem_clarity: { score: 45, classification: "SOMEWHAT", reasoning: "Problem mentioned but needs more clarity" },
        solution_fit: { score: 40, classification: "SOMEWHAT", reasoning: "Solution needs more detail" },
        market_size: { score: 30, classification: "WEAK", reasoning: "Target market not specified" },
        revenue_stability: { score: 25, classification: "WEAK", reasoning: "Revenue model not mentioned" },
        competitive_moat: { score: 35, classification: "WEAK", reasoning: "Competitive advantage unclear" }
      },
      first_question: "What specific problem are you trying to solve for your customers?"
    };
  }
  if (prompt.includes("Evaluate") || prompt.includes("evaluate")) {
    return { new_score: 65, is_satisfied: false, feedback: "Good start, but be more specific" };
  }
  if (prompt.includes("differentiation") || prompt.includes("competitors")) {
    return {
      competitors: [
        {
          name: "Market Leader Inc",
          description: "Established market player",
          market_position: "Premium",
          strengths: ["Strong brand", "Large customer base"],
          weaknesses: ["High pricing", "Slow innovation"]
        },
        {
          name: "Fast Challenger",
          description: "Agile competitor",
          market_position: "Value",
          strengths: ["Modern tech", "Competitive pricing"],
          weaknesses: ["Limited resources", "Smaller team"]
        }
      ],
      uvp: "AI-powered solution making startup validation accessible",
      key_differentiator: "AI-first with business-friendly pricing",
      target_audience: {
        who: "Startup founders",
        age_range: "25-45",
        pain_point: "Difficulty validating ideas cheaply",
        behavior: "Tech-savvy, value efficiency",
        goal: "Validate ideas quickly",
        willingness_to_pay: "MEDIUM"
      },
      positioning: {
        your_product: { x: 70, y: 60 },
        competitors: [
          { name: "Market Leader Inc", x: 30, y: 40 },
          { name: "Fast Challenger", x: 50, y: 70 }
        ],
        market_gap: { x: 75, y: 65 }
      },
      takeaways: [
        { title: "AI-First", desc: "Built with cutting-edge AI" },
        { title: "Affordable", desc: "Pricing for all businesses" },
        { title: "User-Friendly", desc: "Easy to use, no training needed" }
      ],
      next_steps: "Build MVP → Find beta testers → Gather feedback → Seek funding"
    };
  }
  if (prompt.includes("pitch deck") || prompt.includes("Pitch Deck")) {
    return {
      slides: [
        { title: "Title", content: "Startup Name\nFounding Team\nRevolutionary Solution" },
        { title: "Problem", content: "Customers face significant challenges\nCosts time and money\nNo good solution exists today" },
        { title: "Solution", content: "Our product solves the problem\nSimple, effective, and scalable\nBuilt with modern technology" },
        { title: "Market Size", content: "TAM: $10B+\nSAM: $2B\nSOM: $200M in year 3" },
        { title: "Product", content: "Core features deliver value immediately\nBuilt with modern technology stack\nUser-friendly interface" },
        { title: "Business Model", content: "SaaS subscription\nTiered pricing starting at $49/month\nAnnual plans available" },
        { title: "Competitors", content: "Existing solutions are outdated\nWe offer better value\nFaster and more efficient" },
        { title: "Your Edge", content: "Proprietary technology\nFirst-mover advantage\nStrong IP portfolio" },
        { title: "Traction", content: "MVP complete\nBeta users engaged\nStrong early metrics" },
        { title: "The Ask", content: "$500k seed round\n12 months runway\nKey hires and marketing" }
      ]
    };
  }
  if (prompt.includes("elevator pitch")) {
    return {
      script: "We're revolutionizing [industry] by helping [target customer] solve [problem] unlike anyone else. Our [solution] delivers [key benefit]. We're looking for [ask] to scale.",
      hook: "Did you know that 90% of [target audience] struggle with this daily?",
      problem: "[Target customer] wastes hours every week on [pain point].",
      solution: "[Product name] automates this process, saving 10+ hours per week.",
      ask: "We're raising $500k to accelerate development and customer acquisition."
    };
  }
  if (prompt.includes("investor question")) {
    return {
      question: "What is your customer acquisition cost and how do you expect it to evolve as you scale?",
      feedback: null,
      area: "go_to_market"
    };
  }
  if (prompt.includes("pitch score")) {
    return {
      overall_score: 72,
      verdict: "Strong pitch with clear value proposition. Good understanding of market dynamics.",
      scores: {
        clarity: { score: 75, feedback: "Good communication, could be more concise" },
        market_knowledge: { score: 70, feedback: "Understands the space well" },
        revenue_understanding: { score: 68, feedback: "Solid model, needs unit economics" },
        competitive_awareness: { score: 72, feedback: "Knows competitors well" },
        confidence: { score: 78, feedback: "Good presence and conviction" }
      },
      improvements: [
        "Prepare specific TAM/SAM/SOM numbers with sources",
        "Define unit economics more clearly with examples",
        "Practice handling tougher competitor comparison questions"
      ]
    };
  }
  return "Thanks for sharing! Could you tell me more?";
}

// ── Helpers ────────────────────────────────────────────
function calculateOverall(scores) {
  if (!scores) return 0;
  const keys = ["problem_clarity", "solution_fit", "market_size", "revenue_stability", "competitive_moat"];
  return Math.round(keys.reduce((sum, k) => sum + (scores[k]?.score || 0), 0) / keys.length);
}

function generateGaps(scores) {
  const configs = {
    problem_clarity: { severity: "CRITICAL", what_is_missing: "Clear problem definition", why_it_matters: "Customers won't understand why they need this", fix_hint: "What specific pain point are you solving?" },
    solution_fit: { severity: "CRITICAL", what_is_missing: "Detailed solution explanation", why_it_matters: "Investors need to understand how it works", fix_hint: "How exactly does your solution work?" },
    market_size: { severity: "CRITICAL", what_is_missing: "Target market definition", why_it_matters: "You need to know who your customers are", fix_hint: "Who are your ideal customers?" },
    revenue_stability: { severity: "MODERATE", what_is_missing: "Revenue model", why_it_matters: "Business needs a way to make money", fix_hint: "How will you make money?" },
    competitive_moat: { severity: "MODERATE", what_is_missing: "Competitive advantage", why_it_matters: "You need to stand out from competitors", fix_hint: "What makes you different?" }
  };
  return Object.entries(configs)
    .filter(([key]) => (scores[key]?.score || 0) < 50)
    .map(([key, cfg]) => ({
      dimension: key,
      severity: (scores[key]?.score || 0) < 30 ? "CRITICAL" : cfg.severity,
      ...cfg
    }));
}

function buildFinalResult(session) {
  return {
    complete_idea: {
      title: session.idea.substring(0, 50),
      short_summary: session.idea,
      problem: "Problem refined through conversation",
      solution: "Solution clearly defined",
      target_market: "Target audience identified",
      revenue_model: "Sustainable revenue model established",
      competitive_advantage: "Unique advantage defined"
    },
    final_scores: session.scores,
    overall_score: calculateOverall(session.scores),
    market_viability: { verdict: "VIABLE", reasoning: "Well-developed idea with market potential" },
    remaining_gaps: [],
    strengths: [{ dimension: "idea_development", finding: "Idea significantly refined" }],
    assumptions: []
  };
}

function buildReport(session) {
  return {
    complete_idea: {
      title: session.idea.substring(0, 50),
      short_summary: session.idea,
      problem: "Problem refined through conversation",
      solution: "Solution clearly defined",
      target_market: "Target audience identified",
      revenue_model: "Sustainable revenue model established",
      competitive_advantage: "Unique advantage defined"
    },
    competitors: [
      { name: "Competitor A", tagline: "Market leader", strengths: ["Brand recognition", "Large base"], weaknesses: ["High pricing", "Slow innovation"] },
      { name: "Competitor B", tagline: "Innovative challenger", strengths: ["Modern tech", "Competitive price"], weaknesses: ["Limited resources", "Smaller team"] }
    ],
    uvp: {
      statement: `AI-powered solution making ${session.idea.substring(0, 40)} accessible`,
      points: [
        { title: "AI-First", desc: "Built with cutting-edge AI" },
        { title: "Affordable", desc: "Pricing for all businesses" },
        { title: "User-Friendly", desc: "Easy to use, no training needed" }
      ]
    },
    positioning: {
      your_product: { x: 70, y: 60 },
      competitors: [
        { name: "Competitor A", x: 30, y: 40 },
        { name: "Competitor B", x: 50, y: 70 }
      ],
      market_gap: { x: 75, y: 65 }
    },
    takeaways: [
      { title: "✅ Validated", desc: "Idea thoroughly refined" },
      { title: "🎯 Clear Path", desc: "Clear direction forward" },
      { title: "🚀 Ready", desc: "Time to build MVP" }
    ],
    next_steps: "Build MVP → Find beta testers → Gather feedback → Seek funding"
  };
}

// ── Helper functions for pitch routes ─────────────────────────────

function getSession(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) throw new Error("Session not found");
  return session;
}

async function safeJSON(prompt, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await callGroq(prompt, true);
      if (result && typeof result === 'object') {
        return result;
      }
    } catch (err) {
      console.log(`Attempt ${i + 1} failed, retrying...`);
      if (i === retries - 1) {
        return getMockResponse(prompt);
      }
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  return {};
}

// ── Routes ─────────────────────────────────────────────

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server running",
    api_configured: !!(GROQ_API_KEY && GROQ_API_KEY !== "your_groq_api_key_here")
  });
});

// Analyse idea
app.post("/api/response", async (req, res) => {
  try {
    const { idea } = req.body;
    if (!idea?.trim()) return res.status(400).json({ error: "Missing idea" });

    console.log("📝 Analysing:", idea.substring(0, 60));

    const prompt = `
      Analyze this startup idea: "${idea}"
      Score each dimension 0-100 based ONLY on what is explicitly mentioned:
      1. problem_clarity: Is the problem clearly defined?
      2. solution_fit: Is the solution explained well?
      3. market_size: Is the target market mentioned?
      4. revenue_stability: Is the revenue model mentioned?
      5. competitive_moat: Is the competitive advantage mentioned?

      Classification: STRONG(75-100) SOMEWHAT(40-74) WEAK(1-39) MISSING(0)

      Return ONLY valid JSON:
      {
        "scores": {
          "problem_clarity": {"score": number, "classification": "string", "reasoning": "string"},
          "solution_fit": {"score": number, "classification": "string", "reasoning": "string"},
          "market_size": {"score": number, "classification": "string", "reasoning": "string"},
          "revenue_stability": {"score": number, "classification": "string", "reasoning": "string"},
          "competitive_moat": {"score": number, "classification": "string", "reasoning": "string"}
        },
        "first_question": "ONE specific question to improve the weakest area"
      }
    `;

    let analysis = await callGroq(prompt, true);
    if (!analysis?.scores) analysis = getMockResponse("Score each");

    const sessionId = Math.random().toString(36).substring(7);
    const overall = calculateOverall(analysis.scores);
    const gaps = generateGaps(analysis.scores);

    sessions.set(sessionId, {
      idea,
      scores: analysis.scores,
      gaps,
      currentGapIndex: 0,
      conversationHistory: [],
      gapAttempts: {},
      createdAt: new Date().toISOString()
    });

    const firstMessage = analysis.first_question || `Hi! I'm Alex. ${gaps[0]?.fix_hint || "Tell me more!"}`;

    sessions.get(sessionId).conversationHistory.push({
      role: "assistant", content: firstMessage
    });

    res.json({
      sessionId,
      analysis: analysis.scores,
      overall,
      gaps,
      total_gaps: gaps.length,
      verdict: gaps.length > 2 ? "Needs significant refinement" : "Good start!",
      firstMessage,
      status: "IN_PROGRESS"
    });

  } catch (err) {
    console.error("❌ /api/response:", err);
    res.status(500).json({ error: err.message });
  }
});

// Chat
app.post("/api/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: "Missing sessionId" });
    if (!message?.trim()) return res.status(400).json({ error: "Missing message" });

    const session = sessions.get(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    session.conversationHistory.push({ role: "user", content: message });

    const currentGap = session.gaps[session.currentGapIndex];

    if (!currentGap) {
      const finalResult = buildFinalResult(session);
      const report = buildReport(session);
      sessions.set(sessionId, { ...session, finalResult, report });
      
      return res.json({
        status: "IDEA_COMPLETE",
        reply: "🎉 Excellent! Your idea is now well-refined. Check your full report!",
        liveScores: session.scores,
        overall: calculateOverall(session.scores),
        finalResult,
        report
      });
    }

    const dim = currentGap.dimension;
    session.gapAttempts[dim] = (session.gapAttempts[dim] || 0) + 1;
    const MAX_ATTEMPTS = 2;
    const forceMove = session.gapAttempts[dim] >= MAX_ATTEMPTS;
    const prevScore = session.scores[dim]?.score || 30;

    const evalPrompt = `
      Evaluate this answer for a startup idea:
      Dimension: ${dim}
      What was missing: ${currentGap.what_is_missing}
      Founder's answer: "${message}"
      Previous score: ${prevScore}
      New score must be >= ${prevScore}.
      Return ONLY valid JSON:
      {"new_score": number, "is_satisfied": boolean, "feedback": "brief feedback"}
    `;

    let evaluation = await callGroq(evalPrompt, true);
    let newScore = prevScore;
    let satisfied = false;

    if (evaluation?.new_score) {
      newScore = Math.min(evaluation.new_score, 100);
      satisfied = evaluation.is_satisfied || newScore >= 70;
    } else {
      const len = message.length;
      newScore = len > 100 ? Math.min(prevScore + 40, 100)
        : len > 60 ? Math.min(prevScore + 25, 100)
          : len > 30 ? Math.min(prevScore + 15, 100)
            : Math.min(prevScore + 5, 100);
      satisfied = newScore >= 70;
    }

    session.scores[dim] = {
      ...session.scores[dim],
      score: newScore,
      classification: newScore >= 70 ? "STRONG" : newScore >= 40 ? "SOMEWHAT" : "WEAK",
      reasoning: evaluation?.feedback || "Updated"
    };

    const newOverall = calculateOverall(session.scores);
    const gapClosed = satisfied || forceMove || newScore >= 70;

    if (gapClosed) {
      session.currentGapIndex++;

      if (session.currentGapIndex >= session.gaps.length) {
        const finalResult = buildFinalResult(session);
        const report = buildReport(session);
        sessions.set(sessionId, { ...session, finalResult, report });
        
        return res.json({
          status: "IDEA_COMPLETE",
          reply: "🎉 Outstanding! Your idea is fully refined. Here's your complete report!",
          liveScores: session.scores,
          overall: newOverall,
          finalResult,
          report
        });
      }

      const nextGap = session.gaps[session.currentGapIndex];
      const ack = evaluation?.feedback || "Thanks! ";
      const reply = `${ack} Now let's talk about ${nextGap.dimension.replace(/_/g, " ")}. ${nextGap.fix_hint}`;
      session.conversationHistory.push({ role: "assistant", content: reply });

      return res.json({
        status: "NEXT_GAP",
        reply,
        liveScores: session.scores,
        overall: newOverall,
        forcedMove: forceMove
      });
    }

    const followUps = {
      problem_clarity: "Can you describe the problem more specifically with a concrete example?",
      solution_fit: "Walk me through how your solution works step by step.",
      market_size: "Who exactly are your customers? Describe their age, job, and challenges.",
      revenue_stability: "What's your pricing strategy? Monthly, one-time, or usage-based?",
      competitive_moat: "What makes you truly different from existing solutions?"
    };

    const attemptsLeft = MAX_ATTEMPTS - session.gapAttempts[dim];
    const reply = `${followUps[dim] || "Can you elaborate more?"} (${attemptsLeft} attempt${attemptsLeft !== 1 ? "s" : ""} left)`;
    session.conversationHistory.push({ role: "assistant", content: reply });

    return res.json({
      status: "FOLLOW_UP",
      reply,
      liveScores: session.scores,
      overall: newOverall,
      attemptsLeft
    });

  } catch (err) {
    console.error("❌ /api/chat:", err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// PITCH ROUTES (for Pitch.js frontend)
// ─────────────────────────────────────────────

// Generate Pitch Deck
app.post("/api/pitch/deck", async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: "Missing sessionId" });

    const session = getSession(sessionId);
    if (!session.finalResult && !session.report) {
      return res.status(400).json({ error: "Complete idea validation first" });
    }

    const completeIdea = session.finalResult?.complete_idea || session.report?.complete_idea;
    
    const prompt = `
      Generate a 10-slide investor pitch deck for this startup:
      ${JSON.stringify(completeIdea, null, 2)}
      
      Return STRICT JSON only:
      {
        "slides": [
          {"title": "Title", "content": "Company name and tagline\\nFounding team\\nOne liner"},
          {"title": "Problem", "content": "Specific problem\\nWho faces it\\nHow big the pain is"},
          {"title": "Solution", "content": "How it works\\nKey features\\nWhy it works"},
          {"title": "Market Size", "content": "TAM size\\nSAM size\\nTarget segment"},
          {"title": "Product", "content": "Core features\\nHow user uses it\\nKey differentiator"},
          {"title": "Business Model", "content": "Revenue streams\\nPricing\\nUnit economics"},
          {"title": "Competitors", "content": "Key competitors\\nYour advantages\\nWhy you win"},
          {"title": "Your Edge", "content": "Unique value proposition\\nMoat\\nWhy now"},
          {"title": "Traction", "content": "Current status\\nKey metrics\\nMilestones hit"},
          {"title": "The Ask", "content": "Funding amount\\nUse of funds\\nNext milestones"}
        ]
      }
    `;

    const result = await safeJSON(prompt);
    res.json({ slides: result.slides || getMockResponse("pitch deck").slides });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Generate Elevator Pitch
app.post("/api/pitch/elevator", async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: "Missing sessionId" });

    const session = getSession(sessionId);
    if (!session.finalResult && !session.report) {
      return res.status(400).json({ error: "Complete idea validation first" });
    }

    const completeIdea = session.finalResult?.complete_idea || session.report?.complete_idea;
    
    const prompt = `
      Write a 30-second elevator pitch for this startup:
      ${JSON.stringify(completeIdea, null, 2)}
      
      Return STRICT JSON only:
      {
        "script": "complete 30 second pitch script",
        "hook": "opening attention grabber",
        "problem": "the problem in one sentence",
        "solution": "the solution in one sentence",
        "traction": "current status or proof",
        "ask": "what you are looking for"
      }
    `;

    const result = await safeJSON(prompt);
    res.json(result.elevator_pitch ? result : getMockResponse("elevator pitch"));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Generate Investor Question
app.post("/api/pitch/question", async (req, res) => {
  try {
    const { sessionId, answer, qaHistory } = req.body;
    if (!sessionId) return res.status(400).json({ error: "Missing sessionId" });

    const session = getSession(sessionId);
    if (!session.finalResult && !session.report) {
      return res.status(400).json({ error: "Complete idea validation first" });
    }

    const completeIdea = session.finalResult?.complete_idea || session.report?.complete_idea;
    
    const prompt = `
      You are a tough investor interviewing a founder.
      
      STARTUP IDEA:
      ${JSON.stringify(completeIdea, null, 2)}
      
      CONVERSATION SO FAR:
      ${qaHistory && qaHistory.length > 0 
        ? qaHistory.map(m => `${m.role === "founder" ? "Founder" : "Investor"}: ${m.text}`).join("\n")
        : "No conversation yet — ask your first question."}
      
      ${answer ? `\nFOUNDER'S LAST ANSWER: "${answer}"\n` : ""}
      
      Ask ONE tough but fair investor question.
      Give brief feedback on the founder's last answer if there was one.
      
      Return STRICT JSON only:
      {
        "question": "one specific tough question",
        "feedback": ${answer ? "brief feedback on their answer" : "null"},
        "area": "market|revenue|go_to_market|team|tech|risk"
      }
    `;

    const result = await safeJSON(prompt);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Generate Pitch Score
app.post("/api/pitch/score", async (req, res) => {
  try {
    const { sessionId, qaHistory } = req.body;
    if (!sessionId) return res.status(400).json({ error: "Missing sessionId" });

    const session = getSession(sessionId);
    if (!session.finalResult && !session.report) {
      return res.status(400).json({ error: "Complete idea validation first" });
    }

    const completeIdea = session.finalResult?.complete_idea || session.report?.complete_idea;
    
    const prompt = `
      Score this founder's pitch performance.
      
      STARTUP IDEA:
      ${JSON.stringify(completeIdea, null, 2)}
      
      Q&A SESSION:
      ${qaHistory.map(m => `${m.role === "founder" ? "Founder" : "Investor"}: ${m.text}`).join("\n")}
      
      Return STRICT JSON only:
      {
        "overall_score": 0-100,
        "verdict": "one sentence about pitch quality",
        "scores": {
          "clarity": {"score": 0-100, "feedback": "specific feedback"},
          "market_knowledge": {"score": 0-100, "feedback": "specific feedback"},
          "revenue_understanding": {"score": 0-100, "feedback": "specific feedback"},
          "competitive_awareness": {"score": 0-100, "feedback": "specific feedback"},
          "confidence": {"score": 0-100, "feedback": "specific feedback"}
        },
        "improvements": ["improvement 1", "improvement 2", "improvement 3"]
      }
    `;

    const result = await safeJSON(prompt);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Differentiation
app.post("/api/differentiation", async (req, res) => {
  try {
    const { shortSummary } = req.body;
    if (!shortSummary) return res.status(400).json({ error: "Missing shortSummary" });

    console.log("🔍 Differentiation for:", shortSummary.substring(0, 60));

    const prompt = `
      For this startup: "${shortSummary}"
      Generate a complete market differentiation report.
      Return ONLY valid JSON:
      {
        "competitors": [
          {"name":"string","description":"string","market_position":"string","strengths":["string"],"weaknesses":["string"]}
        ],
        "uvp": {"statement":"string","points":[{"title":"string","desc":"string"}]},
        "key_differentiator": "string",
        "target_audience": {
          "who":"string","age_range":"string","pain_point":"string",
          "behavior":"string","goal":"string","willingness_to_pay":"LOW|MEDIUM|HIGH"
        },
        "positioning": {
          "your_product": {"x":number,"y":number},
          "competitors": [{"name":"string","x":number,"y":number}],
          "market_gap": {"x":number,"y":number}
        },
        "takeaways": [{"title":"string","desc":"string"}],
        "next_steps": "string"
      }
    `;

    let result = await callGroq(prompt, true);
    if (!result?.competitors) result = getMockResponse("differentiation");

    res.json(result);

  } catch (err) {
    console.error("❌ /api/differentiation:", err);
    res.status(500).json({ error: err.message });
  }
});

// Session
app.get("/api/session/:sessionId", (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });
  res.json({
    idea: session.idea,
    scores: session.scores,
    gaps: session.gaps,
    currentGapIndex: session.currentGapIndex,
    conversationHistory: session.conversationHistory.slice(-5),
    finalResult: session.finalResult,
    report: session.report
  });
});

// Cleanup
setInterval(() => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [id, s] of sessions.entries()) {
    if (new Date(s.createdAt).getTime() < oneHourAgo) {
      sessions.delete(id);
      console.log(`🧹 Cleaned: ${id}`);
    }
  }
}, 60 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`🔍 Health: http://localhost:${PORT}/api/health`);
  console.log(`📊 API: ${GROQ_API_KEY ? "✅ Configured" : "⚠️ Mock Mode"}`);
  console.log(`========================================\n`);
});