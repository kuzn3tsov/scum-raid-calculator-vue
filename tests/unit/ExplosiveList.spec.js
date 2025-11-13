import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import ExplosiveList from '@/components/ExplosiveList.vue'

describe('ExplosiveList.vue', () => {
    const defaultProps = {
        selectedExplosives: ['C4', 'TNT']
    }

    it('renders all explosives as checkboxes', () => {
        const wrapper = mount(ExplosiveList, {
            props: defaultProps
        })

        expect(wrapper.text()).toContain('VHS BG')
        expect(wrapper.text()).toContain('M82')
        expect(wrapper.text()).toContain('Pipe Bomb')
        expect(wrapper.text()).toContain('C4')
        expect(wrapper.text()).toContain('TNT')

        const checkboxes = wrapper.findAll('input[type="checkbox"]')
        expect(checkboxes).toHaveLength(8) // All 8 explosives
    })

    it('checks explosives that are in selectedExplosives prop', () => {
        const wrapper = mount(ExplosiveList, {
            props: defaultProps
        })

        const c4Checkbox = wrapper.find('input[value="C4"]')
        const tntCheckbox = wrapper.find('input[value="TNT"]')
        const pipeBombCheckbox = wrapper.find('input[value="PipeBomb"]')

        expect(c4Checkbox.element.checked).toBe(true)
        expect(tntCheckbox.element.checked).toBe(true)
        expect(pipeBombCheckbox.element.checked).toBe(false)
    })

    it('emits update:selectedExplosives when checkbox is checked', async () => {
        const wrapper = mount(ExplosiveList, {
            props: defaultProps
        })

        const pipeBombCheckbox = wrapper.find('input[value="PipeBomb"]')
        await pipeBombCheckbox.setChecked(true)

        expect(wrapper.emitted('update:selectedExplosives')).toBeTruthy()
        expect(wrapper.emitted('update:selectedExplosives')[0]).toEqual([
            ['C4', 'TNT', 'PipeBomb']
        ])
    })

    it('emits update:selectedExplosives when checkbox is unchecked', async () => {
        const wrapper = mount(ExplosiveList, {
            props: defaultProps
        })

        const c4Checkbox = wrapper.find('input[value="C4"]')
        await c4Checkbox.setChecked(false)

        expect(wrapper.emitted('update:selectedExplosives')[0]).toEqual([
            ['TNT']
        ])
    })

    it('emits update-result event when selection changes', async () => {
        const wrapper = mount(ExplosiveList, {
            props: defaultProps
        })

        const pipeBombCheckbox = wrapper.find('input[value="PipeBomb"]')
        await pipeBombCheckbox.setChecked(true)

        expect(wrapper.emitted('update-result')).toBeTruthy()
        expect(wrapper.emitted('update-result')[0]).toEqual([false])
    })

    it('displays translated explosive names', () => {
        const wrapper = mount(ExplosiveList)

        // Should use the mock translation from setup
        expect(wrapper.text()).toContain('VHS BG')
        expect(wrapper.text()).toContain('Pipe Bomb')
    })
})