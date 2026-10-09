<template>
  <div class="progress-bar-container">
    <div class="progress-bar-line-wrapper">
      <!-- Connecting line -->
      <div class="progress-bar-line"></div>

      <!-- Step circles -->
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="progress-bar-step"
        @click="handleStepClick(index, step.route)"
        :class="{ 'active': isActive(step.route), 'unlocked': isUnlocked(index) }"
      >
        {{ index + 1 }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
  data() {
    return {
      steps: [
        { route: "registration" },
        { route: "reminders" },
        { route: "confirm" },
      ],
      unlockedSteps: [0], // registration is unlocked by default
    };
  },
  computed: {
    currentRoute() {
      return this.$route.name;
    },
    currentIndex() {
      return this.steps.findIndex((s) => s.route === this.currentRoute);
    },
  },
  watch: {
    currentIndex(newIndex) {
      if (!this.unlockedSteps.includes(newIndex)) {
        this.unlockedSteps.push(newIndex);
      }
    },
  },
  methods: {
    handleStepClick(index, routeName) {
      if (this.isUnlocked(index)) {
        this.$router.push({ name: routeName });
      }
    },
    isActive(routeName) {
      return this.currentRoute === routeName;
    },
    isUnlocked(index) {
      return this.unlockedSteps.includes(index);
    },
  },
};
</script>

<style scoped>
.progress-bar-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 1.5rem 0; /* py-6 */
}

.progress-bar-line-wrapper {
  position: relative;
  width: 90%;
  max-width: 400px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-bar-line {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 0.25rem; /* 1px ~ 4px */
  background-color: #e5e7eb; /* gray-200 */
  transform: translateY(-50%);
  z-index: 0;
  border-radius: 2px;
}

.progress-bar-step {
  position: relative;
  z-index: 10;
  width: 2.5rem; /* 10 */
  height: 2.5rem; /* 10 */
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  color: white;
  background-color: #d1d5db; /* gray-300 */
  cursor: default;
  transition: all 0.3s;
}

.progress-bar-step.unlocked {
  background-color: #016B00; /* primary */
  cursor: pointer;
}

.progress-bar-step.active {
  box-shadow: 0 0 0 0.25rem rgba(1, 107, 0, 0.3); /* ring-primary-light */
}

/* Responsive adjustments if needed */
@media (max-width: 1024px) {
  .progress-bar-line-wrapper {
    width: 80%;
  }
}
</style>
