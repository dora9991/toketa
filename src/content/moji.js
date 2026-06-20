// ============================================================
// content/moji.js — 「文字式」1章（とけた！専用コンテンツ）。
//  学習順：ルール(係数) → 式の値(代入) → 同類項 → 分配法則(展開) → たし算・ひき算。
//  各問題は解き方ステップ(steps)＋誤答パターン付き4択(distractors)を持つ。
// ============================================================
import { ri, num, spe, term, lin, opts } from "./_util.js";

export const MISC_MOJI = {
  "coef-sign": { label: "係数の符号", coach: "文字の前の数を、符号もふくめて読むよ" },
  "omit-one": { label: "1の省略", coach: "1×x は x、−1×x は −x。1は書かないよ" },
  "subst-sign": { label: "代入の符号", coach: "負の数を代入したら、符号もそのまま計算しよう" },
  "mul-like": { label: "同類項をかけた", coach: "同類項は係数を「たす」よ（かけない）" },
  "drop-var": { label: "文字を落とした", coach: "文字（x）はそのまま残すよ。3a＋2a＝5a" },
  "dist-miss": { label: "分配のかけ忘れ", coach: "かっこの外の数を、中の「全部」にかけるよ" },
  "sign-flip": { label: "符号の取り違え", coach: "＋・− を逆にしていないかな？" },
  "calc": { label: "計算ミス", coach: "おしい！もう一度ゆっくり計算してみよう" },
};

// 1. ルール（表し方・係数）
function genRule() {
  const r = Math.random();
  if (r < 0.34) {
    const a = ri(2, 9);
    return { q: `x × ${a} を文字式で表すと？`, ans: `${a}x`,
      steps: ["数は文字の前に書く", "× は省く"],
      distractors: opts(`${a}x`, [{ val: `x${a}`, tag: "calc" }, { val: `${a}＋x`, tag: "calc" }, { val: `${a}`, tag: "drop-var" }]) };
  }
  if (r < 0.67) {
    const a = ri(2, 9), n = -a;
    return { q: `x ×（−${a}） を文字式にすると −${a}x。係数は？`, ans: n,
      steps: ["符号もふくめて文字の前に出す", `係数は −${a}`],
      distractors: opts(n, [{ val: a, tag: "coef-sign" }]) };
  }
  return { q: `（−1）× a を文字式にすると？`, ans: `−a`,
    steps: ["1 は省略する", "符号は残す"],
    distractors: opts(`−a`, [{ val: `−1a`, tag: "omit-one" }, { val: `a`, tag: "sign-flip" }, { val: `1a`, tag: "omit-one" }]) };
}

// 2. 式の値（代入）
function genValue() {
  let x = ri(-5, 5); if (x === 0) x = -3;
  const a = ri(2, 5); let b = ri(-6, 6);
  const ans = a * x + b;
  const tail = b > 0 ? `＋${b}` : b < 0 ? `−${-b}` : "";
  return { q: `x ＝ ${num(x)} のとき　${term(a)}${tail}　の値は？`, ans,
    steps: [`x に ${num(x)} を代入：${a}×（${num(x)}）${tail}`, `計算すると ${ans}`],
    distractors: opts(ans, [{ val: a * Math.abs(x) + b, tag: "subst-sign" }, { val: a * x - b, tag: "sign-flip" }]) };
}

// 3. 同類項をまとめる
function genLike() {
  const a = ri(2, 7), b = ri(1, 6);
  const ans = `${a + b}x`;
  return { q: `${a}x ＋ ${b}x ＝ ？`, ans,
    steps: ["同類項は、係数をたす", `${a}＋${b}＝${a + b}`],
    distractors: opts(ans, [{ val: `${a * b}x`, tag: "mul-like" }, { val: `${a + b}`, tag: "drop-var" }, { val: `${a + b}x²`, tag: "calc" }]) };
}

// 4. 分配法則（展開）
function genDist() {
  const a = ri(2, 5), b = ri(1, 6), c = (Math.random() < 0.5 ? 1 : -1) * b;
  const ans = lin(a, a * c);
  return { q: `${a}（x${c > 0 ? `＋${c}` : `−${-c}`}） を展開すると？`, ans,
    steps: ["外の数を、かっこの中の全部にかける", `${a}×x＝${a}x、　${a}×（${num(c)}）＝${a * c}`],
    distractors: opts(ans, [{ val: lin(a, c), tag: "dist-miss" }, { val: lin(1, a * c), tag: "dist-miss" }, { val: lin(a, -a * c), tag: "sign-flip" }]) };
}

// 5. 文字式のたし算・ひき算
function genCalc() {
  const a = ri(1, 5), c = ri(1, 5), b = ri(1, 8), d = ri(1, 8);
  const minus = Math.random() < 0.5;
  const X = minus ? a - c : a + c, B = minus ? b - d : b + d;
  const ans = lin(X, B);
  const wrongs = [];
  if (minus) wrongs.push({ val: lin(a - c, b + d), tag: "sign-flip" }); // −を数に分配し忘れ
  wrongs.push({ val: lin(minus ? a + c : a - c, B), tag: "calc" });
  wrongs.push({ val: lin(X, B + 1), tag: "calc" });
  wrongs.push({ val: lin(X, B - 1), tag: "calc" });
  return { q: `（${lin(a, b)}）${minus ? "−" : "＋"}（${lin(c, d)}） ＝ ？`, ans,
    steps: ["x どうし、数どうしをまとめる", `x：${a}${minus ? "−" : "＋"}${c}＝${X}、　数：${b}${minus ? "−" : "＋"}${d}＝${B}`],
    distractors: opts(ans, wrongs) };
}

export const CHAPTER_MOJI = {
  id: "moji", name: "文字式", emoji: "🔤",
  units: [
    { id: "moji-rule", name: "文字式のルール", emoji: "🔡", haichiUnit: "v1", need: 4, gen: genRule },
    { id: "moji-value", name: "式の値（代入）", emoji: "🔢", haichiUnit: "v2", need: 5, gen: genValue },
    { id: "moji-like", name: "同類項をまとめる", emoji: "🧮", haichiUnit: "v3", need: 5, gen: genLike },
    { id: "moji-dist", name: "分配法則（展開）", emoji: "📦", haichiUnit: "v4", need: 5, gen: genDist },
    { id: "moji-calc", name: "たし算・ひき算", emoji: "➕", haichiUnit: "v3", need: 6, gen: genCalc },
  ],
};
