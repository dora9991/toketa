// ============================================================
// App.jsx — 「とけた！」コア体験ループ（正負・文字式・方程式の3章）。
//  ・章えらび(home) → その章の小単元を学習順にクリアして進む(play)。
//  ・各問題は本物の解き方ステップ(steps)＋演算/単元ごとの誤答診断(distractors)。
//  ・助けのはしご：習熟度で開始段。ヒント → 解説(手順＋答え＋葉一さんの動画) → 自力で。
//  ・つまづきマップ：誤答の診断タグを記録して弱点を可視化。
// ============================================================
import { useState } from "react";
import { CHAPTERS, GRADES, MISC } from "./content/index.js";
import { startRung } from "./app/ladder.js";
import { findHaichiLessonForUnit } from "./data/haichiCourse.js";

const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

const revealForRung = (r, n) => (r === "example" ? n : r === "fill" ? 1 : 0);
const makeProblem = (chap, i) => ({ ...chap.units[i].gen(), unit: chap.units[i] });
// 正解エフェクト用の紙吹雪（固定配置・色）
const CONFETTI = Array.from({ length: 22 }, (_, i) => ({
  x: (i * 37 + 5) % 100, c: ["#fde047", "#f472b6", "#34d399", "#60a5fa", "#f59e0b", "#a78bfa"][i % 6],
  delay: (i % 7) * 0.04, dur: 0.95 + (i % 5) * 0.15, w: i % 3 ? 9 : 12, round: i % 2 === 0,
}));
const FX_CSS = `
@keyframes fxPop { 0%{transform:translate(-50%,-50%) scale(.2);opacity:0} 45%{transform:translate(-50%,-50%) scale(1.3);opacity:1} 70%{transform:translate(-50%,-50%) scale(.92)} 100%{transform:translate(-50%,-50%) scale(1.08);opacity:1} }
@keyframes fxRing { 0%{transform:translate(-50%,-50%) scale(.3);opacity:.85} 100%{transform:translate(-50%,-50%) scale(2.6);opacity:0} }
@keyframes fxFlash { 0%{opacity:.55} 100%{opacity:0} }
@keyframes fxFall { 0%{transform:translateY(-12vh) rotate(0);opacity:1} 100%{transform:translateY(112vh) rotate(720deg);opacity:.15} }
@keyframes okPulse { 0%{transform:scale(1)} 35%{transform:scale(1.16)} 100%{transform:scale(1)} }
@keyframes bannerPop { 0%{transform:scale(.6);opacity:0} 55%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }`;

// 次に出す単元：先頭の未クリア単元へ。全部クリアならランダム（復習）。
function pickNextIdx(chap, solvedBy) {
  const first = chap.units.findIndex((u) => (solvedBy[u.id] || 0) < u.need);
  return first >= 0 ? first : Math.floor(Math.random() * chap.units.length);
}

