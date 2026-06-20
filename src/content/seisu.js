// ============================================================
// content/seisu.js — 「正の数・負の数」1章（とけた！専用コンテンツ）。
//  ・小単元を学習順に：大小/絶対値 → 加法 → 減法 → 乗法・除法 → 四則混合。
//  ・各問題が「解き方ステップ(steps)」と「誤答パターン付き4択(distractors)」を持つ。
//    → steps はヒント/解説に、distractors はその場の診断（つまづきの正体）に使う。
//  ・haichiUnit は葉一さんの動画の逆引き用（math-dialogue の単元IDに対応）。
// ============================================================
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
// 符号つき（かっこ付き）表記： 3→（＋3） / -3→（−3）
const sp = (n) => (n < 0 ? `（−${-n}）` : `（＋${n}）`);
// 符号つき（かっこ無し）： 3→＋3 / -3→−3
const spe = (n) => (n < 0 ? `−${-n}` : `＋${n}`);

// つまづきの正体（診断タグ → ラベルと直し方の一言）
export const MISC = {
  "abs-sign": { label: "絶対値の意味", coach: "絶対値は符号をとった「大きさ」。答えはいつも0以上だよ" },
  "sign-flip": { label: "符号の取り違え", coach: "答えの ＋・− を逆にしていないかな？" },
  "same-sub": { label: "同符号なのに引いた", coach: "同符号どうしは、絶対値を「たす」よ" },
  "diff-add": { label: "異符号なのに足した", coach: "符号がちがう時は、絶対値を「ひく」よ" },
  "sub-keep": { label: "ひき算の符号変え忘れ", coach: "ひき算は、ひく数の符号を変えて「たす」に直すよ" },
  "mul-sign": { label: "かけ算・わり算の符号", coach: "同符号→＋、異符号→−。符号を先に決めよう" },
  "order": { label: "計算の順番", coach: "×・÷ を先に、＋・− はあとで計算するよ" },
  "calc": { label: "計算ミス", coach: "おしい！もう一度ゆっくり計算してみよう" },
};

// 正解＋誤答候補から、重複なしの4択を作る（足りなければ近い数＝calcで埋める）
function four(ans, cands) {
  const m = new Map(); m.set(ans, null);
  for (const c of cands) { if (m.size >= 4) break; if (!m.has(c.val)) m.set(c.val, c.tag); }
  let d = 1;
  while (m.size < 4) { for (const v of [ans + d, ans - d]) { if (m.size < 4 && !m.has(v)) m.set(v, "calc"); } if (++d > 14) break; }
  return shuffle([...m].map(([val, tag]) => ({ val, tag })));
}

// ── 1. 大小・絶対値 ──
function genDaisho() {
  if (Math.random() < 0.6) {
    const a = ri(1, 12);
    const n = Math.random() < 0.5 ? -a : a;
    return {
      q: `${spe(n)} の絶対値は？`,
      ans: a,
      steps: ["絶対値は、0からのきょり（符号をとった「大きさ」）", `${spe(n)} の符号をとると ${a}`],
      distractors: four(a, [{ val: -a, tag: "abs-sign" }]),
    };
  }
  const a = ri(1, 9), b = ri(1, 9);
  const x = -a, y = b; // −a と ＋b
  const ans = Math.max(x, y);
  return {
    q: `${spe(x)} と ${spe(y)}、大きいのはどっち？（その数を答えよう）`,
    ans,
    steps: ["数直線では、右にある数ほど大きい", "正の数は0より大きく、負の数は0より小さい"],
    distractors: four(ans, [{ val: Math.min(x, y), tag: "sign-flip" }]),
  };
}

// ── 2. 加法 ──
function genKahou() {
  if (Math.random() < 0.5) {
    // 同符号（両方マイナス）
    const a = ri(1, 9), b = ri(1, 9);
    const ans = -(a + b);
    return {
      q: `${sp(-a)} ＋ ${sp(-b)}`,
      ans,
      steps: ["どちらも − の「同符号」", `絶対値をたす：${a}＋${b}＝${a + b}`, "符号はそのまま −"],
      distractors: four(ans, [{ val: a + b, tag: "sign-flip" }, { val: -Math.abs(a - b), tag: "same-sub" }]),
    };
  }
  // 異符号
  let a = ri(1, 9), b = ri(1, 9);
  if (a === b) b += 1;
  const ans = b - a; // (−a) ＋ (＋b)
  const D = Math.abs(b - a);
  return {
    q: `${sp(-a)} ＋ ${sp(b)}`,
    ans,
    steps: ["符号がちがう「異符号」", `絶対値の大きい方から小さい方をひく：${Math.max(a, b)}−${Math.min(a, b)}＝${D}`, `符号は絶対値の大きい方（${b > a ? "＋" : "−"}）`],
    distractors: four(ans, [{ val: -ans, tag: "sign-flip" }, { val: a + b, tag: "diff-add" }, { val: -(a + b), tag: "diff-add" }]),
  };
}

