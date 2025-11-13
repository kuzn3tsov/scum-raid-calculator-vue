<template>
  <div id="result">
    <div id="total-explosives">{{ totalExplosivesText }}</div>
    <div v-html="resultHtml"></div>
  </div>
</template>

<script>
export default {
  name: 'ResultDisplay',
  props: {
    totalExplosivesText: {
      type: String,
      default: ''
    },
    resultHtml: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
#result {
  margin-top: 20px;
  background: var(--tertiary-bg);
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid var(--accent-color);
}

#result .best {
  color: #2ecc71;
  font-weight: bold;
  padding: 4px 0;
}

#total-explosives {
  font-weight: bold;
  color: var(--accent-color);
  margin-bottom: 15px;
  font-size: 1.2em;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
  text-shadow: none;
}

#result div {
  margin-bottom: 6px;
  padding: 4px 0;
}

#result strong {
  color: var(--accent-color);
  display: block;
  margin-top: 12px;
  margin-bottom: 8px;
  font-size: 1.1em;
  text-shadow: none;
}
</style>