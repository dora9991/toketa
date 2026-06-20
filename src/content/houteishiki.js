// ============================================================
// content/houteishiki.js — 「方程式」1章（とけた！専用コンテンツ）。
//  学習順：1step(±) → 1step(×÷) → 2step → 移項(両辺に文字) → かっこ。
//  すべて x の値（数値）が答え。解き方ステップ＋誤答診断つき。
// ============================================================
import { ri, opts } from "./_util.js";

export const MISC_EQ = {
  "move-sign": { label: "移項の符号", coach: "反対側に移すときは、符号を変えるよ" },
  "wrong-op": { label: "逆の計算", coach: "たし算はひき算で、かけ算はわり算で「もどす」よ" },
  "div-both": { label: "両辺をわる", coach: "片方だけでなく、両辺を同じ数でわるよ" },
  "dist-miss": { label: "かっこの展開", coach: "かっこの外の数を、中の全部にかけるよ" },
  "calc": { label: "計算ミス", coach: "おしい！もう一度ゆっくり計算してみよう" },
};

// 1. x ± a = b
function genAdd() {
  const x = ri(2, 12), a = ri(1, 9), plus = Math.random() < 0.5;
  const b = plus ? x + a : x - a;
  return { q: plus ? `x ＋ ${a} ＝ ${b}` : `x − ${a} ＝ ${b}`, ans: x,
    steps: [plus ? `両辺から ${a} をひく` : `両辺に ${a} をたす`, `x ＝ ${b} ${plus ? "−" : "＋"} ${a} ＝ ${x}`],
    distractors: opts(x, [{ val: plus ? b + a : b - a, tag: "move-sign" }]) };
}

// 2. ax = b
function genMul() {
  const x = ri(2, 9), a = ri(2, 6), b = a * x;
  return { q: `${a}x ＝ ${b}`, ans: x,
    steps: [`両辺を ${a} でわる`, `x ＝ ${b} ÷ ${a} ＝ ${x}`],
    distractors: opts(x, [{ val: b - a, tag: "wrong-op" }, { val: b * a, tag: "wrong-op" }]) };
}

// 3. ax + b = c
function genTwo() {
  const x = ri(2, 9), a = ri(2, 5), b = ri(1, 9), c = a * x + b;
  return { q: `${a}x ＋ ${b} ＝ ${c}`, ans: x,
    steps: [`${b} を移項：${a}x ＝ ${c} − ${b} ＝ ${c - b}`, `両辺を ${a} でわる：x ＝ ${x}`],
    distractors: opts(x, [{ val: Math.round((c + b) / a), tag: "move-sign" }, { val: c - b, tag: "div-both" }]) };
}

// 4. ax = cx + d（両辺に文字）
function genMove() {
  const x = ri(2, 8), a = ri(3, 7), c = ri(1, a - 1), d = (a - c) * x;
  return { q: `${a}x ＝ ${c}x ＋ ${d}`, ans: x,
    steps: [`${c}x を移項：${a}x − ${c}x ＝ ${d}`, `${a - c}x ＝ ${d} → x ＝ ${x}`],
    distractors: opts(x, [{ val: Math.round(d / (a + c)), tag: "move-sign" }, { val: d, tag: "div-both" }]) };
}

// 5. a(x + b) = c
function genParen() {
  const x = ri(2, 7), a = ri(2, 5), b = ri(1, 6), c = a * (x + b);
  return { q: `${a}（x ＋ ${b}） ＝ ${c}`, ans: x,
    steps: [`展開：${a}x ＋ ${a * b} ＝ ${c}`, `${a * b} を移項：${a}x ＝ ${c - a * b} → x ＝ ${x}`],
    distractors: opts(x, [{ val: Math.round((c - b) / a), tag: "dist-miss" }, { val: Math.round(c / a), tag: "dist-miss" }]) };
}

// 5'. 文章題（ある数・代金）
function genWord() {
  if (Math.random() < 0.5) {
    const x = ri(2, 12), a = ri(2, 5), b = ri(1, 9), c = a * x + b;
    return { q: `ある数を ${a}倍して ${b} をたすと ${c} になった。ある数は？`, ans: x,
      steps: [`ある数を x とすると ${a}x ＋ ${b} ＝ ${c}`, `${a}x ＝ ${c - b} → x ＝ ${x}`],
      distractors: opts(x, [{ val: Math.round((c + b) / a), tag: "move-sign" }, { val: c - b, tag: "div-both" }]) };
  }
  const price = ri(80, 200), n = ri(3, 8), box = ri(50, 150), total = price * n + box;
  return { q: `1個 ${price}円のおかしを何個かと、${box}円の箱を買って ${total}円。おかしは何個？`, ans: n,
    steps: [`個数を x とすると ${price}x ＋ ${box} ＝ ${total}`, `${price}x ＝ ${total - box} → x ＝ ${n}`],
    distractors: opts(n, [{ val: Math.round(total / price), tag: "move-sign" }, { val: n + 1, tag: "div-both" }]) };
}

export const CHAPTER_EQ = {
  id: "houteishiki", name: "方程式", emoji: "⚖️",
  units: [
    { id: "eq-add", name: "1ステップ（＋−）", emoji: "➖", haichiUnit: "e1", need: 5, gen: genAdd },
    { id: "eq-mul", name: "1ステップ（×÷）", emoji: "✖️", haichiUnit: "e1", need: 5, gen: genMul },
    { id: "eq-two", name: "2ステップで解く", emoji: "🪜", haichiUnit: "e2", need: 5, gen: genTwo },
    { id: "eq-move", name: "移項（両辺に文字）", emoji: "↔️", haichiUnit: "e3", need: 5, gen: genMove },
    { id: "eq-paren", name: "かっこのある式", emoji: "📦", haichiUnit: "e2", need: 6, gen: genParen },
    { id: "eq-word", name: "文章題（ある数・代金）", emoji: "📝", haichiUnit: "e5", need: 5, gen: genWord },
  ],
};
