<template>
  <div class="w-full">
    <div class="relative w-full">
      <!-- ComboBox (Select) -->
      <select
        :id="fieldId"
        v-model="selectedValue"
        @focus="focused = true"
        @blur="focused = false"
        :disabled="disabled"
        class="combo-input w-full p-3 text-xs border-2 border-gray-200 bg-white rounded-md appearance-none"
      >
        <option value="" disabled hidden>
          {{ placeholder }}
        </option>
        <option
          v-for="(option, index) in options"
          :key="index"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- Floating Label -->
      <label
        :for="fieldId"
        :class="[
          'combo-label absolute bg-white px-1 text-xs ',
          (focused || selectedValue !== '' && selectedValue !== null && selectedValue !== undefined) ? 'label-floating text-primary ' : '',
          disabled ? 'label-disabled text-gray-500 bg-gray-100 ' : ''
        ]"
      >
        {{ label }} <span v-if="required" class="text-error">*</span>
      </label>

      <!-- Dropdown Icon -->
      <span class="dropdown-icon absolute pointer-events-none flex items-center" :class="[disabled ? 'bg-transparent' : 'bg-white']">
        <img src="@/assets/icons/down_icon.svg" alt="">
      </span>
    </div>

  </div>
</template>

<script>


export default {
  name: "v-combobox",
  props: {
    label: String,
    placeholder: String,
    options: {
      type: Array,
      required: true,
    },
    modelValue: String,
    disabled: Boolean,
    fieldId: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedValue: this.modelValue ?? "",
      focused: false,
    };
  },
  watch: {
    modelValue(newVal) {
      this.selectedValue = newVal;
    },
    selectedValue(newVal) {
      this.$emit("update:modelValue", newVal);
    },
  },
  methods: {
  },
};
</script>

<style scoped>
.combo-input {
  transition: border-color 0.3s;
  appearance: none;
}

.combo-input:focus {
  border-color: #016b00;
  outline: none;
}

.combo-input:disabled {
  background-color: #f8f8f8;
  color: #999;
  cursor: not-allowed;
}

.combo-input option:disabled {
  color: #9ca3af; /* Tailwind's gray-400 */
  background-color: #f9fafb; /* Slightly lighter bg for disabled options */
}

.combo-label {
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  background-color: transparent;
  transition: all 0.2s ease-in-out;
  pointer-events: none;
}

.label-floating {
  top: 0;
  transform: translateY(-50%) scale(1);
  color: #016b00;
  background-color: white;
}

.dropdown-icon {
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  color: #6b7280;
}

input.combo-input:-webkit-autofill,
input.combo-input:-webkit-autofill:hover,
input.combo-input:-webkit-autofill:focus,
textarea.combo-input:-webkit-autofill,
select.combo-input:-webkit-autofill,
select.combo-input:-webkit-autofill:hover,
select.combo-input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px white inset !important;
  -webkit-text-fill-color: #333333 !important;
  caret-color: #333333 !important;
  transition: background-color 9999s ease-in-out 0s !important;
}

/* For disabled autofilled selects */
select.combo-input:disabled:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px #f8f8f8 inset !important;
}
</style>
