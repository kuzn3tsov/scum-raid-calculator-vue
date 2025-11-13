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

<style scoped>
#copy-btn {
  padding: 12px 24px;
  background: var(--accent-color);
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  color: #2c2c2c;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  width: 100%;
  transition: all 0.3s ease;
}

#copy-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.copy-icon {
  font-size: 1.1em;
}
</style>