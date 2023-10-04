<template>
  <q-item clickable :to="link">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>

    <q-item-section class="items-end">
      <q-item-label>
        <div class="q-gutter-md">
          <q-badge color="primary">{{ messageCount }}</q-badge>
        </div>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { computed, defineComponent } from "vue";
import { useRootStore } from "stores/root";

export default defineComponent({
  name: "EssentialLink",
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },

    link: {
      type: String,
    },

    icon: {
      type: String,
      default: "",
    },
  },

  setup(props) {
    const store = useRootStore();
    const messageCount = computed(() => store[props.id].length);

    return {
      messageCount,
    };
  },
});
</script>
