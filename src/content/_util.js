// content/_util.js — 章コンテンツ共通の小道具（純関数）
export const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
export const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
export const num = (n) => (n < 0 ? `−${-n}` : `${n}`);                 // 3 / −3
export const sp = (n) => (n < 0 ? `（−${-n}）` : `（＋${n}）`);          // （＋3）/（−3）
export const spe = (n) => (n < 0 ? `−${-n}` : `＋${n}`);                // ＋3 / −3
export const term = (k, v = "x") => (k === 1 ? v : k === -1 ? `−${v}` : `${k}${v}`); // x / −x / 3x
export const pit = (n) => (n === 0 ? "0" : n === 1 ? "π" : `${n}π`); // 円・おうぎ形の Nπ 表記
export const cf = (k, body) => (k === 1 ? body : k === -1 ? `−${body}` : `${k}${body}`); // 係数つき単項式 6ab / −b / b
// 2変数の一次式 Aa＋Bb 文字列
export function lin2(a, b) {
  const A = a === 0 ? "" : cf(a, "a");
  if (b === 0) return A || "0";
  const bb = Math.abs(b) === 1 ? "b" : `${Math.abs(b)}b`;
  return A ? `${A}${b > 0 ? "＋" : "−"}${bb}` : (b > 0 ? bb : `−${bb}`);
}
export const rt = (n) => `√${n}`; // 平方根 √n
export const srt = (a, b) => (a === 1 ? `√${b}` : `${a}√${b}`); // a√b
// 2次式 px²＋qx＋r を文字列に
export function quad(p, q, r) {
  let s = p === 1 ? "x²" : p === -1 ? "−x²" : `${p}x²`;
  if (q !== 0) s += (q > 0 ? "＋" : "−") + (Math.abs(q) === 1 ? "x" : `${Math.abs(q)}x`);
  if (r !== 0) s += (r > 0 ? "＋" : "−") + Math.abs(r);
  return s;
}
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
// 「Nπ」の4択：係数(数値)で重複なし4つを作ってから Nπ 表記に変換（数値padが効く）
export function optsPi(coef, wrongs) {
  return opts(coef, wrongs).map((o) => ({ val: pit(o.val), tag: o.tag }));
}
