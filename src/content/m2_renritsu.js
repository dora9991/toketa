// 中2 第2章「連立方程式」（x の値を求める）
import { ri, num, opts } from "./_util.js";
export const MISC_M2_RENRITSU = {
  "pick-y": { label: "もう一方の値", coach: "聞かれているのは x の方だよ。y とまちがえないで" },
  "elim-sign": { label: "消去の符号", coach: "たす・ひくで文字を消す。符号に気をつけよう" },
  "calc": { label: "計算ミス", coach: "おしい！ゆっくり計算してみよう" },
};
function genElim() {
  const x = ri(1, 6), y = ri(1, 6), a = ri(2, 4), c1 = a * x + y, c2 = x + y;
  return { q: `${a}x ＋ y ＝ ${c1}、　x ＋ y ＝ ${c2}。x の値は？`, ans: x,
    steps: ["下の式を上からひくと y が消える", `${a}x − x ＝ ${c1} − ${c2}`, `${a - 1}x ＝ ${c1 - c2} → x ＝ ${x}`],
    distractors: opts(x, [{ val: y, tag: "pick-y" }, { val: c1 - c2, tag: "calc" }]) };
}
function genAddElim() {
  const x = ri(2, 8), y = ri(1, 7), s = x + y, d = x - y;
  return { q: `x ＋ y ＝ ${s}、　x − y ＝ ${num(d)}。x の値は？`, ans: x,
    steps: ["2式をたすと y が消える", `2x ＝ ${s} ＋（${num(d)}）＝ ${s + d}`, `x ＝ ${x}`],
    distractors: opts(x, [{ val: y, tag: "pick-y" }, { val: s + d, tag: "calc" }]) };
}
function genSubst() {
  const x = ri(1, 6), k = ri(1, 6), c = 3 * x + k;
  return { q: `y ＝ x ＋ ${k}、　2x ＋ y ＝ ${c}。x の値は？`, ans: x,
    steps: ["y を 2x＋y に代入する", `2x ＋（x ＋ ${k}）＝ ${c}`, `3x ＝ ${c - k} → x ＝ ${x}`],
    distractors: opts(x, [{ val: c - k, tag: "calc" }, { val: x + k, tag: "pick-y" }]) };
}
function genCoef() {
  const x = ri(1, 5), y = ri(1, 5), c1 = 2 * x + 3 * y, c2 = x + y;
  return { q: `2x ＋ 3y ＝ ${c1}、　x ＋ y ＝ ${c2}。x の値は？`, ans: x,
    steps: ["下の式を2倍して x をそろえる", `上からひくと y ＝ ${c1 - 2 * c2}`, `x ＝ ${c2} − ${y} ＝ ${x}`],
    distractors: opts(x, [{ val: y, tag: "pick-y" }, { val: c2, tag: "calc" }]) };
}
function genWord() {
  const n = ri(4, 10), kame = ri(1, n - 1), tsuru = n - kame, legs = 2 * tsuru + 4 * kame;
  return { q: `ツルとカメが合わせて ${n} 匹。足の数は ${legs} 本。カメは何匹？`, ans: kame,
    steps: [`ツル＋カメ＝${n}、　2×ツル＋4×カメ＝${legs}`, "カメ ＝（足 − 2×匹数）÷ 2", `（${legs} − ${2 * n}）÷ 2 ＝ ${kame}`],
    distractors: opts(kame, [{ val: tsuru, tag: "pick-y" }, { val: n - kame + 1, tag: "calc" }]) };
}
export const CHAPTER_M2_RENRITSU = { id: "m2-renritsu", name: "連立方程式", emoji: "⚖️", grade: 2, units: [
  { id: "m2re-elim", name: "加減法（y を消す）", emoji: "➖", haichiUnit: "g2c2u1", need: 5, gen: genElim },
  { id: "m2re-add", name: "加減法（たして消す）", emoji: "➕", haichiUnit: "g2c2u2", need: 5, gen: genAddElim },
  { id: "m2re-sub", name: "代入法", emoji: "🔁", haichiUnit: "g2c2u3", need: 5, gen: genSubst },
  { id: "m2re-coef", name: "係数をそろえる", emoji: "🎚️", haichiUnit: "g2c2u2", need: 5, gen: genCoef },
  { id: "m2re-word", name: "文章題（ツルカメ）", emoji: "📝", haichiUnit: "g2c2u2", need: 5, gen: genWord },
] };
