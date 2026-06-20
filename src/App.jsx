// ============================================================
// App.jsx — 「とけた！」MVP コア体験ループ（正負の数・加減）。
//  ・1画面1アクション／失敗で減点なし／毎回ほめる。
//  ・助けのはしご：習熟度 m で開始段（お手本→穴うめ→自力）。つまづくと1段やさしく。
//  ・誤答を選ぶと「つまづきの正体」をその場で一言（app/distractors の tag）。
//  ・共有エンジン（data/grade1/c1_seisu, engine/scoring）＋ とけた固有（app/*）を組み合わせる。
//  ※ お手本/穴うめの“ステップ”は当面 c1 の h1/h2 を流用（将来は workedSteps で精密化）。
// ============================================================
import { useState, useRef } from "react";
import { genProblem } from "./engine/generator.js";
import { chapter as c1 } from "./data/grade1/c1_seisu.js";
import { chapter as c2 } from "./data/grade1/c2_moji.js";
import { isCorrect } from "./engine/scoring.js";
import { startRung } from "./app/ladder.js";
import { choicesForAddSub, MISCONCEPTIONS } from "./app/distractors.js";
import { findHaichiLessonForUnit } from "./data/haichiCourse.js";

// つまづき記録などの簡易保存（ローカル。将来 store に差し替え可）
const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

// 共有エンジンの genProblem で複数単元を出題（正負の計算＋文字式。答えはどれも数値）。
const UNITS = [
  ...c1.units.filter((u) => ["u1", "u2", "u3", "u4", "u5"].includes(u.id)), // 正負：大小/加/減/乗除/四則
  ...c2.units, // 文字式（係数・整理 など）
];
const revealForRung = (r) => (r === "example" ? 2 : r === "fill" ? 1 : 0); // 先に見せるヒント数

let _recent = [];
function makeProblem(forceUnitId = null) {
  for (let i = 0; i < 12; i++) {
    const unit = forceUnitId ? UNITS.find((u) => u.id === forceUnitId) : UNITS[Math.floor(Math.random() * UNITS.length)];
    if (!unit) return null;
    const p = genProblem(unit, "easy", _recent[_recent.length - 1] || null);
    if (p) {
      _recent = [..._recent, p.id].slice(-6);
      return { ...p, unitName: unit.name, unitEmoji: unit.emoji, choices: choicesForAddSub(p.ans) };
    }
  }
  return null;
}

