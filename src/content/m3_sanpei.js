// 中3 第7章「三平方の定理」
import { ri, opts, srt } from "./_util.js";
export const MISC_M3_SANPEI = {
  "hypotenuse": { label: "斜辺の位置", coach: "三平方は a²＋b²＝c²。c は一番長い斜辺だよ" },
  "no-square": { label: "2乗・√のし忘れ", coach: "辺を2乗して、最後に √ をとるよ" },
  "simplify-miss": { label: "√の簡単化", coach: "√の中に平方数があれば外に出すよ" },
  "calc": { label: "計算ミス", coach: "おしい！ゆっくり計算してみよう" },
};
const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25]];
function genHyp() {
  const t = TRIPLES[ri(0, TRIPLES.length - 1)], ans = t[2];
  return { q: `直角三角形の直角をはさむ2辺が ${t[0]} と ${t[1]}。斜辺は？`, ans,
    steps: [`斜辺² ＝ ${t[0]}² ＋ ${t[1]}² ＝ ${t[0] * t[0]} ＋ ${t[1] * t[1]} ＝ ${ans * ans}`, `斜辺 ＝ √${ans * ans} ＝ ${ans}`],
    distractors: opts(ans, [{ val: t[0] + t[1], tag: "no-square" }, { val: ans * ans, tag: "no-square" }]) };
}
function genLeg() {
  const t = TRIPLES[ri(0, TRIPLES.length - 1)], ans = t[1];
  return { q: `直角三角形の斜辺が ${t[2]}、1辺が ${t[0]}。もう1辺は？`, ans,
    steps: [`もう1辺² ＝ ${t[2]}² − ${t[0]}² ＝ ${t[2] * t[2]} − ${t[0] * t[0]} ＝ ${ans * ans}`, `＝ √${ans * ans} ＝ ${ans}`],
    distractors: opts(ans, [{ val: t[2] - t[0], tag: "no-square" }, { val: t[2] + t[0], tag: "hypotenuse" }]) };
}
function genSquareDiag() {
  const a = ri(2, 9), ans = srt(a, 2); // 正方形の対角線 = a√2
  return { q: `1辺 ${a} の正方形の対角線の長さは？（√で）`, ans,
    steps: [`対角線² ＝ ${a}² ＋ ${a}² ＝ ${2 * a * a}`, `＝ √${2 * a * a} ＝ ${a}√2`],
    distractors: opts(ans, [{ val: srt(1, 2 * a * a), tag: "simplify-miss" }, { val: srt(a, 4), tag: "calc" }, { val: srt(2 * a, 2), tag: "calc" }]) };
}
function genTriEq() {
  const a = 2 * ri(2, 5), ans = srt(a / 2, 3); // 1辺2k の正三角形の高さ = k√3
  return { q: `1辺 ${a} の正三角形の高さは？（√で）`, ans,
    steps: [`高さ² ＝ ${a}² − ${a / 2}² ＝ ${a * a} − ${(a / 2) * (a / 2)} ＝ ${a * a - (a / 2) * (a / 2)}`, `＝ ${a / 2}√3`],
    distractors: opts(ans, [{ val: srt(1, a * a - (a / 2) * (a / 2)), tag: "simplify-miss" }, { val: srt(a, 3), tag: "calc" }, { val: srt(a / 2, 2), tag: "calc" }]) };
}
function genDist() {
  const t = TRIPLES[ri(0, 2)], ans = t[2];
  return { q: `2点 A(0,0) と B(${t[0]}, ${t[1]}) の距離は？`, ans,
    steps: [`距離² ＝ ${t[0]}² ＋ ${t[1]}² ＝ ${ans * ans}`, `＝ √${ans * ans} ＝ ${ans}`],
    distractors: opts(ans, [{ val: t[0] + t[1], tag: "no-square" }, { val: ans * ans, tag: "no-square" }]) };
}
export const CHAPTER_M3_SANPEI = { id: "m3-sanpei", name: "三平方の定理", emoji: "📏", grade: 3, units: [
  { id: "m3sp-hyp", name: "斜辺を求める", emoji: "📐", haichiUnit: "g3c7u1", need: 5, gen: genHyp },
  { id: "m3sp-leg", name: "他の辺を求める", emoji: "📏", haichiUnit: "g3c7u1", need: 5, gen: genLeg },
  { id: "m3sp-sq", name: "正方形の対角線", emoji: "⬛", haichiUnit: "g3c7u2", need: 5, gen: genSquareDiag },
  { id: "m3sp-tri", name: "正三角形の高さ", emoji: "🔺", haichiUnit: "g3c7u2", need: 5, gen: genTriEq },
  { id: "m3sp-dist", name: "2点間の距離", emoji: "📍", haichiUnit: "g3c7u4", need: 5, gen: genDist },
] };
