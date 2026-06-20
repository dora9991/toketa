// ============================================================
// ladder.js — 「助けのはしご」の純ロジック（とけた！固有・UI非依存）。
//  中核は お手本(example) → 穴うめ(fill) → 自力(solo)。
//   ・開始段は習熟度 m(0〜1) で決める（適応）。
//   ・つまづいたら1段だけ降ろす（solo→fill→example）。一気に答えは見せない。
//   ・不変条件：最後の一手は必ず本人／必ず「自力」で終える（UI側で担保）。
// ============================================================
export const RUNGS = ["example", "fill", "solo"]; // お手本→穴うめ→自力
export const RUNG_LABEL = { example: "お手本", fill: "穴うめ", solo: "自力" };

/** 習熟度 m(0〜1) から開始段を決める */
export function startRung(m = 0) {
  if (m < 0.35) return "example";
  if (m < 0.70) return "fill";
  return "solo";
}
/** つまづいた時：1段だけやさしく */
export function downRung(rung) {
  const i = RUNGS.indexOf(rung);
  return RUNGS[Math.max(0, i - 1)];
}
/** できた時：1段むずかしく（最終は solo 止まり） */
export function upRung(rung) {
  const i = RUNGS.indexOf(rung);
  return RUNGS[Math.min(RUNGS.length - 1, i + 1)];
}
