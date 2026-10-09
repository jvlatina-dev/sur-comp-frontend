<template>
  <button
    :class="[
      'relative flex items-center justify-center rounded uppercase font-semibold w-full focus:outline-none transition text-sm h-10',
      (disabled || loading)
        ? 'bg-gray-400 cursor-default text-white disabled border-2 border-gray-400'
        : variantClass,
    ]"
    :disabled="disabled || loading"
  >
    <span
      v-if="loading"
      class="loader"
    />
    <span v-else>
      <slot />
    </span>
  </button>
</template>


<script>
export default {
  name: 'ButtonComponent',
  props: {
    variant: {
      type: String,
      default: 'primary', 
      validator: (value) =>
        ['primary', 'secondary', 'warning', 'info', 'error', 'primary-secondary', 'info-secondary', 'warning-secondary', 'error-secondary'].includes(value) ||
        ['success', 'info', 'warning', 'error'].some(theme => value === `${theme}-secondary`)
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    variantClass() {
      if (this.variant.endsWith('-secondary')) {
        const theme = this.variant.replace('-secondary', '');
        const borderColorMap = {
          success: 'border-primary text-primary border-2 ',
          info: 'border-info text-info border-2 ',
          warning: 'border-warning text-warning border-2 ',
          error: 'border-error text-error border-2 ',
        };
        return `bg-white border-2 ${borderColorMap[theme] || 'border-primary text-primary'}`;
      }

      switch (this.variant) {
        case 'success':
          return 'bg-primary text-white border-2 border-primary';
        case 'info':
          return 'bg-info text-white border-2  border-info';
        case 'warning':
          return 'bg-warning text-white border-2 border-warning';
        case 'error':
          return 'bg-error text-white border-2 border-error';
        case 'secondary':
          return 'bg-white border-2  border-primary text-primary';
        default:
          return 'bg-primary text-white border-2 border-primary';
      }
    }
  },
};
</script>

<style scoped>
button:hover {
  filter: brightness(1.1);
}

.disabled:hover {
  filter: none !important;
}

button:focus {
  outline: none !important;
}

.loader {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 1.5rem;
  height: 1.5rem;
  border: 4px solid transparent;
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}



</style>