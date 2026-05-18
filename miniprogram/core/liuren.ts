import type { ChineseHour, SixSymbol, SixSymbolKey } from './types';

export const SIX_SYMBOLS: readonly SixSymbol[] = Object.freeze([
  Object.freeze({
    key: 'daan',
    name: '大安',
    tone: 'steady',
    hint: '稳妥，可直接收下',
    summary: '稳妥、不折腾，适合直接收下。',
    recommendedAction: 'accept'
  }),
  Object.freeze({
    key: 'liulian',
    name: '留连',
    tone: 'delay',
    hint: '容易反复，可再看看',
    summary: '容易来回想，可以再看看。',
    recommendedAction: 'reroll'
  }),
  Object.freeze({
    key: 'suxi',
    name: '速喜',
    tone: 'quick',
    hint: '适宜快快定下',
    summary: '适合快点定下，别把小事拖大。',
    recommendedAction: 'accept'
  }),
  Object.freeze({
    key: 'chikou',
    name: '赤口',
    tone: 'cautious',
    hint: '可能有摩擦，谨慎选',
    summary: '可能嘴上嫌弃，谨慎收下。',
    recommendedAction: 'avoid'
  }),
  Object.freeze({
    key: 'xiaoji',
    name: '小吉',
    tone: 'light',
    hint: '轻松可选，压力不大',
    summary: '轻松可选，不用想得太重。',
    recommendedAction: 'accept'
  }),
  Object.freeze({
    key: 'kongwang',
    name: '空亡',
    tone: 'empty',
    hint: '本轮先不优先',
    summary: '今日无缘，本轮可以先放过它。',
    recommendedAction: 'avoid'
  })
]);

const CHINESE_HOURS: readonly ChineseHour[] = Object.freeze([
  Object.freeze({ index: 1, name: '子', rangeLabel: '23:00-00:59' }),
  Object.freeze({ index: 2, name: '丑', rangeLabel: '01:00-02:59' }),
  Object.freeze({ index: 3, name: '寅', rangeLabel: '03:00-04:59' }),
  Object.freeze({ index: 4, name: '卯', rangeLabel: '05:00-06:59' }),
  Object.freeze({ index: 5, name: '辰', rangeLabel: '07:00-08:59' }),
  Object.freeze({ index: 6, name: '巳', rangeLabel: '09:00-10:59' }),
  Object.freeze({ index: 7, name: '午', rangeLabel: '11:00-12:59' }),
  Object.freeze({ index: 8, name: '未', rangeLabel: '13:00-14:59' }),
  Object.freeze({ index: 9, name: '申', rangeLabel: '15:00-16:59' }),
  Object.freeze({ index: 10, name: '酉', rangeLabel: '17:00-18:59' }),
  Object.freeze({ index: 11, name: '戌', rangeLabel: '19:00-20:59' }),
  Object.freeze({ index: 12, name: '亥', rangeLabel: '21:00-22:59' })
]);

export interface SixSymbolInput {
  readonly lunarMonth: number;
  readonly lunarDay: number;
  readonly hourIndex: number;
}

export function getChineseHour(date: Date): ChineseHour {
  const hour = date.getHours();
  const index = hour === 23 ? 1 : Math.floor((hour + 1) / 2) + 1;
  return CHINESE_HOURS[index - 1];
}

export function calculateSixSymbol(input: SixSymbolInput): SixSymbol {
  const rawIndex = input.lunarMonth + input.lunarDay + input.hourIndex - 3;
  const index = ((rawIndex % SIX_SYMBOLS.length) + SIX_SYMBOLS.length) % SIX_SYMBOLS.length;
  return SIX_SYMBOLS[index];
}

export function getSixSymbolByKey(key: SixSymbolKey): SixSymbol {
  const symbol = SIX_SYMBOLS.find((item) => item.key === key);
  if (!symbol) {
    throw new Error(`未知六象: ${key}`);
  }
  return symbol;
}
