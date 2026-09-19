<template>
  <div class="flex w-full justify-between p-5 border-b items-center border-gray-200">
    <div></div>
    <div class="flex max-w-[500px] justify-between w-full max-md:hidden">
      <ULink to="/signup" class="text-black">Try it</ULink>
      <ULink to="/support" class="text-black">Support</ULink>
      <ULink to="/chat-rules" class="text-black">Chat rules</ULink>
    </div>
    <div>
      <ULink to="/auth">
        <button
          class="bg-blue-500 cursor-pointer pl-10 pr-10 pt-2 pb-2 text-white rounded-xl max-md:text-sm"
        >
          Log in
        </button>
      </ULink>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
