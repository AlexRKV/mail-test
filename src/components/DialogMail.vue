<template>
  <q-dialog v-model="dialog">
    <q-layout class="bg-white text-dark">
      <q-input v-model="text" filled type="textarea" />
      <div class="q-pa-md">
        <q-btn
          @click="handleDialogHide"
          color="primary"
          class="full-width"
          label="отправить"
        />
      </div>
    </q-layout>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, computed, watch } from "vue";

export default defineComponent({
  name: "DialogMail",
  props: {
    message: {
      type: Object,
      required: true,
    },
    value: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["change", "close"],

  setup(props, { emit }) {
    const dialog = computed({
      get: () => props.value,
      set: (value) => emit("change", value),
    });

    const text = ref("");

    watch(
      () => dialog.value,
      (value) => {
        if (value) {
          text.value = props.message.body;
        }
      },
      { immediate: true }
    );

    const handleDialogHide = () => {
      dialog.value = false;
      emit("close", { id: props.message.id, text: text.value });
    };

    return {
      text,
      dialog,
      handleDialogHide,
    };
  },
});
</script>
