<template>
  <div class="w-full">
    <div class="relative w-full">
      <!-- Input field -->
      <div v-if="fieldId === 'mobile'" class="flex items-center border-2 rounded-md bg-white" :class="[
        disabled ? 'bg-gray-50 border-gray-200' : 'border-gray-200',
        validationMessage ? 'border-error' : ''
      ]">
        <span class="px-3 select-none text-xs h-full" :class="disabled ? 'text-gray-400' : 'text-gray-600'">
          +63
        </span>
        <input maxlength="10" type="tel" v-model="mobileNumber" @input="handleMobileInput" @focus="focused = true"
          @blur="handleBlur" :disabled="disabled"
          class="flex-1 p-3 text-xs bg-transparent outline-none textfield-input" />
      </div>

      <!-- Normal Input -->
      <input v-else :maxlength="maxLength" :id="fieldId"
        :type="isVisible ? 'text' : (is_password || is_con_password || is_pin) ? 'password' : 'text'"
        v-model="inputValue" @input="handleInput" @focus="handleFocus" @blur="handleBlur"
        @keydown.enter.prevent="handleEnter" :disabled="disabled" autocomplete="off"
        class="textfield-input w-full p-3 lg:p-3 text-xs border-2 rounded-md" :class="[
          validationMessage ? 'border-error' : 'border-gray-200',
          disabled ? 'bg-gray-50' : 'bg-white'
        ]" :placeholder="focused || inputValue ? placeholder : ''" />

        <!-- Toggle Visibility Icon -->
        <div
          v-if="(is_password || is_con_password || is_pin) && !disabled && fieldId !== 'mobile'"
          class="absolute eye-icon cursor-pointer"
          @click="toggleVisibility"
        >
          <img
            :src="isVisible ? getIcon('visible') : getIcon('invisible')"
            class="h-auto w-4"
            alt="Toggle Visibility"
          />
        </div>

      <!-- Floating label -->
      <label :for="fieldId" :class="[
        'textfield-label absolute px-1 text-xs',
        (focused || inputValue || (fieldId === 'mobile' && mobileNumber)) ? 'label-floating text-primary' : '',
        disabled ? 'label-disabled text-grey border-gray-300' : '',
        fieldId === 'mobile' ? 'bg-white' : ''
      ]">
        {{ label }} <span v-if="required" class="text-error">*</span>
      </label>
    </div>

    <!-- Validation Message -->
    <p v-if="validationMessage" class="text-xs text-error mt-1">{{ validationMessage }}</p>
  </div>
</template>

<script>
import mixin from "@/mixins/controls.js";

