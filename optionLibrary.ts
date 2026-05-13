import type { DecisionTemplate, OptionItem, SuggestionItem, TemplateId } from './types';

export function normalizeOptionText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

export function parseOptionTexts(text: string): string[] {
  const seen = new Set<string>();
  return text
    .split(/[\n\r,，、;；/|]+|\s{1,}/g)
    .map(normalizeOptionText)
    .filter((item) => {
      if (!item || seen.has(item)) return false;
      seen.add(item);
      return true;
    });
}

export function makeOptionId(templateId: TemplateId, text: string): string {
  return `${templateId}:${encodeURIComponent(normalizeOptionText(text))}`;
}

export function mergePoolIntoLibrary(
  library: OptionItem[],
  templateId: TemplateId,
  pool: string[],
  now: number
): OptionItem[] {
  const next = [...library];
  const seenInPool = new Set<string>();

  for (const rawText of pool) {
    const text = normalizeOptionText(rawText);
    if (!text) continue;

    const id = makeOptionId(templateId, text);
    if (seenInPool.has(id)) continue;
    seenInPool.add(id);

    const existingIndex = next.findIndex((item) => item.id === id);
    if (existingIndex >= 0) {
      const existing = next[existingIndex];
      next[existingIndex] = {
        ...existing,
        poolCount: existing.poolCount + 1,
        lastUsedAt: now
      };
    } else {
      next.push({
        id,
        templateId,
        text,
        poolCount: 1,
        chosenCount: 0,
        lastUsedAt: now,
        pinned: false
      });
    }
  }

  return sortLibrary(next);
}

export function markOptionChosen(
  library: OptionItem[],
  templateId: TemplateId,
  text: string,
  now: number
): OptionItem[] {
  const id = makeOptionId(templateId, text);
  return sortLibrary(
    library.map((item) =>
      item.id === id
        ? { ...item, chosenCount: item.chosenCount + 1, lastUsedAt: now }
        : item
    )
  );
}

export function deleteOption(library: OptionItem[], optionId: string): OptionItem[] {
  return library.filter((item) => item.id !== optionId);
}

export function getSuggestions(
  library: OptionItem[],
  template: DecisionTemplate,
  limit = 12
): SuggestionItem[] {
  const safeLimit = Math.max(0, Math.floor(limit));
  const history = sortLibrary(library)
    .filter((item) => item.templateId === template.id)
    .map<SuggestionItem>((item) => ({ text: item.text, source: 'history' }));

  const historyTexts = new Set(history.map((item) => item.text));
  const seenExamples = new Set<string>();
  const examples = template.examples
    .map(normalizeOptionText)
    .filter((text) => {
      if (!text || historyTexts.has(text) || seenExamples.has(text)) return false;
      seenExamples.add(text);
      return true;
    })
    .map<SuggestionItem>((text) => ({ text, source: 'example' }));

  return [...history, ...examples].slice(0, safeLimit);
}

function sortLibrary(library: OptionItem[]): OptionItem[] {
  return [...library].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (a.chosenCount !== b.chosenCount) return b.chosenCount - a.chosenCount;
    if (a.poolCount !== b.poolCount) return b.poolCount - a.poolCount;
    if (a.lastUsedAt !== b.lastUsedAt) return b.lastUsedAt - a.lastUsedAt;
    return a.text.localeCompare(b.text, 'zh-Hans-CN');
  });
}
