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