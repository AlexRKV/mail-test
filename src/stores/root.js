import { defineStore } from "pinia";
import { source } from "../../public/messages.js";
import { STATES } from "src/const";

export const useRootStore = defineStore("rootStore", {
  state: () => ({
    messages: [...source],
  }),
  getters: {
    drafts: (s) => s.messages.filter((item) => item.state === STATES.DRAFTS),
    removed: (s) => s.messages.filter((item) => item.state === STATES.REMOVED),
    incoming: (s) =>
      s.messages.filter((item) => item.state === STATES.INCOMING),
    outbounds: (s) =>
      s.messages.filter((item) => item.state === STATES.OUTBOUND),
  },

  actions: {
    getMessageById(id) {
      return this.messages.find((item) => String(item.id) === id);
    },

    confirmTransition(oldState, newState) {
      if (oldState === newState) {
        return true;
      } else {
        if (newState === STATES.REMOVED) {
          return true;
        }
        return oldState !== STATES.INCOMING;
      }
    },

    transitionTo(message, newState) {
      const validTransition = this.confirmTransition(message.state, newState);
      if (validTransition) {
        message.state = newState;
      }
      return validTransition;
    },

    updateMessage(id, newText) {
      const message = this.messages.find((message) => message.id === id);
      if (message && this.transitionTo(message, STATES.DRAFTS)) {
        message.body = newText;
      }
    },

    removeMessage(id) {
      const message = this.messages.find((message) => message.id === id);
      if (message) {
        this.transitionTo(message, STATES.REMOVED);
      }
    },
    removeFromRemoved(id) {
      this.messages = this.messages.filter((message) => message.id !== id);
    },

    createNewMessage(initialState = STATES.DRAFTS) {
      const newMessage = {
        id: String(this.messages.length + 1),
        body: "Type something... ",
        name: "Who Knows...",
        email: "somewhere@whoknows.com",
        state: STATES.DRAFTS,
      };
      this.messages.push({ ...newMessage, state: initialState });
      return newMessage;
    },

    sendAllFromDrafts(drafts) {
      drafts.forEach((item) => {
        if (item.state === STATES.DRAFTS) {
          item.state = STATES.OUTBOUND;
        }
      });
    },
  },
});
