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

<style scoped>
#explosive-list {
  margin-bottom: 20px;
  background: var(--tertiary-bg);
  padding: 15px;
  border-radius: 8px;
}

#explosive-list h2 {
  color: var(--accent-color);
  margin-bottom: 15px;
  font-size: 1.3em;
  font-family: 'Russo One', sans-serif;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 8px;
  text-shadow: none;
}

#explosive-list input[type="checkbox"] {
  margin-right: 10px;
  transform: scale(1.1);
  accent-color: var(--accent-color);
}

#explosive-list label {
  display: flex;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;
  border-radius: 4px;
  padding-left: 8px;
  transition: all 0.3s ease;
}

#explosive-list label:hover {
  background: rgba(255, 255, 255, 0.05);
}

#explosive-list label:has(input:checked) {
  color: #2ecc71;
  font-weight: bold;
}
</style>