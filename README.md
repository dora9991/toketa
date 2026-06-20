# とけた！（MVP 雛形）

数学ぎらいの中学生向け。**つまづき解決と「わかった！」に全振り**した学習アプリ。
math-dialogue とは別アプリだが、**問題生成・採点などの純ロジックは共有エンジンとして流用**する。

> 設計の全体像は `../toketa/DESIGN.md`（PR-FAQ＋全画面遷移＋データ仕様）を参照。

## フォルダ構成
```
toketa/
├─ scripts/
│  ├─ sync-engine.mjs   共有元(math-dialogue/src)から純ロジックを同期
│  └─ smoke-test.mjs    Reactなしで engine が動くか検証（npm不要）
├─ src/
│  ├─ engine/  ← 【生成】math-dialogueから同期（直接編集しない）
│  ├─ data/    ← 【生成】同上（問題バンク・c1_seisu 等）
│  ├─ app/     ← とけた！固有の純ロジック
│  │  ├─ ladder.js       助けのはしご（お手本→穴うめ→自力／適応）
│  │  └─ distractors.js  誤答パターン付き4択（つまづき診断）
│  ├─ App.jsx  コア体験ループ（正負・加減のMVP）
│  └─ main.jsx
└─ index.html
```

## エンジン共有の方針（重要）
- **単一の真実は `math-dialogue/src`**。`src/engine` と `src/data` は **生成物**（先頭に AUTO-SYNCED マーカー）。直接編集しない。
- 共有対象を増やす時は `scripts/sync-engine.mjs` の `FILES` に足して `npm run sync`。
  実行時に**依存の閉包チェック**が走り、足りない依存を警告する。
- とけた！固有のロジックは `src/app/` に置く（共有しない）。
- 前提：`toketa` と `math-dialogue` を**同じ親フォルダ**（数学教材/）に置く。
- 将来、両アプリが安定したら `src/engine`/`src/data` を npm workspace の共有パッケージ（例 `@toketa/engine`）へ昇格する（手順は DESIGN.md）。

## 使い方
```bash
npm install            # 初回のみ（react / vite）
npm run sync           # 共有エンジンを math-dialogue から取り込む（src/engine, src/data 生成）
npm run smoke          # Reactなしで engine の動作確認（install不要・最初の検証に便利）
npm run dev            # 開発サーバ
npm run build          # 本番ビルド（dist）
```

## MVP の現状
- 正負の数（加減）で **出題→4択→つまづき診断→助け（ヒント段階表示）→自力でとけた→ほめ→次** が一周する。
- 助けの“お手本/穴うめ”は当面 c1 の h1/h2 を流用。将来 `workedSteps`（穴うめ用ステップ）と
  テンプレ専用 distractor に置き換えて精度を上げる（DESIGN.md §6, §9）。
