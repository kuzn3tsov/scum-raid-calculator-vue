import { config } from '@vue/test-utils'
import { expect, vi, beforeEach } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'
import { createI18n } from 'vue-i18n'

// Extend Vitest with Testing Library matchers
expect.extend(matchers)

// Mock for FontAwesome
const FontAwesomeIcon = {
    name: 'FontAwesomeIcon',
    template: '<span class="mocked-font-awesome-icon"><slot /></span>',
    props: ['icon', 'size', 'spin', 'pulse', 'border', 'fixedWidth', 'rotation', 'flip', 'transform']
}
// Create a global i18n instance for tests
const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
        en: {
            app: {
                title: 'SCUM Raid Calculator',
                chooseExplosives: 'Choose Explosives',
                selectElement: 'Select Element',
                copyPlan: 'Copy Plan',
                sharePlan: 'Share Plan',
                helpTranslate: 'Help Translate',
                copied: 'Copied!',
                shared: 'Shared!'
            },
            explosives: {
                C4: 'C4',
                TNT: 'TNT',
                PipeBomb: 'Pipe Bomb',
                VHS_BG: 'VHS BG',
                M82: 'M82',
                AT4_HEAT: 'AT4 HEAT',
                Frag: 'Frag Grenade',
                RPG7: 'RPG7'
            },
            damageConfig: {
                title: 'Damage Configuration',
                backToCalculator: 'Back to Calculator',
                expandAll: 'Expand All',
                collapseAll: 'Collapse All'
            },
            translationGui: {
                title: 'Translation Editor',
                backToCalculator: 'Back to Calculator',
                export: 'Export',
                submit: 'Submit'
            },
            auth: {
                title: 'Authentication Required'
            }
        }
    }
})

// Enhanced i18n mock with better key coverage
const i18nMock = {
    global: {
        locale: 'en',
        availableLocales: ['en', 'hr', 'ru', 'fr', 'it', 'de', 'es', 'zh', 'ko', 'nl', 'sv', 'sl'],
        t: (key) => {
            const mockTranslations = {
                'app.title': 'SCUM Raid Calculator',
                'app.copyPlan': 'Copy Plan',
                'app.copied': 'Copied!',
                'app.sharePlan': 'Share Plan',
                'app.shared': 'Shared!',
                'app.helpTranslate': 'Help Translate',
                'app.translationNote': 'Translation corrections:',
                'app.chooseExplosives': 'Choose Explosives',
                'app.selectElement': 'Select Element',
                'app.noData': 'no data',
                'explosives.C4': 'C4',
                'explosives.TNT': 'TNT',
                'explosives.PipeBomb': 'Pipe Bomb',
                'explosives.VHS_BG': 'VHS BG',
                'explosives.M82': 'M82',
                'explosives.AT4_HEAT': 'AT4 HEAT',
                'explosives.Frag': 'Frag Grenade',
                'explosives.RPG7': 'RPG7',
                'damageConfig.title': 'Damage Configuration',
                'damageConfig.backToCalculator': 'Back to Calculator',
                'damageConfig.expandAll': 'Expand All',
                'damageConfig.collapseAll': 'Collapse All',
                'translationGui.title': 'Translation Editor',
                'translationGui.backToCalculator': 'Back to Calculator',
                'auth.title': 'Authentication Required',
                'categories.outerWalls': 'Outer Walls',
                'categories.baseElements': 'Base Elements',
                'categories.doors': 'Doors',
                'categories.hatches': 'Hatches',
                'categories.others': 'Others',
                'elements.Outer wall 1/4 m': 'Outer wall 1/4 m',
                'elements.Outer wall 1/2 m': 'Outer wall 1/2 m',
                'elements.Outer wall 1 m': 'Outer wall 1 m',
                'elements.Outer wall 2 m': 'Outer wall 2 m',
                'elements.Outer wall 3 m': 'Outer wall 3 m',
                'elements.Outer wall 4 m': 'Outer wall 4 m',
                'elements.Outer wall 5 m': 'Outer wall 5 m',
                'elements.Outer wall door (any)': 'Outer wall door (any)',
                'elements.Base element': 'Base element',
                'elements.Base element door (single/double)': 'Base element door (single/double)',
                'elements.Base element hatch door': 'Base element hatch door',
                'elements.Standalone BarbedWire': 'Standalone BarbedWire',
                'materials.Wood': 'Wood',
                'materials.Metal': 'Metal',
                'materials.Brick': 'Brick'
            }
            return mockTranslations[key] || key
        }
    },
    install: vi.fn()
}

