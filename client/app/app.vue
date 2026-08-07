<script setup lang="ts">
import PageLoader from "./components/PageLoader.vue";
import SideNav from "./components/SideNav.vue";
import Nav from "./components/Nav.vue";
import { useUserStore } from "./store/auth/user.store";
import { useAppStore } from "./store/app-store.ts";

const route = useRoute();

const isCurrentPublicPage = ref<boolean>(false);

const userStore = useUserStore();
const appStore = useAppStore();

const isMenuOpen = ref(false);

onBeforeRouteUpdate(() => {
  appStore.setIsLoading(true);
});

onMounted(() => {
  isCurrentPublicPage.value = isPublicPage(route.path);
});
</script>

<template>
  <UApp>
    <UMain>
      <div class="min-h-screen flex flex-col" v-if="!isCurrentPublicPage">
        <Nav
          v-if="userStore.getIsAuth"
          @toggle-menu="(value) => (isMenuOpen = value)"
        />
        <SideNav
          v-if="userStore.getIsAuth"
          style="transition: 0.3s ease"
          :class="[
            'w-[15%] max-[1300px]:w-[300px]',
            isMenuOpen
              ? 'max-[1300px]:translate-x-0'
              : 'max-[1300px]:-translate-x-full',
          ]"
        />
        <div
          :class="[
            'flex-10 w-[85%] ml-auto max-[1300px]:w-full mt-5',
            isMenuOpen ? 'max-[1300px]:blur-sm' : 'max-[1300px]:blur-none',
          ]"
          style="transition: 0.3s all"
        >
          <NuxtPage
            class="m-auto w-[85%]"
            :class="!appStore.isPageLoading ? '' : 'hidden'"
          />
          <PageLoader :class="appStore.isPageLoading ? '' : 'hidden'" />
        </div>
        <Footer
          v-if="userStore.getIsAuth"
          class="w-[85%] ml-auto max-[1300px]:w-full mt-10"
        />
      </div>
      <div v-if="isCurrentPublicPage">
        <NuxtPage
          class="m-auto w-[85%]"
        />
      </div>
    </UMain>
  </UApp>
</template>
