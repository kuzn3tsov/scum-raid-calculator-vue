<template>
  <div id="app">
    <ScumCalculator v-if="!showTranslator && !showDamageConfig" @open-translator="openTranslator"
      @open-damage-config="showDamageConfig = true" />
    <CalcTranslator v-else-if="showTranslator" :initialLanguage="translatorLanguage"
      @back-to-calculator="showTranslator = false" />
    <DamageConfig v-else-if="showDamageConfig" @back-to-calculator="showDamageConfig = false" />
  </div>
</template>

<script>
import ScumCalculator from './components/ScumCalculator.vue'
import CalcTranslator from './components/CalcTranslator.vue'
import DamageConfig from './components/DamageConfig.vue'

export default {
  name: 'App',
  components: {
    ScumCalculator,
    CalcTranslator,
    DamageConfig
  },
  data() {
    return {
      showTranslator: false,
      showDamageConfig: false,
      translatorLanguage: 'en'
    }
  },
  methods: {
    openTranslator(language) {
      this.translatorLanguage = language || 'en'
      this.showTranslator = true
    }
  }
}
</script>

<style>
@import './assets/calculator.css';
</style>