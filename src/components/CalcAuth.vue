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
<style scoped>
.auth-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
}

.auth-modal {
    background: var(--secondary-bg);
    border-radius: 12px;
    padding: 0;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    border: 2px solid var(--border-color);
    animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(-20px) scale(0.9);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.auth-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 15px;
    border-bottom: 1px solid var(--border-color);
    background: var(--tertiary-bg);
    border-radius: 12px 12px 0 0;
}

.auth-header h3 {
    color: var(--accent-color);
    margin: 0;
    font-family: 'Russo One', sans-serif;
    font-size: 1.2em;
}

.close-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 5px;
    border-radius: 4px;
    transition: all 0.3s ease;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-btn:hover {
    color: #e74c3c;
    background: rgba(231, 76, 60, 0.1);
}

.auth-content {
    padding: 20px;
}

.auth-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.auth-form .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.auth-form .form-group label {
    color: var(--accent-color);
    font-weight: bold;
    font-size: 0.9em;
}

.auth-form .form-group input {
    padding: 12px;
    border: 2px solid var(--border-color);
    border-radius: 6px;
    background: var(--primary-bg);
    color: var(--text-primary);
    font-size: 14px;
    transition: all 0.3s ease;
}

.auth-form .form-group input:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px rgba(241, 196, 15, 0.2);
}

.auth-form .form-group input.error {
    border-color: #e74c3c;
    animation: shake 0.5s ease-in-out;
}

@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-5px);
    }

    75% {
        transform: translateX(5px);
    }
}

.login-btn {
    padding: 12px 20px;
    background: #27ae60;
    border: none;
    border-radius: 6px;
    color: white;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s ease;
    margin-top: 10px;
}

.login-btn:hover {
    background: #219653;
    transform: translateY(-1px);
}

.unauthorized-message {
    text-align: center;
    padding: 20px 0;
    animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.warning-icon {
    font-size: 3em;
    color: #e74c3c;
    margin-bottom: 15px;
}

.unauthorized-message h4 {
    color: #e74c3c;
    margin: 0 0 10px 0;
    font-size: 1.3em;
}

.unauthorized-message p {
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.5;
}
</style>