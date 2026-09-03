<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const items: NavigationMenuItem[] = [
  {
    label: "Categories",
    icon: "lucide:list",
    active: true,
    to: "/"
  },
  {
    label: "Subjects",
    icon: "lucide:notebook",
    to: "/subjects"
  },
];
</script>

<template>
  <UDashboardSidebar
    collapsible
    resizable
    :ui="{ footer: 'border-t border-default' }"
  >
  <template #header>
    <h2 class="text-center w-full">Online debates admin</h2>
  </template>
    <template #default="{ collapsed }">
      <UNavigationMenu
        :collapsed="collapsed"
        :items="items"
        orientation="vertical"
      />
    </template>
  </UDashboardSidebar>
</template>
