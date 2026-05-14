import {
  deleteOption,
  getSuggestions,
  markOptionChosen,
  mergePoolIntoLibrary,
  parseOptionTexts
} from '../../core/optionLibrary';
import { drawSixSymbolDecision } from '../../core/decisionEngine';
import { getTemplateById, TEMPLATES } from '../../core/templates';
import {
  addOptionToSession,
  createQuickSession,
  createSession,
  excludeCurrentResult,
  getAvailableOptions,
  removeOptionFromSession,
  resetCurrentResult,
  restoreExcludedOptions
} from '../../core/session';
import { appendDecisionRecord, loadOptionLibrary, saveOptionLibrary } from '../../core/storage';
import type { DecisionSession, OptionItem, SuggestionItem, TemplateId } from '../../core/types';

type ViewMode = 'template' | 'edit' | 'result' | 'library';
type TemplateTapEvent = WechatMiniprogram.TouchEvent<
  WechatMiniprogram.IAnyObject,
  WechatMiniprogram.IAnyObject,
  { id: TemplateId }
>;
type TextTapEvent = WechatMiniprogram.TouchEvent<
  WechatMiniprogram.IAnyObject,
  WechatMiniprogram.IAnyObject,
  { text: string }
>;
type OptionIdTapEvent = WechatMiniprogram.TouchEvent<
  WechatMiniprogram.IAnyObject,
  WechatMiniprogram.IAnyObject,
  { id: string }
>;

type RevealStage = 'flashing' | 'revealed';

interface IndexPageData {
  templates: typeof TEMPLATES;
  mode: ViewMode;
  session: DecisionSession | null;
  optionInput: string;
  optionLibrary: OptionItem[];
  libraryGroups: LibraryGroup[];
  suggestions: SuggestionItem[];
  availableCount: number;
  availableOptions: string[];
  excludedOptions: string[];
  errorMessage: string;
  revealStage: RevealStage;
  flashOptionIndex: number;
  flashSymbolIndex: number;
  showReflectionQuote: boolean;
  decisionAccepted: boolean;
  acceptanceMessage: string;
}

const FLASH_INTERVAL_MS = 55;
const FLASH_TICKS = 8;
const ACCEPTANCE_MESSAGES = [
  '相信自己的选择。',
  '一切都是最好的安排。',
  '随命运去看看下一站的风景。',
  '既来之，则安之。',
  '船到桥头自然直。',
  '心定了，路也就清楚了。',
  '答案已在风里，顺势而行。',
  '山有峰回，路有转机。',
  '今日所选，皆有来处。',
  '念起即缘，缘到即行。',
  '风来听风，雨来听雨。',
  '花开有时，行路有时。',
  '行至水穷，坐看云起。',
  '柳暗花明，自有一程。',
  '此心安处，便是方向。',
  '万事有时，不必强求。',
  '愿你所选，皆成风景。',
  '心有所向，步履不疑。',
  '顺其自然，自有答案。',
  '天光既现，便往前行。',
  '路虽未明，心已先至。',
  '择一念，赴一程。',
  '山海自有归期。',
  '命运翻页，答案成章。',
  '风会带路，心会认得。',
  '此刻即是良辰。',
  '愿此一选，皆为好缘。',
  '所遇皆有因，所行皆有路。',
  '一念既定，万象从容。',
  '心若不疑，万事可期。',
  '慢慢走，也会到。',
  '路在脚下，福在途中。',
  '云开月明，正是时候。',
  '顺风时行，逆风时等。',
  '凡心所定，皆有光照。',
  '万般皆是缘。',
  '答案落定，风景自来。',
  '心安即归处。',
  '有缘自会相逢。',
  '愿所行皆坦途。',
  '抬头见月，低头有路。',
  '风定之后，自见花开。',
  '所选之处，亦有春山。',
  '前路有光，不必回望。',
  '一程有一程的答案。',
  '此去经年，皆是序章。',
  '往前一步，天地自宽。',
  '心中有数，脚下有路。',
  '缘分到了，答案便到。',
  '命里有时，终会抵达。',
  '月有圆缺，事有安排。',
  '山不转，路会转。',
  '星河在上，脚步在前。',
  '择其所爱，爱其所择。',
  '不问归期，只看此刻。',
  '此心既定，万事从容。',
  '前方自有前方的风。',
  '风起时，正好启程。',
  '愿你与答案相安。',
  '一叶知秋，一念知心。',
  '浮云散去，青山仍在。',
  '路逢转角，便见新景。',
  '心里有光，所到皆明。',
  '今日定下，明日生花。',
  '天意不语，万物有时。',
  '此间选择，自有分寸。',
  '愿你一路有晴。',
  '行路不怕远，只怕心不定。',
  '风过有声，选择有迹。',
  '有些答案，来时自明。',
  '落子无悔，静待花开。',
  '此去山水，皆可期待。',
  '事缓则圆，心定则安。',
  '顺水行舟，水到渠成。',
  '云在天边，路在眼前。',
  '愿一切恰逢其时。',
  '春风有信，答案有期。',
  '不必回头，前方有景。',
  '心有所定，万象安然。',
  '把选择交给此刻。',
  '天地宽阔，去看一看。',
  '所念成路，所行成诗。',
  '风景不在远方，在下一步。',
  '既已选择，便是缘起。',
  '安于此刻，静候花开。',
  '此行不虚，此选不疑。',
  '月照前路，心照归途。',
  '答案已落，余下皆风景。',
  '顺心而选，随缘而行。',
  '一念花开，一路生香。',
  '山高水长，慢慢相见。',
  '今日之定，明日之因。',
  '心有归处，步有方向。',
  '去吧，风会记得路。',
  '人间万象，各有其时。',
  '万事不必尽知，往前便好。',
  '当下即是最好的签。',
  '愿你所遇，皆成答案。',
  '此刻已定，便让风继续吹。',
  '下一站，自有下一站的月光。'
];

