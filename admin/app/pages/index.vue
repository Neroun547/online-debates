<template>
  <div>
  </div>
</template>
<script setup lang="ts">
import { authGuard } from "../guards/auth.guard";

onMounted(() => {
  authGuard();
});
</script>
