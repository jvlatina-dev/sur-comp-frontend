<template>
  <div class="w-full">
    <div class="relative w-full">
      <!-- Search Input -->
      <input
        v-model="searchQuery"
        @input="onSearchInput"
        @keyup.enter="onEnter"
        :placeholder="focused ? '' : placeholder"
        class="textfield-input w-full p-3 lg:p-3 text-xs border-2 rounded"
        :class="{
          'border-gray-200': !searchQuery,
          'border-primary': searchQuery || focused,
        }"
        @focus="focused = true"
        @blur="focused = false"
      />
      
      <!-- Floating label -->
      <label
        class="textfield-label bg-white text-xs"
        :class="{
          'label-floating px-1': searchQuery || focused
        }"
      >
        Search Name, Acct No.
      </label>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: 'Search...',
    },
    modelValue: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      searchQuery: this.modelValue,
      focused: false,
    };
  },
  watch: {
    modelValue(newValue) {
      this.searchQuery = newValue;
    },
    searchQuery(newQuery) {
      // Ensure the search query is always uppercase
      const uppercaseQuery = newQuery.toUpperCase();
      this.$emit('update:modelValue', uppercaseQuery);
      this.$emit('search', uppercaseQuery);
    },
  },
  methods: {
    onSearchInput() {
      // Ensure that the model value is always uppercase
      const uppercaseQuery = this.searchQuery.toUpperCase();
      this.$emit('search', uppercaseQuery);
    },
    onEnter() {
      this.$emit('enter', this.searchQuery);
    },
  },
};
</script>


<style scoped>
.textfield-input {
  transition: border-color 0.3s;
  text-transform: uppercase; /* Visually make the input text uppercase */
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
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-55%);
  color: #6b7280;
  transition: all 0.2s ease-in-out;
  pointer-events: none;
}

.textfield-input:focus + .textfield-label,
.textfield-input:not(:placeholder-shown) + .textfield-label {
  top: 0;
  transform: translateY(-50%) scale(1);
  color: #016B00;
  background-color: white;
}

.label-floating {
  color: #016B00;
  transform: translateY(-50%) scale(1);
  background-color: white;
}

input:disabled:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px #f8f8f8 inset !important;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px white inset !important;
  -webkit-text-fill-color: #333333 !important;
  caret-color: #333333 !important;
  transition: background-color 9999s ease-in-out 0s !important;
}
</style>
