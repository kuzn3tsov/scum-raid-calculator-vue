<template>
  <div class="container">
    <div class="header-container">
      <div class="title-section">
        <font-awesome-icon :icon="['fas', 'bomb']" class="title-icon" />
        <h1>{{ $t('app.title') }}</h1>
      </div>
      <div class="header-controls">
        <button class="settings-gear" @click="openAuthModal">
          <font-awesome-icon :icon="['fas', 'gear']" class="gear-icon" />
        </button>
        <ThemeToggle />
        <LanguageSelector />
      </div>
    </div>

    <CustomDropdown :elementHealth="elementHealth" @option-selected="handleOptionSelected" />

    <ExplosiveList v-if="selectedOption" :selectedExplosives="selectedExplosives"
      @update:selectedExplosives="selectedExplosives = $event" @update-result="updateResult" />

    <ResultDisplay v-if="showResult" :totalExplosivesText="totalExplosivesText" :resultHtml="resultHtml" />

    <div class="action-buttons">
      <CopyButton :buttonText="copyButtonText" @copy-plan="copyPlan" />
      <ShareButton :buttonText="shareButtonText" :disabled="!showResult" @share-plan="sharePlan" />
    </div>

    <!-- Translation CTA above the translation note -->
    <div class="translation-cta" @click="openTranslator">
      <font-awesome-icon :icon="['fas', 'hands-helping']" class="cta-icon" />
      <span>{{ $t('app.helpTranslate') }}</span>
    </div>

    <footer class="translation-note">
      <font-awesome-icon :icon="['fas', 'language']" class="note-icon" />
      <span>
        {{ $t('app.translationNote') }}
        <a
          href="mailto:treursiclem@gmail.com?subject=Translation Correction&body=Language: [Language]%0D%0AOriginal: [Original Text]%0D%0ACorrected: [Corrected Text]">
          treursiclem@gmail.com
        </a>
      </span>
    </footer>

    <!-- Auth Modal -->
    <CalcAuth :showAuthModal="showAuthModal" @close="closeAuthModal" @authenticated="openDamageConfig" />
  </div>
</template>

<script>
import CustomDropdown from './CustomDropdown.vue'
import ExplosiveList from './ExplosiveList.vue'
import ResultDisplay from './ResultDisplay.vue'
import CopyButton from './CopyButton.vue'
import ShareButton from './ShareButton.vue'
import LanguageSelector from './LanguageSelector.vue'
import ThemeToggle from './ThemeToggle.vue'
import CalcAuth from './CalcAuth.vue'
import elementHealthData from '../assets/elementHealth.json'
import { useI18n } from 'vue-i18n'