export default function App() {
  const [m, setM] = useState(0.1);          // 習熟度（0〜1・ざっくり）
  const [prob, setProb] = useState(makeProblem);
  const [reveal, setReveal] = useState(() => revealForRung(startRung(0.1))); // 今見せているヒント数(=助けの段)
  const [picked, setPicked] = useState(null);
  const [coach, setCoach] = useState(null); // つまづき診断の一言
  const [praise, setPraise] = useState(null);
  const [solved, setSolved] = useState(() => load("toketa_solved", 0));
  const [showExplain, setShowExplain] = useState(false); // 解説を開いているか
  const [showVideo, setShowVideo] = useState(false);      // 解説の動画を埋め込み表示中か
  const [stumbles, setStumbles] = useState(() => load("toketa_stumbles", {})); // つまづきタグ→回数
  const [view, setView] = useState("play");               // play | map

  function next(nm = m, { sameUnitId = null, soloStart = false } = {}) {
    setProb(makeProblem(sameUnitId));
    setReveal(soloStart ? 0 : revealForRung(startRung(nm))); // 解説の後は「自力」から（ヒントなし）
    setPicked(null); setCoach(null); setPraise(null); setShowExplain(false); setShowVideo(false);
  }

  function choose(c) {
    if (picked) return;
    setPicked(c);
    if (isCorrect(c.val, prob.ans)) {
      const helped = reveal > 0;                 // 助けを見て解いたか
      const nm = Math.min(1, m + (helped ? 0.04 : 0.12));
      setM(nm);
      setSolved((s) => { const v = s + 1; save("toketa_solved", v); return v; });
      setPraise(helped ? "とけた！その調子！" : "自力でとけた！すごい！");
      setTimeout(() => next(nm), 1100);
    } else {
      // つまづき → 原因を一言＋1段やさしく＋記録（つまづきマップ用）
      setCoach(c.tag ? MISCONCEPTIONS[c.tag]?.coach : "もう一度ためしてみよう");
      if (c.tag) setStumbles((s) => { const v = { ...s, [c.tag]: (s[c.tag] || 0) + 1 }; save("toketa_stumbles", v); return v; });
      setReveal((v) => Math.min(2, v + 1));
      setTimeout(() => setPicked(null), 650);    // もう一度選べるように
    }
  }

  if (!prob) return <div style={S.app}><div style={S.wrap}>準備中…</div></div>;

  // ── つまづきマップ画面 ──
  if (view === "map") {
    const entries = Object.entries(stumbles).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);
    const maxN = entries.length ? entries[0][1] : 1;
    return (
      <div style={S.app}>
        <div style={S.wrap}>
          <div style={S.top}>
            <span style={S.brand}>📊 つまづきマップ</span>
            <button onClick={() => setView("play")} style={S.mapBtn}>← もどる</button>
          </div>
          <div style={{ fontSize: 13, color: "rgba(238,241,255,.72)", margin: "8px 0 16px", lineHeight: 1.7 }}>
            とけた数 <b style={{ color: "#a5b4fc" }}>{solved}ｺ</b>。<br />つまづき＝のびしろ。よく出るところを練習すると、一気に伸びるよ！
          </div>
          {entries.length === 0 ? (
            <div style={S.help}>
              <div style={S.helpLine}>まだ つまづきの記録はないよ。</div>
              <div style={S.helpLine}>問題を解くと、ここに「よく間違えるところ」が見えてくる！</div>
            </div>
          ) : (
            entries.map(([tag, n]) => (
              <div key={tag} style={S.mapRow}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                  <b style={{ fontSize: 15 }}>{MISCONCEPTIONS[tag]?.label || tag}</b>
                  <span style={{ fontSize: 12, color: "rgba(238,241,255,.6)" }}>{n}回</span>
                </div>
                <div style={S.barTrack}><div style={{ ...S.barFill, width: `${Math.round((n / maxN) * 100)}%` }} /></div>
                <div style={S.mapCoach}>💡 {MISCONCEPTIONS[tag]?.coach}</div>
              </div>
            ))
          )}
          <button onClick={() => setView("play")} style={{ ...S.tryBtn, marginTop: 18 }}>▶ 問題を解きにもどる</button>
        </div>
      </div>
    );
  }

  const rung = startRung(m);
  return (
    <div style={S.app}>
      <div style={S.wrap}>
        <div style={S.top}>
          <span style={S.brand}>とけた！</span>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={S.meter}>とけた数 {solved}ｺ</span>
            <button onClick={() => setView("map")} style={S.mapBtn}>📊 マップ</button>
          </span>
        </div>

        <div style={S.unit}>{prob.unitEmoji} {prob.unitName}</div>
        <div style={S.q}>{prob.q}</div>

        {/* 助け（お手本/穴うめ）：c1 の h1/h2 を段階表示 */}
        {reveal > 0 && (
          <div style={S.help}>
            <div style={S.helpTtl}>💡 ヒント</div>
            {reveal >= 1 && prob.h1 && <div style={S.helpLine}>{prob.h1}</div>}
            {reveal >= 2 && prob.h2 && <div style={S.helpLine}>{prob.h2}</div>}
          </div>
        )}

        {showExplain ? (
          /* 解説（ヒントを見ても分からない時：答えまで含む完全な手順） */
          <div style={S.explain}>
            <div style={S.explainTtl}>📖 かいせつ</div>
            {prob.h1 && <div style={S.explainStep}>① {prob.h1}</div>}
            {prob.h2 && <div style={S.explainStep}>② {prob.h2}</div>}
            <div style={S.explainAns}>こたえ： <b>{prob.ans}</b></div>
            {(() => {
              const hit = findHaichiLessonForUnit(prob.unitId);
              const yt = hit?.lesson?.yt;
              if (!yt) return null;
              if (!showVideo) {
                return (
                  <button onClick={() => setShowVideo(true)} style={S.videoBtn}>
                    ▶ 動画でもっとくわしく（葉一さん）<span style={S.videoSub}>{hit.lesson.t}</span>
                  </button>
                );
              }
              return (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", borderRadius: 12, overflow: "hidden", background: "#000", border: "1px solid rgba(255,255,255,.15)" }}>
                    <iframe
                      title="解説動画"
                      src={`https://www.youtube-nocookie.com/embed/${yt}?rel=0&modestbranding=1`}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(186,230,253,.8)", marginTop: 6, textAlign: "center" }}>
                    葉一さん「{hit.lesson.t}」 ・ <span onClick={() => window.open(`https://www.youtube.com/watch?v=${yt}`, "_blank", "noopener")} style={{ textDecoration: "underline", cursor: "pointer" }}>別タブで開く</span>
                  </div>
                </div>
              );
            })()}
            <button onClick={() => next(m, { sameUnitId: prob.unitId, soloStart: true })} style={S.tryBtn}>
              📝 わかった！もう一度やってみる
            </button>
            <div style={S.explainNote}>※ 同じタイプの問題が出るよ。今度は自分でとこう！</div>
          </div>
        ) : (
          <>
            {/* 4択（誤答にはつまづきタグ） */}
            <div style={S.grid}>
              {prob.choices.map((c, i) => {
                const isPicked = picked && picked.val === c.val;
                const ok = isPicked && isCorrect(c.val, prob.ans);
                const ng = isPicked && !isCorrect(c.val, prob.ans);
                return (
                  <button key={i} onClick={() => choose(c)} disabled={!!praise}
                    style={{ ...S.choice, ...(ok ? S.ok : ng ? S.ng : {}) }}>
                    {c.val}
                  </button>
                );
              })}
            </div>

            {/* つまづき診断の一言 */}
            {coach && !praise && <div style={S.coach}>🧭 {coach}</div>}
            {/* ほめ */}
            {praise && <div style={S.praise}>🎉 {praise}</div>}

            {/* 助けの導線：ヒント → まだ分からなければ解説 */}
            {!praise && (
              <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap", justifyContent: "center" }}>
                {reveal < 2 && (
                  <button onClick={() => setReveal((v) => Math.min(2, v + 1))} style={S.hintBtn}>
                    💡 ヒントがほしい
                  </button>
                )}
                {reveal >= 1 && (
                  <button onClick={() => setShowExplain(true)} style={S.explainBtn}>
                    📖 まだわからない…解説を見る
                  </button>
                )}
              </div>
            )}
          </>
        )}

        <div style={S.note}>まちがえても大丈夫。最後は自分で解けるよ。</div>
      </div>
    </div>
  );
}

