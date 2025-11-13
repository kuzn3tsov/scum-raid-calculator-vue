// tests/unit/ThemeToggle.spec.js
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createI18n } from 'vue-i18n'
import ThemeToggle from '@/components/ThemeToggle.vue'

const i18n = createI18n({
    legacy: false,
    locale: 'en'
})

describe('ThemeToggle.vue', () => {
    let setItemSpy
    let getItemSpy

    beforeEach(() => {
        setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
        getItemSpy = vi.spyOn(Storage.prototype, 'getItem')
        document.documentElement.removeAttribute('data-theme')
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    const mountComponent = (initialTheme = 'dark') => {
        getItemSpy.mockReturnValue(initialTheme)

        return mount(ThemeToggle, {
            global: {
                plugins: [i18n],
                stubs: {
                    'font-awesome-icon': {
                        template: '<span class="theme-icon"><slot /></span>'
                    }
                }
            }
        })
    }

    it('toggles theme when clicked', async () => {
        const wrapper = mountComponent('dark')

        await wrapper.trigger('click')

        expect(wrapper.vm.isDark).toBe(false)
        expect(setItemSpy).toHaveBeenCalledWith('theme', 'light')
    })

    it('loads saved theme from localStorage on mount', () => {
        getItemSpy.mockReturnValue('light')
        const wrapper = mountComponent()

        expect(wrapper.vm.isDark).toBe(false)
    })

    it('applies theme to document element', async () => {
        const wrapper = mountComponent('dark')

        await wrapper.trigger('click')

        expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    })
})