// 中3 第6章「円」（円周角）
import { ri, opts } from "./_util.js";
export const MISC_M3_EN = {
  "inscribed-central": { label: "円周角と中心角", coach: "円周角 ＝ 中心角 ÷ 2（中心角は円周角の2倍）だよ" },
  "same-arc": { label: "同じ弧の円周角", coach: "同じ弧に立つ円周角は、みんな等しいよ" },
  "thales": { label: "半円の弧の角", coach: "直径（半円）に立つ円周角は 90° だよ" },
  "calc": { label: "計算ミス", coach: "おしい！ゆっくり計算してみよう" },
};
function genCentral() {
  const c = 2 * ri(15, 80), ans = c / 2;
  return { q: `中心角が ${c}° のとき、同じ弧に立つ円周角は？`, ans,
    steps: ["円周角 ＝ 中心角 ÷ 2", `${c} ÷ 2 ＝ ${ans}`],
    distractors: opts(ans, [{ val: c, tag: "inscribed-central" }, { val: c * 2, tag: "calc" }]) };
}
function genInscribed() {
  const i = ri(20, 80), ans = i * 2;
  return { q: `円周角が ${i}° のとき、同じ弧の中心角は？`, ans,
    steps: ["中心角 ＝ 円周角 × 2", `${i} × 2 ＝ ${ans}`],
    distractors: opts(ans, [{ val: Math.round(i / 2), tag: "inscribed-central" }, { val: i, tag: "same-arc" }]) };
}
function genSameArc() {
  const x = ri(25, 75), ans = x;
  return { q: `同じ弧に立つ円周角の1つが ${x}°。もう1つの円周角は？`, ans,
    steps: ["同じ弧の円周角は等しい", `答えは ${x}°`],
    distractors: opts(ans, [{ val: x * 2, tag: "inscribed-central" }, { val: 180 - x, tag: "calc" }]) };
}
function genThales() {
  const a = ri(25, 65), ans = 90 - a;
  return { q: `直径を1辺とする三角形（半円の弧）。1つの角が ${a}° のとき、残りの角は？（直角を使う）`, ans,
    steps: ["直径に立つ円周角は 90°", `180 − 90 − ${a} ＝ ${ans}`],
    distractors: opts(ans, [{ val: 180 - a, tag: "thales" }, { val: a, tag: "calc" }]) };
}
function genQuad() {
  const a = ri(60, 120), ans = 180 - a;
  return { q: `円に内接する四角形。向かい合う角の1つが ${a}°。その対角は？`, ans,
    steps: ["内接四角形の対角の和は 180°", `180 − ${a} ＝ ${ans}`],
    distractors: opts(ans, [{ val: a, tag: "same-arc" }, { val: 360 - a, tag: "calc" }]) };
}
export const CHAPTER_M3_EN = { id: "m3-en", name: "円", emoji: "⭕", grade: 3, units: [
  { id: "m3en-cen", name: "中心角→円周角", emoji: "🎯", haichiUnit: "g3c6u1", need: 5, gen: genCentral },
  { id: "m3en-ins", name: "円周角→中心角", emoji: "🔵", haichiUnit: "g3c6u1", need: 5, gen: genInscribed },
  { id: "m3en-same", name: "同じ弧の円周角", emoji: "🌙", haichiUnit: "g3c6u1", need: 5, gen: genSameArc },
  { id: "m3en-thales", name: "直径と円周角（90°）", emoji: "📐", haichiUnit: "g3c6u1", need: 5, gen: genThales },
  { id: "m3en-quad", name: "内接四角形", emoji: "⬜", haichiUnit: "g3c6u2", need: 5, gen: genQuad },
] };
