import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import ShareButton from '@/components/ShareButton.vue'

describe('ShareButton.vue', () => {
    it('renders with default text when not disabled', () => {
        const wrapper = mount(ShareButton)

        expect(wrapper.text()).toContain('Share Plan')
        expect(wrapper.find('.share-icon').exists()).toBe(true)
        expect(wrapper.classes()).not.toContain('disabled')
    })

    it('renders as disabled when disabled prop is true', () => {
        const wrapper = mount(ShareButton, {
            props: {
                disabled: true
            }
        })

        expect(wrapper.classes()).toContain('disabled')
        expect(wrapper.find('button').element.disabled).toBe(true)
    })

    it('emits share-plan event when clicked and not disabled', async () => {
        const wrapper = mount(ShareButton)

        await wrapper.trigger('click')

        expect(wrapper.emitted('share-plan')).toBeTruthy()
        expect(wrapper.emitted('share-plan')).toHaveLength(1)
    })

    it('does not emit event when disabled', async () => {
        const wrapper = mount(ShareButton, {
            props: {
                disabled: true
            }
        })

        await wrapper.trigger('click')

        expect(wrapper.emitted('share-plan')).toBeFalsy()
    })

    it('accepts custom button text', () => {
        const wrapper = mount(ShareButton, {
            props: {
                buttonText: 'Share Results'
            }
        })

        expect(wrapper.text()).toContain('Share Results')
    })
})