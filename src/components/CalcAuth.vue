<template>
    <div v-if="showAuthModal" class="auth-modal-overlay" @click.self="closeModal">
        <div class="auth-modal">
            <div class="auth-header">
                <h3>{{ $t('auth.title') }}</h3>
                <button class="close-btn" @click="closeModal" :aria-label="$t('auth.close')">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
            </div>

            <div class="auth-content">
                <div v-if="!unauthorized" class="auth-form">
                    <div class="form-group">
                        <label for="username">{{ $t('auth.usernameLabel') }}</label>
                        <input id="username" type="text" v-model="username"
                            :placeholder="$t('auth.usernamePlaceholder')"
                            :class="{ 'error': loginAttempted && !username }" @keyup.enter="attemptLogin" />
                    </div>

                    <div class="form-group">
                        <label for="password">{{ $t('auth.passwordLabel') }}</label>
                        <input id="password" type="password" v-model="password"
                            :placeholder="$t('auth.passwordPlaceholder')"
                            :class="{ 'error': loginAttempted && !password }" @keyup.enter="attemptLogin" />
                    </div>

                    <button class="login-btn" @click="attemptLogin">
                        <font-awesome-icon :icon="['fas', 'lock']" />
                        {{ $t('auth.loginButton') }}
                    </button>
                </div>

                <div v-else class="unauthorized-message">
                    <font-awesome-icon :icon="['fas', 'triangle-exclamation']" class="warning-icon" />
                    <h4>{{ $t('auth.unauthorizedTitle') }}</h4>
                    <p>{{ $t('auth.unauthorizedMessage') }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CalcAuth',
    props: {
        showAuthModal: {
            type: Boolean,
            default: false
        }
    },
    emits: ['close', 'authenticated'],
    data() {
        return {
            username: '',
            password: '',
            loginAttempted: false,
            unauthorized: false,
            correctUsername: 'ScumTech',
            correctPassword: '!NoT3chNo!',
            autoCloseTimer: null
        }
    },
    methods: {
        attemptLogin() {
            this.loginAttempted = true;

            if (!this.username || !this.password) {
                return;
            }

            if (this.username === this.correctUsername && this.password === this.correctPassword) {
                // Successful login
                this.$emit('authenticated');
                this.closeModal();
            } else {
                // Failed login
                this.unauthorized = true;
                this.username = '';
                this.password = '';
                this.loginAttempted = false;

                // Set auto-close timer
                this.autoCloseTimer = setTimeout(() => {
                    this.closeModal();
                }, 5000);
            }
        },

        closeModal() {
            // Clear any existing timer
            if (this.autoCloseTimer) {
                clearTimeout(this.autoCloseTimer);
                this.autoCloseTimer = null;
            }

            // Reset form state
            this.unauthorized = false;
            this.username = '';
            this.password = '';
            this.loginAttempted = false;

            this.$emit('close');
        }
    },
    watch: {
        showAuthModal(newVal) {
            if (newVal) {
                // Reset form when modal opens
                this.unauthorized = false;
                this.username = '';
                this.password = '';
                this.loginAttempted = false;
            }
        }
    },
    beforeUnmount() {
        // Clean up timer when component is destroyed
        if (this.autoCloseTimer) {
            clearTimeout(this.autoCloseTimer);
        }
    }
}
</script>