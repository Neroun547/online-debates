<template>
  <div>
    <USelect
      v-model="selectedSex"
      value-key="value"
      :items="items"
      class="w-full"
      :placeholder="$t('signup.sex')"
    />
  </div>
</template>
<script setup lang="ts">
const { t } = useI18n();

const selectedSex = defineModel<string>("selectedSex");

const items = [
  { label: t("user.male"), value: "male" },
  { label: t("user.female"), value: "female" },
];
</script>
