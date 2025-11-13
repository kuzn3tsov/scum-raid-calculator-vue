import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createI18n } from 'vue-i18n'
import CopyButton from '@/components/CopyButton.vue'

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
        en: {
            app: {
                copyPlan: 'Copy Plan',
                copied: 'Copied!'
            }
        }
    }
})

describe('CopyButton.vue', () => {
    let mockClipboard

    beforeEach(() => {
        mockClipboard = {
            writeText: vi.fn(() => Promise.resolve())
        }
        Object.defineProperty(navigator, 'clipboard', {
            value: mockClipboard,
            writable: true
        })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    const mountComponent = (props = {}) => {
        return mount(CopyButton, {
            props: {
                buttonText: 'Copy Plan',
                plan: 'Test plan content',
                ...props
            },
            global: {
                plugins: [i18n],
                stubs: {
                    'font-awesome-icon': {
                        template: '<span class="mocked-font-awesome-icon"></span>'
                    }
                }
            }
        })
    }

    it('renders button with correct text', () => {
        const wrapper = mountComponent()
        const button = wrapper.find('button')
        expect(button.text()).toBe('Copy Plan')
    })

    it('has proper button attributes', () => {
        const wrapper = mountComponent()
        const button = wrapper.find('button')
        expect(button.attributes('id')).toBe('copy-btn')
        expect(button.find('.mocked-font-awesome-icon').exists()).toBe(true)
    })

    it('copies plan to clipboard when clicked', async () => {
        const wrapper = mountComponent()
        const button = wrapper.find('button')

        await button.trigger('click')

        // Check if copy event is emitted
        expect(wrapper.emitted().copy).toBeTruthy()
    })

    it('uses default text when no buttonText provided', () => {
        const wrapper = mountComponent({ buttonText: undefined })
        const button = wrapper.find('button')
        // Check for the actual default from component
        expect(button.text()).toBe('Copy')
    })
})