export default {
  name: 'ScumCalculator',
  components: {
    CustomDropdown,
    ExplosiveList,
    ResultDisplay,
    CopyButton,
    ShareButton,
    LanguageSelector,
    ThemeToggle,
    CalcAuth
  },
  emits: ['open-translator', 'open-damage-config'],
  setup() {
    const { locale } = useI18n()
    return { locale }
  },
  data() {
    return {
      elementHealth: {},
      selectedOption: '',
      selectedElement: '',
      selectedMaterial: '',
      selectedExplosives: [],
      totalExplosivesText: '',
      resultHtml: '',
      showResult: false,
      copyButtonText: '',
      shareButtonText: '',
      showAuthModal: false
    }
  },
  methods: {
    async loadData() {
      try {
        this.elementHealth = elementHealthData
      } catch (err) {
        console.error('Failed loading elementHealth.json:', err)
      }
    },
    handleOptionSelected(option) {
      this.selectedOption = option.text
      this.selectedElement = option.element
      this.selectedMaterial = option.material
      this.selectedExplosives = []
      this.showResult = false
      this.updateResult(true)
    },
    updateResult(preselectBest = false) {
      if (!this.selectedElement || !this.selectedMaterial) {
        this.showResult = false
        return
      }

      if (!this.elementHealth[this.selectedElement] ||
        !this.elementHealth[this.selectedElement][this.selectedMaterial]) {
        console.error('Data not found for:', this.selectedElement, this.selectedMaterial)
        this.showResult = false
        return
      }

      const data = this.elementHealth[this.selectedElement][this.selectedMaterial]
      const { health, damage } = data

      if (preselectBest) {
        let bestExplosive = null
        let maxDamage = 0
        Object.keys(damage).forEach(exp => {
          if (damage[exp] > maxDamage) {
            maxDamage = damage[exp]
            bestExplosive = exp
          }
        })
        if (bestExplosive) {
          this.selectedExplosives = [bestExplosive]
        }
      }

      this.calculateAndDisplayResults(health, damage)
    },
    calculateAndDisplayResults(health, damage) {
      const selectedExplosivesData = this.selectedExplosives
        .filter(exp => damage[exp] > 0)
        .map(exp => ({
          name: exp,
          damage: damage[exp],
          label: this.getExplosiveLabel(exp)
        }))

      if (selectedExplosivesData.length > 0) {
        const practicalCombination = this.calculatePracticalCombination(health, selectedExplosivesData)
        const totalCount = practicalCombination.reduce((sum, item) => sum + item.count, 0)

        let html = `<div><strong>${this.$t('app.practicalCombination')}</strong></div>`
        practicalCombination.forEach(item => {
          if (item.count > 0) {
            html += `<div>${item.label}: ${item.count}</div>`
          }
        })

        const bestSingleExplosive = selectedExplosivesData.reduce((best, current) => {
          const bestNeeded = Math.ceil(health / best.damage)
          const currentNeeded = Math.ceil(health / current.damage)
          return currentNeeded < bestNeeded ? current : best
        })
        const bestSingleCount = Math.ceil(health / bestSingleExplosive.damage)

        html += `<div style="margin-top: 10px;"><strong>${this.$t('app.mostEfficientSingle')}</strong></div>`
        html += `<div class="best">${bestSingleExplosive.label}: ${bestSingleCount} ${this.$t('app.needed')}</div>`

        html += `<div style="margin-top: 10px;"><strong>${this.$t('app.individualRequirements')}</strong></div>`
        selectedExplosivesData.forEach(exp => {
          const needed = Math.ceil(health / exp.damage)
          const isBest = exp.name === this.findBestExplosive(damage)
          html += `<div class="${isBest ? 'best' : ''}">
            ${exp.label}: ${needed} ${this.$t('app.needed')} ${this.$t('app.ifUsedAlone')}
          </div>`
        })

        this.totalExplosivesText = `${this.$t('app.totalExplosives', { count: totalCount })}`
        this.resultHtml = html
        this.showResult = true
      } else {
        this.resultHtml = `<div>${this.$t('app.selectAtLeastOne')}</div>`
        this.totalExplosivesText = `${this.$t('app.totalExplosives', { count: 0 })}`
        this.showResult = true
      }
    },
    calculatePracticalCombination(totalHealth, explosives) {
      const sortedExplosives = [...explosives].sort((a, b) => b.damage - a.damage)
      let remainingHealth = totalHealth

      const combination = sortedExplosives.map(exp => ({
        ...exp,
        count: 0
      }))

      for (let i = 0; i < combination.length && remainingHealth > 0; i++) {
        const exp = combination[i]
        const maxPossible = Math.ceil(remainingHealth / exp.damage)
        const suggestedCount = Math.floor(maxPossible * 0.7)

        if (suggestedCount > 0) {
          const countToUse = Math.min(suggestedCount, maxPossible)
          exp.count = countToUse
          remainingHealth -= countToUse * exp.damage
        }
      }

      if (remainingHealth > 0) {
        const bestFinisher = combination
          .filter(exp => exp.damage >= remainingHealth || Math.ceil(remainingHealth / exp.damage) <= 3)
          .sort((a, b) => {
            const aNeeded = Math.ceil(remainingHealth / a.damage)
            const bNeeded = Math.ceil(remainingHealth / b.damage)
            return aNeeded - bNeeded
          })[0]

        if (bestFinisher) {
          const needed = Math.ceil(remainingHealth / bestFinisher.damage)
          bestFinisher.count += needed
          remainingHealth = 0
        } else {
          const mostPowerful = combination[0]
          const needed = Math.ceil(remainingHealth / mostPowerful.damage)
          mostPowerful.count += needed
          remainingHealth = 0
        }
      }

      return combination.filter(exp => exp.count > 0)
    },
    findBestExplosive(damage) {
      let bestExplosive = null
      let maxDamage = 0
      Object.entries(damage).forEach(([key, value]) => {
        if (value > maxDamage) {
          maxDamage = value
          bestExplosive = key
        }
      })
      return bestExplosive
    },
    getExplosiveLabel(key) {
      return this.$t(`explosives.${key}`)
    },
    copyPlan() {
      const resultElement = document.getElementById('result')
      const text = resultElement ? resultElement.innerText : ''
      navigator.clipboard.writeText(text).then(() => {
        this.copyButtonText = this.$t('app.copied')
        setTimeout(() => {
          this.copyButtonText = this.$t('app.copyPlan')
        }, 1500)
      })
    },
    sharePlan() {
      if (!this.showResult) return

      const resultElement = document.getElementById('result')
      const text = resultElement ? resultElement.innerText : ''

      // Create share text with additional context
      const shareText = `SCUM Raid Plan - ${this.selectedOption}\n\n${text}\n\nGenerated by SCUM Raid Calculator`

      if (navigator.share) {
        // Use Web Share API if available
        navigator.share({
          title: 'SCUM Raid Plan',
          text: shareText,
          url: window.location.href
        }).then(() => {
          this.shareButtonText = this.$t('app.shared')
          setTimeout(() => {
            this.shareButtonText = this.$t('app.sharePlan')
          }, 1500)
        }).catch((error) => {
          console.log('Error sharing:', error)
          this.fallbackShare(shareText)
        })
      } else {
        // Fallback for browsers that don't support Web Share API
        this.fallbackShare(shareText)
      }
    },
    fallbackShare(text) {
      // Copy to clipboard as fallback
      navigator.clipboard.writeText(text).then(() => {
        this.shareButtonText = this.$t('app.copied')
        setTimeout(() => {
          this.shareButtonText = this.$t('app.sharePlan')
        }, 1500)

        // Show a message that it was copied since sharing isn't available
        alert('Raid plan copied to clipboard! You can now share it anywhere.')
      })
    },
    openAuthModal() {
      this.showAuthModal = true
    },
    closeAuthModal() {
      this.showAuthModal = false
    },
    openTranslator() {
      this.$emit('open-translator', this.locale)
    },
    openDamageConfig() {
      this.$emit('open-damage-config')
    }
  },
  async mounted() {
    await this.loadData()
    // Initialize button texts
    this.copyButtonText = this.$t('app.copyPlan')
    this.shareButtonText = this.$t('app.sharePlan')
  },
  watch: {
    '$i18n.locale'() {
      // Update button texts when language changes
      this.copyButtonText = this.$t('app.copyPlan')
      this.shareButtonText = this.$t('app.sharePlan')
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 700px;
  margin: auto;
  background: var(--secondary-bg);
  padding: 20px;
  border-radius: 16px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
}

/* Header & Language Selector */
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;
  flex-wrap: nowrap;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.title-icon {
  font-size: 2em;
  color: var(--accent-color);
  flex-shrink: 0;
}

h1 {
  font-family: 'Russo One', sans-serif;
  color: var(--accent-color);
  margin: 0;
  font-size: clamp(1.2em, 3.5vw, 1.6em);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400;
}

/* Header Controls */
.header-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* Settings Gear Icon */
.settings-gear {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--border-color);
  color: var(--accent-color);
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  transition: all 0.3s ease;
}

.settings-gear:hover {
  background: var(--border-light);
  transform: rotate(90deg);
}

.gear-icon {
  font-size: 1.2em;
}

/* Action Buttons Container */
.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 20px;
}

