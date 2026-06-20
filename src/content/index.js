// content/index.js — 全章をまとめる窓口。App はここから CHAPTERS / MISC を読む。
import { CHAPTER as SEISU, MISC as MISC_SEISU } from "./seisu.js";
import { CHAPTER_MOJI, MISC_MOJI } from "./moji.js";
import { CHAPTER_EQ, MISC_EQ } from "./houteishiki.js";
import { CHAPTER_HIREI, MISC_HIREI } from "./hirei.js";
import { CHAPTER_HEIMEN, MISC_HEIMEN } from "./heimen.js";
import { CHAPTER_KUKAN, MISC_KUKAN } from "./kukan.js";
import { CHAPTER_DATA, MISC_DATA } from "./data.js";

export const CHAPTERS = [SEISU, CHAPTER_MOJI, CHAPTER_EQ, CHAPTER_HIREI, CHAPTER_HEIMEN, CHAPTER_KUKAN, CHAPTER_DATA];
// つまづきタグ → ラベル/コーチ（全章ぶんを統合）
export const MISC = { ...MISC_SEISU, ...MISC_MOJI, ...MISC_EQ, ...MISC_HIREI, ...MISC_HEIMEN, ...MISC_KUKAN, ...MISC_DATA };
