<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useOrdersStore } from "../stores/orders";
import {
  InputNumber,
  InputText,
  IftaLabel,
  DatePicker,
  Button,
  Message,
} from "primevue";

export default defineComponent({
  components: {
    InputText,
    IftaLabel,
    InputNumber,
    DatePicker,
    Button,
    Message,
  },
  emits: ["created", "cancel"],
  setup(_, { emit }) {
    const store = useOrdersStore();
    const form = reactive({ product: "", quantity: 1, dueDate: "" });
    const errors = ref([]);

    const onSubmit = async () => {
      try {
        await store.createOrder({
          product: form.product,
          quantity: form.quantity,
          dueDate: form.dueDate,
        });
        emit("created");
      } catch (error) {
        errors.value = error.response.data.message;
      }
    };

    return { form, onSubmit, errors };
  },
});
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div class="grid grid-cols-1 gap-4">
      <IftaLabel class="w-full">
        <InputText v-model="form.product" class="w-full" />
        <label for="product">Product</label>
      </IftaLabel>
      <IftaLabel class="w-full">
        <InputNumber v-model="form.quantity" class="w-full" />
        <label for="quantity">Quantity</label>
      </IftaLabel>
      <IftaLabel class="w-full">
        <DatePicker
          v-model="form.dueDate"
          showIcon
          fluid
          iconDisplay="input"
          class="w-full"
        />
        <label for="dueDate">Due Date</label>
      </IftaLabel>
      <div>
        <Message
          v-for="errors in errors"
          :key="errors"
          severity="error"
          icon="pi pi-times-circle"
          class="mb-2"
          >{{ errors }}</Message
        >
      </div>
      <div class="flex justify-end gap-4">
        <Button @click="$emit('cancel')" severity="secondary">Cancel</Button>
        <Button type="submit">Create</Button>
      </div>
    </div>
  </form>
</template>
