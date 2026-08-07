<template>
  <div
    class="fixed inset-0 z-50 grid place-items-center"
    role="status"
    aria-live="polite"
    :aria-label="label"
  >
    <div
      class="size-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary motion-reduce:animate-none"
      aria-hidden="true"
    />
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String
  }
})
</script>
