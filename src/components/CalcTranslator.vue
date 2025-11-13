<template>
    <div class="container">
        <div class="header-container">
            <div class="title-section">
                <font-awesome-icon :icon="['fas', 'language']" class="title-icon" />
                <h1>{{ $t('translationGui.title') }}</h1>
            </div>
            <div class="header-controls">
                <ThemeToggle />
                <LanguageSelector />
                <button class="theme-toggle" @click="goBack">
                    <font-awesome-icon :icon="['fas', 'arrow-left']" class="theme-icon" />
                    <span class="theme-text">{{ $t('translationGui.backToCalculator') }}</span>
                </button>
            </div>
        </div>

        <div class="translation-gui">
            <div class="translation-intro">
                <h3>{{ $t('translationGui.introTitle') }}</h3>
                <p>{{ $t('translationGui.introSteps') }}</p>
                <ol>
                    <li>{{ $t('translationGui.step1') }}</li>
                    <li>{{ $t('translationGui.step2') }}</li>
                    <li>{{ $t('translationGui.step3') }}</li>
                    <li>{{ $t('translationGui.step4') }}</li>
                    <li>{{ $t('translationGui.step5') }}</li>
                </ol>
            </div>

            <div class="translation-form">
                <div class="form-group full-width">
                    <label for="language-select">
                        <font-awesome-icon :icon="['fas', 'globe']" /> {{ $t('translationGui.languageLabel') }}
                    </label>
                    <div class="language-selector-container" :class="{ 'search-mode': searchMode }">
                        <!-- Dropdown mode -->
                        <div v-if="!searchMode" class="language-dropdown" @click="activateSearch">
                            <div class="dropdown-display">
                                <span v-if="selectedLanguage" class="selected-language">
                                    {{ getSelectedLanguageEmoji() }} {{ getSelectedLanguageName() }} ({{
                                    selectedLanguage }})
                                </span>
                                <span v-else class="placeholder">
                                    {{ $t('translationGui.selectLanguage') }}
                                </span>
                                <font-awesome-icon :icon="['fas', 'chevron-down']" class="dropdown-chevron" />
                            </div>
                        </div>

                        <!-- Search mode -->
                        <div v-else class="language-search-mode">
                            <div class="search-header">
                                <input ref="searchInput" type="text" v-model="languageSearch"
                                    :placeholder="$t('translationGui.searchLanguage')" class="language-search-input"
                                    @keydown.esc="deactivateSearch" />
                                <button class="search-close" @click="deactivateSearch">
                                    <font-awesome-icon :icon="['fas', 'times']" />
                                </button>
                            </div>
                            <div class="search-results">
                                <div v-for="lang in filteredLanguages" :key="lang.code" class="language-option"
                                    :class="{ selected: lang.code === selectedLanguage, available: isLanguageAvailable(lang.code) }"
                                    @click="selectLanguage(lang.code)">
                                    <span class="language-emoji">{{ lang.emoji }}</span>
                                    <span class="language-name">{{ lang.name }}</span>
                                    <span class="language-native">({{ lang.nativeName }})</span>
                                    <span class="language-code">{{ lang.code }}</span>
                                    <span v-if="isLanguageAvailable(lang.code)" class="available-badge">✓</span>
                                    <span v-else class="unavailable-badge">+</span>
                                </div>
                                <div v-if="filteredLanguages.length === 0" class="no-results">
                                    {{ $t('translationGui.noResults') }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="selectedLanguage" class="language-status">
                        <span v-if="isLanguageAvailable(selectedLanguage)" class="status-available">
                            ✓ Translation file exists - editing existing translations
                        </span>
                        <span v-else class="status-unavailable">
                            + New translation - all fields are empty
                        </span>
                    </div>
                </div>

                <div class="form-group">
                    <label for="author-name">
                        <font-awesome-icon :icon="['fas', 'user']" /> {{ $t('translationGui.nameLabel') }}
                    </label>
                    <input id="author-name" type="text" v-model="authorName"
                        :placeholder="$t('translationGui.nameLabel')" @blur="validateAuthorName">
                    <span v-if="nameError" class="error-message">{{ nameError }}</span>
                </div>

                <div class="form-group">
                    <label for="author-email">
                        <font-awesome-icon :icon="['fas', 'envelope']" /> {{ $t('translationGui.emailLabel') }}
                    </label>
                    <input id="author-email" type="email" v-model="authorEmail" placeholder="your@email.com"
                        @blur="validateEmail">
                    <span v-if="emailError" class="error-message">{{ emailError }}</span>
                </div>
            </div>

            <div class="translation-progress" v-if="translationProgress > 0">
                <div>{{ $t('translationGui.progress', { percent: Math.round(translationProgress) }) }}</div>
                <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: translationProgress + '%' }"></div>
                </div>
                <div class="progress-text">
                    {{ $t('translationGui.phrasesTranslated', {
                        translated: filledFieldsCount, total: totalFieldsCount
                    }) }}
                </div>
            </div>

            <div class="section-controls">
                <button class="section-control-btn" @click="expandAllSections">
                    <font-awesome-icon :icon="['fas', 'expand']" />
                    {{ $t('translationGui.expandAll') }}
                </button>
                <button class="section-control-btn" @click="collapseAllSections">
                    <font-awesome-icon :icon="['fas', 'compress']" />
                    {{ $t('translationGui.collapseAll') }}
                </button>
            </div>

            <div class="translation-fields">
                <div v-for="(section, sectionKey) in translationStructure" :key="sectionKey" class="translation-section"
                    :class="{ collapsed: !expandedSections[sectionKey] }">
                    <div class="section-header-enhanced" @click="toggleSection(sectionKey)">
                        <div class="section-title">
                            <font-awesome-icon :icon="['fas', 'chevron-right']" class="section-icon" />
                            {{ sectionKey }}
                            <span class="section-progress">
                                ({{ getSectionProgress(sectionKey) }})
                            </span>
                        </div>
                    </div>

                    <div class="section-content" v-if="expandedSections[sectionKey]">
                        <div v-for="(value, key) in section" :key="key" class="translation-item">
                            <div class="translation-key">{{ sectionKey }}.{{ key }}</div>
                            <div class="translation-original">{{ $t('translationGui.originalText') }}: "{{
                                getOriginalText(sectionKey, key) }}"</div>
                            <textarea class="translation-input" :placeholder="getOriginalText(sectionKey, key)"
                                v-model="translations[sectionKey][key]" @input="updateProgress" rows="2"></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <div class="export-section-enhanced">
                <button id="export-btn" @click="exportTranslation" :disabled="!canExport">
                    <font-awesome-icon :icon="['fas', 'download']" class="export-icon" />
                    {{ $t('translationGui.export') }}
                </button>
                <button id="submit-btn" @click="submitTranslation" :disabled="!canSubmit">
                    <font-awesome-icon :icon="['fas', 'paper-plane']" class="submit-icon" />
                    {{ $t('translationGui.submit') }}
                </button>
            </div>
        </div>

        <!-- Success Modal -->
        <ModalDialog :show="showSuccessModal" :title="successModalTitle" :message="successModalMessage" type="success"
            :confirm-text="$t('common.close')" @confirm="showSuccessModal = false" @close="showSuccessModal = false" />

        <!-- Export Success Modal -->
        <ModalDialog :show="showExportModal" title="Export Successful" :message="exportModalMessage" type="success"
            :confirm-text="$t('common.close')" @confirm="showExportModal = false" @close="showExportModal = false" />

        <!-- Submit Confirmation Modal -->
        <ModalDialog :show="showSubmitModal" title="Submit Translation" :message="submitModalMessage" type="confirm"
            confirm-text="Open Email" cancel-text="Cancel" @confirm="openEmailClient" @cancel="showSubmitModal = false"
            @close="showSubmitModal = false" />
    </div>
