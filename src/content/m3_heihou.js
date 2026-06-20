// 中3 第2章「平方根」
import { ri, opts, srt } from "./_util.js";
export const MISC_M3_HEIHOU = {
  "simplify-miss": { label: "√の簡単化", coach: "√の中に平方数(4,9,16…)があれば外に出すよ" },
  "root-sum": { label: "√のたし算", coach: "√の数が同じものだけ、係数をたすよ（中はそのまま）" },
  "mul-inside": { label: "√のかけ算", coach: "√a × √b ＝ √(a×b)。中どうしをかけるよ" },
  "square-root": { label: "2乗と√", coach: "(√a)² ＝ a。√の2乗は中身になるよ" },
  "calc": { label: "計算ミス", coach: "おしい！ゆっくり計算してみよう" },
};
function genPerfect() {
  const k = ri(2, 12), ans = k;
  return { q: `√${k * k} ＝ ？`, ans, steps: [`${k * k} ＝ ${k}²`, `√${k * k} ＝ ${k}`],
    distractors: opts(ans, [{ val: k * k, tag: "square-root" }, { val: k * 2, tag: "calc" }]) };
}
function genSimplify() {
  const m = [2, 3, 5, 6, 7, 10][ri(0, 5)], k = ri(2, 4), inside = k * k * m, ans = srt(k, m);
  return { q: `√${inside} を簡単にすると？`, ans, steps: [`${inside} ＝ ${k * k} × ${m} ＝ ${k}²×${m}`, `√${inside} ＝ ${k}√${m}`],
    distractors: opts(ans, [{ val: srt(1, inside), tag: "simplify-miss" }, { val: srt(k * k, m), tag: "calc" }, { val: srt(k, m * k), tag: "calc" }]) };
}
function genMul() {
  const SAFE = [[2, 3], [2, 5], [3, 5], [5, 6], [3, 7], [2, 7], [5, 7]];
  const [a, b] = SAFE[ri(0, SAFE.length - 1)], inside = a * b, ans = srt(1, inside);
  return { q: `√${a} × √${b} ＝ ？`, ans, steps: ["√a × √b ＝ √(a×b)", `√(${a}×${b}) ＝ √${inside}`],
    distractors: opts(ans, [{ val: srt(1, a + b), tag: "mul-inside" }, { val: srt(a, b), tag: "calc" }, { val: srt(1, inside + 1), tag: "calc" }]) };
}
function genAdd() {
  const m = [2, 3, 5, 7][ri(0, 3)]; let a = ri(2, 6), b = ri(1, 5); if (a * b === a + b) b++;
  const ans = srt(a + b, m);
  return { q: `${a}√${m} ＋ ${b}√${m} ＝ ？`, ans, steps: ["√の中が同じ → 係数をたす", `（${a}＋${b}）√${m} ＝ ${a + b}√${m}`],
    distractors: opts(ans, [{ val: srt(a + b, 2 * m), tag: "root-sum" }, { val: srt(a * b, m), tag: "calc" }, { val: srt(a + b, m + 1), tag: "calc" }]) };
}
function genSquare() {
  if (Math.random() < 0.5) { const a = [2, 3, 5, 6, 7, 10, 11][ri(0, 6)]; return { q: `（√${a}）² ＝ ？`, ans: a,
    steps: ["(√a)² ＝ a", `（√${a}）² ＝ ${a}`], distractors: opts(a, [{ val: a * a, tag: "square-root" }, { val: a * 2, tag: "calc" }]) }; }
  const k = ri(2, 5), m = [2, 3, 5][ri(0, 2)], ans = k * k * m;
  return { q: `（${k}√${m}）² ＝ ？`, ans, steps: ["係数を2乗、√は中身に", `${k}²×${m} ＝ ${ans}`],
    distractors: opts(ans, [{ val: k * m, tag: "square-root" }, { val: k * k, tag: "calc" }]) };
}
export const CHAPTER_M3_HEIHOU = { id: "m3-heihou", name: "平方根", emoji: "√", grade: 3, units: [
  { id: "m3he-perf", name: "√（平方数）", emoji: "🔢", haichiUnit: "g3c2u1", need: 5, gen: genPerfect },
  { id: "m3he-simp", name: "√を簡単にする", emoji: "✂️", haichiUnit: "g3c2u2", need: 5, gen: genSimplify },
  { id: "m3he-mul", name: "√のかけ算", emoji: "✖️", haichiUnit: "g3c2u3", need: 5, gen: genMul },
  { id: "m3he-add", name: "√のたし算", emoji: "➕", haichiUnit: "g3c2u4", need: 5, gen: genAdd },
  { id: "m3he-sq", name: "√の2乗", emoji: "🟦", haichiUnit: "g3c2u5", need: 5, gen: genSquare },
] };
