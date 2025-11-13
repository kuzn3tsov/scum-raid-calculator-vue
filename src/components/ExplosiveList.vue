<template>
  <div id="explosive-list">
    <h2>{{ $t('app.chooseExplosives') }}</h2>
    <label v-for="explosive in explosives" :key="explosive.value">
      <input
        type="checkbox"
        :value="explosive.value"
        :checked="selectedExplosives.includes(explosive.value)"
        @change="handleCheckboxChange(explosive.value, $event.target.checked)"
      />
      {{ $t(`explosives.${explosive.value}`) }}
    </label>
  </div>
</template>

<script>
export default {
  name: 'ExplosiveList',
  props: {
    selectedExplosives: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      explosives: [
        { value: 'VHS_BG' },
        { value: 'M82' },
        { value: 'PipeBomb' },
        { value: 'AT4_HEAT' },
        { value: 'Frag' },
        { value: 'TNT' },
        { value: 'RPG7' },
        { value: 'C4' }
      ]
    }
  },
  methods: {
    handleCheckboxChange(value, checked) {
      let newSelection
      if (checked) {
        newSelection = [...this.selectedExplosives, value]
      } else {
        newSelection = this.selectedExplosives.filter(exp => exp !== value)
      }
      this.$emit('update:selectedExplosives', newSelection)
      this.$emit('update-result', false)
    }
  }
}
</script>