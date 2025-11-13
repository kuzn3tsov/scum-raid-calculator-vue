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

<style scoped>
.language-selector {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--border-color);
    padding: 8px 10px;
    border-radius: 8px;
    min-width: auto;
    flex-shrink: 0;
    height: 40px;
    box-sizing: border-box;
    transition: all 0.3s ease;
}

.language-selector:hover {
    background: var(--border-light);
}

.language-icon {
    color: var(--accent-color);
    font-size: 1em;
    flex-shrink: 0;
}

.language-selector select {
    background: transparent;
    color: var(--text-primary);
    border: none;
    padding: 0;
    cursor: pointer;
    font-size: 12px;
    flex: 1;
    outline: none;
    min-width: 0;
    font-family: inherit;
    font-weight: bold;
    width: 40px;
}

.language-selector select option {
    background: var(--secondary-bg);
    color: var(--text-primary);
    font-size: 12px;
    padding: 4px 6px;
}

/* Responsive */
@media (max-width: 768px) {
    .language-selector {
        padding: 8px;
        min-width: 44px;
        justify-content: center;
    }
}
</style>