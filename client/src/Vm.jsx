import { createContext, useContext, useState } from "react";

const StartupContext = createContext();

export function StartupProvider({ children }) {

  // ── Idea Validation ───────────────────────
  const [sessionId, setSessionId] = useState(null);
  const [completeIdea, setCompleteIdea] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const [scores, setScores] = useState(null);
  const [overall, setOverall] = useState(null);
  const [miss, setMiss] = useState([]);
  const [report, setReport] = useState(null);

 const [idea, setIdea] = useState("");
 const [diff, setDiff] = useState("");

  // ── Product Differentiation ───────────────
  const [diffData, setDiffData] = useState(null);

  // ── Pitch Preparation ─────────────────────
  const [pitchDeck, setPitchDeck] = useState(null);
  const [elevatorPitch, setElevatorPitch] = useState(null);
  const [pitchScore, setPitchScore] = useState(null);
  const [qaHistory, setQaHistory] = useState([]);

  // ── Helpers ───────────────────────────────
  const ideaComplete = !!completeIdea;

  const widthsFromScores = (scoresObj) => {
    if (!scoresObj) return {};
    const filled = {};
    Object.entries(scoresObj).forEach(([k, v]) => {
      filled[k] = v.score || 0;
    });
    return filled;
  };

  function resetAll() {
    setSessionId(null);
    setCompleteIdea(null);
    setFinalResult(null);
    setScores(null);
    setOverall(null);
    setMiss([]);
    setReport(null);
    setDiffData(null);
    setPitchDeck(null);
    setElevatorPitch(null);
    setPitchScore(null);
    setQaHistory([]);
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
      diffData, setDiffData,
      pitchDeck, setPitchDeck,
      elevatorPitch, setElevatorPitch,
      pitchScore, setPitchScore,
      qaHistory, setQaHistory,
       ideaComplete,
       idea,setIdea,
       diff,setDiff,
      widthsFromScores,
      resetAll,
    }}>
      {children}
    </StartupContext.Provider>
  );
}

export function useStartup() {
  return useContext(StartupContext);
}