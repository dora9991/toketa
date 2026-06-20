// ============================================================
// smoke-test.mjs — 同期した「共有エンジン」が、Reactなしの素のnodeで動くか確認。
//  ＝「engineはUIから切り離せている」ことの証明。npm install 不要。
//  実行：npm run smoke
//  ※ JSON import を避けるため、自己完結モジュール（c1_seisu / scoring）だけで検証する。
//    出題オーケストレータ generator.js は Vite ビルド時（アプリ実行）に検証される。
// ============================================================
import { chapter } from "../src/data/grade1/c1_seisu.js";
import { isCorrect } from "../src/engine/scoring.js";
import { startRung, downRung } from "../src/app/ladder.js";
import { choicesForAddSub, MISCONCEPTIONS } from "../src/app/distractors.js";

const r = (a, b) => a + Math.floor(Math.random() * (b - a + 1)); // build が期待する rng(min,max)

const unit = chapter.units.find((u) => u.id === "u2") || chapter.units[1]; // 加法
const tmpl = unit.problems.easy[Math.floor(Math.random() * unit.problems.easy.length)];
const prob = tmpl.build(r);

console.log("── 共有エンジン（純ロジック）の単体動作テスト ──");
console.log("単元   :", unit.name);
console.log("問題   :", prob.q);
console.log("正解   :", prob.ans);
console.log("採点OK :", isCorrect(prob.ans, prob.ans) === true && isCorrect(prob.ans + 1, prob.ans) === false);

const choices = choicesForAddSub(prob.ans);
console.log("4択    :", choices.map((c) => `${c.val}${c.tag ? `(${c.tag})` : "(正)"}`).join("  "));
const wrong = choices.find((c) => c.tag);
console.log("誤答診断:", wrong ? `${wrong.val} → ${MISCONCEPTIONS[wrong.tag]?.coach}` : "(なし)");

console.log("はしご :", "開始段(m=0.1)=", startRung(0.1), " / つまづき→", downRung(startRung(0.1)));
console.log("✅ Reactなしで 出題・採点・誤答診断・はしご が動作（engineは正しく切り出せている）");
