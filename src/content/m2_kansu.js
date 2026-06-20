// 中2 第3章「一次関数」
import { ri, num, opts } from "./_util.js";
export const MISC_M2_KANSU = {
  "slope-intercept": { label: "傾きと切片の取り違え", coach: "y＝ax＋b の a が傾き、b が切片だよ" },
  "slope-run": { label: "x の増加でわり忘れ", coach: "傾き ＝ y の増加 ÷ x の増加 だよ" },
  "calc": { label: "計算ミス", coach: "おしい！ゆっくり計算してみよう" },
};
const bs = (b) => (b >= 0 ? `＋ ${b}` : `− ${-b}`);
function genROC() {
  const a = ri(-4, 6) || 3, b = ri(-6, 6);
  return { q: `一次関数 y ＝ ${a}x ${bs(b)} の変化の割合は？`, ans: a,
    steps: ["変化の割合 ＝ 傾き ＝ x の係数", `答えは ${a}`],
    distractors: opts(a, [{ val: b, tag: "slope-intercept" }, { val: a + b, tag: "calc" }]) };
}
function genY() {
  const a = ri(2, 5), b = ri(-5, 5), x = ri(2, 6), ans = a * x + b;
  return { q: `y ＝ ${a}x ${bs(b)} で x ＝ ${x} のとき y は？`, ans,
    steps: [`代入：${a}×${x} ${bs(b)}`, `y ＝ ${ans}`],
    distractors: opts(ans, [{ val: a + b + x, tag: "calc" }, { val: a * x, tag: "calc" }]) };
}
function gen2pt() {
  const x1 = ri(0, 3), x2 = x1 + ri(1, 4), a = ri(2, 5), y1 = ri(0, 6), y2 = y1 + a * (x2 - x1);
  return { q: `2点（${x1}, ${y1}）（${x2}, ${y2}）を通る直線の傾きは？`, ans: a,
    steps: ["傾き ＝ y の増加 ÷ x の増加", `（${y2} − ${y1}）÷（${x2} − ${x1}）＝ ${a}`],
    distractors: opts(a, [{ val: y2 - y1, tag: "slope-run" }, { val: x2 - x1, tag: "calc" }]) };
}
function genB() {
  const a = ri(2, 5), x = ri(1, 5), b = ri(-5, 5), y = a * x + b;
  return { q: `傾き ${a} の直線が点（${x}, ${y}）を通る。切片 b は？`, ans: b,
    steps: [`y ＝ ax ＋ b に代入：${y} ＝ ${a}×${x} ＋ b`, `b ＝ ${y} − ${a * x} ＝ ${b}`],
    distractors: opts(b, [{ val: y, tag: "slope-intercept" }, { val: y + a * x, tag: "calc" }]) };
}
function genUse() {
  const b = ri(100, 300), a = ri(20, 80), n = ri(2, 8), ans = a * n + b;
  return { q: `基本料金 ${b}円、1個ごとに ${a}円かかる。${n}個のときの代金は？`, ans,
    steps: ["代金 ＝ 1個の値段 × 個数 ＋ 基本料金", `${a}×${n} ＋ ${b} ＝ ${ans}`],
    distractors: opts(ans, [{ val: a * n, tag: "slope-intercept" }, { val: (a + b) * n, tag: "calc" }]) };
}
export const CHAPTER_M2_KANSU = { id: "m2-kansu", name: "一次関数", emoji: "📈", grade: 2, units: [
  { id: "m2ka-roc", name: "変化の割合（傾き）", emoji: "📐", haichiUnit: "g2c3u1", need: 5, gen: genROC },
  { id: "m2ka-y", name: "式に代入して y", emoji: "🎯", haichiUnit: "g2c3u2", need: 5, gen: genY },
  { id: "m2ka-2pt", name: "2点から傾き", emoji: "📈", haichiUnit: "g2c3u2", need: 5, gen: gen2pt },
  { id: "m2ka-b", name: "切片を求める", emoji: "🔑", haichiUnit: "g2c3u2", need: 5, gen: genB },
  { id: "m2ka-use", name: "一次関数の利用", emoji: "📝", haichiUnit: "g2c3u3", need: 5, gen: genUse },
] };
