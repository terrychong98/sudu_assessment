<script lang="ts">
import { ref } from "vue";
import OrderList from "./components/OrderList.vue";
import OrderForm from "./components/OrderForm.vue";
import { Dialog } from "primevue";

export default {
  components: { OrderList, OrderForm, Dialog },
  setup() {
    const openCreate = ref(false);
    const onCreated = () => {
      openCreate.value = false;
      orders.value.fetchOrders();
    };
    return { openCreate, onCreated };
  },
};
</script>

<template>
  <div class="container">
    <header class="header">
      <h1 class="font-bold text-2xl">Production Orders Dashboard</h1>
      <div>
        <button @click="openCreate = true" class="p-button p-component">
          New Order
        </button>
      </div>
    </header>

    <OrderList />

    <Dialog
      v-model:visible="openCreate"
      header="Create Order"
      :modal="true"
      :closable="true"
    >
      <OrderForm @created="onCreated" @cancel="openCreate = false" />
    </Dialog>
  </div>
</template>

<style scoped>
button.p-button {
  margin-left: 8px;
}
</style>
