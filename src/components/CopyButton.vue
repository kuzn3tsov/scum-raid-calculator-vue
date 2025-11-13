<template>
  <button id="copy-btn" @click="$emit('copy-plan')">
    <font-awesome-icon :icon="['fas', 'copy']" class="copy-icon" />
    {{ buttonText }}
  </button>
</template>

<script>
export default {
  name: 'CopyButton',
  props: {
    buttonText: {
      type: String,
      default: 'Copy Plan'
    }
  },
  emits: ['copy-plan']
}
</script>