// 中2 第4章「平行と合同」（角の計算）
import { ri, opts } from "./_util.js";
export const MISC_M2_HEIKOU = {
  "alt-angle": { label: "錯角・同位角は等しい", coach: "平行線の錯角・同位角は等しいよ" },
  "co-interior": { label: "同側内角", coach: "平行線の同じ側の内角は、たして180°だよ" },
  "angle-sum": { label: "内角・外角の関係", coach: "外角 ＝ となりにない2つの内角の和だよ" },
  "poly-formula": { label: "多角形の公式", coach: "内角の和は (n−2)×180° だよ" },
  "int-ext": { label: "内角と外角", coach: "外角の和はいつも360°。内角とまちがえないで" },
  "calc": { label: "計算ミス", coach: "おしい！ゆっくり計算してみよう" },
};
function genPar() {
  const x = ri(40, 140);
  if (Math.random() < 0.5) return { q: `平行な2直線で、${x}° の錯角の大きさは？`, ans: x,
    steps: ["平行線の錯角は等しい", `答えは ${x}°`], distractors: opts(x, [{ val: 180 - x, tag: "co-interior" }, { val: 90, tag: "calc" }]) };
  return { q: `平行線で、片方の角が ${x}°。同じ側の内角（たして180°）は？`, ans: 180 - x,
    steps: ["同側内角の和は 180°", `180 − ${x} ＝ ${180 - x}`], distractors: opts(180 - x, [{ val: x, tag: "alt-angle" }, { val: 360 - x, tag: "calc" }]) };
}
function genExt() {
  const a = ri(30, 80), b = ri(30, 80);
  return { q: `三角形の外角は、となりにない2つの内角の和。内角が ${a}° と ${b}° のとき外角は？`, ans: a + b,
    steps: ["外角 ＝ となりにない2内角の和", `${a} ＋ ${b} ＝ ${a + b}`],
    distractors: opts(a + b, [{ val: 180 - a - b, tag: "angle-sum" }, { val: Math.abs(a - b), tag: "calc" }]) };
}
function genPoly() {
  const n = ri(3, 9), ans = (n - 2) * 180;
  return { q: `${n}角形の内角の和は？`, ans, steps: ["内角の和 ＝ (n−2)×180°", `(${n}−2)×180 ＝ ${ans}`],
    distractors: opts(ans, [{ val: n * 180, tag: "poly-formula" }, { val: 360, tag: "int-ext" }]) };
}
function genReg() {
  const n = [3, 4, 5, 6, 8, 9, 10, 12][ri(0, 7)], ans = (n - 2) * 180 / n;
  return { q: `正${n}角形の1つの内角は？`, ans, steps: ["内角の和 ÷ n", `(${n}−2)×180 ÷ ${n} ＝ ${ans}`],
    distractors: opts(ans, [{ val: 360 / n, tag: "int-ext" }, { val: (n - 2) * 180, tag: "poly-formula" }]) };
}
function genExtSum() {
  const n = [3, 4, 5, 6, 8, 9, 10, 12][ri(0, 7)], ans = 360 / n;
  return { q: `正${n}角形の1つの外角は？`, ans, steps: ["外角の和は 360°", `360 ÷ ${n} ＝ ${ans}`],
    distractors: opts(ans, [{ val: (n - 2) * 180 / n, tag: "int-ext" }, { val: 360, tag: "calc" }]) };
}
export const CHAPTER_M2_HEIKOU = { id: "m2-heikou", name: "平行と合同", emoji: "📐", grade: 2, units: [
  { id: "m2he-par", name: "平行線と角（錯角・同位角）", emoji: "🔀", haichiUnit: "g2c4u1", need: 5, gen: genPar },
  { id: "m2he-ext", name: "三角形の内角と外角", emoji: "🔺", haichiUnit: "g2c4u1", need: 5, gen: genExt },
  { id: "m2he-poly", name: "多角形の内角の和", emoji: "⬡", haichiUnit: "g2c4u1", need: 5, gen: genPoly },
  { id: "m2he-reg", name: "正多角形の1つの内角", emoji: "⭐", haichiUnit: "g2c4u2", need: 5, gen: genReg },
  { id: "m2he-ext2", name: "正多角形の1つの外角", emoji: "🧭", haichiUnit: "g2c4u2", need: 5, gen: genExtSum },
] };
