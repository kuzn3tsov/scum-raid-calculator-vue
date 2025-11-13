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

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) { // Only if user hasn't set preference
                this.isDark = e.matches
                this.applyTheme()
            }
        })
    },
    methods: {
        toggleTheme() {
            this.isDark = !this.isDark
            this.applyTheme()
            localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
        },
        applyTheme() {
            const theme = this.isDark ? 'dark' : 'light'
            document.documentElement.setAttribute('data-theme', theme)

            // Also update meta theme-color for mobile browsers
            const metaThemeColor = document.querySelector("meta[name=theme-color]")
            if (metaThemeColor) {
                metaThemeColor.setAttribute("content", this.isDark ? '#2c2c2c' : '#f8f9fa')
            }
        }
    }
}
</script>

<style scoped>
.theme-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--border-color);
    color: var(--text-primary);
    border: none;
    padding: 8px 10px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 12px;
    white-space: nowrap;
    height: 40px;
    box-sizing: border-box;
    font-weight: bold;
    transition: all 0.3s ease;
}

.theme-toggle:hover {
    background: var(--border-light);
    transform: translateY(-1px);
}

.theme-icon {
    color: var(--accent-color);
    font-size: 1em;
}

.theme-text {
    font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
    .theme-toggle .theme-text {
        display: none;
    }

    .theme-toggle {
        padding: 8px;
        min-width: 44px;
        justify-content: center;
    }
}
</style>