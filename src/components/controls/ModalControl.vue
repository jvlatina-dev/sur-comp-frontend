<template>
  <div v-if="is_visible" class="fixed flex items-center justify-center z-40 papsi-modal-overlay">
    <div :class="['bg-white rounded p-5 relative mt-5', width]" >
      
      <div class="flex flex-row justify-center items-center absolute close">
        <img
          v-show="closable"
          class=" w-5 h-5 cursor-pointer bg-white p-1 rounded-full hover:bg-gray-100 z-10"
          src="@/assets/icons/close_icon.svg"
          @click.self="closeModal"
        />
      </div>

      <div class="modal-body pr-3" style="max-height: calc(80vh); ">
        <slot></slot>
      </div>
      
    </div>
  </div>
</template>


<script>
// import mixin from "@/mixins/controls.js";

export default {
  name: "v-modal",
  // mixins: [mixin],
  props: {
    is_visible: {
      type: Boolean,
      required: true,
    },
    closable: {
      type: Boolean,
      default: true,
      required: false,
    },
    width: {
      type: String,
      default: "w-2/3",
    },
    blur: {
      type: Boolean,
      default: false,
    }
  },
  mounted() {
    document.addEventListener("keydown", this.handleKeydown);
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.handleKeydown);
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    handleKeydown(event) {
      if (event.key === "Escape" && this.closable) {
        this.closeModal();
      }
    },
  },
};
</script>

<style scoped>
.papsi-modal-overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
}

.edit-modal-overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px); /* adjust blur strength */
  -webkit-backdrop-filter: blur(6px);
}

.close {
    top: 0.45rem;
    right: 0.45rem;
}


</style>