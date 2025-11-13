<template>
  <div class="language-selector">
    <font-awesome-icon :icon="['fas', 'globe']" class="language-icon" />
    <select v-model="currentLocale" @change="changeLanguage">
      <option value="en">🇺🇸</option>
      <option value="hr">🇭🇷</option>
      <option value="ru">🇷🇺</option>
      <option value="fr">🇫🇷</option>
      <option value="it">🇮🇹</option>
      <option value="de">🇩🇪</option>
      <option value="es">🇪🇸</option>
      <option value="zh">🇨🇳</option>
      <option value="ko">🇰🇷</option>
      <option value="nl">🇳🇱</option>
      <option value="sv">🇸🇪</option>
      <option value="sl">🇸🇮</option>
    </select>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'LanguageSelector',
  setup() {
    const { locale } = useI18n()

    const changeLanguage = () => {
      // Language is automatically updated via v-model
    }

    return {
      currentLocale: locale,
      changeLanguage
    }
  }
}
</script>