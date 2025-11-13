<template>
    <button class="theme-toggle" @click="toggleTheme"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
        <font-awesome-icon :icon="['fas', isDark ? 'sun' : 'moon']" class="theme-icon" />
        <span class="theme-text">{{ isDark ? $t('app.lightMode') : $t('app.darkMode') }}</span>
    </button>
</template>

<script>
export default {
    name: 'ThemeToggle',
    data() {
        return {
            isDark: true
        }
    },
    mounted() {
        // Check for saved theme preference or prefer dark scheme
        const savedTheme = localStorage.getItem('theme')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

        this.isDark = savedTheme ? savedTheme === 'dark' : prefersDark
        this.applyTheme()
    },
    methods: {
        toggleTheme() {
            this.isDark = !this.isDark
            this.applyTheme()
            localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
        },
        applyTheme() {
            if (this.isDark) {
                document.documentElement.setAttribute('data-theme', 'dark')
            } else {
                document.documentElement.setAttribute('data-theme', 'light')
            }
        }
    }
}
</script>