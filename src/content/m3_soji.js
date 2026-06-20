// 中3 第5章「相似な図形」
import { ri, opts } from "./_util.js";
export const MISC_M3_SOJI = {
  "ratio-cross": { label: "比の計算", coach: "a：b ＝ c：x なら a×x ＝ b×c（たすきがけ）だよ" },
  "area-ratio": { label: "面積比", coach: "相似比 m：n のとき、面積比は m²：n² だよ" },
  "vol-ratio": { label: "体積比", coach: "相似比 m：n のとき、体積比は m³：n³ だよ" },
  "calc": { label: "計算ミス", coach: "おしい！ゆっくり計算してみよう" },
};
function genRatio() {
  const a = ri(2, 5), c = ri(2, 6), m = ri(2, 5), b = a * m, x = c * m; // a:b = c:x
  return { q: `${a}：${b} ＝ ${c}：x のとき x は？`, ans: x,
    steps: [`${a} × x ＝ ${b} × ${c}`, `x ＝ ${b * c} ÷ ${a} ＝ ${x}`],
    distractors: opts(x, [{ val: a + c, tag: "ratio-cross" }, { val: b + c, tag: "calc" }]) };
}
function genMidline() {
  const bc = 2 * ri(3, 9), ans = bc / 2; // 中点連結定理：中点を結ぶと底辺の半分
  return { q: `三角形の2辺の中点を結んだ線分。底辺が ${bc} のとき、その長さは？`, ans,
    steps: ["中点連結定理：底辺の半分", `${bc} ÷ 2 ＝ ${ans}`],
    distractors: opts(ans, [{ val: bc, tag: "ratio-cross" }, { val: bc * 2, tag: "calc" }]) };
}
function genParallel() {
  const a = ri(2, 5), b = ri(2, 5), c = ri(2, 6), x = b * c / a;
  // AD:DB = AE:EC （平行線と線分の比）整数になるよう調整
  const A = a, B = a * 2, C = c, X = c * 2;
  return { q: `平行線で ${A}：${B} ＝ ${C}：x。x は？`, ans: X,
    steps: ["対応する線分の比は等しい", `${A}×x ＝ ${B}×${C} → x ＝ ${X}`],
    distractors: opts(X, [{ val: B + C, tag: "ratio-cross" }, { val: C * 2 + 1, tag: "calc" }]) };
}
function genArea() {
  const m = ri(2, 4), n = m + ri(1, 3), ans = n * n;
  return { q: `相似比が ${m}：${n} の2つの図形。面積比は ${m * m}：？`, ans,
    steps: ["面積比 ＝ 相似比の2乗", `${m}²：${n}² ＝ ${m * m}：${n * n}`],
    distractors: opts(ans, [{ val: n, tag: "area-ratio" }, { val: n * n * n, tag: "vol-ratio" }]) };
}
function genVol() {
  const m = ri(2, 3), n = m + ri(1, 2), ans = n * n * n;
  return { q: `相似比が ${m}：${n} の2つの立体。体積比は ${m * m * m}：？`, ans,
    steps: ["体積比 ＝ 相似比の3乗", `${m}³：${n}³ ＝ ${m * m * m}：${n * n * n}`],
    distractors: opts(ans, [{ val: n * n, tag: "vol-ratio" }, { val: n, tag: "area-ratio" }]) };
}
export const CHAPTER_M3_SOJI = { id: "m3-soji", name: "相似な図形", emoji: "📐", grade: 3, units: [
  { id: "m3so-rat", name: "比を使って長さ", emoji: "📏", haichiUnit: "g3c5u1", need: 5, gen: genRatio },
  { id: "m3so-mid", name: "中点連結定理", emoji: "🔻", haichiUnit: "g3c5u1", need: 5, gen: genMidline },
  { id: "m3so-par", name: "平行線と線分の比", emoji: "📐", haichiUnit: "g3c5u1", need: 5, gen: genParallel },
  { id: "m3so-area", name: "面積比", emoji: "🟦", haichiUnit: "g3c5u2", need: 5, gen: genArea },
  { id: "m3so-vol", name: "体積比", emoji: "🧊", haichiUnit: "g3c5u2", need: 5, gen: genVol },
] };
