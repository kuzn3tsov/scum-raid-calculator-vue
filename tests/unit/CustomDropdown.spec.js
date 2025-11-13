import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import CustomDropdown from '@/components/CustomDropdown.vue'
import { mockElementHealth } from '../utils/test-utils'

describe('CustomDropdown.vue', () => {
    const defaultProps = {
        elementHealth: mockElementHealth
    }

    it('renders dropdown with placeholder text', () => {
        const wrapper = mount(CustomDropdown, {
            props: defaultProps
        })

        expect(wrapper.find('.select-selected').text()).toContain('Select Element')
    })

    it('shows dropdown options when clicked', async () => {
        const wrapper = mount(CustomDropdown, {
            props: defaultProps
        })

        await wrapper.find('.select-selected').trigger('click')

        expect(wrapper.find('.select-items').classes()).not.toContain('select-hide')
    })

    it('renders all categories and elements', async () => {
        const wrapper = mount(CustomDropdown, {
            props: defaultProps
        })

        await wrapper.find('.select-selected').trigger('click')

        expect(wrapper.text()).toContain('Outer wall 1/4 m')
        expect(wrapper.text()).toContain('Wood')
        expect(wrapper.text()).toContain('Metal')
        expect(wrapper.text()).toContain('Base element')
    })

    it('emits option-selected event with correct data', async () => {
        const wrapper = mount(CustomDropdown, {
            props: defaultProps
        })

        await wrapper.find('.select-selected').trigger('click')

        const firstOption = wrapper.find('.dropdown-option')
        await firstOption.trigger('click')

        expect(wrapper.emitted('option-selected')).toBeTruthy()
        const emittedData = wrapper.emitted('option-selected')[0][0]

        expect(emittedData).toHaveProperty('element')
        expect(emittedData).toHaveProperty('material')
        expect(emittedData).toHaveProperty('text')
    })

    it('closes dropdown when option is selected', async () => {
        const wrapper = mount(CustomDropdown, {
            props: defaultProps
        })

        await wrapper.find('.select-selected').trigger('click')
        expect(wrapper.find('.select-items').classes()).not.toContain('select-hide')

        const firstOption = wrapper.find('.dropdown-option')
        await firstOption.trigger('click')

        expect(wrapper.find('.select-items').classes()).toContain('select-hide')
    })

    it('shows "no data" for elements without health data', async () => {
        const incompleteData = {
            "Outer wall 1/4 m": {
                "Wood": { health: 100, damage: {} }
            },
            "Unknown element": {} // No health data
        }

        const wrapper = mount(CustomDropdown, {
            props: { elementHealth: incompleteData }
        })

        await wrapper.find('.select-selected').trigger('click')

        expect(wrapper.text()).toContain('no data')
    })
})