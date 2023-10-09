<template>
  <div v-if="validRoute" class="q-pa-md q-gutter-md">
    <q-item>
      <q-item-section>
        <q-item-label class="text-uppercase">{{ section }}</q-item-label>
      </q-item-section>
      <q-item-section>
        <q-btn
          size="sm"
          color="primary"
          label="новое письмо"
          @click="handleNewMessageClick"
        />
      </q-item-section>
      <q-item-section>
        <q-btn
          size="sm"
          color="primary"
          label="все в отправленные"
          @click="onSendAllFromDrafts"
        />
      </q-item-section>
      <q-item-section>
        <q-btn
          size="sm"
          color="primary"
          label="получить входящие"
          @click="onCheckMailbox"
        />
      </q-item-section>
    </q-item>

    <div class="row">
      <div class="col-12 col-sm-12">
        <q-list v-for="message in messages" :key="message.id" bordered>
          <q-item clickable @click="handleItemClick(message.id)">
            <q-item-section>
              <q-item-label class="text-weight-medium">
                {{ message.email }}
              </q-item-label>
              <q-item-label>
                {{ message.name }}
              </q-item-label>
              <q-item-label overline>
                {{ message.body }}
              </q-item-label>
            </q-item-section>
            <div class="q-pa-md flex justify-center items-center">
              <q-btn
                size="sm"
                color="negative"
                round
                @click="handleRemoveMessage(message.id)"
              >
                <q-icon name="close" />
              </q-btn>
            </div>
          </q-item>
        </q-list>
      </div>
    </div>
    <DialogMail
      v-if="currentMessage"
      :value="dialog"
      @close="(e) => handleDialogClose(e)"
      :message="currentMessage"
      @change="handleDialogChange"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { MAILBOX, STATES } from "src/const";
import { useRootStore } from "stores/root";
import DialogMail from "components/DialogMail";

const validSections = [
  STATES.INCOMING,
  STATES.OUTBOUND,
  STATES.DRAFTS,
  STATES.REMOVED,
];

const props = defineProps({
  section: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const validRoute = computed(() => validSections.includes(props.section));

!validRoute.value && router.push({ path: `/${MAILBOX}/${STATES.INCOMING}` });

const store = useRootStore();
const messages = computed(() => store[props.section]);

const dialog = ref(false);

const currentMessage = computed(() => store.getMessageById(props.id));

const handleItemClick = async (id) => {
  try {
    await router.push(`/${MAILBOX}/${props.section}/edit/${id}`);
  } catch (e) {
    //
  }
};

watch(
  () => props.action,
  (value) => {
    if ((value === "new" || value === "edit") && props.id) {
      openDialog();
    } else {
      closeDialog();
    }
  }
);

const openDialog = () => {
  if (currentMessage.value) {
    dialog.value = true;
  } else {
    console.log("message not found!");
  }
};

const closeDialog = () => {
  router.push(`/${MAILBOX}/${props.section}`).catch(() => {
    //
  });
};

const handleDialogChange = (e) => {
  dialog.value = e;
};

const handleDialogClose = ({ id, text }) => {
  store.updateMessage(id, text);
  closeDialog();
};

const handleRemoveMessage = (id) => {
  if (props.section === STATES.REMOVED) {
    store.removeFromRemoved(id);
  } else {
    store.removeMessage(id);
  }
};

const randomize = () => {
  return store.messages[Math.floor(Math.random() * store.messages.length)];
};

const onCheckMailbox = () => {
  const count = randomize();
  for (let i = 0; i < count; i++) {
    store.createNewMessage(STATES.INCOMING);
  }
};

const onSendAllFromDrafts = () => {
  store.sendAllFromDrafts(store.drafts.slice(0));
};

const handleNewMessageClick = () => {
  const newMessage = store.createNewMessage();
  router.push(`/${MAILBOX}/${props.section}/new/${newMessage.id}`).catch(() => {
    //
  });
};
</script>
