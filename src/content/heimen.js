// ============================================================
// content/heimen.js — 「平面図形」1章（中1 第5章）。
//  角の計算 → 三角形の角 → 円周・円の面積 → おうぎ形の弧 → おうぎ形の面積。
//  円・おうぎ形の答えは「Nπ」の形（文字列）。
// ============================================================
import { ri, opts, pit, optsPi } from "./_util.js";

export const MISC_HEIMEN = {
  "supp-comp": { label: "補角と余角の取り違え", coach: "一直線は180°、直角は90°。どちらから引くか確認しよう" },
  "angle-sum": { label: "内角の和", coach: "三角形の角の和は 180° だよ" },
  "circ-area": { label: "円周と面積の混同", coach: "円周は 2πr、面積は πr²（半径×半径）だよ" },
  "fan-frac": { label: "中心角の割合", coach: "おうぎ形は 円 ×（中心角 ÷ 360）だよ" },
  "calc": { label: "計算ミス", coach: "おしい！もう一度ゆっくり計算してみよう" },
};

function genAngle() {
  const r = Math.random();
  if (r < 0.4) { const x = ri(20, 160); return { q: `一直線の上にある角。${x}° のとなりの角は？`, ans: 180 - x,
    steps: ["一直線は 180°", `180 − ${x} ＝ ${180 - x}`], distractors: opts(180 - x, [{ val: x, tag: "supp-comp" }, { val: 90 - x > 0 ? 90 - x : x + 5, tag: "supp-comp" }]) }; }
  if (r < 0.7) { const x = ri(10, 80); return { q: `直角を2つに分けた角。一方が ${x}° のとき、もう一方は？`, ans: 90 - x,
    steps: ["直角は 90°", `90 − ${x} ＝ ${90 - x}`], distractors: opts(90 - x, [{ val: 180 - x, tag: "supp-comp" }, { val: x, tag: "supp-comp" }]) }; }
  const x = ri(20, 160); return { q: `2直線が交わってできる、${x}° の対頂角は？`, ans: x,
    steps: ["対頂角は等しい", `答えは ${x}°`], distractors: opts(x, [{ val: 180 - x, tag: "supp-comp" }, { val: 90, tag: "calc" }]) };
}
function genTri() {
  const a = ri(30, 80), b = ri(30, 80), ans = 180 - a - b;
  return { q: `三角形の2つの角が ${a}° と ${b}°。残りの角は？`, ans,
    steps: ["三角形の内角の和は 180°", `180 − ${a} − ${b} ＝ ${ans}`],
    distractors: opts(ans, [{ val: a + b, tag: "angle-sum" }, { val: 360 - a - b, tag: "angle-sum" }]) };
}
function genCircle() {
  const r = ri(2, 9);
  if (Math.random() < 0.5) { return { q: `半径 ${r} の円の円周は？（π を使って）`, ans: pit(2 * r),
    steps: ["円周 ＝ 2πr", `2×π×${r} ＝ ${pit(2 * r)}`], distractors: optsPi(2 * r, [{ val: r * r, tag: "circ-area" }, { val: r, tag: "calc" }, { val: 4 * r, tag: "calc" }]) }; }
  return { q: `半径 ${r} の円の面積は？（π を使って）`, ans: pit(r * r),
    steps: ["面積 ＝ πr²", `π×${r}×${r} ＝ ${pit(r * r)}`], distractors: optsPi(r * r, [{ val: 2 * r, tag: "circ-area" }, { val: 2 * r * r, tag: "calc" }, { val: r, tag: "calc" }]) };
}
function genArc() {
  const o = [[180, ri(2, 9)], [90, 2 * ri(1, 4)], [120, 3 * ri(1, 3)], [60, 3 * ri(1, 3)]][ri(0, 3)];
  const deg = o[0], r = o[1], coef = r * deg / 180;
  return { q: `半径 ${r}、中心角 ${deg}° のおうぎ形の弧の長さは？（π）`, ans: pit(coef),
    steps: ["弧 ＝ 2πr ×（中心角 ÷ 360）", `2π×${r}×（${deg}÷360）＝ ${pit(coef)}`],
    distractors: optsPi(coef, [{ val: 2 * r, tag: "fan-frac" }, { val: coef * 2, tag: "calc" }]) };
}
function genFan() {
  const o = [[90, 2 * ri(1, 4)], [180, 2 * ri(1, 4)], [120, [3, 6][ri(0, 1)]]][ri(0, 2)];
  const deg = o[0], r = o[1], coef = r * r * deg / 360;
  return { q: `半径 ${r}、中心角 ${deg}° のおうぎ形の面積は？（π）`, ans: pit(coef),
    steps: ["面積 ＝ πr² ×（中心角 ÷ 360）", `π×${r}×${r}×（${deg}÷360）＝ ${pit(coef)}`],
    distractors: optsPi(coef, [{ val: r * r, tag: "fan-frac" }, { val: coef * 2, tag: "calc" }]) };
}

export const CHAPTER_HEIMEN = {
  id: "heimen", name: "平面図形", emoji: "📐",
  units: [
    { id: "hm-angle", name: "角の計算（対頂角・補角）", emoji: "📐", haichiUnit: "z1", need: 5, gen: genAngle },
    { id: "hm-tri", name: "三角形の角（和は180°）", emoji: "🔺", haichiUnit: "z1", need: 5, gen: genTri },
    { id: "hm-circle", name: "円周と円の面積", emoji: "⭕", haichiUnit: "z3", need: 5, gen: genCircle },
    { id: "hm-arc", name: "おうぎ形の弧の長さ", emoji: "🌙", haichiUnit: "z3", need: 5, gen: genArc },
    { id: "hm-fan", name: "おうぎ形の面積", emoji: "🍕", haichiUnit: "z3", need: 5, gen: genFan },
  ],
};