// ── 3. 減法 ──
function genGenpou() {
  const a = ri(1, 9), b = ri(1, 9);
  const ans = -a + b; // (−a) − (−b) = −a ＋ b
  return {
    q: `${sp(-a)} − ${sp(-b)}`,
    ans,
    steps: ["ひき算は、ひく数の符号を変えて「たす」に直す", `${sp(-a)} ＋ ${sp(b)} になる`, `あとは加法：${-a}＋${b}＝${ans}`],
    distractors: four(ans, [{ val: -a - b, tag: "sub-keep" }, { val: a - b, tag: "sign-flip" }]),
  };
}

// ── 4. 乗法・除法 ──
function genJokujo() {
  const sa = Math.random() < 0.5 ? -1 : 1, sb = Math.random() < 0.5 ? -1 : 1;
  const same = sa === sb;
  if (Math.random() < 0.5) {
    const a = ri(2, 9), b = ri(2, 9);
    const ans = sa * sb * a * b;
    return {
      q: `${sp(sa * a)} × ${sp(sb * b)}`,
      ans,
      steps: [`まず符号を決める：${same ? "同符号 → ＋" : "異符号 → −"}`, `絶対値をかける：${a}×${b}＝${a * b}`],
      distractors: four(ans, [{ val: -ans, tag: "mul-sign" }, { val: a * b, tag: "mul-sign" }]),
    };
  }
  const b = ri(2, 9), q = ri(2, 9), a = b * q;
  const ans = sa * sb * q;
  return {
    q: `${sp(sa * a)} ÷ ${sp(sb * b)}`,
    ans,
    steps: [`まず符号を決める：${same ? "同符号 → ＋" : "異符号 → −"}`, `絶対値をわる：${a}÷${b}＝${q}`],
    distractors: four(ans, [{ val: -ans, tag: "mul-sign" }, { val: q, tag: "mul-sign" }]),
  };
}

// ── 5. 四則混合 ──
function genShisoku() {
  const a = ri(1, 9), b = ri(2, 6), c = ri(2, 6);
  const sb = Math.random() < 0.5 ? -1 : 1;
  const prod = sb * b * c;
  const ans = -a + prod;
  const leftToRight = (-a + sb * b) * c; // 左から計算してしまう順番ミス
  return {
    q: `${sp(-a)} ＋ ${sp(sb * b)} × ${c}`,
    ans,
    steps: ["×・÷ を先に計算する", `${sp(sb * b)} × ${c} ＝ ${prod}`, `あとは加法：${-a} ＋ ${prod} ＝ ${ans}`],
    distractors: four(ans, [{ val: leftToRight, tag: "order" }, { val: -a - prod, tag: "sign-flip" }]),
  };
}

// 章（小単元を学習順に）。need = 自力で何問とけたらクリア（次の単元へ）。
// ── 6. 文章題（気温の増減） ──
function genWord() {
  const a = ri(-5, 5), d = ri(2, 9), up = Math.random() < 0.5, ans = up ? a + d : a - d;
  const sa = a < 0 ? `−${-a}` : `${a}`;
  return {
    q: `朝の気温は ${sa}℃。昼までに ${d}℃ ${up ? "上がった" : "下がった"}。昼の気温は？`,
    ans,
    steps: [`${sa} ${up ? "＋" : "−"} ${d} を計算する`, `＝ ${ans}（℃）`],
    distractors: four(ans, [{ val: up ? a - d : a + d, tag: "sign-flip" }, { val: -ans, tag: "abs-sign" }]),
  };
}

export const CHAPTER = {
  id: "seisu",
  name: "正の数・負の数",
  emoji: "🔢",
  units: [
    { id: "daisho", name: "大小・絶対値", emoji: "📏", haichiUnit: "u1", need: 4, gen: genDaisho },
    { id: "kahou", name: "加法（たし算）", emoji: "➕", haichiUnit: "u2", need: 5, gen: genKahou },
    { id: "genpou", name: "減法（ひき算）", emoji: "➖", haichiUnit: "u3", need: 5, gen: genGenpou },
    { id: "jokujo", name: "乗法・除法", emoji: "✖️", haichiUnit: "u4", need: 5, gen: genJokujo },
    { id: "shisoku", name: "四則混合", emoji: "🔀", haichiUnit: "u5", need: 6, gen: genShisoku },
    { id: "seisu-word", name: "文章題（気温）", emoji: "🌡️", haichiUnit: "u1", need: 5, gen: genWord },
  ],
};
