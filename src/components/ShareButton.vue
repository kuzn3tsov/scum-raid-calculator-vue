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