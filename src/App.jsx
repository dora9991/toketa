// ============================================================
// App.jsx — 「とけた！」コア体験ループ（正の数・負の数 1章をしっかり）。
//  ・小単元を学習順にクリアして進む（大小→加法→減法→乗除→四則）。全部クリアで復習モード。
//  ・各問題は本物の解き方ステップ(steps)と、演算ごとの正確な誤答診断(distractors)を持つ。
//  ・助けのはしご：習熟度で開始段（お手本→穴うめ→自力）。つまづくと1段やさしく。
//    ヒント → まだ分からない → 解説(手順＋答え＋葉一さんの動画埋め込み) → 同じ型を自力で。
//  ・つまづきマップ：誤答の診断タグを記録して、弱点を可視化。
// ============================================================
import { useState } from "react";
import { CHAPTER, MISC } from "./content/seisu.js";
import { startRung } from "./app/ladder.js";
import { findHaichiLessonForUnit } from "./data/haichiCourse.js";

const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const UNITS = CHAPTER.units;

const revealForRung = (r, n) => (r === "example" ? n : r === "fill" ? 1 : 0);
function makeProblem(i) { const unit = UNITS[i]; return { ...unit.gen(), unit }; }
// 次に出す単元：先頭の未クリア単元へ。全部クリアならランダム（復習）。
function pickNextIdx(solvedBy) {
  const first = UNITS.findIndex((u) => (solvedBy[u.id] || 0) < u.need);
  return first >= 0 ? first : Math.floor(Math.random() * UNITS.length);
}

