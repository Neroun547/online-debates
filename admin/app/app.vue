<script setup>
import { useAuthStore } from "~/store/auth/auth.store.ts";
import SideBar from "./components/SideBar.vue";
import TopBar from "./components/TopBar.vue";

const authStore = useAuthStore();
</script>

<template>
  <UApp>
    <UMain>
      <UDashboardGroup>
        <SideBar v-if="authStore.isAuth" />
        <UDashboardPanel>
          <template #header>
            <TopBar v-if="authStore.isAuth" />
          </template>
          <template #body>
            <NuxtPage />
          </template>
        </UDashboardPanel>
      </UDashboardGroup>
    </UMain>
  </UApp>
</template>
