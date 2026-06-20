// content/index.js — 全章をまとめる窓口。App はここから CHAPTERS / MISC を読む。
import { CHAPTER as SEISU, MISC as MISC_SEISU } from "./seisu.js";
import { CHAPTER_MOJI, MISC_MOJI } from "./moji.js";
import { CHAPTER_EQ, MISC_EQ } from "./houteishiki.js";

export const CHAPTERS = [SEISU, CHAPTER_MOJI, CHAPTER_EQ];
// つまづきタグ → ラベル/コーチ（全章ぶんを統合）
export const MISC = { ...MISC_SEISU, ...MISC_MOJI, ...MISC_EQ };
