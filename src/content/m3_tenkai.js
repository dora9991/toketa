// 中3 第1章「式の展開と因数分解」
import { ri, opts, quad } from "./_util.js";
export const MISC_M3_TENKAI = {
  "expand-mid": { label: "真ん中の項のミス", coach: "(x＋a)(x＋b) の真ん中は a＋b、後ろは a×b だよ" },
  "square-mid": { label: "2乗の真ん中（2倍）", coach: "(x＋a)² の真ん中は 2×a。2倍を忘れずに" },
  "sign": { label: "符号のミス", coach: "＋・− を逆にしていないかな？" },
  "factor-pair": { label: "因数の組み合わせ", coach: "たして真ん中、かけて後ろになる2数をさがそう" },
  "factor-incomplete": { label: "くくり残し", coach: "共通因数を全部くくり出せているかな？" },
  "calc": { label: "計算ミス", coach: "おしい！ゆっくり計算してみよう" },
};
function genProduct() {
  let a = ri(1, 6), b = ri(1, 6); if (a * b === a + b) b++; const ans = quad(1, a + b, a * b);
  return { q: `（x＋${a}）（x＋${b}） を展開すると？`, ans,
    steps: ["真ん中 ＝ a＋b、後ろ ＝ a×b", `x²＋${a + b}x＋${a * b}`],
    distractors: opts(ans, [{ val: quad(1, a + b, -a * b), tag: "sign" }, { val: quad(1, a * b, a + b), tag: "expand-mid" }, { val: quad(1, a + b + 1, a * b), tag: "calc" }]) };
}
function genSquare() {
  const a = ri(2, 7), ans = quad(1, 2 * a, a * a);
  return { q: `（x＋${a}）² を展開すると？`, ans,
    steps: ["(x＋a)² ＝ x² ＋ 2a x ＋ a²", `x²＋${2 * a}x＋${a * a}`],
    distractors: opts(ans, [{ val: quad(1, a, a * a), tag: "square-mid" }, { val: quad(1, 2 * a, a), tag: "calc" }, { val: quad(1, 2 * a, -a * a), tag: "sign" }]) };
}
function genDiff() {
  const a = ri(2, 9), ans = quad(1, 0, -a * a);
  return { q: `（x＋${a}）（x−${a}） を展開すると？`, ans,
    steps: ["(x＋a)(x−a) ＝ x² − a²", `x²−${a * a}`],
    distractors: opts(ans, [{ val: quad(1, 0, a * a), tag: "sign" }, { val: quad(1, -2 * a, -a * a), tag: "expand-mid" }, { val: quad(1, 2 * a, -a * a), tag: "calc" }]) };
}
function genCommon() {
  const k = ri(2, 5), b = ri(2, 6), ans = `${k}x（x＋${b}）`;
  return { q: `${k}x² ＋ ${k * b}x を因数分解すると？`, ans,
    steps: ["共通因数 " + k + "x をくくり出す", `${k}x（x ＋ ${b}）`],
    distractors: opts(ans, [{ val: `x（${k}x＋${k * b}）`, tag: "factor-incomplete" }, { val: `${k}（x²＋${b}x）`, tag: "factor-incomplete" }, { val: `${k}x（x＋${b + 1}）`, tag: "calc" }]) };
}
function genFactor() {
  const a = ri(1, 4), b = ri(a + 1, 6), s = a + b, p = a * b;
  const ans = `（x＋${a}）（x＋${b}）`;
  return { q: `x² ＋ ${s}x ＋ ${p} を因数分解すると？`, ans,
    steps: [`たして ${s}、かけて ${p} になる2数をさがす`, `${a} と ${b} → （x＋${a}）（x＋${b}）`],
    distractors: opts(ans, [{ val: `（x＋${a}）（x＋${b + 1}）`, tag: "factor-pair" }, { val: `（x＋${a + 1}）（x＋${b}）`, tag: "factor-pair" }, { val: `（x＋${s}）（x＋1）`, tag: "factor-pair" }]) };
}
export const CHAPTER_M3_TENKAI = { id: "m3-tenkai", name: "展開と因数分解", emoji: "📦", grade: 3, units: [
  { id: "m3te-prod", name: "展開（x＋a）（x＋b）", emoji: "📂", haichiUnit: "g3c1u3", need: 5, gen: genProduct },
  { id: "m3te-sq", name: "展開（x＋a）²", emoji: "🟧", haichiUnit: "g3c1u4", need: 5, gen: genSquare },
  { id: "m3te-diff", name: "展開（x＋a）（x−a）", emoji: "🔷", haichiUnit: "g3c1u4", need: 5, gen: genDiff },
  { id: "m3te-com", name: "共通因数でくくる", emoji: "🪢", haichiUnit: "g3c1u5", need: 5, gen: genCommon },
  { id: "m3te-fac", name: "因数分解 x²＋bx＋c", emoji: "🧩", haichiUnit: "g3c1u6", need: 6, gen: genFactor },
] };
