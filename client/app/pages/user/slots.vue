<template>
  <div class="mt-15">
    <h2 class="text-4xl">My slots</h2>
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from "~/store/app-store";

const appStore = useAppStore();

onMounted(() => {
  appStore.setIsLoading(false);
});
</script>
