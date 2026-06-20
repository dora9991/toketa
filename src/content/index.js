// content/index.js — 全章をまとめる窓口（中1〜中3）。App はここから CHAPTERS / MISC を読む。
import { CHAPTER as SEISU, MISC as MISC_SEISU } from "./seisu.js";
import { CHAPTER_MOJI, MISC_MOJI } from "./moji.js";
import { CHAPTER_EQ, MISC_EQ } from "./houteishiki.js";
import { CHAPTER_HIREI, MISC_HIREI } from "./hirei.js";
import { CHAPTER_HEIMEN, MISC_HEIMEN } from "./heimen.js";
import { CHAPTER_KUKAN, MISC_KUKAN } from "./kukan.js";
import { CHAPTER_DATA, MISC_DATA } from "./data.js";
import { CHAPTER_M2_SHIKI, MISC_M2_SHIKI } from "./m2_shiki.js";
import { CHAPTER_M2_RENRITSU, MISC_M2_RENRITSU } from "./m2_renritsu.js";
import { CHAPTER_M2_KANSU, MISC_M2_KANSU } from "./m2_kansu.js";
import { CHAPTER_M2_HEIKOU, MISC_M2_HEIKOU } from "./m2_heikou.js";
import { CHAPTER_M2_SANKAKU, MISC_M2_SANKAKU } from "./m2_sankaku.js";
import { CHAPTER_M2_KAKURITSU, MISC_M2_KAKURITSU } from "./m2_kakuritsu.js";
import { CHAPTER_M3_TENKAI, MISC_M3_TENKAI } from "./m3_tenkai.js";
import { CHAPTER_M3_HEIHOU, MISC_M3_HEIHOU } from "./m3_heihou.js";
import { CHAPTER_M3_2JI, MISC_M3_2JI } from "./m3_2ji.js";
import { CHAPTER_M3_KANSU, MISC_M3_KANSU } from "./m3_kansu.js";
import { CHAPTER_M3_SOJI, MISC_M3_SOJI } from "./m3_soji.js";
import { CHAPTER_M3_EN, MISC_M3_EN } from "./m3_en.js";
import { CHAPTER_M3_SANPEI, MISC_M3_SANPEI } from "./m3_sanpei.js";
import { CHAPTER_M3_HYOHON, MISC_M3_HYOHON } from "./m3_hyohon.js";

const G1 = [SEISU, CHAPTER_MOJI, CHAPTER_EQ, CHAPTER_HIREI, CHAPTER_HEIMEN, CHAPTER_KUKAN, CHAPTER_DATA].map((c) => ({ ...c, grade: 1 }));
const G2 = [CHAPTER_M2_SHIKI, CHAPTER_M2_RENRITSU, CHAPTER_M2_KANSU, CHAPTER_M2_HEIKOU, CHAPTER_M2_SANKAKU, CHAPTER_M2_KAKURITSU];
const G3 = [CHAPTER_M3_TENKAI, CHAPTER_M3_HEIHOU, CHAPTER_M3_2JI, CHAPTER_M3_KANSU, CHAPTER_M3_SOJI, CHAPTER_M3_EN, CHAPTER_M3_SANPEI, CHAPTER_M3_HYOHON];

export const CHAPTERS = [...G1, ...G2, ...G3];
export const GRADES = [1, 2, 3];
export const MISC = {
  ...MISC_SEISU, ...MISC_MOJI, ...MISC_EQ, ...MISC_HIREI, ...MISC_HEIMEN, ...MISC_KUKAN, ...MISC_DATA,
  ...MISC_M2_SHIKI, ...MISC_M2_RENRITSU, ...MISC_M2_KANSU, ...MISC_M2_HEIKOU, ...MISC_M2_SANKAKU, ...MISC_M2_KAKURITSU,
  ...MISC_M3_TENKAI, ...MISC_M3_HEIHOU, ...MISC_M3_2JI, ...MISC_M3_KANSU, ...MISC_M3_SOJI, ...MISC_M3_EN, ...MISC_M3_SANPEI, ...MISC_M3_HYOHON,
};
