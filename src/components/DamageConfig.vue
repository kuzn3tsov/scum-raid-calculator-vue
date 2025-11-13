<template>
    <div class="container">
        <div class="header-container">
            <div class="title-section">
                <font-awesome-icon :icon="['fas', 'shield-halved']" class="title-icon" />
                <h1>{{ $t('damageConfig.title') }}</h1>
            </div>
            <div class="header-controls">
                <ThemeToggle />
                <LanguageSelector />
                <button class="theme-toggle" @click="goBack">
                    <font-awesome-icon :icon="['fas', 'arrow-left']" class="theme-icon" />
                    <span class="theme-text">{{ $t('damageConfig.backToCalculator') }}</span>
                </button>
            </div>
        </div>

        <div class="damage-config-gui">
            <div class="config-intro">
                <h3>{{ $t('damageConfig.introTitle') }}</h3>
                <p>{{ $t('damageConfig.introDescription') }}</p>
                <ol>
                    <li>{{ $t('damageConfig.step1') }}</li>
                    <li>{{ $t('damageConfig.step2') }}</li>
                    <li>{{ $t('damageConfig.step3') }}</li>
                    <li>{{ $t('damageConfig.step4') }}</li>
                </ol>
            </div>

            <div class="config-form">
                <div class="form-group full-width">
                    <label for="element-select">
                        <font-awesome-icon :icon="['fas', 'cube']" /> {{ $t('damageConfig.elementLabel') }}
                    </label>
                    <select id="element-select" v-model="selectedElement" @change="loadElementData"
                        class="element-select">
                        <option value="">{{ $t('damageConfig.selectElement') }}</option>
                        <option v-for="element in Object.keys(elementData)" :key="element" :value="element">
                            {{ element }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="section-controls">
                <button class="section-control-btn" @click="expandAllSections">
                    <font-awesome-icon :icon="['fas', 'expand']" />
                    {{ $t('damageConfig.expandAll') }}
                </button>
                <button class="section-control-btn" @click="collapseAllSections">
                    <font-awesome-icon :icon="['fas', 'compress']" />
                    {{ $t('damageConfig.collapseAll') }}
                </button>
            </div>

            <div class="damage-fields">
                <div v-for="(materials, element) in elementData" :key="element" class="element-section"
                    :class="{ collapsed: !expandedSections[element] }" :data-element="element">
                    <div class="section-header-enhanced" @click="toggleSection(element)">
                        <div class="section-title">
                            <font-awesome-icon :icon="['fas', 'chevron-right']" class="section-icon" />
                            {{ element }}
                            <span class="section-progress">
                                ({{ $t('damageConfig.materialsCount', { count: Object.keys(materials).length }) }})
                            </span>
                        </div>
                    </div>

                    <div class="section-content" v-if="expandedSections[element]">
                        <div v-for="(data, material) in materials" :key="material" class="material-item">
                            <div class="material-header">
                                <h4 class="material-name">{{ material }}</h4>
                                <div class="health-input-group">
                                    <label>{{ $t('damageConfig.healthLabel') }}</label>
                                    <input type="number" v-model.number="elementData[element][material].health"
                                        class="health-input" min="0" @input="validateHealth(element, material)" />
                                </div>
                            </div>

                            <div class="damage-grid">
                                <div class="damage-header">
                                    <span>{{ $t('damageConfig.explosiveLabel') }}</span>
                                    <span>{{ $t('damageConfig.damageLabel') }}</span>
                                </div>
                                <div v-for="(damageValue, explosive) in data.damage" :key="explosive"
                                    class="damage-row">
                                    <span class="explosive-name">{{ getExplosiveName(explosive) }}</span>
                                    <input type="number"
                                        v-model.number="elementData[element][material].damage[explosive]"
                                        class="damage-input" min="0"
                                        @input="validateDamage(element, material, explosive)" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="export-section-enhanced">
                <button id="export-config-btn" @click="exportConfiguration">
                    <font-awesome-icon :icon="['fas', 'download']" class="export-icon" />
                    {{ $t('damageConfig.exportConfig') }}
                </button>
                <button id="reset-config-btn" @click="resetConfiguration" class="reset-btn">
                    <font-awesome-icon :icon="['fas', 'rotate-left']" class="reset-icon" />
                    {{ $t('damageConfig.resetConfig') }}
                </button>
            </div>

            <div class="config-notes">
                <div class="note">
                    <font-awesome-icon :icon="['fas', 'circle-info']" class="note-icon" />
                    <span><strong>{{ $t('damageConfig.note') }}</strong> {{ $t('damageConfig.noteText') }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import elementHealthData from '../assets/elementHealth.json'
import ThemeToggle from './ThemeToggle.vue'
import LanguageSelector from './LanguageSelector.vue'

export default {
    name: 'DamageConfig',
    components: {
        ThemeToggle,
        LanguageSelector
    },
    emits: ['back-to-calculator'],
    data() {
        return {
            elementData: JSON.parse(JSON.stringify(elementHealthData)),
            selectedElement: '',
            expandedSections: {},
            explosives: {
                'VHS_BG': 'VHS BG',
                'M82': 'M82',
                'PipeBomb': 'Pipe Bomb',
                'AT4_HEAT': 'AT4 HEAT',
                'Frag': 'Frag Grenade',
                'TNT': 'TNT',
                'RPG7': 'RPG7',
                'C4': 'C4'
            }
        }
    },
    methods: {
        getExplosiveName(explosiveKey) {
            return this.explosives[explosiveKey] || explosiveKey
        },

        goBack() {
            this.$emit('back-to-calculator')
        },

        loadElementData() {
            if (this.selectedElement && this.elementData[this.selectedElement]) {
                // Expand the selected element section
                this.expandedSections[this.selectedElement] = true

                // Scroll to the selected element section after a short delay
                this.$nextTick(() => {
                    const elementSection = document.querySelector(`[data-element="${this.selectedElement}"]`)
                    if (elementSection) {
                        elementSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                })
            }
        },

        initializeSections() {
            const sections = {}
            Object.keys(this.elementData).forEach(element => {
                sections[element] = false // Start collapsed
            })
            // Keep first section expanded by default for better UX
            const firstElement = Object.keys(this.elementData)[0]
            if (firstElement) {
                sections[firstElement] = true
            }
            this.expandedSections = sections
        },

        toggleSection(section) {
            this.expandedSections[section] = !this.expandedSections[section]
        },

        expandAllSections() {
            const expanded = {}
            Object.keys(this.elementData).forEach(section => {
                expanded[section] = true
            })
            this.expandedSections = expanded
        },

        collapseAllSections() {
            const expanded = {}
            Object.keys(this.elementData).forEach(section => {
                expanded[section] = false
            })
            this.expandedSections = expanded
        },

        validateHealth(element, material) {
            const health = this.elementData[element][material].health
            if (health < 0) {
                this.elementData[element][material].health = 0
            }
        },

        validateDamage(element, material, explosive) {
            const damage = this.elementData[element][material].damage[explosive]
            if (damage < 0) {
                this.elementData[element][material].damage[explosive] = 0
            }
        },

        exportConfiguration() {
            const configData = {
                ...this.elementData,
                _meta: {
                    exported: new Date().toISOString(),
                    version: '1.0',
                    note: 'Modified damage configuration for SCUM Raid Calculator'
                }
            }

            const dataStr = JSON.stringify(configData, null, 2)
            const dataBlob = new Blob([dataStr], { type: 'application/json' })

            const link = document.createElement('a')
            link.href = URL.createObjectURL(dataBlob)
            link.download = 'elementHealth_modified.json'
            link.click()
            URL.revokeObjectURL(link.href)

            // Save to localStorage as backup
            localStorage.setItem('scumDamageConfig', dataStr)

            alert(this.$t('damageConfig.exportSuccess'))
        },

        resetConfiguration() {
            if (confirm(this.$t('damageConfig.resetConfirm'))) {
                this.elementData = JSON.parse(JSON.stringify(elementHealthData))
                this.initializeSections()

                // Clear localStorage
                localStorage.removeItem('scumDamageConfig')

                alert(this.$t('damageConfig.resetSuccess'))
            }
        },

        loadFromStorage() {
            const savedConfig = localStorage.getItem('scumDamageConfig')
            if (savedConfig) {
                try {
                    const parsedConfig = JSON.parse(savedConfig)
                    // Remove metadata before applying
                    const { _meta, ...configData } = parsedConfig
                    this.elementData = configData
                    console.log('Loaded configuration from browser storage')
                } catch (error) {
                    console.error('Error loading saved configuration:', error)
                }
            }
        },

        validateData() {
            // Basic validation to ensure all required fields exist
            Object.keys(this.elementData).forEach(element => {
                Object.keys(this.elementData[element]).forEach(material => {
                    const data = this.elementData[element][material]
                    if (typeof data.health !== 'number' || data.health < 0) {
                        console.warn(`Invalid health for ${element} - ${material}:`, data.health)
                        data.health = 0
                    }

                    Object.keys(data.damage).forEach(explosive => {
                        if (typeof data.damage[explosive] !== 'number' || data.damage[explosive] < 0) {
                            console.warn(`Invalid damage for ${element} - ${material} - ${explosive}:`, data.damage[explosive])
                            data.damage[explosive] = 0
                        }
                    })
                })
            })
        }
    },
    mounted() {
        this.loadFromStorage()
        this.initializeSections()
        this.validateData()
    },
    watch: {
        elementData: {
            handler(newData) {
                // Auto-save to localStorage when data changes
                const dataStr = JSON.stringify(newData, null, 2)
                localStorage.setItem('scumDamageConfig', dataStr)
            },
            deep: true
        }
    }
}
</script>