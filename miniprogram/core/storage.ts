import type { DecisionRecord, OptionItem } from './types';

const OPTION_LIBRARY_KEY = 'choice_helper_option_library_v1';
const DECISION_RECORDS_KEY = 'choice_helper_decision_records_v1';

export function loadOptionLibrary(): OptionItem[] {
  return readArray<OptionItem>(OPTION_LIBRARY_KEY);
}

export function saveOptionLibrary(library: OptionItem[]): void {
  wx.setStorageSync(OPTION_LIBRARY_KEY, library);
}

export function loadDecisionRecords(): DecisionRecord[] {
  return readArray<DecisionRecord>(DECISION_RECORDS_KEY);
}

export function appendDecisionRecord(record: DecisionRecord): void {
  const records = loadDecisionRecords();
  wx.setStorageSync(DECISION_RECORDS_KEY, [record, ...records].slice(0, 100));
}

function readArray<T>(key: string): T[] {
  try {
    const value = wx.getStorageSync(key);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}
