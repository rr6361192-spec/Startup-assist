
import React from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',sans-serif;background:#0d0f1a;color:#e8eaf6;font-size:17px;line-height:1.55}
.vt-wrap{padding:0;font-family:'DM Sans',sans-serif;color:#e8eaf6}
.page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:36px;gap:20px;flex-wrap:wrap}
.page-title{font-family:'Syne',sans-serif;font-weight:800;font-size:38px;display:flex;align-items:center;gap:10px;letter-spacing:-.02em;background:linear-gradient(135deg,#fff,#c4b5fd);-webkit-background-clip:text;background-clip:text;color:transparent}
.page-subtitle{color:#8892b0;font-size:16px;margin-top:8px}
.idea-banner{background:#131629;border:1px solid rgba(255,255,255,.07);border-radius:20px;padding:24px 28px;display:flex;align-items:center;gap:20px;margin-bottom:28px}
.idea-icon{width:60px;height:60px;background:linear-gradient(135deg,#5b4de0,#7c6ef7);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;box-shadow:0 8px 20px rgba(124,110,247,.25)}
.idea-tag{font-size:13px;color:#7c6ef7;font-weight:700;margin-bottom:6px;text-transform:uppercase;letter-spacing:.08em}
.idea-desc{font-size:18px;color:#e8eaf6;font-weight:600;line-height:1.4}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px}
@media(max-width:768px){.grid-2{grid-template-columns:1fr}}
.card{background:#131629;border:1px solid rgba(255,255,255,.07);border-radius:20px;padding:28px}
.card-title{font-family:'Syne',sans-serif;font-weight:700;font-size:18px;margin-bottom:20px;display:flex;align-items:center;gap:10px;color:#e8eaf6}
.card-title-icon{font-size:20px}
.section-label{font-size:11px;font-weight:700;color:#8892b0;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px}

/* Competitors */
.comp-scroll{display:flex;gap:16px;overflow-x:auto;padding-bottom:8px;scrollbar-width:thin;scrollbar-color:#1f2440 transparent}
.comp-scroll::-webkit-scrollbar{height:6px}
.comp-scroll::-webkit-scrollbar-thumb{background:#1f2440;border-radius:3px}
.comp-card{min-width:180px;background:#1a1e35;border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:18px;flex-shrink:0;transition:all .2s}
.comp-card:hover{border-color:rgba(124,110,247,.4);transform:translateY(-2px)}
.comp-logo{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:12px;font-weight:800;color:#fff}
.comp-name{font-weight:700;font-size:15px;margin-bottom:4px;color:#e8eaf6}
.comp-desc{font-size:12px;color:#8892b0;margin-bottom:12px;line-height:1.5}
.tag-row{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px}
.tag{font-size:11px;padding:3px 8px;border-radius:20px;font-weight:500}
.tag-s{background:#0d2e1f;color:#4fd1c5;border:1px solid rgba(79,209,197,.2)}
.tag-w{background:#2d1515;color:#fc8181;border:1px solid rgba(252,129,129,.2)}
.tag-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px}
.tag-label-s{color:#4fd1c5}
.tag-label-w{color:#fc8181}

/* UVP */
.uvp-quote-box{background:linear-gradient(140deg,#1a1e35,#1d1640 60%,#1a1e35);border:1px solid rgba(124,110,247,.3);border-radius:14px;padding:24px;margin-bottom:20px;position:relative;overflow:hidden}
.uvp-quote-box::before{content:'';position:absolute;top:-40px;right:-40px;width:180px;height:180px;background:radial-gradient(circle,rgba(124,110,247,.15),transparent 70%);pointer-events:none}
.uvp-text{font-size:17px;font-weight:500;line-height:1.7;color:#cdd3f0;position:relative;z-index:1}
.uvp-hi{color:#7c6ef7;font-weight:700}
.uvp-pills{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.uvp-pill{background:#1a1e35;border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:16px;text-align:center;transition:all .2s}
.uvp-pill:hover{border-color:rgba(124,110,247,.4);transform:translateY(-2px)}
.uvp-pill-icon{font-size:28px;margin-bottom:8px;display:block}
.uvp-pill-title{font-size:13px;font-weight:700;color:#cdd3f0;margin-bottom:4px}
.uvp-pill-desc{font-size:12px;color:#8892b0;line-height:1.5}

/* Scores */
.score-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px}
.score-item{background:#1a1e35;border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:16px;text-align:center;transition:all .2s}
.score-item:hover{transform:translateY(-2px);border-color:rgba(124,110,247,.3)}
.score-icon{font-size:24px;margin-bottom:8px}
.score-name{font-size:12px;color:#8892b0;margin-bottom:8px;font-weight:500;text-transform:capitalize}
.score-bar-bg{width:100%;height:6px;background:rgba(255,255,255,.08);border-radius:3px;overflow:hidden;margin-bottom:6px}
.score-bar-fill{height:100%;border-radius:3px;transition:width .8s cubic-bezier(.22,1,.36,1)}
.score-num{font-size:18px;font-weight:800;color:#e8eaf6}
.score-class{font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;margin-top:6px;display:inline-block}

/* Target Audience */
.tg{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.ti{padding:16px;background:#1a1e35;border-radius:12px;border:1px solid rgba(255,255,255,.07);transition:all .2s}
.ti:hover{border-color:rgba(124,110,247,.35);transform:translateY(-2px)}
.ti-header{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.ti-icon{font-size:20px}
.ti-title{font-size:12px;font-weight:700;color:#8892b0;text-transform:uppercase;letter-spacing:.05em}
.ti-text{font-size:13px;color:#cdd3f0;line-height:1.55}
.pay-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;margin-top:8px}

/* Market Viability */
.viability-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:16px}
.viability-item{background:#1a1e35;border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:16px}
.viability-label{font-size:11px;color:#8892b0;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px}
.viability-val{font-size:15px;font-weight:700;color:#e8eaf6}
.viability-reasoning{background:#1a1e35;border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:16px;font-size:13px;color:#8892b0;line-height:1.6}

/* Assumptions */
.assumption-item{background:#1a1e35;border-left:3px solid #f6c90e;border-radius:0 12px 12px 0;padding:14px 16px;margin-bottom:10px}
.assumption-item.high{border-left-color:#fc8181}
.assumption-item.medium{border-left-color:#f6c90e}
.assumption-item.low{border-left-color:#4fd1c5}
.assumption-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
.assumption-text{font-size:13px;font-weight:600;color:#e8eaf6}
.risk-badge{font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px}
.risk-HIGH{background:#2d1515;color:#fc8181}
.risk-MEDIUM{background:#2d2010;color:#f6c90e}
.risk-LOW{background:#0d2e1f;color:#4fd1c5}
.assumption-reason{font-size:12px;color:#8892b0;line-height:1.5}

/* Strengths */
.strength-item{display:flex;align-items:flex-start;gap:12px;padding:14px;background:#1a1e35;border-radius:12px;margin-bottom:10px;border:1px solid rgba(79,209,197,.15)}
.strength-dot{width:8px;height:8px;border-radius:50%;background:#4fd1c5;flex-shrink:0;margin-top:4px}
.strength-dim{font-size:12px;font-weight:700;color:#4fd1c5;text-transform:capitalize;margin-bottom:3px}
.strength-text{font-size:13px;color:#8892b0;line-height:1.5}

/* Remaining gaps */
.gap-item{display:flex;align-items:flex-start;gap:12px;padding:14px;background:#1a1e35;border-radius:12px;margin-bottom:10px}
.gap-dot-c{width:8px;height:8px;border-radius:50%;background:#fc8181;flex-shrink:0;margin-top:4px}
.gap-dot-m{width:8px;height:8px;border-radius:50%;background:#f6c90e;flex-shrink:0;margin-top:4px}
.gap-dim{font-size:12px;font-weight:700;text-transform:capitalize;margin-bottom:3px}
.gap-text{font-size:13px;color:#8892b0;line-height:1.5}
.gap-hint{font-size:12px;color:#4fd1c5;margin-top:4px}

/* Complete Idea */
.idea-field{margin-bottom:16px;padding:16px;background:#1a1e35;border-radius:12px;border:1px solid rgba(255,255,255,.07)}
.idea-field-label{font-size:11px;font-weight:700;color:#7c6ef7;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}
.idea-field-value{font-size:14px;color:#cdd3f0;line-height:1.6}

/* Next steps */
.next-steps-card{background:linear-gradient(135deg,#131629,#1a1e35);border:1px solid rgba(124,110,247,.2);border-radius:20px;padding:28px;margin-bottom:24px}
.ns-title{font-family:'Syne',sans-serif;font-weight:800;font-size:20px;margin-bottom:12px;color:#e8eaf6}
.ns-text{font-size:15px;color:#8892b0;line-height:1.7;margin-bottom:24px}
.cta-btn{background:linear-gradient(135deg,#7c6ef7,#5b4de0);color:#fff;border:none;padding:14px 28px;border-radius:14px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:10px;transition:all .2s;box-shadow:0 6px 20px rgba(124,110,247,.4)}
.cta-btn:hover{background:linear-gradient(135deg,#8b7ef8,#6a5be8);transform:translateY(-2px);box-shadow:0 10px 28px rgba(124,110,247,.5)}

@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fadeUp .5s ease both}
.d1{animation-delay:.08s}
.d2{animation-delay:.15s}
.d3{animation-delay:.22s}
.d4{animation-delay:.3s}
.d5{animation-delay:.37s}
`;

function getScoreColor(score) {
  if (score >= 75) return "#4fd1c5";
  if (score >= 40) return "#f6c90e";
  return "#fc8181";
}

function getClassStyle(classification) {
  const c = classification?.toUpperCase();
  if (c === "STRONG") return { background: "#0d2e1f", color: "#4fd1c5" };
  if (c === "SOMEWHAT") return { background: "#2d2010", color: "#f6c90e" };
  if (c === "WEAK") return { background: "#1a1e35", color: "#8892b0" };
  return { background: "#2d1515", color: "#fc8181" };
}

function getVerdictColor(verdict) {
  if (verdict === "VIABLE") return "#4fd1c5";
  if (verdict === "RISKY") return "#f6c90e";
  return "#fc8181";
}

function getPayColor(pay) {
  if (pay === "HIGH") return { bg: "#0d2e1f", color: "#4fd1c5" };
  if (pay === "MEDIUM") return { bg: "#2d2010", color: "#f6c90e" };
  return { bg: "#2d1515", color: "#fc8181" };
}

const scoreIcons = {
  problem_clarity: "🎯",
  solution_fit: "💡",
  market_size: "🌍",
  revenue_stability: "💰",
  competitive_moat: "🛡️",
};

export default function Vt({ report }) {

  if (!report) return (
    <div style={{ textAlign: "center", padding: "40px", color: "#8892b0" }}>
      Loading report...
    </div>
  );

  const {
    idea,
    uvp,
    features,
    takeaways,
    next_steps,
    complete_idea,
    final_scores,
    market_viability,
    strengths,
    assumptions,
    remaining_gaps,
  } = report;

  // Use final_scores if available, else features array
  const scores = final_scores || {};

  return (
    <>
      <style>{CSS}</style>
      <div className="vt-wrap">

        {/* Header */}
        <div className="page-header fu d1">
          <div>
            <div className="page-title">
              📋 Full Report
            </div>
            <div className="page-subtitle">
              Complete validation analysis for your startup idea
            </div>
          </div>
        </div>

        {/* Idea Banner */}
        {(idea || complete_idea?.title) && (
          <div className="idea-banner fu d1">
            <div className="idea-icon">🚀</div>
            <div>
              <div className="idea-tag">Validated Idea</div>
              <div className="idea-desc">
                {idea || complete_idea?.title}
              </div>
              {complete_idea?.short_summary && (
                <div style={{ fontSize: "13px", color: "#8892b0", marginTop: "6px" }}>
                  {complete_idea.short_summary}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Row 1 — Complete Idea + Scores */}
        <div className="grid-2 fu d2">

          {/* Complete Idea */}
          {complete_idea && (
            <div className="card">
              <div className="card-title">
                <span className="card-title-icon">💡</span>
                Structured Idea
              </div>

              {complete_idea.problem && (
                <div className="idea-field">
                  <div className="idea-field-label">Problem</div>
                  <div className="idea-field-value">{complete_idea.problem}</div>
                </div>
              )}

              {complete_idea.solution && (
                <div className="idea-field">
                  <div className="idea-field-label">Solution</div>
                  <div className="idea-field-value">{complete_idea.solution}</div>
                </div>
              )}

              {complete_idea.target_market && (
                <div className="idea-field">
                  <div className="idea-field-label">Target Market</div>
                  <div className="idea-field-value">{complete_idea.target_market}</div>
                </div>
              )}

              {complete_idea.revenue_model && (
                <div className="idea-field">
                  <div className="idea-field-label">Revenue Model</div>
                  <div className="idea-field-value">{complete_idea.revenue_model}</div>
                </div>
              )}

              {complete_idea.competitive_advantage && (
                <div className="idea-field">
                  <div className="idea-field-label">Competitive Advantage</div>
                  <div className="idea-field-value">{complete_idea.competitive_advantage}</div>
                </div>
              )}
            </div>
          )}

          {/* Scores */}
          <div className="card">
            <div className="card-title">
              <span className="card-title-icon">📊</span>
              Final Scores
            </div>

            <div className="score-grid">
              {Object.entries(scores).map(([key, val]) => {
                const score = val.score || 0;
                const color = getScoreColor(score);
                const classStyle = getClassStyle(val.classification);

                return (
                  <div className="score-item" key={key}>
                    <div className="score-icon">
                      {scoreIcons[key] || "📊"}
                    </div>
                    <div className="score-name">
                      {key.replace(/_/g, " ")}
                    </div>
                    <div className="score-bar-bg">
                      <div
                        className="score-bar-fill"
                        style={{
                          width: `${score}%`,
                          background: color,
                          boxShadow: `0 0 8px ${color}`
                        }}
                      />
                    </div>
                    <div className="score-num" style={{ color }}>
                      {score}
                    </div>
                    <div
                      className="score-class"
                      style={classStyle}
                    >
                      {val.classification || "N/A"}
                    </div>
                  </div>
                );
              })}

              {/* Fallback to features array */}
              {Object.keys(scores).length === 0 && features?.map((f, i) => {
                const score = f.values?.score || 0;
                const color = getScoreColor(score);
                const classStyle = getClassStyle(f.values?.classification);

                return (
                  <div className="score-item" key={i}>
                    <div className="score-icon">📊</div>
                    <div className="score-name">{f.name}</div>
                    <div className="score-bar-bg">
                      <div
                        className="score-bar-fill"
                        style={{ width: `${score}%`, background: color }}
                      />
                    </div>
                    <div className="score-num" style={{ color }}>{score}</div>
                    <div className="score-class" style={classStyle}>
                      {f.values?.classification || "N/A"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Row 2 — UVP + Market Viability */}
        <div className="grid-2 fu d3">

          {/* UVP */}
          {uvp && (
            <div className="card">
              <div className="card-title">
                <span className="card-title-icon">⚡</span>
                Unique Value Proposition
              </div>

              {uvp.statement && (
                <div className="uvp-quote-box">
                  <div className="uvp-text">
                    <span className="uvp-hi">"</span>
                    {uvp.statement}
                    <span className="uvp-hi">"</span>
                  </div>
                </div>
              )}

              {uvp.points && uvp.points.length > 0 && (
                <div className="uvp-pills">
                  {uvp.points.map((p, i) => (
                    <div className="uvp-pill" key={i}>
                      <span className="uvp-pill-icon">
                        {i === 0 ? "🎯" : i === 1 ? "💡" : "💰"}
                      </span>
                      <div className="uvp-pill-title">{p.title}</div>
                      <div className="uvp-pill-desc">{p.desc}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Market Viability */}
          {market_viability && (
            <div className="card">
              <div className="card-title">
                <span className="card-title-icon">🌍</span>
                Market Viability
              </div>

              <div className="viability-row">
                <div className="viability-item">
                  <div className="viability-label">Verdict</div>
                  <div
                    className="viability-val"
                    style={{ color: getVerdictColor(market_viability.verdict) }}
                  >
                    {market_viability.verdict || "—"}
                  </div>
                </div>
                <div className="viability-item">
                  <div className="viability-label">TAM</div>
                  <div className="viability-val">{market_viability.tam || "—"}</div>
                </div>
                <div className="viability-item">
                  <div className="viability-label">Growth</div>
                  <div
                    className="viability-val"
                    style={{
                      color: market_viability.growth_trend === "GROWING"
                        ? "#4fd1c5"
                        : market_viability.growth_trend === "DECLINING"
                        ? "#fc8181"
                        : "#f6c90e"
                    }}
                  >
                    {market_viability.growth_trend || "—"}
                  </div>
                </div>
                <div className="viability-item">
                  <div className="viability-label">Competition</div>
                  <div
                    className="viability-val"
                    style={{
                      color: market_viability.competition_level === "LOW"
                        ? "#4fd1c5"
                        : market_viability.competition_level === "HIGH"
                        ? "#fc8181"
                        : "#f6c90e"
                    }}
                  >
                    {market_viability.competition_level || "—"}
                  </div>
                </div>
              </div>

              {market_viability.reasoning && (
                <div className="viability-reasoning">
                  {market_viability.reasoning}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Row 3 — Strengths + Assumptions */}
        {((strengths && strengths.length > 0) || (assumptions && assumptions.length > 0)) && (
          <div className="grid-2 fu d4">

            {/* Strengths */}
            {strengths && strengths.length > 0 && (
              <div className="card">
                <div className="card-title">
                  <span className="card-title-icon">💪</span>
                  Strengths
                </div>
                {strengths.map((s, i) => (
                  <div className="strength-item" key={i}>
                    <div className="strength-dot" />
                    <div>
                      <div className="strength-dim">
                        {s.dimension?.replace(/_/g, " ")}
                      </div>
                      <div className="strength-text">{s.finding}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Assumptions */}
            {assumptions && assumptions.length > 0 && (
              <div className="card">
                <div className="card-title">
                  <span className="card-title-icon">⚠️</span>
                  Hidden Assumptions
                </div>
                {assumptions.map((a, i) => (
                  <div
                    className={`assumption-item ${a.risk_level?.toLowerCase()}`}
                    key={i}
                  >
                    <div className="assumption-top">
                      <div className="assumption-text">{a.assumption}</div>
                      <span className={`risk-badge risk-${a.risk_level}`}>
                        {a.risk_level}
                      </span>
                    </div>
                    <div className="assumption-reason">{a.why_risky}</div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* Row 4 — Remaining Gaps + Takeaways */}
        {((remaining_gaps && remaining_gaps.length > 0) || (takeaways && takeaways.length > 0)) && (
          <div className="grid-2 fu d5">

            {/* Remaining Gaps */}
            {remaining_gaps && remaining_gaps.length > 0 && (
              <div className="card">
                <div className="card-title">
                  <span className="card-title-icon">🔴</span>
                  Remaining Gaps
                </div>
                {remaining_gaps.map((g, i) => (
                  <div className="gap-item" key={i}>
                    <div className={g.severity === "CRITICAL" ? "gap-dot-c" : "gap-dot-m"} />
                    <div>
                      <div
                        className="gap-dim"
                        style={{ color: g.severity === "CRITICAL" ? "#fc8181" : "#f6c90e" }}
                      >
                        {g.dimension?.replace(/_/g, " ")}
                      </div>
                      <div className="gap-text">{g.what_is_missing}</div>
                      {g.fix_hint && (
                        <div className="gap-hint">💡 {g.fix_hint}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Takeaways */}
            {takeaways && takeaways.length > 0 && (
              <div className="card">
                <div className="card-title">
                  <span className="card-title-icon">🏆</span>
                  Key Takeaways
                </div>
                <div className="tg">
                  {takeaways.map((t, i) => (
                    <div className="ti" key={i}>
                      <div className="ti-header">
                        <span className="ti-icon">
                          {i === 0 ? "🎯" : i === 1 ? "💡" : i === 2 ? "🌍" : "🛡️"}
                        </span>
                        <div
                          className="ti-title"
                          style={{ textTransform: "capitalize" }}
                        >
                          {t.title}
                        </div>
                      </div>
                      <div className="ti-text">{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Next Steps */}
        {next_steps && (
          <div className="next-steps-card fu d5">
            <div className="ns-title">🗺️ Next Steps</div>
            <div className="ns-text">{next_steps}</div>
            <button
              className="cta-btn"
              onClick={() => alert("Moving to Product Differentiation...")}
            >
              Move to Product Differentiation →
            </button>
          </div>
        )}

      </div>
    </>
  );
}