const S = {
  app: { minHeight: "100dvh", background: "radial-gradient(900px 500px at 50% -10%,#1b2150,#0f1226 60%)", color: "#eef1ff", fontFamily: "'Hiragino Kaku Gothic ProN',system-ui,sans-serif", display: "flex", justifyContent: "center" },
  wrap: { width: "100%", maxWidth: 460, padding: "22px 18px 30px", display: "flex", flexDirection: "column", alignItems: "center" },
  top: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 },
  brand: { fontSize: 22, fontWeight: 900, color: "#a5b4fc" },
  meter: { fontSize: 11, color: "rgba(238,241,255,.6)" },
  unit: { fontSize: 12, fontWeight: 800, color: "rgba(186,230,253,.85)", marginBottom: 6 },
  q: { fontSize: 38, fontWeight: 900, letterSpacing: 1, margin: "6px 0 18px", textAlign: "center" },
  help: { width: "100%", background: "rgba(251,191,36,.12)", border: "1px solid rgba(251,191,36,.4)", borderRadius: 12, padding: "10px 13px", marginBottom: 14 },
  helpTtl: { fontSize: 12, fontWeight: 900, color: "#fde047", marginBottom: 4 },
  helpLine: { fontSize: 13.5, color: "#fde68a", lineHeight: 1.7 },
  grid: { width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  choice: { padding: "18px 10px", borderRadius: 14, border: "2px solid rgba(255,255,255,.18)", background: "rgba(255,255,255,.06)", color: "#fff", fontSize: 24, fontWeight: 900, cursor: "pointer" },
  ok: { background: "linear-gradient(135deg,#22c55e,#10b981)", border: "2px solid transparent" },
  ng: { background: "rgba(248,113,113,.25)", border: "2px solid rgba(248,113,113,.6)" },
  coach: { width: "100%", marginTop: 14, padding: "11px 13px", borderRadius: 12, background: "rgba(125,211,252,.14)", border: "1px solid rgba(125,211,252,.4)", color: "#bae6fd", fontSize: 13.5, fontWeight: 700, lineHeight: 1.6 },
  praise: { width: "100%", marginTop: 14, padding: "13px", borderRadius: 12, background: "linear-gradient(135deg,#22c55e,#10b981)", color: "#fff", fontSize: 17, fontWeight: 900, textAlign: "center" },
  hintBtn: { padding: "9px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,.22)", background: "rgba(255,255,255,.06)", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer" },
  explainBtn: { padding: "9px 16px", borderRadius: 12, border: "1px solid rgba(125,211,252,.5)", background: "rgba(125,211,252,.12)", color: "#bae6fd", fontSize: 13, fontWeight: 800, cursor: "pointer" },
  explain: { width: "100%", marginTop: 6, background: "rgba(125,211,252,.1)", border: "1px solid rgba(125,211,252,.45)", borderRadius: 14, padding: "16px 16px 14px" },
  explainTtl: { fontSize: 14, fontWeight: 900, color: "#7dd3fc", marginBottom: 10 },
  explainStep: { fontSize: 15, color: "#e0f2fe", lineHeight: 1.9 },
  explainAns: { fontSize: 18, fontWeight: 900, color: "#fff", margin: "10px 0 14px" },
  videoBtn: { width: "100%", padding: "11px 14px", borderRadius: 12, border: "2px solid rgba(255,255,255,.2)", background: "linear-gradient(135deg,#ef4444,#f59e0b)", color: "#fff", fontSize: 14, fontWeight: 900, cursor: "pointer", marginBottom: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  videoSub: { fontSize: 11, fontWeight: 700, opacity: 0.9 },
  tryBtn: { width: "100%", padding: "14px", borderRadius: 14, border: "2px solid rgba(255,255,255,.25)", background: "linear-gradient(135deg,#6366f1,#a855f7)", color: "#fff", fontSize: 16, fontWeight: 900, cursor: "pointer" },
  explainNote: { fontSize: 11.5, color: "rgba(186,230,253,.8)", marginTop: 8, textAlign: "center" },
  note: { fontSize: 11, color: "rgba(238,241,255,.45)", marginTop: 20 },
  mapBtn: { padding: "7px 12px", borderRadius: 10, border: "1px solid rgba(165,180,252,.5)", background: "rgba(99,102,241,.18)", color: "#c7d2fe", fontSize: 12, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" },
  mapRow: { width: "100%", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 12, padding: "12px 14px", marginBottom: 10 },
  barTrack: { width: "100%", height: 10, borderRadius: 999, background: "rgba(255,255,255,.1)", overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 999, background: "linear-gradient(90deg,#fb923c,#f59e0b)" },
  mapCoach: { fontSize: 12, color: "rgba(186,230,253,.85)", marginTop: 7, lineHeight: 1.6 },
};
