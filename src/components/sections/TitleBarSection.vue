<template>
  <div class="text-white flex justify-between text-xxs lg:text-xs cursor-pointer select-none title-bar bg-primary">
    <div @mousedown="startDrag" class="flex flex-1 flex-row justify-start items-center text-left px-2 py-1 lg:py-2">
      <img src="@/assets/images/papsi_icon.png" width="20" height="20" class="mr-1" />
      <p class="font-medium uppercase">
        {{titleBar}}
      </p>
    </div>

    <div class="flex flex-row z-50" style="gap: 0.3rem">
      <img :src="getIcon('min')" width="30" height="30" class="cursor-pointer p-2 hover:bg-primary-dark"
        @click="sendCommand('min')" />
      <img :src="getIcon('exit')" width="30" height="30" class="cursor-pointer p-2 hover:bg-primary-dark"
        @click="exit" />
    </div>
  </div>
  <div v-if="!$store.state.window" class="bg-white w-full p-3 flex flex-row justify-between items-center">
    <div class="flex flex-row items-center justify-center">
      <p class="text-primary font-bold">Surcharge Computation</p>
      <div class="ml-2 p-1" :class="{
        'bg-error': prodMode === 'TEST',
        'bg-primary': prodMode !== 'TEST'
      }">
        <p class="text-white text-xs">{{ prodMode }}</p>
      </div>
    </div>
    <div class="flex flex-row justify-center items-center">
      <div v-if="$route.name === 'generate'" class="bg-warning-dark hover:bg-warning text-white px-2 py-1 mr-3 text-sm font-bold flex flex-row items-center justify-center cursor-pointer" @click="refresh">
        <img src="@/assets/icons/papsi_refresh_white.svg" class="w-5 h-5 mr-1">
      </div>
      <div class="flex items-center justify-center">
        <img src="@/assets/icons/papsi_user.svg" width="20" height="20" class="mr-1" />
        <p class="font-bold text-sm text-primary">
          {{ username }}
        </p>
      </div>
    </div>
  </div>

  <transition name="slide-in">
    <MessageBoxControl v-if="message_modal" :is_visible="message_modal" :positiveButton="'Yes'"
      @positiveClick="sendCommand('exit');" :negativeButton="'No'" @negativeClick="message_modal = false"
      :theme="'warning'" :title="'Exit'" :message="'Are you sure you want to close the application?'" style="z-index: 99999999999999 !important;">
    </MessageBoxControl>
  </transition>

</template>

<script>
import mixin from "@/mixins/controls.js";
import MessageBoxControl from "../controls/MessageBoxControl.vue";

export default {
  name: "titlebar-section",
  mixins: [mixin],
  components: {
    MessageBoxControl,
  },
  emits: ['exit'],
  data() {
    return {
      mobile_modal: false,
      version_modal: false,
      message_modal: false,
      minimized: false,
      login_page: false,
    };
  },
  computed: {
    prodMode() {
      return this.$store.state.system_info?.production_mode || '';
    },
    username() {
      return this.$store.state.system_info?.username || '';
    },
    titleBar() {
      if (!this.$store.state.window) {
        return 'PHILIPPINE ARMY FINANCE CENTER PRODUCERS INTEGRATED COOPERATIVE';
      } else {
        return this.$store.state.title_bar;
      }
    }
  },
  mounted() {
    if (window.chrome?.webview) {
      window.chrome.webview.addEventListener("message", this.handleWebResponse);
    }
    window.chrome.webview.postMessage({ action: "get_info" });
    window.addEventListener("keydown", this.handleHotkeys);
  },
  beforeUnmount() {
    if (window.chrome?.webview) {
      window.chrome.webview.removeEventListener(
        "message",
        this.handleWebResponse
      );
    }

    window.removeEventListener("keydown", this.handleHotkeys);
  },
  methods: {
    exit() {
      if (!this.$store.state.window) {
        this.message_modal = true;
      } else {
        this.sendCommand('exit');
        this.$store.state.openedLedgers = {};
        console.log(this.$store.state.openedLedgers)
      }
    },
    sendCommand(cmd) {
      if (window.chrome?.webview) {
        window.chrome.webview.postMessage(cmd);
      }

      if (cmd === 'exit') {
        this.$emit('exit');
      }
    },
    handleMax() {
      this.minimized = !this.minimized;
      this.sendCommand("max");
    },
    startDrag() {
      if (window.chrome?.webview) {
        window.chrome.webview.postMessage("drag");
      }
    },
    handleHotkeys(e) {
      if (e.key === "Escape" && this.$store.state.window) {
        this.sendCommand('exit');
        this.$store.state.openedLedgers = {};
        console.log(this.$store.state.openedLedgers);
      }
    },
    handleWebResponse(event) {
      const msg = event.data;
      const store = this.$store.state;

      if (msg.type === "system_info") {
        store.system_info = msg.data;
        store.branch_name = msg.data.branch_name;

        // Map permissions dynamically based on access_string and permission_string
        const accessString = msg.data.access_string || "";
        const permissionString = msg.data.permission_string || "";
        store.permissions = [];

        for (let i = 0; i < accessString.length; i++) {
          if (permissionString[i] === '1') {
            store.permissions.push(accessString[i]);
          }
        }

        console.log("Mapped Permissions:", store.permissions);
      }
    },
  },
};
</script>

<style scoped>
.title-bar {
  z-index: 9999 !important;
}
</style>
