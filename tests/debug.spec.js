// tests/debug.spec.js
import { render, screen } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import { createI18n } from 'vue-i18n'
import ScumCalculator from '@/components/ScumCalculator.vue'

// Create i18n instance for tests
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
                helpTranslate: 'Help Translate'
            }
        }
    }
})

describe('DEBUG - ScumCalculator Rendering', () => {
    it('shows what is actually rendered', async () => {
        const { container } = render(ScumCalculator, {
            global: {
                plugins: [i18n], // Add i18n plugin here
                stubs: {
                    'font-awesome-icon': { template: '<span>ICON</span>' },
                    'ThemeToggle': { template: '<div>Theme Toggle</div>' },
                    'LanguageSelector': { template: '<select><option>English</option></select>' },
                    'CustomDropdown': { template: '<div>Custom Dropdown</div>' },
                    'ExplosiveList': { template: '<div>Explosive List</div>' },
                    'ResultDisplay': { template: '<div>Result Display</div>' },
                    'CopyButton': { template: '<button>Copy Button</button>' },
                    'ShareButton': { template: '<button>Share Button</button>' },
                    'CalcAuth': { template: '<div>Auth Modal</div>' }
                }
            }
        })

        console.log('ACTUAL HTML:')
        console.log(container.innerHTML)

        // Check what text is actually available
        const allText = screen.queryAllByText(/.*/, { exact: false })
        console.log('ALL TEXT CONTENT:')
        allText.forEach(element => {
            console.log('-', element.textContent?.trim())
        })

        // Test what we can find
        expect(screen.getByText(/SCUM Raid Calculator/i)).toBeInTheDocument()
    })
})