/* Translation CTA Styles */
.translation-cta {
  margin-top: 15px;
  padding: 12px 15px;
  background: var(--tertiary-bg);
  border-radius: 6px;
  font-size: 0.9em;
  color: var(--text-primary);
  text-align: center;
  border: 1px dashed var(--accent-color);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.translation-cta:hover {
  background: var(--border-light);
  transform: translateY(-1px);
}

.cta-icon {
  color: var(--accent-color);
  font-size: 1em;
}

/* Translation Note Footer */
.translation-note {
  margin-top: 25px;
  padding: 12px 15px;
  background: var(--tertiary-bg);
  border-radius: 6px;
  font-size: 0.85em;
  color: var(--text-secondary);
  text-align: center;
  border-left: 3px solid var(--accent-color);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  line-height: 1.4;
}

.note-icon {
  color: var(--accent-color);
  font-size: 0.9em;
  flex-shrink: 0;
}

.translation-note span {
  flex: 1;
}

.translation-note a {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 500;
}

.translation-note a:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 15px;
    margin: 0;
    border-radius: 12px;
  }

  .header-container {
    flex-wrap: wrap;
    gap: 12px;
  }

  .title-section {
    min-width: 0;
    flex: 1 1 auto;
  }

  h1 {
    white-space: normal;
    text-overflow: clip;
    font-size: clamp(1.1em, 4vw, 1.4em);
  }

  .header-controls {
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: 10px;
  }

  .theme-toggle .theme-text {
    display: none;
  }

  .theme-toggle {
    padding: 8px;
    min-width: 44px;
    justify-content: center;
  }

  .language-selector {
    padding: 8px;
    min-width: 44px;
    justify-content: center;
  }

  .settings-gear {
    padding: 8px;
    min-width: 44px;
    justify-content: center;
  }

  .title-icon {
    font-size: 1.6em;
  }

  .action-buttons {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .translation-note {
    font-size: 0.8em;
    padding: 10px 12px;
    flex-direction: column;
    gap: 6px;
    text-align: center;
  }

  .translation-cta {
    padding: 10px 12px;
    font-size: 0.85em;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 12px;
    border-radius: 8px;
  }

  .header-container {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .title-section {
    justify-content: center;
    text-align: center;
  }

  h1 {
    font-size: clamp(1em, 5vw, 1.3em);
  }

  .title-icon {
    font-size: 1.4em;
  }

  .header-controls {
    gap: 8px;
  }

  .language-selector,
  .theme-toggle,
  .settings-gear {
    flex: 1;
    min-width: 0;
    height: 36px;
  }

  .action-buttons {
    gap: 10px;
  }

  .translation-note {
    font-size: 0.75em;
    padding: 8px 10px;
  }

  .translation-note a {
    word-break: break-all;
  }
}
</style>