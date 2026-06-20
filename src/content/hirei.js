// ============================================================
// content/hirei.js — 「比例と反比例」1章（中1 第4章）。
//  比例の値 → 比例定数 → 反比例の値 → 反比例定数 → 比例の利用。
// ============================================================
import { ri, opts } from "./_util.js";

export const MISC_HIREI = {
  "prop-confuse": { label: "比例と反比例の混同", coach: "比例は y＝ax（かける）、反比例は y＝a/x（わる）だよ" },
  "div-mul": { label: "かけ算・わり算の取り違え", coach: "比例定数は y と x の関係で決まる。式をたしかめよう" },
  "calc": { label: "計算ミス", coach: "おしい！もう一度ゆっくり計算してみよう" },
};

function genPropVal() {
  const a = ri(2, 8), x = ri(2, 9), ans = a * x;
  return { q: `y＝${a}x で x＝${x} のとき y は？`, ans,
    steps: [`x に ${x} を代入：${a}×${x}`, `y ＝ ${ans}`],
    distractors: opts(ans, [{ val: a + x, tag: "prop-confuse" }, { val: a, tag: "calc" }]) };
}
function genPropA() {
  const a = ri(2, 9), x = ri(2, 6), y = a * x;
  return { q: `y は x に比例し、x＝${x} のとき y＝${y}。比例定数 a は？`, ans: a,
    steps: ["a ＝ y ÷ x", `a ＝ ${y} ÷ ${x} ＝ ${a}`],
    distractors: opts(a, [{ val: y * x, tag: "div-mul" }, { val: y - x, tag: "calc" }]) };
}
function genInvVal() {
  const x = ri(2, 6), q = ri(2, 8), a = x * q, ans = q;
  return { q: `y＝${a}/x で x＝${x} のとき y は？`, ans,
    steps: [`x に ${x} を代入：${a} ÷ ${x}`, `y ＝ ${ans}`],
    distractors: opts(ans, [{ val: a * x, tag: "prop-confuse" }, { val: a, tag: "calc" }]) };
}
function genInvA() {
  const x = ri(2, 8), y = ri(2, 8), a = x * y;
  return { q: `y は x に反比例し、x＝${x} のとき y＝${y}。比例定数 a は？`, ans: a,
    steps: ["反比例は a ＝ x × y", `a ＝ ${x} × ${y} ＝ ${a}`],
    distractors: opts(a, [{ val: x + y, tag: "div-mul" }, { val: y, tag: "prop-confuse" }]) };
}
function genUse() {
  const per = ri(2, 9), u = ri(2, 4), n = ri(5, 9), W = per * u, ans = per * n;
  return { q: `${u}m で ${W}g の針金。${n}m では何 g？`, ans,
    steps: [`1m あたり：${W}÷${u}＝${per}g`, `${n}m：${per}×${n}＝${ans}g`],
    distractors: opts(ans, [{ val: per * (n - u), tag: "prop-confuse" }, { val: W + n, tag: "calc" }]) };
}

export const CHAPTER_HIREI = {
  id: "hirei", name: "比例と反比例", emoji: "📈",
  units: [
    { id: "hirei-val", name: "比例の値（y＝ax）", emoji: "📈", haichiUnit: "h1", need: 5, gen: genPropVal },
    { id: "hirei-a", name: "比例定数を求める", emoji: "🔑", haichiUnit: "h1", need: 5, gen: genPropA },
    { id: "hirei-inv", name: "反比例の値（y＝a/x）", emoji: "📉", haichiUnit: "h2", need: 5, gen: genInvVal },
    { id: "hirei-inva", name: "反比例定数を求める", emoji: "🗝️", haichiUnit: "h2", need: 5, gen: genInvA },
    { id: "hirei-use", name: "比例の利用（文章）", emoji: "📝", haichiUnit: "h5", need: 5, gen: genUse },
  ],
};
