// ============================================================
// distractors.js — 誤答パターン付き4択（とけた！の診断の心臓・UI非依存）。
//  まちがいの選択肢に「つまづきの正体(tag)」を仕込み、選んだ瞬間に原因を言い当てる。
//  ※ MVPは正負の加減向けの“汎用版”（答えから機械生成）。
//    将来は問題テンプレ側に専用ディストラクタを持たせ精度を上げる（DESIGN.md §6-2-B）。
// ============================================================
export const MISCONCEPTIONS = {
  "sign-flip": { label: "符号の取り違え", coach: "符号（＋・−）を見落としたかも。もう一度たしかめよう" },
  "abs-only": { label: "符号のつけ忘れ", coach: "答えに符号もつけ忘れていないかな？" },
  "calc": { label: "計算ミス", coach: "おしい！もう一度ゆっくり計算してみよう" },
};

const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);

/** 答え(整数)から、誤答パターン付き4択を作る。返り値 [{ val, tag|null }]（tag=nullが正解） */
export function choicesForAddSub(ans) {
  const m = new Map();
  m.set(ans, null);                    // 正解
  if (!m.has(-ans)) m.set(-ans, "sign-flip");        // 符号の取り違え
  if (!m.has(Math.abs(ans))) m.set(Math.abs(ans), "abs-only"); // 絶対値だけ
  // 残りは「近い数（計算ミス）」で4択まで埋める
  let d = 1;
  while (m.size < 4) {
    for (const cand of [ans + d, ans - d]) {
      if (m.size < 4 && !m.has(cand)) m.set(cand, "calc");
    }
    if (++d > 9) break;
  }
  return shuffle([...m].map(([val, tag]) => ({ val, tag })));
}