export default function App() {
  const [chap, setChap] = useState(null);
  const [idx, setIdx] = useState(0);
  const [prob, setProb] = useState(null);
  const [mBy, setMBy] = useState(() => load("toketa_m", {}));
  const [solvedBy, setSolvedBy] = useState(() => load("toketa_solvedBy", {}));
  const [solved, setSolved] = useState(() => load("toketa_solved", 0));
  const [reveal, setReveal] = useState(0);
  const [picked, setPicked] = useState(null);
  const [coach, setCoach] = useState(null);
  const [praise, setPraise] = useState(null);
  const [showExplain, setShowExplain] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [stumbles, setStumbles] = useState(() => load("toketa_stumbles", {}));
  const [wrongBy, setWrongBy] = useState(() => load("toketa_wrongBy", {})); // 単元別の間違えた回数（復習の重み付けに使う）
  const [view, setView] = useState("home");
  const [homeGrade, setHomeGrade] = useState(() => load("toketa_grade", 1));
  const [reviewing, setReviewing] = useState(false); // ふくしゅうモード中か
  const [chapterClear, setChapterClear] = useState(null); // 章クリアのご褒美演出 { name, emoji }
  const [fxKey, setFxKey] = useState(0); // 正解エフェクトの再生キー（増やすとアニメ再生）

  function resetTurn() { setPicked(null); setCoach(null); setPraise(null); setShowExplain(false); setShowVideo(false); }
  function loadNext(c, nextIdx, { soloStart = false } = {}) {
    const unit = c.units[nextIdx];
    const p = makeProblem(c, nextIdx);
    setChap(c); setIdx(nextIdx); setProb(p);
    setReveal(soloStart ? 0 : revealForRung(startRung(mBy[unit.id] || 0), p.steps.length));
    resetTurn();
  }
  function enterChapter(c) { setReviewing(false); setChap(c); setView("units"); }
  function enterUnit(c, i) { setReviewing(false); loadNext(c, i); setView("play"); }
  // 単元の理解度メーター（習熟度 mBy をもとに状態を出す）
  function unitMeter(u) {
    const done = (solvedBy[u.id] || 0) >= u.need;
    const pct = done ? 100 : Math.round(Math.min(1, mBy[u.id] || 0) * 100);
    let label, color;
    if (done) { label = "バッチリ"; color = "#4ade80"; }
    else if (pct >= 70) { label = "あと少し"; color = "#60a5fa"; }
    else if (pct >= 35) { label = "練習中"; color = "#fbbf24"; }
    else if ((solvedBy[u.id] || 0) > 0 || pct > 0) { label = "はじめたよ"; color = "#f472b6"; }
    else { label = "これから"; color = "rgba(255,255,255,.35)"; }
    return { done, pct, label, color };
  }

  // ── ふくしゅう（これまで練習した単元から、章をまたいでまぜて出す） ──
  function reviewPool() { return CHAPTERS.flatMap((c) => c.units).filter((u) => (solvedBy[u.id] || 0) > 0); }
  function loadReviewNext() {
    const pool = reviewPool();
    if (pool.length === 0) { setView("home"); return; }
    // 間違えた回数が多い／習熟度が低い単元ほど出やすい重み付け
    const weight = (u) => 1 + 3 * (wrongBy[u.id] || 0) + 2 * (1 - (mBy[u.id] || 0));
    let r = Math.random() * pool.reduce((s, u) => s + weight(u), 0), unit = pool[pool.length - 1];
    for (const u of pool) { r -= weight(u); if (r <= 0) { unit = u; break; } }
    const p = { ...unit.gen(), unit };
    setProb(p);
    setReveal(revealForRung(startRung(mBy[unit.id] || 0), p.steps.length));
    resetTurn();
  }
  function startReview() { setReviewing(true); setChap(null); loadReviewNext(); setView("play"); }

  function choose(cv) {
    if (picked || praise) return;
    setPicked(cv);
    const u = prob.unit;
    if (cv.val === prob.ans) {
      const self = reveal === 0;
      setFxKey((k) => k + 1); // 正解エフェクト発火
      const nm = Math.min(1, (mBy[u.id] || 0) + (self ? 0.12 : 0.04));
      const nMBy = { ...mBy, [u.id]: nm }; setMBy(nMBy); save("toketa_m", nMBy);
      const prev = solvedBy[u.id] || 0;
      const nSolvedBy = { ...solvedBy, [u.id]: prev + 1 };
      setSolvedBy(nSolvedBy); save("toketa_solvedBy", nSolvedBy);
      setSolved((s) => { const v = s + 1; save("toketa_solved", v); return v; });
      if (reviewing) {
        setPraise(self ? "自力でとけた！すごい！" : "とけた！その調子！");
        setTimeout(loadReviewNext, 1050);
        return;
      }
      const justCleared = prev < u.need && prev + 1 >= u.need;
      const chapDone = chap.units.every((x) => (nSolvedBy[x.id] || 0) >= x.need);
      if (justCleared && chapDone) {
        setPraise(null);
        setChapterClear({ name: chap.name, emoji: chap.emoji }); // ご褒美演出（メダル）
      } else if (justCleared) {
        setPraise(`🎉 ${u.name} クリア！`);
        setTimeout(() => setView("units"), 1400); // 単元クリア→小単元えらびに戻る
      } else {
        setPraise(self ? "自力でとけた！すごい！" : "とけた！その調子！");
        setTimeout(() => loadNext(chap, idx), 1050); // 同じ小単元を続ける
      }
    } else {
      setCoach(cv.tag ? MISC[cv.tag]?.coach : "もう一度ためしてみよう");
      if (cv.tag) setStumbles((s) => { const v = { ...s, [cv.tag]: (s[cv.tag] || 0) + 1 }; save("toketa_stumbles", v); return v; });
      setWrongBy((w) => { const v = { ...w, [u.id]: (w[u.id] || 0) + 1 }; save("toketa_wrongBy", v); return v; });
      setReveal((v) => Math.min(prob.steps.length, v + 1));
      setTimeout(() => setPicked(null), 650);
    }
  }

  // ── 章クリアのご褒美（メダル演出） ──
  if (chapterClear) {
    return (
      <div style={S.app}><div style={{ ...S.wrap, justifyContent: "center", minHeight: "100dvh", textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: "#fde047", letterSpacing: 3 }}>🏅 しょう クリア！</div>
        <div style={{ fontSize: 84, margin: "14px 0" }}>{chapterClear.emoji}</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>{chapterClear.name}</div>
        <div style={{ fontSize: 15, fontWeight: 900, color: "#a5f3fc", marginTop: 6 }}>ぜんぶクリア！メダル GET！🏅</div>
        <div style={{ fontSize: 13, color: "rgba(238,241,255,.7)", marginTop: 12, lineHeight: 1.7 }}>よくがんばったね！<br />つぎの章や、ふくしゅうにも挑戦しよう。</div>
        <button onClick={() => { setChapterClear(null); setProb(null); setReviewing(false); setView("home"); }} style={{ ...S.tryBtn, marginTop: 24, maxWidth: 300 }}>🏠 ホームへ</button>
      </div></div>
    );
  }

  // ── つまづきマップ ──
  if (view === "map") {
    const entries = Object.entries(stumbles).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);
    const maxN = entries.length ? entries[0][1] : 1;
    return (
      <div style={S.app}><div style={S.wrap}>
        <div style={S.top}>
          <span style={S.brand}>📊 つまづきマップ</span>
          <button onClick={() => setView(prob ? "play" : "home")} style={S.mapBtn}>← もどる</button>
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
      </div></div>
    );
  }

  // ── 小単元えらび（理解度メーター付き） ──
  if (view === "units" && chap) {
    const clearedN = chap.units.filter((u) => (solvedBy[u.id] || 0) >= u.need).length;
    return (
      <div style={S.app}><div style={S.wrap}>
        <div style={S.top}>
          <button onClick={() => { setChap(null); setView("home"); }} style={S.mapBtn}>← 章えらび</button>
          <button onClick={() => setView("map")} style={S.mapBtn}>📊 マップ</button>
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, margin: "6px 0 2px" }}>中{chap.grade}　{chap.emoji} {chap.name}</div>
        <div style={{ fontSize: 12, color: "rgba(238,241,255,.6)", marginBottom: 14 }}>{clearedN}/{chap.units.length} 単元クリア ・ 小単元をえらんで練習しよう</div>
        {chap.units.map((u, i) => {
          const mt = unitMeter(u);
          return (
            <button key={u.id} onClick={() => enterUnit(chap, i)} style={S.unitRow}>
              <span style={{ fontSize: 26, lineHeight: 1 }}>{u.emoji}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontSize: 14.5, fontWeight: 900 }}>{u.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 900, color: mt.color, whiteSpace: "nowrap" }}>{mt.done ? "バッチリ ✓" : `${mt.label} ${mt.pct}%`}</span>
                </span>
                <span style={{ display: "block", marginTop: 6, height: 8, borderRadius: 999, background: "rgba(255,255,255,.1)", overflow: "hidden" }}>
                  <span style={{ display: "block", height: "100%", width: mt.pct + "%", background: mt.color, transition: "width .4s" }} />
                </span>
                <span style={{ fontSize: 10.5, color: "rgba(238,241,255,.5)", marginTop: 3, display: "block" }}>とけた {Math.min(solvedBy[u.id] || 0, u.need)}/{u.need}</span>
              </span>
              <span style={{ fontSize: 16, color: "rgba(255,255,255,.5)" }}>›</span>
            </button>
          );
        })}
      </div></div>
    );
  }

  // ── 章えらび（ホーム） ──
  if (view === "home" || !prob) {
    const medals = CHAPTERS.filter((c) => c.units.every((u) => (solvedBy[u.id] || 0) >= u.need)).length;
    return (
      <div style={S.app}><div style={S.wrap}>
        <div style={S.top}>
          <span style={S.brand}>とけた！</span>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={S.meter}>🏅{medals} ・ とけた数 {solved}ｺ</span>
            <button onClick={() => setView("map")} style={S.mapBtn}>📊 マップ</button>
          </span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 800, color: "rgba(238,241,255,.8)", margin: "8px 0 12px" }}>どの章を学ぶ？</div>
        <div style={{ display: "flex", gap: 8, width: "100%", marginBottom: 14 }}>
          {GRADES.map((g) => (
            <button key={g} onClick={() => { setHomeGrade(g); save("toketa_grade", g); }}
              style={{ flex: 1, padding: "9px 0", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 900,
                border: homeGrade === g ? "2px solid #818cf8" : "1px solid rgba(255,255,255,.18)",
                background: homeGrade === g ? "rgba(129,140,248,.25)" : "rgba(255,255,255,.05)", color: "#fff" }}>中{g}</button>
          ))}
        </div>
        {CHAPTERS.filter((c) => c.grade === homeGrade).map((c) => {
          const cleared = c.units.filter((u) => (solvedBy[u.id] || 0) >= u.need).length;
          const done = cleared === c.units.length;
          return (
            <button key={c.id} onClick={() => enterChapter(c)} style={{ ...S.chapCard, borderColor: done ? "rgba(74,222,128,.6)" : "rgba(255,255,255,.15)" }}>
              <span style={{ fontSize: 32, lineHeight: 1 }}>{c.emoji}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 16, fontWeight: 900, display: "block" }}>{done ? "🏅 " : ""}{c.name}</span>
                <span style={{ fontSize: 12, color: done ? "#86efac" : "rgba(238,241,255,.6)" }}>{cleared}/{c.units.length} 単元{done ? " クリア ✓" : ""}</span>
                <span style={{ display: "block", marginTop: 6, height: 6, borderRadius: 999, background: "rgba(255,255,255,.1)", overflow: "hidden" }}>
                  <span style={{ display: "block", height: "100%", width: `${Math.round(cleared / c.units.length * 100)}%`, background: "linear-gradient(90deg,#818cf8,#22d3ee)" }} />
                </span>
              </span>
              <span style={{ fontSize: 18, color: "rgba(255,255,255,.5)" }}>›</span>
            </button>
          );
        })}
        {reviewPool().length > 0 && (
          <button onClick={startReview} style={{ width: "100%", marginTop: 6, padding: "14px", borderRadius: 14, cursor: "pointer",
            border: "2px solid rgba(255,255,255,.2)", background: "linear-gradient(135deg,#f59e0b,#ef4444)", color: "#fff", fontSize: 15, fontWeight: 900 }}>
            🔁 ふくしゅう（学んだ問題をまぜて出題）
          </button>
        )}
        <div style={S.note}>まちがえても大丈夫。最後は自分で解けるよ。</div>
      </div></div>
    );
  }

  // ── 出題（プレイ） ──
  const u = prob.unit;
  const cleared = (solvedBy[u.id] || 0) >= u.need;
  return (
    <div style={S.app}><div style={S.wrap}>
      <style>{FX_CSS}</style>
      {/* 正解の大きなエフェクト（紙吹雪＋光のリング＋ポップ） */}
      {praise && (
        <div key={fxKey} style={{ position: "fixed", inset: 0, zIndex: 60, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 40%, rgba(74,222,128,.4), transparent 62%)", animation: "fxFlash .55s ease-out forwards" }} />
          <div style={{ position: "absolute", left: "50%", top: "40%", width: 150, height: 150, border: "7px solid #4ade80", borderRadius: "50%", animation: "fxRing .7s ease-out forwards" }} />
          <div style={{ position: "absolute", left: "50%", top: "40%", width: 150, height: 150, border: "4px solid #a5f3fc", borderRadius: "50%", animation: "fxRing .7s ease-out .12s forwards" }} />
          <div style={{ position: "absolute", left: "50%", top: "40%", fontSize: 92, filter: "drop-shadow(0 4px 16px rgba(0,0,0,.5))", animation: "fxPop .6s cubic-bezier(.2,1.6,.4,1) both" }}>🎉</div>
          {CONFETTI.map((p, i) => (
            <div key={i} style={{ position: "absolute", left: p.x + "%", top: 0, width: p.w, height: p.w + 4, background: p.c, borderRadius: p.round ? "50%" : 2, animation: `fxFall ${p.dur}s ease-in ${p.delay}s forwards` }} />
          ))}
        </div>
      )}
      <div style={S.top}>
        <button onClick={() => { if (reviewing) { setProb(null); setReviewing(false); setView("home"); } else setView("units"); }} style={S.mapBtn}>← もどる</button>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={S.meter}>とけた数 {solved}ｺ</span>
          <button onClick={() => setView("map")} style={S.mapBtn}>📊 マップ</button>
        </span>
      </div>

      {reviewing ? (
        <div style={S.unit}>🔁 ふくしゅう　・　{u.emoji} {u.name}</div>
      ) : (
        <>
          <div style={S.unit}>
            中{chap.grade}　{chap.emoji} {chap.name}　{idx + 1}/{chap.units.length}：{u.name}
            <span style={{ color: cleared ? "#4ade80" : "rgba(255,255,255,.5)", marginLeft: 8, fontWeight: 800 }}>
              {cleared ? "クリア済み ✓" : `${Math.min(solvedBy[u.id] || 0, u.need)}/${u.need}`}
            </span>
          </div>
          <div style={S.barTrackSlim}><div style={{ ...S.barFillBlue, width: `${Math.round(Math.min(solvedBy[u.id] || 0, u.need) / u.need * 100)}%` }} /></div>
        </>
      )}

      <div style={S.q}>{prob.q}</div>

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
          <button onClick={() => { if (reviewing) { const p = { ...u.gen(), unit: u }; setProb(p); setReveal(0); resetTurn(); } else loadNext(chap, idx, { soloStart: true }); }} style={S.tryBtn}>📝 わかった！もう一度やってみる</button>
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
                  style={{ ...S.choice, ...(ok ? { ...S.ok, animation: "okPulse .5s ease both" } : ng ? S.ng : {}) }}>{c.val}</button>
              );
            })}
          </div>
          {coach && !praise && <div style={S.coach}>🧭 {coach}</div>}
          {praise && <div style={{ ...S.praise, fontSize: 20, animation: "bannerPop .45s cubic-bezier(.2,1.6,.4,1) both" }}>{praise}</div>}
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
    </div></div>
  );
}

