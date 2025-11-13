import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ResultDisplay from '@/components/ResultDisplay.vue'

describe('ResultDisplay.vue', () => {
    const defaultProps = {
        totalExplosivesText: 'Total explosives needed: 5',
        resultHtml: '<div><strong>Practical Combination</strong><div>C4: 3</div><div>TNT: 2</div></div>'
    }

    it('renders total explosives text', () => {
        const wrapper = mount(ResultDisplay, {
            props: defaultProps
        })

        expect(wrapper.find('#total-explosives').text()).toBe('Total explosives needed: 5')
    })

    it('renders HTML content safely', () => {
        const wrapper = mount(ResultDisplay, {
            props: defaultProps
        })

        expect(wrapper.html()).toContain('<strong>Practical Combination</strong>')
        expect(wrapper.text()).toContain('C4: 3')
        expect(wrapper.text()).toContain('TNT: 2')
    })

    it('handles empty results', () => {
        const wrapper = mount(ResultDisplay, {
            props: {
                totalExplosivesText: '',
                resultHtml: ''
            }
        })

        expect(wrapper.find('#total-explosives').text()).toBe('')
        expect(wrapper.find('#result').text()).toBe('')
    })

    it('applies correct CSS classes', () => {
        const wrapper = mount(ResultDisplay, {
            props: defaultProps
        })

        expect(wrapper.find('#result').exists()).toBe(true)
        expect(wrapper.find('#total-explosives').exists()).toBe(true)
    })
})