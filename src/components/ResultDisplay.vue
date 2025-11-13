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