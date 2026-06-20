// 中3 第4章「関数 y＝ax²」
import { ri, num, opts } from "./_util.js";
export const MISC_M3_KANSU = {
  "square-miss": { label: "x を2乗し忘れ", coach: "y＝ax² は x を2乗してから a をかけるよ" },
  "sign-square": { label: "2乗の符号", coach: "負の数も2乗すると正になるよ（(−3)²＝9）" },
  "roc-2pt": { label: "変化の割合", coach: "変化の割合 ＝ y の増加 ÷ x の増加 だよ" },
  "calc": { label: "計算ミス", coach: "おしい！ゆっくり計算してみよう" },
};
function genY() {
  const a = ri(2, 4), x = ri(-5, 5) || 3, ans = a * x * x;
  return { q: `y ＝ ${a}x² で x ＝ ${num(x)} のとき y は？`, ans,
    steps: [`x を2乗：（${num(x)}）² ＝ ${x * x}`, `y ＝ ${a} × ${x * x} ＝ ${ans}`],
    distractors: opts(ans, [{ val: a * x, tag: "square-miss" }, { val: -(a * x * x), tag: "sign-square" }]) };
}
function genA() {
  const a = ri(2, 5), x = ri(2, 5), y = a * x * x;
  return { q: `y ＝ ax² が点（${x}, ${y}）を通る。a は？`, ans: a,
    steps: ["a ＝ y ÷ x²", `${y} ÷ ${x * x} ＝ ${a}`],
    distractors: opts(a, [{ val: Math.round(y / x), tag: "square-miss" }, { val: y, tag: "calc" }]) };
}
function genCompare() {
  const a = ri(2, 4), x = ri(2, 5), ans = a * x * x;
  return { q: `y ＝ ${a}x² で x ＝ ${x} のときと x ＝ ${-x} のとき。x ＝ ${x} の y は？`, ans,
    steps: ["x² は ± どちらでも同じ", `${a} × ${x * x} ＝ ${ans}`],
    distractors: opts(ans, [{ val: -ans, tag: "sign-square" }, { val: a * x, tag: "square-miss" }]) };
}
function genROC() {
  const a = ri(1, 3), x1 = ri(1, 3), x2 = x1 + ri(1, 3);
  const y1 = a * x1 * x1, y2 = a * x2 * x2, ans = (y2 - y1) / (x2 - x1);
  return { q: `y ＝ ${a}x² で x が ${x1} から ${x2} まで変わるときの変化の割合は？`, ans,
    steps: [`y の増加：${y2}−${y1}＝${y2 - y1}`, `÷ x の増加（${x2 - x1}）＝ ${ans}`],
    distractors: opts(ans, [{ val: y2 - y1, tag: "roc-2pt" }, { val: a * (x2 - x1), tag: "calc" }]) };
}
function genUse() {
  const a = ri(2, 5), t = ri(2, 6), ans = a * t * t;
  return { q: `ボールが t 秒で y ＝ ${a}t² m 落ちる。${t} 秒後は何 m？`, ans,
    steps: [`t を2乗：${t}²＝${t * t}`, `${a} × ${t * t} ＝ ${ans}`],
    distractors: opts(ans, [{ val: a * t, tag: "square-miss" }, { val: a * t * t + a, tag: "calc" }]) };
}
export const CHAPTER_M3_KANSU = { id: "m3-kansu", name: "関数 y＝ax²", emoji: "📈", grade: 3, units: [
  { id: "m3ka-y", name: "y の値を求める", emoji: "🎯", haichiUnit: "g3c4u1", need: 5, gen: genY },
  { id: "m3ka-a", name: "a を求める", emoji: "🔑", haichiUnit: "g3c4u1", need: 5, gen: genA },
  { id: "m3ka-cmp", name: "正負の x と y", emoji: "🔀", haichiUnit: "g3c4u2", need: 5, gen: genCompare },
  { id: "m3ka-roc", name: "変化の割合", emoji: "📐", haichiUnit: "g3c4u3", need: 5, gen: genROC },
  { id: "m3ka-use", name: "y＝ax² の利用", emoji: "📝", haichiUnit: "g3c4u4", need: 5, gen: genUse },
] };
