<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useOrdersStore } from "../stores/orders";
import { DataTable, AutoComplete, Column, Button } from "primevue";

export default defineComponent({
  components: { DataTable, Column, Button, AutoComplete },
  setup() {
    const store = useOrdersStore();
    const orders = ref([]);
    const total = ref(0);
    const pageSize = ref(10);
    const statusFilter = ref<{ label: string; value: string }>(null);
    const statusOptions = [
      { label: "All", value: null },
      { label: "Pending", value: "PENDING" },
      { label: "In Progress", value: "IN_PROGRESS" },
      { label: "Completed", value: "COMPLETED" },
    ];

    const fetchOrders = async (page = 1) => {
      const res = await store.fetchOrders({
        offset: page,
        limit: pageSize.value,
        status: statusFilter.value?.value,
      });
      orders.value = res.data.data;
      total.value = res.data.total;
    };

    const onPage = (e: any) => {
      fetchOrders(e.page + 1);
    };

    onMounted(() => fetchOrders());

    const handleToggleStatus = (_id: string, status: string) => {
      store.toggleStatus(_id, status);
    };

    return {
      orders,
      total,
      pageSize,
      fetchOrders,
      onPage,
      statusOptions,
      statusFilter,
      handleToggleStatus,
    };
  },
});
</script>

<template>
  <div>
    <div class="flex gap-2 items-center mb-2">
      <label for="status">Status:</label>

      <AutoComplete
        v-model="statusFilter"
        dropdown
        :suggestions="statusOptions"
        optionLabel="label"
        optionValue="value"
      />
      <Button label="Refresh" icon="pi pi-refresh" @click="fetchOrders(1)" />
    </div>

    <DataTable
      :value="orders"
      :paginator="true"
      :rows="pageSize"
      :totalRecords="total"
      :lazy="true"
      @page="onPage"
    >
      <Column field="_id" header="Order ID" />
      <Column field="product" header="Product" />
      <Column field="quantity" header="Qty" />
      <Column field="status" header="Status" />
      <Column field="dueDate" header="Due Date">
        <template #body="slotProps">
          <span>
            {{ new Date(slotProps.data.dueDate).toLocaleDateString() }}
          </span>
        </template></Column
      >
      <Column field="priorityScore" header="Priority">
        <template #body="slotProps">
          <span>
            {{ slotProps.data.priorityScore }}
          </span>
        </template>
      </Column>
      <Column header="Actions">
        <template #body="slotProps">
          <Button
            label="Toggle"
            icon="pi pi-refresh"
            @click="
              handleToggleStatus(slotProps.data._id, slotProps.data.status)
            "
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped></style>
