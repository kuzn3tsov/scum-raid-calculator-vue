<template>
    <button id="share-btn" :class="{ disabled: disabled }" @click="$emit('share-plan')" :disabled="disabled">
        <font-awesome-icon :icon="['fas', 'share-alt']" class="share-icon" />
        {{ buttonText }}
    </button>
</template>

<script>
export default {
    name: 'ShareButton',
    props: {
        buttonText: {
            type: String,
            default: 'Share Plan'
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    emits: ['share-plan']
}
</script>

<style scoped>
#share-btn {
    padding: 12px 24px;
    background: #3498db;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    color: white;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
    width: 100%;
    transition: all 0.3s ease;
}

#share-btn:hover:not(.disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

#share-btn.disabled {
    background: #7f8c8d;
    cursor: not-allowed;
    opacity: 0.6;
}

.share-icon {
    font-size: 1.1em;
}
</style>