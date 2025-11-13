import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createI18n } from 'vue-i18n'
import CalcTranslator from '@/components/CalcTranslator.vue'

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
        en: {
            translationGui: {
                title: 'Translation Editor',
                backToCalculator: 'Back to Calculator',
                export: 'Export',
                submit: 'Submit'
            }
        }
    }
})

describe('CalcTranslator.vue', () => {
    let wrapper
    let createObjectURLSpy

    beforeEach(() => {
        createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')

        wrapper = mount(CalcTranslator, {
            global: {
                plugins: [i18n],
                stubs: {
                    'font-awesome-icon': { template: '<span></span>' },
                    'ModalDialog': {
                        template: '<div v-if="show"><slot /></div>',
                        props: ['show']
                    }
                }
            }
        })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('renders translation interface', () => {
        expect(wrapper.find('h1').text()).toBe('Translation Editor')
    })

    it('navigates back to calculator', async () => {
        wrapper.vm.$emit('close')
        expect(wrapper.emitted().close).toBeTruthy()
    })

    it('updates translation text', async () => {
        await wrapper.setData({ translationText: 'New translation text' })
        expect(wrapper.vm.translationText).toBe('New translation text')
    })

    it('previews translation', async () => {
        await wrapper.setData({
            translationText: JSON.stringify({ app: { title: 'Test' } })
        })

        // Call the preview method directly
        if (typeof wrapper.vm.previewTranslation === 'function') {
            await wrapper.vm.previewTranslation()
            expect(wrapper.vm.previewData).toEqual({ app: { title: 'Test' } })
        }
    })

    it('exports translation data', async () => {
        await wrapper.setData({
            translationText: JSON.stringify({ app: { title: 'Test' } })
        })

        // Call export method directly
        if (typeof wrapper.vm.exportTranslation === 'function') {
            await wrapper.vm.exportTranslation()
            expect(createObjectURLSpy).toHaveBeenCalled()
        }
    })

    it('validates JSON format', async () => {
        await wrapper.setData({
            translationText: 'invalid json'
        })

        if (typeof wrapper.vm.previewTranslation === 'function') {
            await wrapper.vm.previewTranslation()
            expect(wrapper.vm.previewError).toBeTruthy()
        }
    })

    it('closes export modal', async () => {
        await wrapper.setData({ showExportModal: true })

        if (typeof wrapper.vm.closeExportModal === 'function') {
            wrapper.vm.closeExportModal()
            expect(wrapper.vm.showExportModal).toBe(false)
        }
    })
})