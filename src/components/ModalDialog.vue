<template>
    <div v-if="show" class="modal-overlay" @click.self="closeModal">
        <div class="modal-dialog">
            <div class="modal-header">
                <h3>{{ title }}</h3>
                <button class="close-btn" @click="closeModal" :aria-label="$t('common.close')">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
            </div>

            <div class="modal-content">
                <p>{{ message }}</p>
            </div>

            <div class="modal-actions">
                <button v-if="type === 'confirm'" class="modal-btn cancel-btn" @click="handleCancel">
                    {{ $t('common.cancel') }}
                </button>
                <button class="modal-btn confirm-btn" @click="handleConfirm">
                    {{ confirmText }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ModalDialog',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: 'Information'
        },
        message: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: 'info', // 'info', 'success', 'error', 'confirm'
            validator: (value) => ['info', 'success', 'error', 'confirm'].includes(value)
        },
        confirmText: {
            type: String,
            default: 'OK'
        }
    },
    emits: ['confirm', 'cancel', 'close'],
    methods: {
        closeModal() {
            this.$emit('close');
        },
        handleConfirm() {
            this.$emit('confirm');
            this.closeModal();
        },
        handleCancel() {
            this.$emit('cancel');
            this.closeModal();
        }
    },
    watch: {
        show(newVal) {
            if (newVal) {
                // Prevent body scroll when modal is open
                document.body.style.overflow = 'hidden';
            } else {
                // Restore body scroll when modal is closed
                document.body.style.overflow = '';
            }
        }
    },
    beforeUnmount() {
        // Ensure body scroll is restored when component is destroyed
        document.body.style.overflow = '';
    }
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
    backdrop-filter: blur(5px);
}

.modal-dialog {
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

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 15px;
    border-bottom: 1px solid var(--border-color);
    background: var(--tertiary-bg);
    border-radius: 12px 12px 0 0;
}

.modal-header h3 {
    color: var(--accent-color);
    margin: 0;
    font-family: 'Russo One', sans-serif;
    font-size: 1.2em;
}

.modal-content {
    padding: 20px;
    color: var(--text-primary);
    line-height: 1.5;
}

.modal-content p {
    margin: 0;
    white-space: pre-line;
}

.modal-actions {
    display: flex;
    gap: 10px;
    padding: 15px 20px 20px;
    border-top: 1px solid var(--border-color);
    background: var(--tertiary-bg);
    border-radius: 0 0 12px 12px;
}

.modal-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
    flex: 1;
}

.confirm-btn {
    background: #27ae60;
    color: white;
}

.confirm-btn:hover {
    background: #219653;
    transform: translateY(-1px);
}

.cancel-btn {
    background: #7f8c8d;
    color: white;
}

.cancel-btn:hover {
    background: #6c7a7d;
    transform: translateY(-1px);
}

/* Modal type variations */
.modal-dialog.success .modal-header {
    border-bottom-color: #27ae60;
}

.modal-dialog.success .modal-header h3 {
    color: #27ae60;
}

.modal-dialog.error .modal-header {
    border-bottom-color: #e74c3c;
}

.modal-dialog.error .modal-header h3 {
    color: #e74c3c;
}

.modal-dialog.confirm .modal-header {
    border-bottom-color: var(--accent-color);
}

.modal-dialog.confirm .modal-header h3 {
    color: var(--accent-color);
}
</style>