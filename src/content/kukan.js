// ============================================================
// content/kukan.js — 「空間図形」1章（中1 第6章）。
//  直方体/立方体の体積 → 角柱の体積 → 角錐の体積(÷3) → 円柱の体積(Nπ) → 球の表面積(Nπ)。
// ============================================================
import { ri, opts, pit, optsPi } from "./_util.js";

export const MISC_KUKAN = {
  "pyramid-third": { label: "錐の ÷3 忘れ", coach: "角錐・円錐の体積は、柱の 1/3（÷3）だよ" },
  "vol-base": { label: "体積の公式", coach: "体積 ＝ 底面積 × 高さ だよ" },
  "surf-vol": { label: "体積と表面積の混同", coach: "表面積は『面の面積の合計』。体積とはちがうよ" },
  "calc": { label: "計算ミス", coach: "おしい！もう一度ゆっくり計算してみよう" },
};

function genBox() {
  if (Math.random() < 0.4) { const a = ri(2, 6); return { q: `1辺 ${a} の立方体の体積は？`, ans: a * a * a,
    steps: ["体積 ＝ 1辺 × 1辺 × 1辺", `${a}×${a}×${a} ＝ ${a * a * a}`], distractors: opts(a * a * a, [{ val: a * a * 6, tag: "surf-vol" }, { val: a * 3, tag: "calc" }]) }; }
  const a = ri(2, 6), b = ri(2, 6), c = ri(2, 6); return { q: `たて${a}・よこ${b}・高さ${c} の直方体の体積は？`, ans: a * b * c,
    steps: ["体積 ＝ たて×よこ×高さ", `${a}×${b}×${c} ＝ ${a * b * c}`], distractors: opts(a * b * c, [{ val: a + b + c, tag: "vol-base" }, { val: 2 * (a * b + b * c + c * a), tag: "surf-vol" }]) };
}
function genPrism() {
  const base = ri(6, 20), h = ri(3, 9);
  return { q: `底面積 ${base}、高さ ${h} の角柱の体積は？`, ans: base * h,
    steps: ["体積 ＝ 底面積 × 高さ", `${base}×${h} ＝ ${base * h}`],
    distractors: opts(base * h, [{ val: base + h, tag: "vol-base" }, { val: Math.round(base * h / 3), tag: "pyramid-third" }]) };
}
function genPyramid() {
  const base = 3 * ri(2, 7), h = ri(2, 9), ans = base * h / 3;
  return { q: `底面積 ${base}、高さ ${h} の角錐の体積は？`, ans,
    steps: ["角錐の体積 ＝ 底面積 × 高さ ÷ 3", `${base}×${h}÷3 ＝ ${ans}`],
    distractors: opts(ans, [{ val: base * h, tag: "pyramid-third" }, { val: base + h, tag: "vol-base" }]) };
}
function genCyl() {
  const r = ri(2, 6), h = ri(2, 8), coef = r * r * h;
  return { q: `底面の半径 ${r}、高さ ${h} の円柱の体積は？（π）`, ans: pit(coef),
    steps: ["体積 ＝ πr² × 高さ", `π×${r}×${r}×${h} ＝ ${pit(coef)}`],
    distractors: optsPi(coef, [{ val: 2 * r * h, tag: "vol-base" }, { val: r * r, tag: "calc" }, { val: Math.round(coef / 3), tag: "pyramid-third" }]) };
}
function genSphere() {
  const r = ri(2, 6), coef = 4 * r * r;
  return { q: `半径 ${r} の球の表面積は？（π）`, ans: pit(coef),
    steps: ["球の表面積 ＝ 4πr²", `4×π×${r}×${r} ＝ ${pit(coef)}`],
    distractors: optsPi(coef, [{ val: 2 * r * r, tag: "surf-vol" }, { val: 4 * r, tag: "calc" }, { val: r * r, tag: "calc" }]) };
}

export const CHAPTER_KUKAN = {
  id: "kukan", name: "空間図形", emoji: "🧊",
  units: [
    { id: "kk-box", name: "直方体・立方体の体積", emoji: "📦", haichiUnit: "k2", need: 5, gen: genBox },
    { id: "kk-prism", name: "角柱の体積", emoji: "🟦", haichiUnit: "k2", need: 5, gen: genPrism },
    { id: "kk-pyr", name: "角錐の体積（÷3）", emoji: "🔺", haichiUnit: "k2", need: 5, gen: genPyramid },
    { id: "kk-cyl", name: "円柱の体積", emoji: "🥫", haichiUnit: "k2", need: 5, gen: genCyl },
    { id: "kk-sphere", name: "球の表面積", emoji: "⚽", haichiUnit: "k4", need: 5, gen: genSphere },
  ],
};