const S = {
  app: { minHeight: "100dvh", background: "radial-gradient(900px 500px at 50% -10%,#1b2150,#0f1226 60%)", color: "#eef1ff", fontFamily: "'Hiragino Kaku Gothic ProN',system-ui,sans-serif", display: "flex", justifyContent: "center" },
  wrap: { width: "100%", maxWidth: 460, padding: "22px 18px 30px", display: "flex", flexDirection: "column", alignItems: "center" },
  top: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  brand: { fontSize: 22, fontWeight: 900, color: "#a5b4fc" },
  meter: { fontSize: 11, color: "rgba(238,241,255,.6)" },
  mapBtn: { padding: "7px 12px", borderRadius: 10, border: "1px solid rgba(165,180,252,.5)", background: "rgba(99,102,241,.18)", color: "#c7d2fe", fontSize: 12, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" },
  chapCard: { width: "100%", display: "flex", alignItems: "center", gap: 12, textAlign: "left", padding: "14px 16px", borderRadius: 16, cursor: "pointer", color: "#fff", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.15)", marginBottom: 10 },
  unitRow: { width: "100%", display: "flex", alignItems: "center", gap: 12, textAlign: "left", padding: "12px 14px", borderRadius: 14, cursor: "pointer", color: "#fff", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.13)", marginBottom: 9 },
  unit: { width: "100%", fontSize: 12, fontWeight: 800, color: "rgba(186,230,253,.9)", marginBottom: 6 },
  barTrackSlim: { width: "100%", height: 6, borderRadius: 999, background: "rgba(255,255,255,.1)", overflow: "hidden", marginBottom: 16 },
  barFillBlue: { height: "100%", borderRadius: 999, background: "linear-gradient(90deg,#818cf8,#22d3ee)" },
  q: { fontSize: 32, fontWeight: 900, letterSpacing: 1, margin: "4px 0 18px", textAlign: "center", lineHeight: 1.3 },
  help: { width: "100%", background: "rgba(251,191,36,.12)", border: "1px solid rgba(251,191,36,.4)", borderRadius: 12, padding: "10px 13px", marginBottom: 14 },
  helpTtl: { fontSize: 12, fontWeight: 900, color: "#fde047", marginBottom: 4 },
  helpLine: { fontSize: 13.5, color: "#fde68a", lineHeight: 1.8 },
  grid: { width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  choice: { padding: "18px 10px", borderRadius: 14, border: "2px solid rgba(255,255,255,.18)", background: "rgba(255,255,255,.06)", color: "#fff", fontSize: 22, fontWeight: 900, cursor: "pointer" },
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
