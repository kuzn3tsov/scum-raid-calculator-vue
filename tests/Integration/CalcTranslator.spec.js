import { render, fireEvent, screen, waitFor } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import CalcTranslator from '@/components/CalcTranslator.vue'

// Mock the same dependencies as in unit tests
vi.mock('@/languages/en.json', () => ({
    default: {
        app: {
            title: 'SCUM Raid Calculator',
            copyPlan: 'Copy Plan'
        },
        explosives: {
            C4: 'C4',
            TNT: 'TNT'
        }
    }
}))

vi.mock('@/utils/languages', () => ({
    getLanguages: () => [
        { code: 'en', name: 'English', nativeName: 'English', emoji: '🇺🇸' },
        { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', emoji: '🇭🇷' },
        { code: 'fr', name: 'French', nativeName: 'Français', emoji: '🇫🇷' }
    ],
    getLanguageByCode: (code) => ({
        en: { code: 'en', name: 'English', nativeName: 'English', emoji: '🇺🇸' },
        hr: { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', emoji: '🇭🇷' },
        fr: { code: 'fr', name: 'French', nativeName: 'Français', emoji: '🇫🇷' }
    })[code],
    isLanguageAvailable: (code) => ['en', 'hr'].includes(code)
}))

describe('CalcTranslator Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('completes full translation workflow', async () => {
        const { emitted } = render(CalcTranslator)

        // 1. Select language
        const languageDropdown = screen.getByText(/select language/i)
        await fireEvent.click(languageDropdown)

        const frenchOption = screen.getByText(/french/i)
        await fireEvent.click(frenchOption)

        // 2. Fill author info
        const nameInput = screen.getByLabelText(/name/i)
        const emailInput = screen.getByLabelText(/email/i)

        await fireEvent.update(nameInput, 'Jean Dupont')
        await fireEvent.update(emailInput, 'jean@example.com')

        // 3. Fill translations
        const appSection = screen.getByText(/app/i)
        await fireEvent.click(appSection)

        const translationInputs = screen.getAllByRole('textbox')
        const titleInput = translationInputs.find(input =>
            input.previousElementSibling?.textContent?.includes('app.title')
        )

        if (titleInput) {
            await fireEvent.update(titleInput, 'Calculateur de Raid SCUM')
        }

        // 4. Export translation
        const exportButton = screen.getByText(/export/i)
        await fireEvent.click(exportButton)

        // 5. Verify export happened
        await waitFor(() => {
            expect(emitted()).toHaveProperty('export')
        })

        // 6. Submit translation (if 100% complete)
        const submitButton = screen.getByText(/submit/i)
        expect(submitButton).toBeInTheDocument()
    })

    it('searches and filters languages', async () => {
        render(CalcTranslator)

        // Open search
        const dropdown = screen.getByText(/select language/i)
        await fireEvent.click(dropdown)

        // Search for Croatian
        const searchInput = screen.getByPlaceholderText(/search language/i)
        await fireEvent.update(searchInput, 'croat')

        // Should find Croatian
        expect(screen.getByText(/croatian/i)).toBeInTheDocument()
        expect(screen.queryByText(/french/i)).not.toBeInTheDocument()
    })

    it('shows progress bar updating in real-time', async () => {
        render(CalcTranslator)

        // Initially low progress
        const progressBar = screen.getByRole('progressbar')
        expect(progressBar).toBeInTheDocument()

        // Select a new language to start with 0%
        const dropdown = screen.getByText(/select language/i)
        await fireEvent.click(dropdown)

        const frenchOption = screen.getByText(/french/i)
        await fireEvent.click(frenchOption)

        // Progress should be 0% for new language
        const progressText = screen.getByText(/0%.*%/i)
        expect(progressText).toBeInTheDocument()
    })

    it('handles modal interactions correctly', async () => {
        render(CalcTranslator)

        // Fill form to enable export
        const nameInput = screen.getByLabelText(/name/i)
        const emailInput = screen.getByLabelText(/email/i)

        await fireEvent.update(nameInput, 'Test User')
        await fireEvent.update(emailInput, 'test@example.com')

        // Export should show success modal
        const exportButton = screen.getByText(/export/i)
        await fireEvent.click(exportButton)

        // Modal should appear
        await waitFor(() => {
            expect(screen.getByText(/export successful/i)).toBeInTheDocument()
        })

        // Close modal
        const closeButton = screen.getByText(/close/i)
        await fireEvent.click(closeButton)

        // Modal should disappear
        await waitFor(() => {
            expect(screen.queryByText(/export successful/i)).not.toBeInTheDocument()
        })
    })

    it('validates form in real-time', async () => {
        render(CalcTranslator)

        const nameInput = screen.getByLabelText(/name/i)
        const emailInput = screen.getByLabelText(/email/i)

        // Test invalid email
        await fireEvent.update(emailInput, 'invalid-email')
        await fireEvent.blur(emailInput)

        expect(screen.getByText(/emailInvalid/i)).toBeInTheDocument()

        // Test valid email
        await fireEvent.update(emailInput, 'valid@example.com')
        await fireEvent.blur(emailInput)

        expect(screen.queryByText(/emailInvalid/i)).not.toBeInTheDocument()
    })
})