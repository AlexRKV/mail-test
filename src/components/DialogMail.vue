<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="dialog">
      <q-layout view="Lhh lpR fff" container class="bg-white text-dark">
        <q-header class="bg-primary">
          <q-toolbar>
            <q-btn
              flat
              v-close-popup
              round
              dense
              icon="close"
              @click="$router.go(-1)"
            />
          </q-toolbar>
        </q-header>
        <q-page-container>
          <q-page padding>
            <q-input v-model="text" filled type="textarea" />
            <div v-if="getStatus" class="q-pa-md">
              <q-btn
                @click="handleDialogHide"
                color="primary"
                label="добавить в черновик"
              />
            </div>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>
  </div>
</template>

<script>
import { STATES } from "src/const";
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
    console.log(dialog.value);

    const text = ref("");

    watch(
      () => dialog.value,
      (value) => {
        if (value) {
          console.log(text);
          text.value = props.message.body;
        }
      },
      { immediate: true }
    );

    const getStatus = computed(() => {
      return props.message.state !== STATES.INCOMING;
    });

    const handleDialogHide = () => {
      dialog.value = false;

      emit("close", {
        id: props.message.id,
        text: text.value,
      });
    };

    return {
      text,
      dialog,
      getStatus,
      handleDialogHide,
    };
  },
});
</script>
