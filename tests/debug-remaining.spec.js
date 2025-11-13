// tests/debug-remaining.spec.js
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

describe('Debug - Check Component Structures', () => {
    it('debug modal dialog classes', async () => {
        const ModalDialog = await import('@/components/ModalDialog.vue')
        const wrapper = mount(ModalDialog.default, {
            props: { show: true, title: 'Test', type: 'success' }
        })

        console.log('ModalDialog classes:', wrapper.classes())
        console.log('ModalDialog HTML:', wrapper.html())
    })

    it('debug copy button behavior', async () => {
        const CopyButton = await import('@/components/CopyButton.vue')
        const wrapper = mount(CopyButton.default, {
            props: { buttonText: 'Copy', plan: 'test' }
        })

        await wrapper.find('button').trigger('click')
        console.log('CopyButton emitted:', wrapper.emitted())
    })
})