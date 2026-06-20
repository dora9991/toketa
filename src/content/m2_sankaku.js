// 中2 第5章「三角形と四角形」（角の計算）
import { ri, opts } from "./_util.js";
export const MISC_M2_SANKAKU = {
  "iso-angle": { label: "二等辺三角形の角", coach: "底角は等しい。頂角＋底角×2＝180°だよ" },
  "para-adj": { label: "平行四辺形のとなり角", coach: "となり合う角はたして180°だよ" },
  "para-opp": { label: "平行四辺形の対角", coach: "向かい合う角（対角）は等しいよ" },
  "angle-sum": { label: "内角の和", coach: "四角形の内角の和は360°だよ" },
  "poly-formula": { label: "多角形の公式", coach: "内角の和は (n−2)×180° だよ" },
  "calc": { label: "計算ミス", coach: "おしい！ゆっくり計算してみよう" },
};
function genIso1() {
  const a = 2 * ri(15, 40), ans = (180 - a) / 2;
  return { q: `二等辺三角形の頂角が ${a}°。底角の大きさは？`, ans,
    steps: ["底角は等しい", `（180 − ${a}）÷ 2 ＝ ${ans}`], distractors: opts(ans, [{ val: 180 - a, tag: "iso-angle" }, { val: a, tag: "calc" }]) };
}
function genIso2() {
  const b = ri(30, 75), ans = 180 - 2 * b;
  return { q: `二等辺三角形の底角が ${b}°。頂角の大きさは？`, ans,
    steps: ["頂角 ＝ 180 − 底角×2", `180 − ${2 * b} ＝ ${ans}`], distractors: opts(ans, [{ val: b, tag: "iso-angle" }, { val: 90 - b > 5 ? 90 - b : b + 7, tag: "calc" }]) };
}
function genPara1() {
  const x = ri(40, 140);
  return { q: `平行四辺形で、ある角が ${x}°。その対角（向かい合う角）は？`, ans: x,
    steps: ["対角は等しい", `答えは ${x}°`], distractors: opts(x, [{ val: 180 - x, tag: "para-adj" }, { val: 90, tag: "calc" }]) };
}
function genPara2() {
  const x = ri(40, 140), ans = 180 - x;
  return { q: `平行四辺形で、ある角が ${x}°。となり合う角は？`, ans,
    steps: ["となり合う角の和は 180°", `180 − ${x} ＝ ${ans}`], distractors: opts(ans, [{ val: x, tag: "para-opp" }, { val: 360 - x, tag: "calc" }]) };
}
function genQuad() {
  const a = ri(60, 100), b = ri(60, 100), c = ri(60, 100), ans = 360 - a - b - c;
  return { q: `四角形の3つの角が ${a}°、${b}°、${c}°。残りの角は？`, ans,
    steps: ["四角形の内角の和は 360°", `360 − ${a} − ${b} − ${c} ＝ ${ans}`], distractors: opts(ans, [{ val: a + b + c, tag: "angle-sum" }, { val: 540 - a - b - c, tag: "poly-formula" }]) };
}
export const CHAPTER_M2_SANKAKU = { id: "m2-sankaku", name: "三角形と四角形", emoji: "🔺", grade: 2, units: [
  { id: "m2sa-iso1", name: "二等辺三角形（底角）", emoji: "🔺", haichiUnit: "g2c5u1", need: 5, gen: genIso1 },
  { id: "m2sa-iso2", name: "二等辺三角形（頂角）", emoji: "🔻", haichiUnit: "g2c5u1", need: 5, gen: genIso2 },
  { id: "m2sa-pa1", name: "平行四辺形（対角）", emoji: "▱", haichiUnit: "g2c5u2", need: 5, gen: genPara1 },
  { id: "m2sa-pa2", name: "平行四辺形（となり角）", emoji: "▰", haichiUnit: "g2c5u2", need: 5, gen: genPara2 },
  { id: "m2sa-quad", name: "四角形の角（和360°）", emoji: "⬛", haichiUnit: "g2c5u3", need: 5, gen: genQuad },
] };
