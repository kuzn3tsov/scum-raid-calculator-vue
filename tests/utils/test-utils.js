import { render } from '@testing-library/vue'
import { createI18n } from 'vue-i18n'

// Mock translations
const mockTranslations = {
    app: {
        title: 'SCUM Raid Calculator',
        chooseExplosives: 'Choose Explosives',
        selectElement: 'Select Element',
        copyPlan: 'Copy Plan',
        copied: 'Copied!',
        sharePlan: 'Share Plan',
        shared: 'Shared!',
        helpTranslate: 'Help Translate',
        translationNote: 'Translation corrections:'
    },
    explosives: {
        VHS_BG: 'VHS BG',
        M82: 'M82',
        PipeBomb: 'Pipe Bomb',
        AT4_HEAT: 'AT4 HEAT',
        Frag: 'Frag Grenade',
        TNT: 'TNT',
        RPG7: 'RPG7',
        C4: 'C4'
    },
    auth: {
        title: 'Authentication Required',
        usernameLabel: 'Username',
        passwordLabel: 'Password',
        loginButton: 'Login'
    }
}

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: { en: mockTranslations }
})

// Custom render function with common providers
export function renderWithProviders(component, options = {}) {
    return render(component, {
        global: {
            plugins: [i18n],
            stubs: {
                'font-awesome-icon': true
            }
        },
        ...options
    })
}

// Mock element health data for tests
export const mockElementHealth = {
    "Outer wall 1/4 m": {
        "Wood": {
            health: 100,
            damage: {
                "C4": 50,
                "TNT": 25,
                "PipeBomb": 15
            }
        },
        "Metal": {
            health: 200,
            damage: {
                "C4": 100,
                "TNT": 50
            }
        }
    },
    "Base element": {
        "Wood": {
            health: 150,
            damage: {
                "C4": 75,
                "TNT": 35
            }
        }
    }
}

// Mock for clipboard
export const mockClipboard = () => {
    const writeText = vi.fn(() => Promise.resolve())
    Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        writable: true
    })
    return writeText
}