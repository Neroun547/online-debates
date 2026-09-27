<script setup lang="ts">
import PageLoader from "./components/PageLoader.vue";
import SideNav from "./components/SideNav.vue";
import Nav from "./components/Nav.vue";
import { useUserStore } from "./store/user/user.store.ts";
import { useAppStore } from "./store/app-store.ts";

const route = useRoute();

const showPublicLayout = ref<boolean>(false);
const isCurrentSessionPage = ref<boolean>(false);

const userStore = useUserStore();
const appStore = useAppStore();

const isMenuOpen = ref(true);

onMounted(() => {
  const pageData = isPublicPage(route.path);

  if (pageData.page === "/support" && userStore.isAuth) {
    showPublicLayout.value = false;
  } else if (pageData.page === "/support" && !userStore.isAuth) {
    showPublicLayout.value = true;
  } else {
    showPublicLayout.value = isPublicPage(route.path).value;
  }
  isCurrentSessionPage.value = route.path.includes("/my-sessions/");
});

function showLandingNav() {
  return route.path === "/";
}

watch(
  () => route.path,
  () => {
    const pageData = isPublicPage(route.path);

    if (pageData.page === "/support" && userStore.isAuth) {
      showPublicLayout.value = false;
    } else if (pageData.page === "/support" && !userStore.isAuth) {
      showPublicLayout.value = true;
    } else {
      showPublicLayout.value = isPublicPage(route.path).value;
    }
    isCurrentSessionPage.value = route.path.includes("/my-sessions/");
  },
);
</script>

<template>
  <UApp>
    <UMain>
      <div class="min-h-screen flex flex-col" v-if="!showPublicLayout">
        <Nav
          v-if="userStore.getIsAuth"
          @toggle-menu="(value) => (isMenuOpen = value)"
        />
        <SideNav
          v-if="userStore.getIsAuth && !appStore.isSideNavHidden"
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
            'min-h-[100vh]',
            !isCurrentSessionPage || !userStore.isAuth
              ? 'flex-10 max-sm:w-full w-[85%] ml-auto max-[1300px]:w-full mt-5'
              : 'w-full',
            isCurrentSessionPage ? 'w-full' : ''
          ]"
          style="transition: 0.3s all"
        >
          <NuxtPage
            class="m-auto max-sm:w-[95%] w-[85%]"
            :class="!appStore.isPageLoading ? '' : 'hidden'"
          />
          <PageLoader :class="appStore.isPageLoading ? '' : 'hidden'" />
        </div>
        <Footer
          :class="[
            !isCurrentSessionPage
              ? 'max-sm:w-full w-[85%] ml-auto max-[1300px]:w-full mt-10'
              : 'w-full',
          ]"
        />
      </div>
      <div v-if="showPublicLayout" class="min-h-screen h-full">
        <LandingNav />
        <NuxtPage class="m-auto max-sm:w-[90%] w-[85%] min-h-screen" />
        <Footer
          :class="[
            !isCurrentSessionPage && !showPublicLayout
              ? 'max-sm:w-full w-[85%] ml-auto max-[1300px]:w-full mt-10'
              : 'w-full',
          ]"
        />
      </div>
    </UMain>
  </UApp>
</template>
