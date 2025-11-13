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