export default function App() {
  const [idx, setIdx] = useState(() => Math.min(load("toketa_idx", 0), UNITS.length - 1));
  const [prob, setProb] = useState(() => makeProblem(Math.min(load("toketa_idx", 0), UNITS.length - 1)));
  const [mBy, setMBy] = useState(() => load("toketa_m", {}));
  const [solvedBy, setSolvedBy] = useState(() => load("toketa_solvedBy", {}));
  const [solved, setSolved] = useState(() => load("toketa_solved", 0));
  const [reveal, setReveal] = useState(() => revealForRung(startRung(load("toketa_m", {})[UNITS[0].id] || 0), 2));
  const [picked, setPicked] = useState(null);
  const [coach, setCoach] = useState(null);
  const [praise, setPraise] = useState(null);
  const [showExplain, setShowExplain] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [stumbles, setStumbles] = useState(() => load("toketa_stumbles", {}));
  const [view, setView] = useState("play");

  function loadNext(nextIdx = idx, { soloStart = false } = {}) {
    const unit = UNITS[nextIdx];
    const p = makeProblem(nextIdx);
    setIdx(nextIdx); save("toketa_idx", nextIdx);
    setProb(p);
    setReveal(soloStart ? 0 : revealForRung(startRung(mBy[unit.id] || 0), p.steps.length));
    setPicked(null); setCoach(null); setPraise(null); setShowExplain(false); setShowVideo(false);
  }

  function choose(c) {
    if (picked || praise) return;
    setPicked(c);
    const u = prob.unit;
    if (c.val === prob.ans) {
      const self = reveal === 0;
      const nm = Math.min(1, (mBy[u.id] || 0) + (self ? 0.12 : 0.04));
      const nMBy = { ...mBy, [u.id]: nm }; setMBy(nMBy); save("toketa_m", nMBy);
      const prev = solvedBy[u.id] || 0;
      const nSolvedBy = { ...solvedBy, [u.id]: prev + 1 }; // 正解はすべて単元の進み具合に数える
      setSolvedBy(nSolvedBy); save("toketa_solvedBy", nSolvedBy);
      setSolved((s) => { const v = s + 1; save("toketa_solved", v); return v; });

      const justCleared = prev < u.need && prev + 1 >= u.need;
      const allClear = UNITS.every((x) => (nSolvedBy[x.id] || 0) >= x.need);
      setPraise(justCleared ? (allClear ? "🎉 正負ぜんぶクリア！すごい！" : `🎉 ${u.name} クリア！つぎへ！`) : (self ? "自力でとけた！すごい！" : "とけた！その調子！"));
      const nextIdx = pickNextIdx(nSolvedBy);
      setTimeout(() => loadNext(nextIdx), justCleared ? 1600 : 1050);
    } else {
      setCoach(c.tag ? MISC[c.tag]?.coach : "もう一度ためしてみよう");
      if (c.tag) setStumbles((s) => { const v = { ...s, [c.tag]: (s[c.tag] || 0) + 1 }; save("toketa_stumbles", v); return v; });
      setReveal((v) => Math.min(prob.steps.length, v + 1));
      setTimeout(() => setPicked(null), 650);
    }
  }

  // ── つまづきマップ ──
  if (view === "map") {
    const entries = Object.entries(stumbles).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);
    const maxN = entries.length ? entries[0][1] : 1;
    return (
      <div style={S.app}><div style={S.wrap}>
        <div style={S.top}>
          <span style={S.brand}>📊 つまづきマップ</span>
          <button onClick={() => setView("play")} style={S.mapBtn}>← もどる</button>
        </div>
        <div style={{ fontSize: 13, color: "rgba(238,241,255,.72)", margin: "8px 0 16px", lineHeight: 1.7 }}>
          とけた数 <b style={{ color: "#a5b4fc" }}>{solved}ｺ</b>。<br />つまづき＝のびしろ。よく出るところを練習すると、一気に伸びるよ！
        </div>
        {entries.length === 0 ? (
          <div style={S.help}><div style={S.helpLine}>まだ つまづきの記録はないよ。</div><div style={S.helpLine}>問題を解くと、ここに「よく間違えるところ」が見えてくる！</div></div>
        ) : entries.map(([tag, n]) => (
          <div key={tag} style={S.mapRow}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
              <b style={{ fontSize: 15 }}>{MISC[tag]?.label || tag}</b>
              <span style={{ fontSize: 12, color: "rgba(238,241,255,.6)" }}>{n}回</span>
            </div>
            <div style={S.barTrack}><div style={{ ...S.barFill, width: `${Math.round((n / maxN) * 100)}%` }} /></div>
            <div style={S.mapCoach}>💡 {MISC[tag]?.coach}</div>
          </div>
        ))}
        <button onClick={() => setView("play")} style={{ ...S.tryBtn, marginTop: 18 }}>▶ 問題を解きにもどる</button>
      </div></div>
    );
  }

  if (!prob) return <div style={S.app}><div style={S.wrap}>準備中…</div></div>;
  const u = prob.unit;
  const cleared = (solvedBy[u.id] || 0) >= u.need;
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

        {/* 章の進み具合 */}
        <div style={S.unit}>
          {CHAPTER.name}　{idx + 1}/{UNITS.length}：{u.emoji} {u.name}
          <span style={{ color: cleared ? "#4ade80" : "rgba(255,255,255,.5)", marginLeft: 8, fontWeight: 800 }}>
            {cleared ? "クリア済み ✓" : `${Math.min(solvedBy[u.id] || 0, u.need)}/${u.need}`}
          </span>
        </div>
        <div style={S.barTrackSlim}><div style={{ ...S.barFillBlue, width: `${Math.round(Math.min(solvedBy[u.id] || 0, u.need) / u.need * 100)}%` }} /></div>

        <div style={S.q}>{prob.q}</div>

        {/* ヒント：解き方ステップを段階表示 */}
        {reveal > 0 && (
          <div style={S.help}>
            <div style={S.helpTtl}>💡 ヒント</div>
            {prob.steps.slice(0, reveal).map((s, i) => <div key={i} style={S.helpLine}>{s}</div>)}
          </div>
        )}

        {showExplain ? (
          <div style={S.explain}>
            <div style={S.explainTtl}>📖 かいせつ</div>
            {prob.steps.map((s, i) => <div key={i} style={S.explainStep}>{i + 1}. {s}</div>)}
            <div style={S.explainAns}>こたえ： <b>{prob.ans}</b></div>
            {(() => {
              const hit = findHaichiLessonForUnit(u.haichiUnit);
              const yt = hit?.lesson?.yt;
              if (!yt) return null;
              if (!showVideo) return (
                <button onClick={() => setShowVideo(true)} style={S.videoBtn}>
                  ▶ 動画でもっとくわしく（葉一さん）<span style={S.videoSub}>{hit.lesson.t}</span>
                </button>
              );
              return (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", borderRadius: 12, overflow: "hidden", background: "#000", border: "1px solid rgba(255,255,255,.15)" }}>
                    <iframe title="解説動画" src={`https://www.youtube-nocookie.com/embed/${yt}?rel=0&modestbranding=1`}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(186,230,253,.8)", marginTop: 6, textAlign: "center" }}>
                    葉一さん「{hit.lesson.t}」 ・ <span onClick={() => window.open(`https://www.youtube.com/watch?v=${yt}`, "_blank", "noopener")} style={{ textDecoration: "underline", cursor: "pointer" }}>別タブで開く</span>
                  </div>
                </div>
              );
            })()}
            <button onClick={() => loadNext(idx, { soloStart: true })} style={S.tryBtn}>📝 わかった！もう一度やってみる</button>
            <div style={S.explainNote}>※ 同じタイプの問題が出るよ。今度は自分でとこう！</div>
          </div>
        ) : (
          <>
            <div style={S.grid}>
              {prob.distractors.map((c, i) => {
                const isPicked = picked && picked.val === c.val;
                const ok = isPicked && c.val === prob.ans;
                const ng = isPicked && c.val !== prob.ans;
                return (
                  <button key={i} onClick={() => choose(c)} disabled={!!praise}
                    style={{ ...S.choice, ...(ok ? S.ok : ng ? S.ng : {}) }}>{c.val}</button>
                );
              })}
            </div>

            {coach && !praise && <div style={S.coach}>🧭 {coach}</div>}
            {praise && <div style={S.praise}>{praise}</div>}

            {!praise && (
              <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap", justifyContent: "center" }}>
                {reveal < prob.steps.length && (
                  <button onClick={() => setReveal((v) => Math.min(prob.steps.length, v + 1))} style={S.hintBtn}>💡 ヒントがほしい</button>
                )}
                {reveal >= 1 && (
                  <button onClick={() => setShowExplain(true)} style={S.explainBtn}>📖 まだわからない…解説を見る</button>
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
  top: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  brand: { fontSize: 22, fontWeight: 900, color: "#a5b4fc" },
  meter: { fontSize: 11, color: "rgba(238,241,255,.6)" },
  mapBtn: { padding: "7px 12px", borderRadius: 10, border: "1px solid rgba(165,180,252,.5)", background: "rgba(99,102,241,.18)", color: "#c7d2fe", fontSize: 12, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" },
  unit: { width: "100%", fontSize: 12, fontWeight: 800, color: "rgba(186,230,253,.9)", marginBottom: 6 },
  barTrackSlim: { width: "100%", height: 6, borderRadius: 999, background: "rgba(255,255,255,.1)", overflow: "hidden", marginBottom: 16 },
  barFillBlue: { height: "100%", borderRadius: 999, background: "linear-gradient(90deg,#818cf8,#22d3ee)" },
  q: { fontSize: 34, fontWeight: 900, letterSpacing: 1, margin: "4px 0 18px", textAlign: "center", lineHeight: 1.3 },
  help: { width: "100%", background: "rgba(251,191,36,.12)", border: "1px solid rgba(251,191,36,.4)", borderRadius: 12, padding: "10px 13px", marginBottom: 14 },
  helpTtl: { fontSize: 12, fontWeight: 900, color: "#fde047", marginBottom: 4 },
  helpLine: { fontSize: 13.5, color: "#fde68a", lineHeight: 1.8 },
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
  mapRow: { width: "100%", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 12, padding: "12px 14px", marginBottom: 10 },
  barTrack: { width: "100%", height: 10, borderRadius: 999, background: "rgba(255,255,255,.1)", overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 999, background: "linear-gradient(90deg,#fb923c,#f59e0b)" },
  mapCoach: { fontSize: 12, color: "rgba(186,230,253,.85)", marginTop: 7, lineHeight: 1.6 },
};
