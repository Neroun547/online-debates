<template>
  <footer class="border-t-gray-200 border-t pb-5 pt-5 relative">
    <div class="absolute left-[25px] max-sm:hidden">
      {{ $t("footer.brand") }}
    </div>
    <div class="block w-max m-auto max-md:text-sm">
      <ULink to="/support" class="mr-4 text-black">
        {{ $t("footer.support") }}
      </ULink>
      <ULink to="/privacy-policy" class="ml-4 text-black">
        {{ $t("footer.privacyPolicy") }}
      </ULink>
    </div>
  </footer>
</template>
<script setup></script>