interface LibraryGroup {
  templateId: TemplateId;
  templateName: string;
  options: OptionItem[];
}

Page<IndexPageData, WechatMiniprogram.IAnyObject>({
  data: {
    templates: TEMPLATES,
    mode: 'template',
    session: null,
    optionInput: '',
    optionLibrary: [],
    libraryGroups: [],
    suggestions: [],
    availableCount: 0,
    availableOptions: [],
    excludedOptions: [],
    errorMessage: '',
    revealStage: 'revealed',
    flashOptionIndex: 0,
    flashSymbolIndex: 0,
    showReflectionQuote: false,
    decisionAccepted: false,
    acceptanceMessage: ''
  },

  flashTimer: null as number | null,
  flashTimeout: null as number | null,

  onLoad() {
    let optionLibrary = loadOptionLibrary();
    let changed = false;
    optionLibrary = optionLibrary.filter(opt => {
      if (opt.templateId === 'custom' && ['1', '2', '3'].includes(opt.text)) {
        changed = true;
        return false;
      }
      return true;
    });
    if (changed) {
      saveOptionLibrary(optionLibrary);
    }
    this.setData({
      optionLibrary,
      libraryGroups: this.buildLibraryGroups(optionLibrary)
    });
  },

  goBack() {
    this.clearRevealAnimation();
    if (this.data.mode === 'result') {
      if (this.data.decisionAccepted || (this.data.session && this.isPlaceholderQuickSession(this.data.session))) {
        this.backToTemplates();
        return;
      }

      this.setData(
        {
          mode: 'edit',
          showReflectionQuote: false,
          decisionAccepted: false,
          acceptanceMessage: ''
        },
        () => this.refreshDerivedState()
      );
      return;
    }

    if (this.data.mode === 'edit' || this.data.mode === 'library') {
      this.backToTemplates();
    }
  },

  quickStart() {
    try {
      const session = createQuickSession('第一个念头', '第二个念头');
      this.setData(
        {
          session,
          errorMessage: '',
          showReflectionQuote: false,
          decisionAccepted: false,
          acceptanceMessage: ''
        },
        () => {
          this.refreshDerivedState();
          this.drawCurrentSession();
        }
      );
    } catch (error) {
      this.setData({
        errorMessage: error instanceof Error ? error.message : '先填两个不同选项。'
      });
    }
  },

  selectTemplate(event: TemplateTapEvent) {
    const templateId = event.currentTarget.dataset.id as TemplateId;
    const session = createSession(templateId);
    this.setData(
      {
        mode: 'edit',
        session,
        optionInput: '',
        errorMessage: '',
        showReflectionQuote: false,
        decisionAccepted: false,
        acceptanceMessage: ''
      },
      () => this.refreshDerivedState()
    );
  },

  backToTemplates() {
    this.clearRevealAnimation();
    this.setData({
      mode: 'template',
      session: null,
      optionInput: '',
      suggestions: [],
      availableCount: 0,
      availableOptions: [],
      excludedOptions: [],
      errorMessage: '',
      showReflectionQuote: false,
      decisionAccepted: false,
      acceptanceMessage: ''
    });
  },

  onOptionInput(event: WechatMiniprogram.Input) {
    this.setData({ optionInput: String(event.detail.value) });
  },

  addTypedOption() {
    const session = this.data.session;
    if (!session) return;

    const parsed = parseOptionTexts(this.data.optionInput);
    let next = session;
    for (const text of parsed) {
      next = addOptionToSession(next, text);
    }

    this.setData(
      {
        session: next,
        optionInput: '',
        errorMessage: ''
      },
      () => this.refreshDerivedState()
    );
  },

  addSuggestedOption(event: TextTapEvent) {
    const session = this.data.session;
    if (!session) return;

    const text = String(event.currentTarget.dataset.text);
    const next = addOptionToSession(session, text);
    this.setData(
      {
          session: next,
          errorMessage: ''
      },
      () => this.refreshDerivedState()
    );
  },

  removePoolOption(event: TextTapEvent) {
    const session = this.data.session;
    if (!session) return;

    const text = String(event.currentTarget.dataset.text);
    const next = removeOptionFromSession(session, text);
    this.setData({ session: next }, () => this.refreshDerivedState());
  },

  randomize() {
    const session = this.data.session;
    if (!session) return;

    if (session.pool.length === 0) {
      this.setData({ errorMessage: '先加至少一个候选项。' });
      return;
    }

    if (getAvailableOptions(session).length === 0) {
      this.setData({ errorMessage: '已经没有可抽的选项了，可以恢复已排除项或新增选项。' });
      return;
    }

    const now = Date.now();
    const library = this.isPlaceholderQuickSession(session)
      ? this.data.optionLibrary
      : mergePoolIntoLibrary(this.data.optionLibrary, session.templateId, session.pool, now);

    if (library !== this.data.optionLibrary) {
      saveOptionLibrary(library);
    }

    this.setData(
      {
        optionLibrary: library,
        libraryGroups: this.buildLibraryGroups(library),
        showReflectionQuote: false,
        decisionAccepted: false,
        acceptanceMessage: ''
      },
      () => this.drawCurrentSession()
    );
  },

  drawCurrentSession(shuffleOptions = false, showReflectionQuote = false) {
    const session = this.data.session;
    if (!session) return;

    try {
      const next = drawSixSymbolDecision(session, { shuffleOptions });
      this.clearRevealAnimation();
      this.setData(
        {
          session: next,
          mode: 'result',
          errorMessage: '',
          revealStage: 'revealed',
          flashOptionIndex: -1,
          flashSymbolIndex: -1,
          showReflectionQuote,
          decisionAccepted: false,
          acceptanceMessage: ''
        },
        () => {
          this.refreshDerivedState();
        }
      );
    } catch {
      this.clearRevealAnimation();
      if (this.isPlaceholderQuickSession(session)) {
        this.backToTemplates();
        return;
      }
      this.setData(
        {
          mode: 'edit',
          session: resetCurrentResult(session),
          errorMessage: '已经没有可速选的选项了，可以恢复已排除项或新增选项。'
        },
        () => this.refreshDerivedState()
      );
    }
  },

  startRevealAnimation() {
    // Skipping flashing animation, we directly go to 'revealed' stage.
  },

  clearRevealAnimation() {
    if (this.flashTimer !== null) {
      clearInterval(this.flashTimer);
      this.flashTimer = null;
    }
    if (this.flashTimeout !== null) {
      clearTimeout(this.flashTimeout);
      this.flashTimeout = null;
    }
  },

  onUnload() {
    this.clearRevealAnimation();
  },

  excludeResult() {
    const session = this.data.session;
    if (!session) return;

    this.clearRevealAnimation();

    if (this.isPlaceholderQuickSession(session)) {
      let next = restoreExcludedOptions(session);
      next = excludeCurrentResult({ ...next, currentResult: session.currentResult });
      this.setData(
        {
          session: next,
          errorMessage: '',
          showReflectionQuote: true,
          decisionAccepted: false,
          acceptanceMessage: ''
        },
        () => this.drawCurrentSession(true, true)
      );
      return;
    }

    const next = excludeCurrentResult(session);
    this.setData(
        {
          session: next,
          errorMessage: '',
          showReflectionQuote: true,
          decisionAccepted: false,
          acceptanceMessage: ''
        },
      () => this.drawCurrentSession(true, true)
    );
  },

  acceptResult() {
    const session = this.data.session;
    if (!session || !session.currentResult) return;

    this.clearRevealAnimation();
    const now = Date.now();
    const library = this.isPlaceholderQuickSession(session)
      ? this.data.optionLibrary
      : markOptionChosen(this.data.optionLibrary, session.templateId, session.currentResult, now);

    if (library !== this.data.optionLibrary) {
      saveOptionLibrary(library);
    }

    appendDecisionRecord({
      templateId: session.templateId,
      finalChoice: session.currentResult,
      createdAt: now
    });

    this.setData({
      optionLibrary: library,
      libraryGroups: this.buildLibraryGroups(library),
      errorMessage: '',
      revealStage: 'revealed',
      showReflectionQuote: false,
      decisionAccepted: true,
      acceptanceMessage: this.pickAcceptanceMessage(session.currentResult, now)
    });
  },

  pickAcceptanceMessage(choice: string, now: number): string {
    const entropy = Math.random() * ACCEPTANCE_MESSAGES.length + choice.length + (now % ACCEPTANCE_MESSAGES.length);
    const index = Math.floor(entropy) % ACCEPTANCE_MESSAGES.length;
    return ACCEPTANCE_MESSAGES[index];
  },

  restoreExcluded() {
    const session = this.data.session;
    if (!session) return;

    this.setData(
      {
        session: restoreExcludedOptions(session),
        errorMessage: '',
        showReflectionQuote: false,
        decisionAccepted: false,
        acceptanceMessage: ''
      },
      () => this.refreshDerivedState()
    );
  },

  openLibrary() {
    this.setData({
      mode: 'library',
      libraryGroups: this.buildLibraryGroups(this.data.optionLibrary),
      errorMessage: '',
      showReflectionQuote: false,
      decisionAccepted: false,
      acceptanceMessage: ''
    });
  },

  deleteHistoryOption(event: OptionIdTapEvent) {
    const optionId = String(event.currentTarget.dataset.id);
    const library = deleteOption(this.data.optionLibrary, optionId);
    saveOptionLibrary(library);
    this.setData(
      {
        optionLibrary: library,
        libraryGroups: this.buildLibraryGroups(library)
      },
      () => this.refreshDerivedState()
    );
  },

  isPlaceholderQuickSession(session: DecisionSession): boolean {
    return (
      session.templateId === 'custom' &&
      session.title === '极速起局' &&
      session.pool.length === 2 &&
      session.pool[0] === '第一个念头' &&
      session.pool[1] === '第二个念头'
    );
  },

  buildLibraryGroups(optionLibrary: OptionItem[]): LibraryGroup[] {
    return TEMPLATES.map((template) => ({
      templateId: template.id,
      templateName: template.name,
      options: optionLibrary.filter((option) => option.templateId === template.id)
    })).filter((group) => group.options.length > 0);
  },

  refreshDerivedState() {
    const session = this.data.session;
    if (!session) {
      this.setData({
        suggestions: [],
        availableCount: 0,
        availableOptions: [],
        excludedOptions: []
      });
      return;
    }

    const template = getTemplateById(session.templateId);
    const availableOptions = getAvailableOptions(session);
    this.setData({
      suggestions: getSuggestions(this.data.optionLibrary, template),
      availableCount: availableOptions.length,
      availableOptions,
      excludedOptions: session.excluded
    });
  }
});
