<template>
  <div class="w-full">
    <div class="relative w-full">
      <!-- DateTime Input -->
      <input
        ref="dateInput"
        :id="fieldId"
        :type="isMonthOnly ? 'month' : 'date'"
        v-model="inputValue"
        :min="minDate"
        :max="maxDate"
        @focus="focused = true"
        @blur="focused = false"
        :disabled="disabled"
        @keydown.enter.prevent="handleEnter"
        class="datetime-input w-full text-xs border-2 border-grey-light bg-white rounded-md appearance-none" 
        style="padding: .7rem;"
      />


      <!-- Floating Label -->
      <label
        :for="fieldId"
        :class="[
          'datetime-label absolute px-1 text-xs bg-white',
          (focused || inputValue) ? 'label-floating text-primary' : 'w-24',
          disabled ? 'bg-grey-disabled' : ''
        ]"
      >
        {{ label }} <span v-if="required" class="text-error">*</span>
      </label>

      <!-- Calendar Icon -->
      <!-- <span class="calendar-icon absolute items-center cursor-pointer">
        <img :src="getIcon('calendar')" alt="">
      </span> -->
    </div>
  </div>
</template>

<script>
import mixin from "@/mixins/controls.js";

export default {
  name: "v-datetime",
  mixins: [mixin],
  props: {
    label: String,
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
    isMonthOnly: {   
      type: Boolean,
      default: false,
    },
    minDate: {
      type: String,
      default: null,
    },
    maxDate: {
      type: String,
      default: null,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputValue: this.modelValue || "",
      focused: false,
    };
  },
  watch: {
    modelValue(newValue) {
      this.inputValue = newValue;
    },
    inputValue(newValue) {
      this.$emit("update:modelValue", newValue);
    },
  },
  mounted() {
    if (this.autofocus && !this.disabled) {
      this.$nextTick(() => {
        this.$refs.dateInput.focus();
      });
    }
  },
  methods: {
    handleEnter() {
      // input[type=date] stores value as YYYY-MM-DD
      if (!this.inputValue) return;

      const date = new Date(this.inputValue);

      // Invalid date
      if (isNaN(date.getTime())) return;

      // Convert to MM/DD/YYYY
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const yyyy = date.getFullYear();

      const formatted = `${mm}/${dd}/${yyyy}`;

      // Emit the formatted date if needed
      this.$emit("enter", formatted);
    }
  }
};
</script>

<style scoped>
/* Positioning for floating label */
.datetime-label {
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  transition: all 0.2s ease;
  pointer-events: none;
}
.label-floating {
  display: inline-block; /* shrink background to text */
  top: 0;
  transform: translateY(-50%) scale(1);
  color: #016B00;
  background-color: white;
  padding: 0 4px;
}

.datetime-input:disabled {
  background-color: #f8f8f8;
  color: #999;
  cursor: not-allowed;
}

.bg-grey-disabled {
  background-color: #f8f8f8;
  color: #868686;
  cursor: not-allowed;
}

/* Calendar Icon positioning */
.calendar-icon {
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
}
</style>
