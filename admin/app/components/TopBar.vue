<script setup lang="ts">
import { useAuthStore } from "~/store/auth/auth.store";

const router = useRouter();

const authStore = useAuthStore();

function exit() {
  authStore.exit();
  router.push("/auth");
}
</script>

<template>
  <UDashboardNavbar title="Admin">
    <template #leading>
      <UDashboardSidebarCollapse />
    </template>

    <template #right>
      <UTooltip text="Exit">
        <UButton icon="lucide:log-in" class="cursor-pointer" @click="exit" />
      </UTooltip>
    </template>
  </UDashboardNavbar>
</template>
