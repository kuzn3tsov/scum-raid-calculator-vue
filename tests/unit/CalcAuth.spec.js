import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CalcAuth from '@/components/CalcAuth.vue'

describe('CalcAuth.vue', () => {
    const defaultProps = {
        showAuthModal: true
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders auth modal when showAuthModal is true', () => {
        const wrapper = mount(CalcAuth, {
            props: defaultProps
        })

        expect(wrapper.find('.auth-modal-overlay').exists()).toBe(true)
        expect(wrapper.find('.auth-modal').exists()).toBe(true)
    })

    it('does not render when showAuthModal is false', () => {
        const wrapper = mount(CalcAuth, {
            props: {
                showAuthModal: false
            }
        })

        expect(wrapper.find('.auth-modal-overlay').exists()).toBe(false)
    })

    it('closes modal when overlay is clicked', async () => {
        const wrapper = mount(CalcAuth, {
            props: defaultProps
        })

        await wrapper.find('.auth-modal-overlay').trigger('click.self')

        expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('closes modal when close button is clicked', async () => {
        const wrapper = mount(CalcAuth, {
            props: defaultProps
        })

        await wrapper.find('.close-btn').trigger('click')

        expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('authenticates with correct credentials', async () => {
        const wrapper = mount(CalcAuth, {
            props: defaultProps
        })

        await wrapper.find('#username').setValue('ScumTech')
        await wrapper.find('#password').setValue('!NoT3chNo!')
        await wrapper.find('.login-btn').trigger('click')

        expect(wrapper.emitted('authenticated')).toBeTruthy()
        expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('shows error with incorrect credentials', async () => {
        const wrapper = mount(CalcAuth, {
            props: defaultProps
        })

        await wrapper.find('#username').setValue('wrong')
        await wrapper.find('#password').setValue('wrong')
        await wrapper.find('.login-btn').trigger('click')

        expect(wrapper.emitted('authenticated')).toBeFalsy()
        expect(wrapper.find('.unauthorized-message').exists()).toBe(true)
    })

    it('shows validation errors for empty fields', async () => {
        const wrapper = mount(CalcAuth, {
            props: defaultProps
        })

        await wrapper.find('.login-btn').trigger('click')

        const usernameInput = wrapper.find('#username')
        const passwordInput = wrapper.find('#password')

        expect(usernameInput.classes()).toContain('error')
        expect(passwordInput.classes()).toContain('error')
    })

    it('clears form and resets state when modal closes', async () => {
        const wrapper = mount(CalcAuth, {
            props: defaultProps
        })

        await wrapper.find('#username').setValue('test')
        await wrapper.find('#password').setValue('test')

        // Close modal
        await wrapper.setProps({ showAuthModal: false })
        await wrapper.setProps({ showAuthModal: true })

        expect(wrapper.find('#username').element.value).toBe('')
        expect(wrapper.find('#password').element.value).toBe('')
        expect(wrapper.vm.unauthorized).toBe(false)
    })

    it('auto-closes after unauthorized attempt', async () => {
        vi.useFakeTimers()

        const wrapper = mount(CalcAuth, {
            props: defaultProps
        })

        await wrapper.find('#username').setValue('wrong')
        await wrapper.find('#password').setValue('wrong')
        await wrapper.find('.login-btn').trigger('click')

        expect(wrapper.vm.autoCloseTimer).toBeDefined()

        // Fast-forward timers
        vi.runAllTimers()

        expect(wrapper.emitted('close')).toBeTruthy()

        vi.useRealTimers()
    })
})