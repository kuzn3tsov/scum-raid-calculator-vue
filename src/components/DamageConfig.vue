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

                            <div class="damage-columns-container">
                                <div class="explosives-column">
                                    <h5 class="column-title">{{ $t('damageConfig.explosiveLabel') }}</h5>
                                    <div class="explosives-list">
                                        <div v-for="(damageValue, explosive) in data.damage" :key="explosive"
                                            class="explosive-item">
                                            <span class="explosive-name">{{ getExplosiveName(explosive) }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="damage-column">
                                    <h5 class="column-title">{{ $t('damageConfig.damageLabel') }}</h5>
                                    <div class="damage-inputs">
                                        <div v-for="(damageValue, explosive) in data.damage" :key="explosive"
                                            class="damage-input-item">
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

<style scoped>
.damage-config-gui {
    background: var(--tertiary-bg);
    padding: 20px;
    border-radius: 8px;
    margin-top: 20px;
    border-left: 4px solid var(--accent-color);
}

.config-intro {
    background: rgba(94, 80, 64, 0.3);
    padding: 15px;
    border-radius: 6px;
    margin-bottom: 20px;
    border-left: 3px solid var(--accent-color);
}

.config-intro h3 {
    color: var(--accent-color);
    margin: 0 0 10px 0;
    font-family: 'Russo One', sans-serif;
    font-size: 1.3em;
}

.config-intro ol {
    margin: 0;
    padding-left: 20px;
}

.config-intro li {
    margin-bottom: 8px;
    line-height: 1.5;
}

.config-form {
    margin-bottom: 20px;
}

.element-select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--secondary-bg);
    color: var(--text-primary);
    font-size: 14px;
}

.element-select:focus {
    outline: none;
    border-color: var(--accent-color);
}

.damage-fields {
    margin: 20px 0;
}

.element-section {
    margin-bottom: 25px;
}

.material-item {
    margin-bottom: 20px;
    padding: 15px;
    background: var(--secondary-bg);
    border-radius: 6px;
    border-left: 3px solid var(--border-color);
    transition: all 0.3s ease;
}

.material-item:hover {
    border-left-color: var(--accent-color);
    transform: translateX(2px);
}

.material-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border-color);
    flex-wrap: wrap;
    gap: 10px;
}

.material-name {
    color: var(--accent-color);
    margin: 0;
    font-size: 1.1em;
    flex: 1;
    min-width: 200px;
}

.health-input-group {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}

.health-input-group label {
    color: var(--text-secondary);
    font-weight: bold;
    white-space: nowrap;
}

.health-input {
    width: 100px;
    padding: 6px 8px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--primary-bg);
    color: var(--text-primary);
    text-align: center;
    transition: border-color 0.3s ease;
}

.health-input:focus {
    outline: none;
    border-color: var(--accent-color);
}

/* Two columns layout for Explosives and Damage */
.damage-columns-container {
    display: flex;
    gap: 30px;
    align-items: flex-start;
}

.explosives-column,
.damage-column {
    flex: 1;
    min-width: 0;
}

.column-title {
    color: var(--accent-color);
    margin: 0 0 10px 0;
    font-size: 1em;
    font-weight: bold;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 5px;
}

.explosives-list,
.damage-inputs {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.explosive-item,
.damage-input-item {
    display: flex;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #4a3f33;
    min-height: 40px;
}

.explosive-name {
    color: var(--text-primary);
    font-weight: 500;
    text-align: left;
    width: 100%;
}

.damage-input {
    width: 100%;
    max-width: 120px;
    padding: 8px 10px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--primary-bg);
    color: var(--text-primary);
    text-align: center;
    transition: border-color 0.3s ease;
}

.damage-input:focus {
    outline: none;
    border-color: var(--accent-color);
}

#export-config-btn {
    padding: 12px 30px;
    background: #27ae60;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    color: white;
    font-size: 16px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: background 0.3s ease;
}

#export-config-btn:hover {
    background: #219653;
}

#reset-config-btn {
    padding: 12px 30px;
    background: #e74c3c;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    color: white;
    font-size: 16px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: background 0.3s ease;
    margin-left: 10px;
}

#reset-config-btn:hover {
    background: #c0392b;
}

.reset-icon {
    font-size: 1.1em;
}

.config-notes {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid var(--border-color);
}

.note {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px;
    background: rgba(94, 80, 64, 0.2);
    border-radius: 4px;
    color: var(--text-secondary);
    font-size: 0.9em;
}

.note-icon {
    color: var(--accent-color);
    margin-top: 2px;
    flex-shrink: 0;
}

/* Responsive design */
@media (max-width: 768px) {
    .damage-columns-container {
        flex-direction: column;
        gap: 20px;
    }

    .material-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    .material-name {
        min-width: auto;
    }

    .health-input-group {
        width: 100%;
        justify-content: space-between;
    }

    .explosives-column,
    .damage-column {
        width: 100%;
    }

    .damage-input {
        max-width: 100%;
    }
}

@media (max-width: 480px) {

    .explosive-item,
    .damage-input-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
    }

    .damage-input {
        width: 100%;
    }
}
</style>