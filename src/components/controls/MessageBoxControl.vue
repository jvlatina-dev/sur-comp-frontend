<template>
    <div v-if="is_visible" class="fixed flex items-center justify-center papsi-modal-overlay" style="z-index: 999999999;">
      <div class="bg-white w-1/3 relative papsi-modal overflow-hidden rounded p-6 xl:rounded-3xl">
        <div class="modal-body">
          <div class="flex flex-col text-center align-middle justify-center items-center">
                    <div v-if="theme === 'success'" class="flex justify-center align-middle items-center rounded-full bg-primary-light h-22 w-22">
                        <div class="flex justify-center align-middle items-center rounded-full h-16 w-16 bg-primary p-4">
                            <img src="@/assets/icons/check_icon.svg" alt="Success" class="h-12 w-12" />
                        </div>
                    </div>

                    <div v-if="theme === 'info'" class="flex justify-center align-middle items-center rounded-full bg-info-light h-22 w-22">
                        <div class="flex justify-center align-middle items-center rounded-full h-16 w-16 bg-info p-4">
                            <img src="@/assets/icons/info_icon.svg" alt="Information" class="h-12 w-12" />
                        </div>
                    </div>

                    <div v-if="theme === 'warning'" class="flex justify-center align-middle items-center rounded-full bg-warning-lighter h-22 w-22">
                        <div class="flex justify-center align-middle items-center rounded-full h-16 w-16 bg-warning p-4">
                            <img src="@/assets/icons/warning_icon.svg" alt="Warning" class="h-12 w-12" />
                        </div>
                    </div>

                    <div v-if="theme === 'error'" class="flex justify-center align-middle items-center rounded-full bg-error-light h-22 w-22">
                        <div class="flex justify-center align-middle items-center rounded-full h-16 w-16 bg-error p-4">
                            <img src="@/assets/icons/error_icon.svg" alt="Error" class="h-12 w-12 " />
                        </div>
                    </div>

                    <p :class="['mt-2 xl:mt-4 text-lg lg:text-2xl font-bold', themeTextClass]">
                      {{ title }}
                    </p>
                    <p class="mt-2 text-sm px-3 text-gray-600 select-text whitespace-pre-line">{{ message }}</p>
                    <slot></slot>

                    <div class="flex flex-row justify-center mt-6 w-full" style="gap: 1rem;">
                      <ButtonControl :variant="theme" @click="$emit('positiveClick')">
                        {{ positiveButton }}
                      </ButtonControl>
                      <ButtonControl
                        v-if="negativeButton && negativeButton !== ''"
                        :variant="secondaryVariant"
                        @click="$emit('negativeClick')"
                      >
                        {{ negativeButton }}
                      </ButtonControl>
                    </div>
                  </div>
        </div>
      </div>
    </div>
  </template>
  
<script>

import ButtonControl from '@/components/controls/ButtonControl.vue';

export default {
  name: "v-messagebox",
  components: {
    ButtonControl
  },
  props: {
    is_visible: Boolean,
    title: String,
    message: String,
    positiveButton: {
      type: String,
      default: 'OK'
    },
    negativeButton: {
      type: String,
      default: ''
    },
    theme: {
      type: String,
      default: '', 
      validator: value => ['success', 'info', 'warning', 'error', ''].includes(value)
    }
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeydown);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeydown);
  },
  computed: {
    themeTextClass() {
      const themeTextMap = {
        success: 'text-primary',
        info: 'text-info',
        warning: 'text-warning',
        error: 'text-error'
      };
      return themeTextMap[this.theme] || '';
    },
    secondaryVariant() {
      return this.theme ? `${this.theme}-secondary` : 'secondary';
    }
  },
  methods: {
    // handleKeydown(e) {
    //   if (this.is_visible && e.key === "Enter") {
    //     this.$emit("positiveClick");
    //   }
    // }
  }
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
  </style>