// ============================================================
// sync-engine.mjs — math-dialogue の「純ロジック（UI非依存）」を、とけた！へ同期する。
//  ・単一の真実は math-dialogue/src（共有元）。ここを直接編集はしない。
//  ・実行：npm run sync   → src/engine, src/data に最新をコピー（先頭に生成マーカー付与）。
//  ・閉包チェック：コピーした各.jsのローカルimportが、同期リストに全部含まれるか検査。
//    足りなければ警告するので FILES に足す（＝共有範囲を広げる手順）。
// ============================================================
import { copyFileSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve, relative, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const TOKETA = resolve(HERE, "..");
// 共有元（同じ親フォルダ「数学教材」に math-dialogue がある前提）
const SRC = resolve(TOKETA, "../math-dialogue/src");

// ── 共有する純ロジック（UI非依存）。MVP=正負・加減の依存閉包＋将来の診断系を追加していく ──
const FILES = [
  // 出題・採点コア
  "engine/rng.js",
  "engine/scoring.js",
  "engine/generator.js",
  // 問題データ
  "data/dbProblems.js",
  "data/problemBank.js",
  "data/problem_bank.json",
  "data/grade1/c1_seisu.js",
  "data/grade1/c2_moji.js",
  "data/haichiCourse.js", // 単元→葉一さんの解説動画（yt ID）の逆引き
  // ── ここから下は範囲を広げる時に有効化（診断・他単元など） ──
  // "engine/weakness.js", "engine/tagAnalysis.js", "engine/insight.js", "engine/unitMastery.js",
  // "data/index.js", "data/skills.js", "data/grade1/c2_moji.js", ...
];

const BANNER = "// ⚠️ AUTO-SYNCED from math-dialogue/src — 直接編集しないこと（npm run sync で再生成）\n";

if (!existsSync(SRC)) {
  console.error("共有元が見つかりません:", SRC, "\n（toketa と math-dialogue を同じ親フォルダに置いてください）");
  process.exit(1);
}

const copied = new Set(FILES.map((f) => normalize(f)));
for (const rel of FILES) {
  const from = join(SRC, rel);
  const to = join(TOKETA, "src", rel);
  if (!existsSync(from)) { console.error("元ファイルが無い:", from); process.exit(1); }
  mkdirSync(dirname(to), { recursive: true });
  if (rel.endsWith(".json")) copyFileSync(from, to);
  else writeFileSync(to, BANNER + readFileSync(from, "utf8"));
}

// ── 閉包チェック（コピーした.jsのローカルimport先が全部同期対象か） ──
let warnings = 0;
for (const rel of FILES) {
  if (!rel.endsWith(".js")) continue;
  const code = readFileSync(join(TOKETA, "src", rel), "utf8");
  const deps = [...code.matchAll(/from\s+["'](\.[^"']+)["']/g)].map((m) => m[1]);
  for (const d of deps) {
    const depRel = normalize(relative(join(SRC), resolve(join(SRC, dirname(rel)), d)));
    if (!copied.has(depRel)) {
      console.warn(`⚠️ 未同期の依存: ${rel} → ${d}  （FILES に "${depRel}" を追加してください）`);
      warnings++;
    }
  }
}
console.log(`✅ synced ${FILES.length} files` + (warnings ? `（要対応の依存 ${warnings} 件）` : "（閉包OK）"));
