<template>
  <div>
    <ul class="list-disc mt-10">
      <li
        v-for="item in props.items"
        class="text-primary text-xl text-left mt-3 list-inside"
        style="list-style-type: disclosure-closed; color: rgb(174, 174, 174)"
      >
        <ULink
          v-if="item.isLink"
          class="text-primary cursor-pointer underline max-sm:text-base"
          :to="item.link"
        >
          {{ item.title }}
        </ULink>
        <span v-if="!item.isLink">{{ item.title }}</span>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
export interface ListItem {
  isLink: boolean;
  link: string;
  title: string;
  [key: string]: any;
}
interface Props {
  items: Array<ListItem>;
}

const props = defineProps<Props>();
</script>