// Global mocks for browser APIs
global.CSS = {
    supports: () => false,
    escape: (str) => String(str)
}

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}))

// Mock matchMedia
global.matchMedia = vi.fn((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
}))

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
global.URL.revokeObjectURL = vi.fn()

// Mock window.scrollTo
global.window.scrollTo = vi.fn()

// Mock Element.prototype.scrollIntoView
Element.prototype.scrollIntoView = vi.fn()

// Mock console.error to reduce noise during tests
global.console.error = vi.fn()
global.console.warn = vi.fn()

// Vue Test Utils configuration for Vue 3
config.global.mocks = {
    $t: i18nMock.global.t,
    $i18n: i18nMock.global
}

// Update stubs to render text content properly
config.global.stubs = {
    'font-awesome-icon': FontAwesomeIcon,
    'ThemeToggle': {
        template: '<div class="mocked-theme-toggle"><span>Theme Toggle</span></div>',
        props: ['modelValue'],
        emits: ['update:modelValue']
    },
    'LanguageSelector': {
        template: '<div class="mocked-language-selector"><select><option value="en">English</option></select></div>',
        props: ['modelValue'],
        emits: ['update:modelValue']
    },
    'CustomDropdown': {
        template: '<div class="mocked-custom-dropdown"><span>Select Element</span></div>',
        props: ['elementHealth', 'modelValue'],
        emits: ['update:modelValue']
    },
    'ExplosiveList': {
        template: '<div class="mocked-explosive-list"><span>Choose Explosives</span></div>',
        props: ['modelValue'],
        emits: ['update:modelValue']
    },
    'ResultDisplay': {
        template: '<div class="mocked-result-display"><span>Result Display</span></div>',
        props: ['result', 'selectedElement']
    },
    'CopyButton': {
        template: '<button class="mocked-copy-button"><span>Copy Plan</span></button>',
        props: ['buttonText', 'plan'],
        emits: ['copy']
    },
    'ShareButton': {
        template: '<button class="mocked-share-button"><span>Share Plan</span></button>',
        props: ['buttonText', 'plan', 'disabled'],
        emits: ['share']
    },
    'CalcAuth': {
        template: '<div class="mocked-calc-auth"><span>Auth Modal</span></div>',
        props: ['showAuthModal'],
        emits: ['close', 'authenticated']
    },
    'ModalDialog': {
        template: '<div class="mocked-modal-dialog"><slot /></div>',
        props: ['show', 'title', 'type', 'size']
    },
    'DamageConfig': {
        template: '<div class="mocked-damage-config"><span>Damage Config</span></div>',
        emits: ['close']
    },
    'CalcTranslator': {
        template: '<div class="mocked-calc-translator"><span>Translator</span></div>',
        emits: ['close']
    }
}

config.global.plugins = [i18n]

config.global.components = {
    'font-awesome-icon': FontAwesomeIcon
}

// Enhanced localStorage mock with actual storage simulation
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => {
            store[key] = String(value);
        }),
        removeItem: vi.fn((key) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
        length: 0,
        key: vi.fn((index) => Object.keys(store)[index] || null),
    };
})();

global.localStorage = localStorageMock;

// Mock sessionStorage
global.sessionStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
}

// Mock navigator.clipboard
Object.defineProperty(global.navigator, 'clipboard', {
    value: {
        writeText: vi.fn(() => Promise.resolve()),
        readText: vi.fn(() => Promise.resolve('')),
    },
    writable: true
})

// Mock navigator.share
Object.defineProperty(global.navigator, 'share', {
    value: vi.fn(() => Promise.resolve()),
    writable: true
})

// Mock window.alert
global.alert = vi.fn()

// Mock window.confirm
global.confirm = vi.fn(() => true)

// Reset all mocks before each test
beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()

    // Reset i18n mock
    i18nMock.global.locale = 'en'

    // Reset all mocks
    global.URL.createObjectURL.mockClear()
    global.URL.revokeObjectURL.mockClear()
    global.window.scrollTo.mockClear()
    Element.prototype.scrollIntoView.mockClear()
    global.alert.mockClear()
    global.confirm.mockImplementation(() => true)

    // Reset DOM
    document.body.innerHTML = ''
    document.head.innerHTML = ''

    // Reset theme
    document.documentElement.removeAttribute('data-theme')
})