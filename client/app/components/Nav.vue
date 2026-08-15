<template>
  <nav
    class="border-[1.5px] border-primary h-[50px] flex justify-between shadow-lg fixed w-full bg-white z-10"
  >
    <div class="flex items-center h-full ml-2">
      <button
        v-if="appStore.isGoBackButtonVisible"
        class="block mr-5 mt-1 cursor-pointer"
        @click="goBack"
      >
        <UIcon name="lucide:arrow-left" class="w-[20px] h-[20px]" />
      </button>
      <button @click="toggleMenu" class="max-[1300px]:block hidden p-2">
        <UIcon name="lucide:menu" class="text-black" />
      </button>
      <div class="max-[1300px]:ml-5">{{ isUserOnlineText }}</div>
      <div class="ml-3">
        <USwitch v-model="localIsOnlineState" color="success" />
      </div>
    </div>
    <div class="flex items-center mr-2">
      <div>
        <ULink to="/settings">
          <UIcon name="lucide:settings" class="h-[24px] w-[24px]" />
        </ULink>
      </div>
    </div>
  </nav>
</template>
<script setup>
import { useAppStore } from "~/store/app-store";
import { useUserStore } from "~/store/user/user.store";

const emit = defineEmits(["toggleMenu"]);

const userStore = useUserStore();
const appStore = useAppStore();

const isMenuOpen = ref(false);

const localIsOnlineState = ref(false);

const isUserOnlineText = computed(() => {
  if (localIsOnlineState.value) {
    return "I am online";
  }
  return "I am offline";
});

function goBack() {
  if (
    appStore.isGoBackButtonVisible &&
    typeof appStore.goBackAction === "function"
  ) {
    appStore.goBackAction();
  }
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
  emit("toggleMenu", isMenuOpen.value);
}

watch(localIsOnlineState, () => {
  userStore.updateIsOnlineState(localIsOnlineState.value);
});

onMounted(() => {
  localIsOnlineState.value = userStore.isOnline;
});
</script>
