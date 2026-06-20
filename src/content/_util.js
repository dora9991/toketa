// content/_util.js — 章コンテンツ共通の小道具（純関数）
export const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
export const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
export const num = (n) => (n < 0 ? `−${-n}` : `${n}`);                 // 3 / −3
export const sp = (n) => (n < 0 ? `（−${-n}）` : `（＋${n}）`);          // （＋3）/（−3）
export const spe = (n) => (n < 0 ? `−${-n}` : `＋${n}`);                // ＋3 / −3
export const term = (k, v = "x") => (k === 1 ? v : k === -1 ? `−${v}` : `${k}${v}`); // x / −x / 3x
// 一次式 ax＋b を文字列に（全角＋−）
export function lin(a, b) {
  const ax = a === 0 ? "" : term(a);
  if (b === 0) return ax || "0";
  if (!ax) return num(b);
  return ax + (b > 0 ? `＋${b}` : `−${-b}`);
}
// 正解＋誤答候補から重複なし4択（数値なら近い数=calcで補完／式は候補3つ必須）
export function opts(ans, wrongs) {
  const m = new Map(); m.set(ans, null);
  for (const w of wrongs) { if (m.size >= 4) break; if (w && !m.has(w.val)) m.set(w.val, w.tag); }
  if (typeof ans === "number") {
    let d = 1;
    while (m.size < 4) { for (const v of [ans + d, ans - d]) { if (m.size < 4 && !m.has(v)) m.set(v, "calc"); } if (++d > 14) break; }
  }
  return shuffle([...m].map(([val, tag]) => ({ val, tag })));
}