export default {
  name: "v-text",
  mixins: [mixin],
  props: {
    label: String,
    placeholder: String,
    is_pin: Boolean,
    is_password: Boolean,
    is_con_password: Boolean,
    is_account: Boolean,
    is_username: Boolean,
    is_creation: Boolean,
    modelValue: String,
    disabled: Boolean,
    enableValidation: { type: Boolean, default: false },
    maxLength: { type: Number, default: 50 },
    fieldId: { type: String, required: true },
    required: { type: Boolean, default: false },
    passwordValue: { type: String, default: "" },
  },
  data() {
    return {
      inputValue: this.modelValue || "",
      mobileNumber: "",
      isVisible: false,
      validationMessage: "",
      focused: false,
    };
  },
  watch: {
    modelValue(newValue) {
      const value = newValue ?? "";

      if (this.fieldId === "money") return;

      if (this.fieldId === "mobile" && value.startsWith("+63")) {
        this.mobileNumber = value.replace("+63", "");
      } else {
        this.inputValue = value;
      }
    },

    inputValue() {
      if (this.enableValidation) this.validateField();
    },

    mobileNumber() {
      if (this.enableValidation) this.validateField();
    },
  },
  mounted() {
    const value = this.modelValue ?? ""; // ensure string
    if (this.fieldId === "mobile" && value.startsWith("+63")) {
      this.mobileNumber = value.replace("+63", "");
    }
  },
  methods: {
    handleFocus() {
      this.focused = true;
      this.$emit("focus");
    },
    handleEnter() {
      this.$emit("enter", this.inputValue);
    },
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },
    focus() {
        this.$nextTick(() => {
            const input = this.$el.querySelector('input.textfield-input');

            if (input && !input.disabled) {
                input.focus();
            }
        });
    },
    blur() {
        const input = this.$el.querySelector('input.textfield-input');
        input?.blur();
    },
    handleMobileInput(event) {
      let value = event.target.value.replace(/\D/g, "");
      if (value.length > 10) value = value.slice(0, 10);
      this.mobileNumber = value;
      this.$emit("update:modelValue", `+63${value}`);
    },
    handleInput(event) {
      let value = event.target.value;

      // MONEY FIELD (keep as-is)
      if (this.fieldId === "money") {
        value = value.replace(/[^0-9.]/g, "");

        const parts = value.split(".");
        if (parts.length > 2) value = parts[0] + "." + parts[1];

        if (parts[1]?.length > 2) {
          parts[1] = parts[1].slice(0, 2);
          value = parts.join(".");
        }

        let intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        value = parts[1] !== undefined ? `${intPart}.${parts[1]}` : intPart;

        this.inputValue = value;
        this.$emit("update:modelValue", value.replace(/,/g, ""));
        return;
      }

      // REMOVE SPACES FOR SPECIFIC FIELDS FIRST
      if (this.fieldId === "email") value = value.replace(/\s+/g, "");
      if (this.fieldId === "username") value = value.replace(/\s+/g, "");
      if (this.fieldId === "age") value = value.replace(/\D+/g, "");
      if (this.fieldId === "number") value = value.replace(/\D+/g, "");

      // ACCOUNT / SERIAL CLEANUP
      if (this.fieldId === "account_no" || this.fieldId === "serial_no") {
        value = value.replace(/\s+/g, "").replace(/[^A-Z0-9-]/gi, "");
      }

      if (this.fieldId === "uppercase") {
        value = value.toUpperCase();
      }

      // 🔥 GLOBAL UPPERCASE (EXCEPT EMAIL & MONEY)
      // if (this.fieldId !== "email") {
      //   value = value.toUpperCase();
      // }

      this.inputValue = value;
      this.$emit("update:modelValue", value);
    },
    handleBlur() {
      this.focused = false;
      this.$emit("blur");

      // ✅ Auto-format money fields on blur
      if (this.fieldId === "money") {
        if (!this.inputValue) return;

        let raw = this.inputValue.replace(/,/g, "");
        let num = parseFloat(raw);

        if (isNaN(num)) {
          this.inputValue = "";
          this.$emit("update:modelValue", "");
          return;
        }

        let formatted = num.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });

        this.inputValue = formatted;
        this.$emit("update:modelValue", num.toFixed(2));
      }

      if (this.enableValidation) this.validateField();
    },
    validateField() {
      if (this.required && !this.inputValue && this.fieldId !== "mobile" && !this.mobileNumber) {
        this.validationMessage = "This field is required.";
        return;
      }

      switch (this.fieldId) {
        case "email":
          if (this.inputValue && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(this.inputValue))
            this.validationMessage = "Please enter a valid email address.";
          else
            this.validationMessage = "";
          break;

        case "mobile":
          if (this.mobileNumber) {
            if (!/^9\d{9}$/.test(this.mobileNumber)) {
              this.validationMessage = "Mobile number must start with 9 and be 10 digits.";
            } else {
              this.validationMessage = "";
            }
          } else if (this.required) {
            this.validationMessage = "This field is required.";
          } else {
            this.validationMessage = "";
          }
          break;

        case "age": {
          const ageValue = Number(this.inputValue); // ✅ now legal
          if (this.inputValue && isNaN(ageValue)) {
            this.validationMessage = "Please enter a valid number for age.";
          } else if (this.inputValue && ageValue < 12) {
            this.validationMessage = "Age must be 12 or above.";
          } else if (!this.inputValue && this.required) {
            this.validationMessage = "This field is required.";
          } else {
            this.validationMessage = "";
          }
          break;
        }


        default:
          this.validationMessage = "";
      }
    },
    focusNextOrSubmit(event) {
      const form = event.target.form || document;
      const elements = Array.from(form.querySelectorAll("input, select, textarea, button"))
        .filter(el => !el.disabled && el.type !== "hidden");

      const index = elements.indexOf(event.target);

      if (index > -1 && index + 1 < elements.length) {
        const nextEl = elements[index + 1];
        nextEl.type === "submit" ? nextEl.click() : nextEl.focus();
      } else {
        const submitBtn = form.querySelector("button[type='submit'], input[type='submit']");
        if (submitBtn) submitBtn.click();
      }
    },
  },
};
</script>

<style scoped>
.textfield-input {
  transition: border-color 0.3s;
}

.textfield-input:focus {
  border-color: #016B00;
  outline: none;
}

.textfield-input:disabled {
  background-color: #f8f8f8;
  color: #999;
  cursor: not-allowed;
}

.textfield-label {
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  transition: all 0.2s ease-in-out;
  pointer-events: none;
}

.label-floating {
  top: 0;
  transform: translateY(-50%) scale(1);
  color: #016B00;
  background-color: white;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px white inset !important;
  -webkit-text-fill-color: #333333 !important;
  caret-color: #333333 !important;
  transition: background-color 9999s ease-in-out 0s !important;
}

input:disabled:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px #f8f8f8 inset !important;
}

.eye-icon {
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
}

input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear {
  display: none;
}

/* Remove built-in eye icon in some Chromium browsers */
input[type="password"]::-webkit-credentials-auto-fill-button,
input[type="password"]::-webkit-textfield-decoration-container {
  display: none !important;
}

/* Prevent default password reveal UI */
input[type="password"] {
  -webkit-text-security: disc;
}
</style>
