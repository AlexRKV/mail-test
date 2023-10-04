<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Gmail</q-toolbar-title>
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.id"
          v-bind="link"
        >
        </EssentialLink>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "../components/EssentialLink.vue";
import { MAILBOX, STATES } from "src/const";

const linksList = [
  {
    id: STATES.INCOMING,
    title: "Входящие",
    icon: "move_to_inbox",
    link: `/${MAILBOX}/${STATES.INCOMING}`,
  },
  {
    id: STATES.OUTBOUND,
    title: "Отправленные",
    icon: "send",
    link: `/${MAILBOX}/${STATES.OUTBOUND}`,
  },
  {
    id: STATES.DRAFTS,
    title: "Черновики",
    icon: "edit_document",
    link: `/${MAILBOX}/${STATES.DRAFTS}`,
  },
  {
    id: STATES.REMOVED,
    title: "Удаленные",
    icon: "close",
    link: `/${MAILBOX}/${STATES.REMOVED}`,
  },
];

export default defineComponent({
  name: "MainLayout",
  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