</template>

<script>
import enTranslations from '../languages/en.json'
import { getLanguages, getLanguageByCode, isLanguageAvailable } from '../utils/languages'
import ThemeToggle from './ThemeToggle.vue'
import LanguageSelector from './LanguageSelector.vue'
import ModalDialog from './ModalDialog.vue'

// Import only the languages that actually exist
let availableTranslations = {
    'en': enTranslations
};

// Only import languages that we know have files based on your directory listing
const languageImports = {
    'hr': () => import('../languages/hr.json').catch(() => null),
    'de': () => import('../languages/de.json').catch(() => null),
    'es': () => import('../languages/es.json').catch(() => null),
    'fr': () => import('../languages/fr.json').catch(() => null),
    'it': () => import('../languages/it.json').catch(() => null),
    'ko': () => import('../languages/ko.json').catch(() => null),
    'nl': () => import('../languages/nl.json').catch(() => null),
    'ru': () => import('../languages/ru.json').catch(() => null),
    'sl': () => import('../languages/sl.json').catch(() => null),
    'sv': () => import('../languages/sv.json').catch(() => null),
    'zh': () => import('../languages/zh.json').catch(() => null),
    // Remove imports for languages that don't have files yet
};

export default {
    name: 'CalcTranslator',
    components: {
        ThemeToggle,
        LanguageSelector,
        ModalDialog
    },
    props: {
        initialLanguage: {
            type: String,
            default: 'en'
        }
    },
    emits: ['back-to-calculator'],
    data() {
        return {
            selectedLanguage: this.initialLanguage,
            authorName: '',
            authorEmail: '',
            nameError: '',
            emailError: '',
            translations: {},
            originalTranslations: JSON.parse(JSON.stringify(enTranslations)),
            translationStructure: enTranslations,
            languageSearch: '',
            expandedSections: {},
            allLanguages: getLanguages(),
            searchMode: false,
            loadedLanguages: new Set(['en']),
            // Modal states
            showSuccessModal: false,
            showExportModal: false,
            showSubmitModal: false,
            successModalTitle: '',
            successModalMessage: '',
            exportModalMessage: '',
            submitModalMessage: ''
        }
    },
    computed: {
        translationProgress() {
            return this.totalFieldsCount > 0 ? (this.filledFieldsCount / this.totalFieldsCount) * 100 : 0
        },
        totalFieldsCount() {
            return this.countTotalFields(this.translationStructure)
        },
        filledFieldsCount() {
            return this.countFilledFields(this.translations)
        },
        canExport() {
            // Export is always available if we have a language selected and basic form info
            return this.selectedLanguage && this.authorName && this.authorEmail &&
                this.emailError === '' && this.nameError === ''
        },
        canSubmit() {
            // Submit only when 100% complete and form is valid
            return this.isFormValid && this.translationProgress === 100
        },
        isFormValid() {
            return this.authorName &&
                this.authorEmail &&
                this.emailError === '' &&
                this.nameError === '' &&
                this.selectedLanguage
        },
        filteredLanguages() {
            if (!this.languageSearch) {
                return this.allLanguages.slice(0, 10)
            }
            const searchTerm = this.languageSearch.toLowerCase()
            return this.allLanguages.filter(lang =>
                lang.name.toLowerCase().includes(searchTerm) ||
                lang.code.toLowerCase().includes(searchTerm) ||
                lang.nativeName.toLowerCase().includes(searchTerm)
            )
        }
    },
    methods: {
        isLanguageAvailable(code) {
            return isLanguageAvailable(code)
        },

        activateSearch() {
            this.searchMode = true
            this.languageSearch = ''
            this.$nextTick(() => {
                this.$refs.searchInput?.focus()
            })
        },

        deactivateSearch() {
            this.searchMode = false
            this.languageSearch = ''
        },

        selectLanguage(languageCode) {
            this.selectedLanguage = languageCode
            this.deactivateSearch()
            this.loadTranslationData()
        },

        getSelectedLanguageName() {
            const lang = this.allLanguages.find(l => l.code === this.selectedLanguage)
            return lang ? lang.name : this.selectedLanguage
        },

        getSelectedLanguageEmoji() {
            const lang = this.allLanguages.find(l => l.code === this.selectedLanguage)
            return lang ? lang.emoji : '🌐'
        },

        goBack() {
            this.$emit('back-to-calculator')
        },

        async loadTranslationData() {
            try {
                console.log('Loading translation data for:', this.selectedLanguage)

                // If we already have the translation loaded, use it
                if (availableTranslations[this.selectedLanguage]) {
                    this.translations = JSON.parse(JSON.stringify(availableTranslations[this.selectedLanguage]))
                    console.log('Using cached translation:', this.selectedLanguage)
                }
                // Try to load the translation file if it exists
                else if (languageImports[this.selectedLanguage]) {
                    try {
                        const translationModule = await languageImports[this.selectedLanguage]()
                        if (translationModule && translationModule.default) {
                            availableTranslations[this.selectedLanguage] = translationModule.default
                            this.translations = JSON.parse(JSON.stringify(translationModule.default))
                            this.loadedLanguages.add(this.selectedLanguage)
                            console.log('Successfully loaded existing translation:', this.selectedLanguage)
                        } else {
                            // If import returns null, treat as new language
                            console.log('No translation file found for:', this.selectedLanguage)
                            this.useEmptyTemplate()
                        }
                    } catch (importError) {
                        console.warn('Failed to import translation file for:', this.selectedLanguage, importError)
                        // If import fails, treat as new language with empty fields
                        this.useEmptyTemplate()
                    }
                }
                // For languages without import statements, try dynamic import
                else if (this.isLanguageAvailable(this.selectedLanguage)) {
                    console.log('Trying dynamic import for:', this.selectedLanguage)
                    try {
                        const translationModule = await import(`../languages/${this.selectedLanguage}.json`)
                        if (translationModule && translationModule.default) {
                            availableTranslations[this.selectedLanguage] = translationModule.default
                            this.translations = JSON.parse(JSON.stringify(translationModule.default))
                            this.loadedLanguages.add(this.selectedLanguage)
                            console.log('Dynamically loaded existing translation:', this.selectedLanguage)
                        }
                    } catch (dynamicImportError) {
                        console.warn('Dynamic import failed for:', this.selectedLanguage, dynamicImportError)
                        this.useEmptyTemplate()
                    }
                }
                // For new languages, use empty template
                else {
                    console.log('Creating new empty translation template for:', this.selectedLanguage)
                    this.useEmptyTemplate()
                }

                // Remove _meta if it exists for editing
                if (this.translations._meta) {
                    delete this.translations._meta
                }

            } catch (error) {
                console.error('Error loading translation:', error)
                this.useEmptyTemplate()
            }

            this.initializeSections()
            this.updateProgress()
        },

        useEmptyTemplate() {
            // Create completely empty template for new languages
            this.translations = this.createEmptyTranslations()
            this.loadedLanguages.add(this.selectedLanguage)
        },

        createEmptyTranslations() {
            const createEmptyObject = (obj) => {
                const emptyObj = {}
                Object.keys(obj).forEach(key => {
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        emptyObj[key] = createEmptyObject(obj[key])
                    } else {
                        emptyObj[key] = ''
                    }
                })
                return emptyObj
            }
            return createEmptyObject(this.originalTranslations)
        },

        initializeSections() {
            const sections = {}
            Object.keys(this.translationStructure).forEach(section => {
                sections[section] = false
            })
            // Keep first section expanded
            const firstSection = Object.keys(this.translationStructure)[0]
            if (firstSection) {
                sections[firstSection] = true
            }
            this.expandedSections = sections
        },

        toggleSection(section) {
            this.expandedSections[section] = !this.expandedSections[section]
        },

        expandAllSections() {
            const expanded = {}
            Object.keys(this.translationStructure).forEach(section => {
                expanded[section] = true
            })
            this.expandedSections = expanded
        },

        collapseAllSections() {
            const expanded = {}
            Object.keys(this.translationStructure).forEach(section => {
                expanded[section] = false
            })
            this.expandedSections = expanded
        },

        getSectionProgress(section) {
            const total = this.countTotalFields({ [section]: this.translationStructure[section] })
            const filled = this.countFilledFields({ [section]: this.translations[section] })
            return this.$t('translationGui.phrasesTranslated', { translated: filled, total: total })
        },

        getOriginalText(section, key) {
            return this.originalTranslations[section]?.[key] || ''
        },

        countTotalFields(obj) {
            let count = 0
            const countFields = (obj) => {
                Object.values(obj).forEach(value => {
                    if (typeof value === 'object') {
                        countFields(value)
                    } else {
                        count++
                    }
                })
            }
            countFields(obj)
            return count
        },

        countFilledFields(obj) {
            let count = 0
            const countFilled = (obj) => {
                Object.values(obj).forEach(value => {
                    if (typeof value === 'object') {
                        countFilled(value)
                    } else if (value && value.trim() !== '') {
                        count++
                    }
                })
            }
            countFilled(obj)
            return count
        },

        updateProgress() {
            // Progress is computed, this method triggers reactivity
        },

        validateAuthorName() {
            if (!this.authorName.trim()) {
                this.nameError = this.$t('translationGui.validation.nameRequired')
            } else if (this.authorName.trim().length < 2) {
                this.nameError = this.$t('translationGui.validation.nameMinLength')
            } else if (this.authorName.trim().length > 50) {
                this.nameError = this.$t('translationGui.validation.nameMaxLength')
            } else {
                this.nameError = ''
            }
        },

        validateEmail() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!this.authorEmail.trim()) {
                this.emailError = this.$t('translationGui.validation.emailRequired')
            } else if (!emailRegex.test(this.authorEmail)) {
                this.emailError = this.$t('translationGui.validation.emailInvalid')
            } else {
                this.emailError = ''
            }
        },

        exportTranslation() {
            if (!this.canExport) return

            const exportData = {
                ...this.translations,
                _meta: {
                    author: this.authorName.trim(),
                    email: this.authorEmail.trim(),
                    language: this.selectedLanguage,
                    created: new Date().toISOString(),
                    version: '1.0',
                    progress: Math.round(this.translationProgress),
                    filledFields: this.filledFieldsCount,
                    totalFields: this.totalFieldsCount
                }
            }

            const dataStr = JSON.stringify(exportData, null, 2)
            const dataBlob = new Blob([dataStr], { type: 'application/json' })

            const link = document.createElement('a')
            link.href = URL.createObjectURL(dataBlob)
            link.download = `${this.selectedLanguage}.json`
            link.click()
            URL.revokeObjectURL(link.href)

            // Show export success modal
            this.exportModalMessage = `Translation file exported successfully!\n\nProgress: ${Math.round(this.translationProgress)}% (${this.filledFieldsCount}/${this.totalFieldsCount} phrases)\n\nFile: ${this.selectedLanguage}.json`
            this.showExportModal = true
        },

        submitTranslation() {
            if (!this.canSubmit) return

            // First export the translation file
            const translationData = {
                ...this.translations,
                _meta: {
                    author: this.authorName.trim(),
                    email: this.authorEmail.trim(),
                    language: this.selectedLanguage,
                    created: new Date().toISOString(),
                    version: '1.0',
                    progress: 100,
                    filledFields: this.filledFieldsCount,
                    totalFields: this.totalFieldsCount,
                    completed: true
                }
            }

            const dataStr = JSON.stringify(translationData, null, 2)
            const dataBlob = new Blob([dataStr], { type: 'application/json' })

            // Download the file first
            const link = document.createElement('a')
            link.href = URL.createObjectURL(dataBlob)
            link.download = `${this.selectedLanguage}.json`
            link.click()
            URL.revokeObjectURL(link.href)

            // Show submit confirmation modal
            const languageName = getLanguageByCode(this.selectedLanguage)?.name || this.selectedLanguage
            this.submitModalMessage = `Your translation for ${languageName} is complete and ready to submit!\n\n• Translation file has been downloaded: ${this.selectedLanguage}.json\n• Your email client will open with prefilled information\n• Please attach the downloaded file to your email\n\nThank you for your contribution!`
            this.showSubmitModal = true
        },

        openEmailClient() {
            const languageName = getLanguageByCode(this.selectedLanguage)?.name || this.selectedLanguage
            const subject = `SCUM Calculator Translation for ${languageName}`
            const body = `Hello,\n\nI have completed the translation for ${languageName}.\n\nName: ${this.authorName.trim()}\nEmail: ${this.authorEmail.trim()}\nLanguage: ${languageName}\nProgress: 100% Complete\n\nPlease find the translation file attached.\n\nBest regards,\n${this.authorName.trim()}`

            const mailtoLink = `mailto:treursiclem@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

            // Close the modal first
            this.showSubmitModal = false

            // Then open email client
            setTimeout(() => {
                window.location.href = mailtoLink
            }, 300)

            // Show success modal after a delay
            setTimeout(() => {
                this.successModalTitle = 'Translation Submitted'
                this.successModalMessage = `Thank you for submitting your ${languageName} translation!\n\nWe will review your submission and contact you if we have any questions.\n\nYour contribution helps make the SCUM Calculator accessible to more players worldwide!`
                this.showSuccessModal = true
            }, 1000)
        }
    },
    mounted() {
        this.loadTranslationData()
    },
    watch: {
        initialLanguage(newLang) {
            if (newLang && newLang !== this.selectedLanguage) {
                this.selectedLanguage = newLang
                this.loadTranslationData()
            }
        }
    }
}
</script>