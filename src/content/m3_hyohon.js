// 中3 第8章「標本調査」
import { ri, opts } from "./_util.js";
export const MISC_M3_HYOHON = {
  "ratio-est": { label: "割合で推定", coach: "標本の割合が全体でも同じと考えて推定するよ" },
  "calc": { label: "計算ミス", coach: "おしい！ゆっくり計算してみよう" },
};
function genEstimate() {
  const perBag = [10, 20, 25, 50][ri(0, 3)], white = ri(1, perBag - 1);
  const total = perBag * ri(8, 20), ans = total / perBag * white;
  return { q: `${perBag}個取り出すと白が ${white}個。全部で ${total}個のとき、白はおよそ何個？`, ans,
    steps: [`標本の割合：${white}/${perBag}`, `${total} × ${white}/${perBag} ＝ ${ans}`],
    distractors: opts(ans, [{ val: total - white, tag: "ratio-est" }, { val: white * 2, tag: "calc" }]) };
}
function genFish() {
  const marked = [20, 30, 50][ri(0, 2)], caught = [10, 20, 25][ri(0, 2)];
  const found = ri(1, caught - 1), total = Math.round(marked * caught / found);
  return { q: `印をつけた魚 ${marked}匹を放流。後で ${caught}匹つかまえると印つきが ${found}匹。池の魚はおよそ何匹？`, ans: total,
    steps: ["印つきの割合は全体でも同じ", `${marked} × ${caught} ÷ ${found} ＝ 約 ${total}`],
    distractors: opts(total, [{ val: marked + caught, tag: "ratio-est" }, { val: marked * caught, tag: "calc" }]) };
}
function genRate() {
  const total = [100, 200, 500][ri(0, 2)], rate = [0.1, 0.2, 0.05, 0.04][ri(0, 3)], ans = Math.round(total * rate);
  return { q: `不良品の相対度数が ${rate} の工場。${total}個つくると不良品はおよそ何個？`, ans,
    steps: ["個数 ＝ 全体 × 相対度数", `${total} × ${rate} ＝ ${ans}`],
    distractors: opts(ans, [{ val: Math.round(total / (rate * 100)), tag: "calc" }, { val: total - ans, tag: "ratio-est" }]) };
}
export const CHAPTER_M3_HYOHON = { id: "m3-hyohon", name: "標本調査", emoji: "📊", grade: 3, units: [
  { id: "m3hy-est", name: "標本から推定（玉）", emoji: "⚪", haichiUnit: "g3c8u3", need: 5, gen: genEstimate },
  { id: "m3hy-fish", name: "標識再捕（魚）", emoji: "🐟", haichiUnit: "g3c8u3", need: 5, gen: genFish },
  { id: "m3hy-rate", name: "相対度数で推定", emoji: "📈", haichiUnit: "g3c8u3", need: 5, gen: genRate },
] };
