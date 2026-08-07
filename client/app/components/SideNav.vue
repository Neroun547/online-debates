<template>
  <div
    class="border-primary border-r-[1.5px] fixed top-[50px] h-full bg-white z-10 shadow-lg"
  >
    <div class="w-[120px] m-auto">
      <div class="block m-auto mt-5">
        <ULink
          to="/user/topics"
          active-class="text-primary"
          inactive-class="text-black"
          class="flex items-center"
        >
          <UIcon name="lucide:volume-1" class="block mr-2" />
          <div class="text-left w-full">My Topics</div>
        </ULink>
      </div>
      <div class="block m-auto mt-5">
        <ULink
          to="/"
          active-class="text-primary"
          inactive-class="text-black"
          class="flex items-center"
        >
          <UIcon name="lucide:list" class="block mr-2" />
          <div class="text-left w-full">Categories</div>
        </ULink>
      </div>
      <div class="block m-auto mt-5">
        <ULink
          to="/settings"
          active-class="text-primary"
          inactive-class="text-black"
          class="flex items-center"
        >
          <UIcon name="lucide:settings" class="block mr-2" />
          <div class="text-left w-full">Settings</div>
        </ULink>
      </div>
      <div class="border-gray-200 border-t mt-5"></div>
      <div class="mt-5">
        <div class="flex items-center">
          <UIcon name="lucide:log-in" class="text-red-600 mr-2" />
          <button @click="userStore.logout" class="cursor-pointer">Exit</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useUserStore } from "~/store/auth/user.store";

const userStore = useUserStore();
</script>
