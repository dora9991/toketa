// 中3 第3章「2次方程式」（解を1つ求める）
import { ri, num, opts } from "./_util.js";
export const MISC_M3_2JI = {
  "root-square": { label: "平方根の取り方", coach: "x²＝a なら x＝±√a。両方あるよ" },
  "factor-sign": { label: "解の符号", coach: "（x−a）＝0 のとき x＝a。符号に注意" },
  "move-sign": { label: "移項の符号", coach: "反対側に移すとき符号を変えるよ" },
  "calc": { label: "計算ミス", coach: "おしい！ゆっくり計算してみよう" },
};
function genX2() {
  const k = ri(2, 12), ans = k;
  return { q: `x² ＝ ${k * k} の正の解は？`, ans, steps: ["x ＝ ±√" + k * k, `正の解は ${k}`],
    distractors: opts(ans, [{ val: k * k, tag: "root-square" }, { val: k * 2, tag: "calc" }]) };
}
function genSquareEq() {
  const a = ri(1, 6), k = ri(2, 6), ans = a + k; // (x−a)² = k² → x = a±k、大きい解 a+k
  return { q: `（x − ${a}）² ＝ ${k * k} の大きい方の解は？`, ans,
    steps: [`x − ${a} ＝ ±${k}`, `大きい方：x ＝ ${a} ＋ ${k} ＝ ${ans}`],
    distractors: opts(ans, [{ val: a - k, tag: "move-sign" }, { val: k - a, tag: "calc" }]) };
}
function genFactor() {
  let r1 = ri(2, 7), r2 = ri(1, 6); if (r1 === r2) r2++; const s = r1 + r2, p = r1 * r2;
  const ans = Math.max(r1, r2);
  return { q: `x² − ${s}x ＋ ${p} ＝ 0 の大きい方の解は？`, ans,
    steps: [`（x−${r1}）（x−${r2}）＝ 0`, `x ＝ ${r1} または ${r2}、大きい方は ${ans}`],
    distractors: opts(ans, [{ val: -ans, tag: "factor-sign" }, { val: Math.min(r1, r2), tag: "calc" }]) };
}
function genFactor0() {
  const r = ri(2, 8), ans = r; // x² − rx = 0 → x(x−r)=0 → x=0, r
  return { q: `x² − ${r}x ＝ 0 の、0 でない方の解は？`, ans,
    steps: ["x（x − " + r + "）＝ 0", `x ＝ 0 または ${r}。0 でない解は ${r}`],
    distractors: opts(ans, [{ val: -r, tag: "factor-sign" }, { val: 0, tag: "calc" }]) };
}
function genFactorNeg() {
  let a = ri(2, 6), b = ri(1, 5); if (a === b) b++; const s = a - b, p = -a * b;
  // (x−a)(x+b)=0 → x=a, −b
  const ans = a;
  return { q: `x² ${s >= 0 ? `− ${s}x` : `＋ ${-s}x`} ${p >= 0 ? `＋ ${p}` : `− ${-p}`} ＝ 0 の正の解は？`, ans,
    steps: [`（x−${a}）（x＋${b}）＝ 0`, `x ＝ ${a} または ${num(-b)}。正の解は ${a}`],
    distractors: opts(ans, [{ val: -a, tag: "factor-sign" }, { val: b, tag: "calc" }]) };
}
export const CHAPTER_M3_2JI = { id: "m3-2ji", name: "2次方程式", emoji: "⚖️", grade: 3, units: [
  { id: "m32-x2", name: "x² ＝ a で解く", emoji: "🟰", haichiUnit: "g3c3u1", need: 5, gen: genX2 },
  { id: "m32-sq", name: "（x−a）² ＝ b で解く", emoji: "🟧", haichiUnit: "g3c3u2", need: 5, gen: genSquareEq },
  { id: "m32-fac", name: "因数分解で解く", emoji: "🧩", haichiUnit: "g3c3u4", need: 5, gen: genFactor },
  { id: "m32-fac0", name: "x²−bx＝0 で解く", emoji: "0️⃣", haichiUnit: "g3c3u4", need: 5, gen: genFactor0 },
  { id: "m32-facn", name: "因数分解（正負の解）", emoji: "🔀", haichiUnit: "g3c3u4", need: 5, gen: genFactorNeg },
] };
