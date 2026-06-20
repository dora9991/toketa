// ============================================================
// content/data.js — 「データの活用」1章（中1 第7章）。
//  平均値 → 中央値 → 最頻値 → 範囲 → 相対度数。
// ============================================================
import { ri, opts, shuffle } from "./_util.js";

export const MISC_DATA = {
  "mean-sum": { label: "平均の計算", coach: "平均 ＝ 合計 ÷ 個数 だよ" },
  "median-sort": { label: "中央値は並べ替え", coach: "小さい順に並べてから、まん中の値だよ" },
  "rep-confuse": { label: "代表値の取り違え", coach: "平均・中央値・最頻値・範囲はちがうもの。何を聞かれているか確認" },
  "calc": { label: "計算ミス", coach: "おしい！もう一度ゆっくり計算してみよう" },
};

const set = (n, lo, hi) => Array.from({ length: n }, () => ri(lo, hi));

function genMean() {
  const n = 5, arr = set(n, 2, 10);
  let sum = arr.reduce((a, b) => a + b, 0);
  arr[n - 1] += (n - (sum % n)) % n; // 合計が n で割り切れるように調整
  sum = arr.reduce((a, b) => a + b, 0);
  const ans = sum / n;
  return { q: `${arr.join("、")} の平均値は？`, ans,
    steps: [`合計：${arr.join("＋")} ＝ ${sum}`, `平均 ＝ ${sum} ÷ ${n} ＝ ${ans}`],
    distractors: opts(ans, [{ val: sum, tag: "mean-sum" }, { val: Math.max(...arr), tag: "rep-confuse" }]) };
}
function genMedian() {
  const n = 5, arr = set(n, 1, 20), sorted = [...arr].sort((a, b) => a - b), ans = sorted[2];
  return { q: `${arr.join("、")} の中央値は？`, ans,
    steps: [`小さい順に並べる：${sorted.join("、")}`, "まん中（3番目）の値が中央値"],
    distractors: opts(ans, [{ val: arr[2], tag: "median-sort" }, { val: Math.round(arr.reduce((a, b) => a + b, 0) / n), tag: "rep-confuse" }]) };
}
function genMode() {
  const m = ri(2, 9);
  let p = ri(2, 9); while (p === m) p = ri(2, 9);
  let q = ri(2, 9); while (q === m) q = ri(2, 9);
  const arr = shuffle([m, m, m, p, q]);
  return { q: `${arr.join("、")} の最頻値は？`, ans: m,
    steps: ["いちばん多く出てくる値をさがす", "それが最頻値"],
    distractors: opts(m, [{ val: Math.max(...arr), tag: "rep-confuse" }, { val: Math.min(...arr), tag: "calc" }]) };
}
function genRange() {
  const arr = set(6, 1, 30), mx = Math.max(...arr), mn = Math.min(...arr), ans = mx - mn;
  return { q: `${arr.join("、")} の範囲は？`, ans,
    steps: [`範囲 ＝ 最大 − 最小`, `${mx} − ${mn} ＝ ${ans}`],
    distractors: opts(ans, [{ val: mx, tag: "rep-confuse" }, { val: mx + mn, tag: "calc" }]) };
}
function genRel() {
  const total = [10, 20, 25, 50][ri(0, 3)];
  const f = ri(1, total / 2);
  const r2 = (v) => Math.round(v * 100) / 100;
  const ans = r2(f / total);
  return { q: `全体 ${total} 人のうち ${f} 人。相対度数は？`, ans,
    steps: ["相対度数 ＝ その度数 ÷ 合計", `${f} ÷ ${total} ＝ ${ans}`],
    distractors: opts(ans, [{ val: f, tag: "rep-confuse" }, { val: r2(ans + 0.1), tag: "calc" }, { val: r2(ans + 0.05), tag: "calc" }]) };
}

export const CHAPTER_DATA = {
  id: "data", name: "データの活用", emoji: "📊",
  units: [
    { id: "dt-mean", name: "平均値", emoji: "⚖️", haichiUnit: "d1", need: 5, gen: genMean },
    { id: "dt-median", name: "中央値", emoji: "🎯", haichiUnit: "d1", need: 5, gen: genMedian },
    { id: "dt-mode", name: "最頻値", emoji: "🏆", haichiUnit: "d1", need: 5, gen: genMode },
    { id: "dt-range", name: "範囲（最大−最小）", emoji: "📏", haichiUnit: "d1", need: 5, gen: genRange },
    { id: "dt-rel", name: "相対度数", emoji: "📊", haichiUnit: "d2", need: 5, gen: genRel },
  ],
};
