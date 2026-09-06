<template>
    <UModal>
        <template #title>
            <h2>{{ props.title }}</h2>
        </template>
        <template #body>
            <p>{{ props.description }}</p>
        </template>
        <template #footer>
            <div class="flex justify-end w-full">
                <UButton label="Ok" @click="emit('close')" class="cursor-pointer" />
            </div>
        </template>
    </UModal>
</template>
<script setup lang="ts">
    interface Props {
        title: string;
        description: string;
    }
    const emit = defineEmits(["close"]);
    const props = defineProps<Props>();
</script>
