<template>
  <div class="multi-select-wrapper">
    <!-- Dropdown trigger -->
    <div class="combo-input rounded" @click="toggleDropdown" :class="{
      'disabled': disabled,
      'active': isOpen
    }">
      <span v-if="internalValue.length" class="selected-text" :title="selectedDisplay">
        {{ selectedDisplay }}
      </span>
      <span v-else class="placeholder invisible">Placeholder</span>

      <!-- Dropdown Icon -->
      <img src="@/assets/icons/down_icon.svg" alt="dropdown" class="dropdown-icon bg-white"
        :class="{ rotate: isOpen }" />

      <!-- Floating Label -->
      <label :for="fieldId" :class="[
        'combo-label',
        (isOpen || internalValue.length > 0) ? 'label-floating' : '',
        disabled ? 'label-disabled' : ''
      ]">
        {{ label }} <span v-if="required" class="required">*</span>
      </label>
    </div>

    <!-- Dropdown -->
    <transition name="fade">
      <div v-if="isOpen" class="dropdown-list">

        <div class="range-input-bar">
          <input type="text" v-model="rangeInput" placeholder="e.g. 1-50" class="range-input" style="accent-color: #016b00;"/>
        </div>

        <!-- Select / Deselect All -->
        <div class="select-all-bar">
          <button type="button" class="select-all-btn p-3" :class="[!allSelected ? 'text-primary' : 'text-error']"
            @click.stop="toggleSelectAll">
            {{ allSelected ? 'Deselect All' : 'Select All' }}
          </button>
        </div>

        <!-- Options -->
        <div v-for="(option, index) in options" :key="index" class="dropdown-item"
          :class="{ disabled: option.disabled }">
          <input type="checkbox" class="checkbox cursor-pointer" :id="`${fieldId}-${index}`" :value="option.value" style="accent-color: #016b00;"
            v-model="internalValue" :disabled="option.disabled || disabled" />
          <label :for="`${fieldId}-${index}`" class="checkbox-label">
            {{ option.label }}
          </label>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "MultiSelectCheckbox",
  props: {
    label: String,
    options: {
      type: Array,
      default: () => []   // ⭐ CRITICAL
    },
    modelValue: {
      type: Array,
      default: () => []
    },
    disabled: Boolean,
    fieldId: {
      type: String,
      required: true
    },
    required: Boolean
  },
  data() {
    return {
      isOpen: false,
      internalValue: [...this.modelValue],
      rangeInput: ""
    };
  },
  computed: {
    selectedDisplay() {
      if (!this.internalValue.length) return "";

      // map selected values to their record numbers (index + 1)
      const selectedIndexes = this.options
        .map((opt, index) =>
          this.internalValue.includes(opt.value) ? index + 1 : null
        )
        .filter(Boolean);

      return this.formatNumericRanges(selectedIndexes);
    },
    allSelected() {
      const selectable = this.options.filter(o => !o.disabled);
      return (
        selectable.length > 0 &&
        selectable.every(o => this.internalValue.includes(o.value))
      );
    }
  },
  watch: {
    modelValue(val) {
      if (JSON.stringify(val) !== JSON.stringify(this.internalValue)) {
        this.internalValue = [...val];
      }
    },
    internalValue(val) {
      if (JSON.stringify(val) !== JSON.stringify(this.modelValue)) {
        this.$emit("update:modelValue", val);
      }
    },
    rangeInput(val) {
      this.applyRangeLive(val);
    },
    options: {
      handler() {
        this.selectAllByDefault(); // ⭐ auto select when options arrive
      },
      deep: true,
      immediate: true
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
    this.selectAllByDefault();
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    selectAllByDefault() {
      // only auto-select if parent did not provide a value
      if (this.modelValue && this.modelValue.length) return;

      this.internalValue = this.options
        .filter(opt => !opt.disabled)
        .map(opt => opt.value);
    },
    formatNumericRanges(nums) {
      if (!nums.length) return "";

      const sorted = [...nums].sort((a, b) => a - b);
      const ranges = [];

      let start = sorted[0];
      let prev = sorted[0];

      for (let i = 1; i <= sorted.length; i++) {
        const current = sorted[i];

        if (current !== prev + 1) {
          ranges.push(
            start === prev ? `${start}` : `${start}-${prev}`
          );
          start = current;
        }
        prev = current;
      }

      return ranges.join(", ");
    },

    applyRangeLive(input) {
      if (!input) return;

      const clean = input.replace(/\s+/g, "");
      let start, end;

      if (clean.includes("-")) {
        const parts = clean.split("-");
        if (parts.length !== 2) return;

        start = Number(parts[0]);
        end = Number(parts[1]);
      } else {
        start = end = Number(clean);
      }

      // ignore invalid / partial input
      if (isNaN(start) || isNaN(end)) return;

      if (start > end) [start, end] = [end, start];

      const valuesToSelect = this.options
        .map((opt, index) => ({
          value: opt.value,
          index: index + 1,
          disabled: opt.disabled
        }))
        .filter(opt =>
          !opt.disabled &&
          opt.index >= start &&
          opt.index <= end
        )
        .map(opt => opt.value);

      this.internalValue = valuesToSelect;
    },


    toggleDropdown() {
      if (!this.disabled) this.isOpen = !this.isOpen;
    },
    handleClickOutside(e) {
      if (!this.$el.contains(e.target)) {
        this.isOpen = false;
      }
    },
    toggleSelectAll() {
      if (this.allSelected) {
        this.internalValue = [];
      } else {
        this.internalValue = this.options
          .filter(opt => !opt.disabled)
          .map(opt => opt.value);
      }
    },
    formatRanges(values) {
      if (!values.length) return "";

      const nums = [...values]
        .map(Number)
        .filter(n => !isNaN(n))
        .sort((a, b) => a - b);

      const ranges = [];
      let start = nums[0];
      let prev = nums[0];

      for (let i = 1; i <= nums.length; i++) {
        const current = nums[i];

        if (current !== prev + 1) {
          // close range
          ranges.push(
            start === prev ? `${start}` : `${start}-${prev}`
          );
          start = current;
        }

        prev = current;
      }

      return ranges.join(", ");
    },
  }
};
</script>

<style scoped>
.multi-select-wrapper {
  position: relative;
  width: 100%;
  font-size: 12px;
}

.combo-input {
  position: relative;
  width: 100%;
  padding: 12px;
  border: 2px solid #e5e7eb;
  background: white;
  cursor: pointer;
}

.combo-input.active {
  border-color: #016b00;
}

.dropdown-icon {
  width: 20px;
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}

.dropdown-icon.rotate {
  transform: translateY(-50%) rotate(180deg);
}

.combo-label {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  padding: 0 4px;
  transition: all 0.2s ease-in-out;
  color: #6b7280;
}

.label-floating {
  top: 0;
  color: #016b00;
}

.dropdown-list {
  position: absolute;
  top: calc(100% + 4px);
  /* directly under input */
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 9999;
}

/* 🔢 Range input */
.range-input-bar {
  display: flex;
  padding: 8px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.range-input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 6px 10px;
}

.checkbox {
  margin-right: 8px;
  accent-color: #016b00;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
