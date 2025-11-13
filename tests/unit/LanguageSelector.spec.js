import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import LanguageSelector from '@/components/LanguageSelector.vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
        en: { app: { title: 'Test' } },
        hr: { app: { title: 'Test HR' } }
    }
})

describe('LanguageSelector.vue', () => {
    it('renders language options', () => {
        const wrapper = mount(LanguageSelector, {
            global: {
                plugins: [i18n]
            }
        })

        expect(wrapper.find('select').exists()).toBe(true)
        expect(wrapper.find('.language-icon').exists()).toBe(true)
    })

    it('displays current locale in select', () => {
        const wrapper = mount(LanguageSelector, {
            global: {
                plugins: [i18n]
            }
        })

        const select = wrapper.find('select').element
        expect(select.value).toBe('en')
    })

    it('changes language when selection changes', async () => {
        const wrapper = mount(LanguageSelector, {
            global: {
                plugins: [i18n]
            }
        })

        const select = wrapper.find('select')
        await select.setValue('hr')

        expect(i18n.global.locale.value).toBe('hr')
    })

    it('contains all supported languages', () => {
        const wrapper = mount(LanguageSelector, {
            global: {
                plugins: [i18n]
            }
        })

        const options = wrapper.findAll('option')
        const languageCodes = options.map(opt => opt.element.value)

        expect(languageCodes).toContain('en')
        expect(languageCodes).toContain('hr')
        expect(languageCodes).toContain('ru')
        expect(languageCodes).toContain('fr')
    })
})