import type { DecisionTemplate, TemplateId } from './types';

function freezeTemplate(template: DecisionTemplate): DecisionTemplate {
  return Object.freeze({
    ...template,
    examples: Object.freeze([...template.examples])
  });
}

const TEMPLATE_DEFINITIONS: readonly DecisionTemplate[] = [
  {
    id: 'food',
    name: '吃什么',
    description: '外卖、餐厅、今天这顿饭',
    inputPlaceholder: '例如：麻辣烫',
    examples: ['火锅', '面', '轻食', '米饭', '小吃']
  },
  {
    id: 'place',
    name: '去哪玩 / 去哪吃',
    description: '周末、约会、下班后去哪',
    inputPlaceholder: '例如：附近商场',
    examples: ['公园', '电影院', '咖啡店', '商场', '夜市']
  },
  {
    id: 'buy',
    name: '买哪个',
    description: '轻消费选择，不做复杂参数打分',
    inputPlaceholder: '例如：黑色耳机',
    examples: ['便宜款', '好看款', '口碑款']
  },
  {
    id: 'priority',
    name: '先做什么',
    description: '事情太多时先动一个',
    inputPlaceholder: '例如：洗衣服',
    examples: ['收拾桌面', '回消息', '洗衣服', '出门散步']
  },
  {
    id: 'custom',
    name: '自定义',
    description: '自己输入任何低风险选择',
    inputPlaceholder: '输入一个候选项',
    examples: []
  }
];

export const TEMPLATES: readonly DecisionTemplate[] = Object.freeze(
  TEMPLATE_DEFINITIONS.map(freezeTemplate)
);

export function getTemplateById(templateId: TemplateId): DecisionTemplate {
  const template = TEMPLATES.find((item) => item.id === templateId);
  if (!template) {
    throw new Error(`Unknown template id: ${templateId}`);
  }
  return template;
}
