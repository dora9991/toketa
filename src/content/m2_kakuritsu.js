// 中2 第6章「確率」（分数で答える）
import { ri, shuffle, opts } from "./_util.js";
export const MISC_M2_KAKURITSU = {
  "prob-count": { label: "場合の数の数え方", coach: "（あてはまる場合）÷（全部の場合）。数え方を確認しよう" },
  "prob-comp": { label: "反対の事がら", coach: "聞かれている方を数えよう（赤か白かなど）" },
  "calc": { label: "計算ミス", coach: "おしい！ゆっくり計算してみよう" },
};
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const frac = (p, q) => { const g = gcd(p, q) || 1, P = p / g, Q = q / g; return Q === 1 ? `${P}` : `${P}/${Q}`; };
function probQ(q, c, T, steps, tag = "prob-count") {
  const ansStr = frac(c, T), pool = [];
  for (let k = 1; k < T; k++) { const s = frac(k, T); if (s !== ansStr && !pool.includes(s)) pool.push(s); }
  const wrongs = shuffle(pool).slice(0, 3).map((v) => ({ val: v, tag }));
  return { q, ans: ansStr, steps, distractors: opts(ansStr, wrongs) };
}
function genDice1() {
  const ev = [["偶数の目", 3], ["奇数の目", 3], ["3の倍数", 2], ["4以上の目", 3], ["5以上の目", 2]][ri(0, 4)];
  return probQ(`1個のさいころを投げる。${ev[0]}が出る確率は？`, ev[1], 6, ["（あてはまる目の数）÷ 6", `${ev[1]} ÷ 6 ＝ 約分`]);
}
function genDice2() {
  const ev = [["2以下", 2], ["素数（2,3,5）", 3], ["6の約数", 4], ["1の目", 1]][ri(0, 3)];
  return probQ(`1個のさいころで ${ev[0]} が出る確率は？`, ev[1], 6, ["あてはまる目を数える", `${ev[1]} ÷ 6 ＝ 約分`]);
}
function genCoin() {
  const ev = [["3枚とも表", 1], ["2枚が表", 3], ["少なくとも1枚は表", 7]][ri(0, 2)];
  return probQ(`コインを3枚投げる。${ev[0]}になる確率は？（全部で8通り）`, ev[1], 8, ["あてはまる場合 ÷ 8通り", `${ev[1]} ÷ 8 ＝ 約分`]);
}
function genCard() {
  const ev = [["偶数", 5], ["3の倍数", 3], ["1ケタ（1〜9）", 9], ["7以上", 4]][ri(0, 3)];
  return probQ(`1〜10 のカードから1枚ひく。${ev[0]}の確率は？`, ev[1], 10, ["あてはまる枚数 ÷ 10", `${ev[1]} ÷ 10 ＝ 約分`]);
}
function genBall() {
  const red = ri(1, 4), white = 5 - red;
  return probQ(`赤玉 ${red}個、白玉 ${white}個が入った袋から1個ひく。赤玉の確率は？`, red, 5, ["赤玉 ÷ 全部", `${red} ÷ 5 ＝ 約分`], "prob-comp");
}
export const CHAPTER_M2_KAKURITSU = { id: "m2-kakuritsu", name: "確率", emoji: "🎲", grade: 2, units: [
  { id: "m2kk-d1", name: "さいころの確率", emoji: "🎲", haichiUnit: "g2c6u2", need: 5, gen: genDice1 },
  { id: "m2kk-d2", name: "さいころ（倍数・約数）", emoji: "🎰", haichiUnit: "g2c6u2", need: 5, gen: genDice2 },
  { id: "m2kk-coin", name: "コイン3枚", emoji: "🪙", haichiUnit: "g2c6u3", need: 5, gen: genCoin },
  { id: "m2kk-card", name: "カードの確率", emoji: "🃏", haichiUnit: "g2c6u3", need: 5, gen: genCard },
  { id: "m2kk-ball", name: "玉を取り出す", emoji: "🔴", haichiUnit: "g2c6u3", need: 5, gen: genBall },
] };
