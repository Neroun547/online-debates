<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const items: NavigationMenuItem[] = [
  {
    label: "Categories",
    icon: "lucide:list",
    to: "/",
    exact: true
  },
  {
    label: "Subjects",
    icon: "lucide:notebook",
    to: "/subjects",
  },
  {
    label: "Users",
    icon: "lucide:user",
    to: "/users"
  },
  {
    label: "Settings",
    icon: "lucide:settings",
    to: "/settings"
  },
  {
    label: "Support",
    icon: "lucide:circle-question-mark",
    to: "/support"
  }
];
</script>

<template>
  <UDashboardSidebar
    collapsible
    resizable
    :ui="{ footer: 'border-t border-default' }"
  >
    <template #header="{ collapsed }">
      <h2 class="text-center w-full" v-if="!collapsed">Online debates admin</h2>
    </template>
    <template #default="{ collapsed }">
      <UNavigationMenu
        :collapsed="collapsed"
        :items="items"
        orientation="vertical"
      ></UNavigationMenu>
    </template>
  </UDashboardSidebar>
</template>
