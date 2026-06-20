// 中2 第1章「式の計算」
import { ri, num, opts, lin2 } from "./_util.js";
export const MISC_M2_SHIKI = {
  "pow-miss": { label: "指数のミス", coach: "x×x は x²。指数（右上の数）に気をつけよう" },
  "drop-var": { label: "文字を落とした", coach: "文字はそのまま残すよ" },
  "subst-sign": { label: "代入の符号", coach: "負の数を代入したら、符号もそのまま計算しよう" },
  "sign-flip": { label: "符号の取り違え", coach: "＋・− を逆にしていないかな？" },
  "calc": { label: "計算ミス", coach: "おしい！ゆっくり計算してみよう" },
};
function genAddSub() {
  const a = ri(1, 6), b = ri(1, 6), c = ri(1, 6), d = ri(1, 6), minus = Math.random() < 0.5;
  const A = minus ? a - c : a + c, B = minus ? b - d : b + d, ans = lin2(A, B);
  const w = [];
  if (minus) w.push({ val: lin2(a - c, b + d), tag: "sign-flip" });
  w.push({ val: lin2(minus ? a + c : a - c, B), tag: "calc" }, { val: lin2(A, B + 1), tag: "calc" }, { val: lin2(A + 1, B), tag: "calc" });
  return { q: `（${lin2(a, b)}）${minus ? "−" : "＋"}（${lin2(c, d)}） ＝ ？`, ans,
    steps: ["a どうし、b どうしをまとめる", `a：${a}${minus ? "−" : "＋"}${c}＝${A}、　b：${b}${minus ? "−" : "＋"}${d}＝${B}`], distractors: opts(ans, w) };
}
function genMul() {
  let a = ri(2, 6), b = ri(2, 6); if (a * b === a + b) b++;
  if (Math.random() < 0.5) { const ans = `${a * b}ab`;
    return { q: `${a}a × ${b}b ＝ ？`, ans, steps: ["数は数、文字は文字をかける", `${a}×${b}＝${a * b}、　a×b＝ab`],
      distractors: opts(ans, [{ val: `${a + b}ab`, tag: "calc" }, { val: `${a * b}a`, tag: "drop-var" }, { val: `${a * b}b`, tag: "drop-var" }]) }; }
  const ans = `${a * b}x²`;
  return { q: `${a}x × ${b}x ＝ ？`, ans, steps: ["数どうし、文字どうしをかける", `${a}×${b}＝${a * b}、　x×x＝x²`],
    distractors: opts(ans, [{ val: `${a + b}x²`, tag: "calc" }, { val: `${a * b}x`, tag: "pow-miss" }, { val: `${a * b}x³`, tag: "calc" }]) };
}
function genDiv() {
  let C = ri(2, 5), q = ri(2, 6); if (C === 2 && q === 2) q = 3; const A = C * q;
  if (Math.random() < 0.5) { const ans = `${q}b`;
    return { q: `${A}ab ÷ ${C}a ＝ ？`, ans, steps: ["数は数でわる、同じ文字は消える", `${A}÷${C}＝${q}、　ab÷a＝b`],
      distractors: opts(ans, [{ val: `${q}ab`, tag: "drop-var" }, { val: `${q}a`, tag: "drop-var" }, { val: `${A - C}b`, tag: "calc" }]) }; }
  const ans = `${q}x`;
  return { q: `${A}x² ÷ ${C}x ＝ ？`, ans, steps: ["数は数でわる、x²÷x＝x", `${A}÷${C}＝${q}`],
    distractors: opts(ans, [{ val: `${q}x²`, tag: "pow-miss" }, { val: `${q}`, tag: "drop-var" }, { val: `${A - C}x`, tag: "calc" }]) };
}
function genPow() {
  let a = ri(2, 6); if (a === 2) a = 3; const ans = `${a * a}x²`;
  return { q: `（${a}x）² ＝ ？`, ans, steps: ["係数も2乗、x も2乗", `${a}²＝${a * a}、　x²`],
    distractors: opts(ans, [{ val: `${a * 2}x²`, tag: "pow-miss" }, { val: `${a * a}x`, tag: "calc" }, { val: `${a * a}x⁴`, tag: "calc" }]) };
}
function genVal() {
  const a = ri(-4, 5) || 2, b = ri(-4, 5) || -1, p = ri(2, 5), q = (ri(-5, 5) || 2);
  const ans = p * a + q * b;
  return { q: `a＝${num(a)}、b＝${num(b)} のとき　${lin2(p, q)}　の値は？`, ans,
    steps: [`代入：${p}×（${num(a)}）${q >= 0 ? "＋" : "−"}${Math.abs(q)}×（${num(b)}）`, `計算すると ${ans}`],
    distractors: opts(ans, [{ val: p * Math.abs(a) + q * Math.abs(b), tag: "subst-sign" }, { val: p * a - q * b, tag: "sign-flip" }]) };
}
export const CHAPTER_M2_SHIKI = { id: "m2-shiki", name: "式の計算", emoji: "🧮", grade: 2, units: [
  { id: "m2sh-as", name: "多項式の加法・減法", emoji: "➕", haichiUnit: "g2c1u1", need: 5, gen: genAddSub },
  { id: "m2sh-mul", name: "単項式の乗法", emoji: "✖️", haichiUnit: "g2c1u2", need: 5, gen: genMul },
  { id: "m2sh-div", name: "単項式の除法", emoji: "➗", haichiUnit: "g2c1u4", need: 5, gen: genDiv },
  { id: "m2sh-pow", name: "累乗（2乗）", emoji: "🔢", haichiUnit: "g2c1u3", need: 5, gen: genPow },
  { id: "m2sh-val", name: "式の値（代入）", emoji: "🎯", haichiUnit: "g2c1u1", need: 5, gen: genVal },
] };
