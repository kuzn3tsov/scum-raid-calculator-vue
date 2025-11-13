<template>
  <div id="combined-select" class="custom-select">
    <div class="select-selected" @click="toggleDropdown">
      {{ selectedText || $t('app.selectElement') }}
    </div>
    <div class="select-items" :class="{ 'select-hide': !dropdownOpen }">
      <template v-for="(elements, groupName) in categories" :key="groupName">
        <div class="dropdown-group">
          {{ $t(`categories.${groupName}`) }}
        </div>
        <div
          v-for="elementKey in elements"
          :key="elementKey"
        >
          <template v-if="elementHealth[elementKey]">
            <div
              v-for="materialKey in Object.keys(elementHealth[elementKey])"
              :key="`${elementKey}-${materialKey}`"
              class="dropdown-option"
              @click="selectOption(elementKey, materialKey)"
            >
              {{ $t(`elements.${elementKey}`) }} ({{ $t(`materials.${materialKey}`) }})
            </div>
          </template>
          <div v-else class="dropdown-option no-data">
            {{ $t(`elements.${elementKey}`) }} ({{ $t('app.noData') }})
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomDropdown',
  props: {
    elementHealth: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  data() {
    return {
      dropdownOpen: false,
      selectedText: '',
      categories: {
        "outerWalls": [
          "Outer wall 1/4 m", "Outer wall 1/2 m", "Outer wall 1 m",
          "Outer wall 2 m", "Outer wall 3 m", "Outer wall 4 m", "Outer wall 5 m"
        ],
        "baseElements": ["Base element"],
        "doors": ["Outer wall door (any)", "Base element door (single/double)"],
        "hatches": ["Base element hatch door"],
        "others": ["Standalone BarbedWire"]
      }
    }
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen
    },
    selectOption(elementKey, materialKey) {
      this.selectedText = `${this.$t(`elements.${elementKey}`)} (${this.$t(`materials.${materialKey}`)})`
      this.dropdownOpen = false
      this.$emit('option-selected', {
        text: this.selectedText,
        element: elementKey,
        material: materialKey
      })
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.dropdownOpen = false
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>

<style scoped>
.custom-select {
  position: relative;
  font-size: 16px;
  margin-bottom: 20px;
  width: 100%;
}

.custom-select select {
  display: none;
}

.select-selected {
  background-color: var(--border-color);
  color: var(--text-primary);
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.select-selected:focus {
  outline: none;
  border-color: var(--accent-color);
}

.select-items {
  position: absolute;
  background-color: var(--border-color);
  width: 100%;
  border-radius: 0 0 8px 8px;
  overflow-y: auto;
  max-height: 300px;
  z-index: 99;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-light);
}

.select-hide {
  display: none;
}

.dropdown-group {
  font-weight: bold;
  color: var(--accent-color);
  padding: 8px 12px;
  background: var(--tertiary-bg);
  cursor: default;
  border-top: 1px solid var(--border-light);
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dropdown-option {
  padding: 10px 12px;
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
  color: var(--text-primary);
}

.dropdown-option:hover {
  background: var(--border-light);
}

.no-data {
  color: var(--text-muted);
  cursor: not-allowed;
  font-style: italic;
}

/* Scrollbar styling */
.select-items::-webkit-scrollbar {
  width: 8px;
}

.select-items::-webkit-scrollbar-track {
  background: var(--tertiary-bg);
  border-radius: 0 0 8px 0;
}

.select-items::-webkit-scrollbar-thumb {
  background: var(--border-light);
  border-radius: 4px;
}

.select-items {
  scrollbar-width: thin;
  scrollbar-color: var(--border-light) var(--tertiary-bg);
}
</style>