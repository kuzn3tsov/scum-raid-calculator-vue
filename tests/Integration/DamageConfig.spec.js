import { render, fireEvent, screen } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import DamageConfig from '@/components/DamageConfig.vue'
import { mockElementHealth } from '../utils/test-utils'

// Mock the elementHealth import
vi.mock('@/assets/elementHealth.json', () => ({
    default: mockElementHealth
}))

describe('DamageConfig Integration', () => {
    it('renders damage configuration interface', () => {
        render(DamageConfig)

        expect(screen.getByText(/damage configuration/i)).toBeInTheDocument()
        expect(screen.getByText(/export configuration/i)).toBeInTheDocument()
        expect(screen.getByText(/reset configuration/i)).toBeInTheDocument()
    })

    it('expands and collapses sections', async () => {
        render(DamageConfig)

        const sectionHeaders = screen.getAllByText(/outer wall 1\/4 m|base element/i)
        expect(sectionHeaders.length).toBeGreaterThan(0)

        const firstSection = sectionHeaders[0]
        await fireEvent.click(firstSection)

        // Should show content after click
        expect(screen.getByText(/health/i)).toBeInTheDocument()
    })

    it('updates health values', async () => {
        render(DamageConfig)

        // Expand a section first
        const sectionHeader = screen.getByText(/outer wall 1\/4 m/i)
        await fireEvent.click(sectionHeader)

        const healthInput = screen.getByDisplayValue('100') // Initial health value
        await fireEvent.update(healthInput, '150')

        expect(healthInput.value).toBe('150')
    })

    it('validates health input to prevent negative values', async () => {
        render(DamageConfig)

        const sectionHeader = screen.getByText(/outer wall 1\/4 m/i)
        await fireEvent.click(sectionHeader)

        const healthInput = screen.getByDisplayValue('100')
        await fireEvent.update(healthInput, '-50')

        // Should be clamped to 0
        expect(healthInput.value).toBe('0')
    })

    it('exports configuration', async () => {
        const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL')
        const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL')

        render(DamageConfig)

        const exportButton = screen.getByText(/export configuration/i)
        await fireEvent.click(exportButton)

        expect(createObjectURLSpy).toHaveBeenCalled()
        expect(revokeObjectURLSpy).toHaveBeenCalled()
    })

    it('resets configuration after confirmation', async () => {
        // Mock confirm to return true
        vi.spyOn(window, 'confirm').mockReturnValue(true)

        render(DamageConfig)

        const resetButton = screen.getByText(/reset configuration/i)
        await fireEvent.click(resetButton)

        expect(window.confirm).toHaveBeenCalled()
    })

    it('navigates back to calculator', async () => {
        const { emitted } = render(DamageConfig)

        const backButton = screen.getByText(/back to calculator/i)
        await fireEvent.click(backButton)

        expect(emitted()['back-to-calculator']).toBeTruthy()
    })
})