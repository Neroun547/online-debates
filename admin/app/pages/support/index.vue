<template>
  <div>
    <div class="mb-5 flex items-center justify-between">
      <h1 class="text-2xl">Support messages</h1>
    </div>

    <UTable :data="messages" :columns="tableColumns" :loading="isTableLoading">
      <template #actions-cell="{ row }">
        <div class="flex justify-end">
          <UButton
            label="View"
            icon="lucide:eye"
            size="xs"
            variant="outline"
            class="cursor-pointer"
            @click="openInfoModal(row.original)"
          />
        </div>
      </template>
      <template #message-cell="{ row }">
        <p>{{ row.original.message.substring(0, 20) }}...</p>
      </template>

      <template #empty>
        <div class="py-8 text-center text-muted">No support messages found</div>
      </template>
    </UTable>

    <div class="flex justify-end border-t border-default px-4 pt-4">
      <UPagination
        :page="page"
        :items-per-page="limit"
        :total="totalMessagesCount"
        @update:page="updatePage"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { SupportItemInterface } from "~/store/support/interfaces/get-messages-response.interface";
import { useSupportStore } from "~/store/support/support.store";
import BaseInfoModal from "~/components/BaseInfoModal.vue";

const overlay = useOverlay();
const infoModal = overlay.create(BaseInfoModal);

const supportStore = useSupportStore();

const messages = ref<SupportItemInterface[]>([]);
const isTableLoading = ref(false);

const page = ref(1);
const limit = 20;
const totalMessagesCount = ref(0);

const tableColumns: TableColumn<SupportItemInterface>[] = [
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "message",
    header: "Message"
  },
  {
    id: "actions",
  },
];

function openInfoModal(data: SupportItemInterface) {
  infoModal.open({
    title: "Message from " + data.email,
    description: data.message,
  });
}

async function getMessages() {
  isTableLoading.value = true;

  const response = await supportStore.getMessages({
    page: page.value,
    limit,
  });

  if (response) {
    messages.value = response.data;
    totalMessagesCount.value = response.count;
  }

  isTableLoading.value = false;
}

function updatePage(newPage: number) {
  page.value = newPage;
}

watch(page, getMessages);

onMounted(getMessages);
</script>
