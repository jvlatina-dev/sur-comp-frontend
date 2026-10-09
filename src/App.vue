<template>
  <div class="min-h-screen flex flex-col select-none bg-gray-200">

    <!-- Loading Section -->
    <LoadingSection v-if="is_loading" class="z-50" />

    <!-- HEADER -->
    <TitleBarSection @exit="logout_modal = false" />

    <!-- MAIN CONTENT (GROWS) -->
    <div class="flex-grow p-5 overflow-hidden">
      <div class="home flex flex-col h-full">
          <div class="flex-grow overflow-auto">
            <router-view />
          </div>
      </div>
    </div>

    <!-- FOOTER (ALWAYS BOTTOM) -->
    <footer
      class="bg-grey-light text-grey-darker px-4 py-2 flex justify-between items-center text-xs lg:text-sm flex-shrink-0">
      <div class="flex items-center italic font-bold uppercase">
        <img :src="getIcon('pin-grey')" class="w-4" />
        <p class="ml-1 text-xxs"> {{ formattedBranchName }} </p>
      </div>
      <DateTimeControl is_footer />
    </footer>

  </div>
</template>



<script>
import LoadingSection from "./components/sections/LoadingSection.vue";
import TitleBarSection from "./components/sections/TitleBarSection.vue";
import DateTimeControl from "./components/controls/DateTimeControl.vue";
import mixin from "@/mixins/controls.js";


export default {
  name: 'App',
  mixins: [mixin],
  components: {
    LoadingSection,
    TitleBarSection,
    DateTimeControl
  },
  data() {
    return {
      version: process.env.VUE_APP_VERSION,
      test_mode: process.env.VUE_APP_TEST,
      is_loading: false,
      user_dropdown: false,
      edit_password: false,
      logout_modal: false,
      message_modal: false,
    };
  },
  provide() {
    return {
      setLoading: this.setLoading,
    };
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
    document.addEventListener("keydown", this.disableShortcuts);
    document.addEventListener("wheel", this.disableZoom, { passive: false });
  },
  computed: {
    formattedBranchName() {
      return this.$store.state.branch_name
        ? this.formattedBranch(this.$store.state.branch_name)
        : "";
    }
  },
  methods: {
    formattedBranch(branch) {
      if (!branch) return "";

      // Handle MAIN OFFICE
      if (branch.toUpperCase().includes("MAIN OFFICE")) {
        return "MAIN OFFICE";
      }

      // Handle SATELLITE OFFICE branches
      return branch
        .replace(/^PAFCPIC\s+SATELLITE\s+OFFICE-\s*/i, "PSO- ")
        .trim();
    },
    goTo(path) {
      if (this.$route.path !== path) {
        this.$router.push(path);
      }
    },
    isActive(path) {
      return this.$route.path === path;
    },
    setActiveTab(id) {
      this.activeTabId = id;
    },
    setLoading(status) {
      this.is_loading = status;
    },
    disableShortcuts(e) {
      // Block F5 / Ctrl+F5
      if ((e.ctrlKey && e.key === "F5") || e.key === "F5") {
        e.preventDefault();
        e.stopPropagation();
        // console.log("Blocked refresh (F5 / Ctrl+F5)");
        return false;
      }

      // Block Ctrl+R
      if (e.ctrlKey && (e.key === "r" || e.key === "R")) {
        e.preventDefault();
        e.stopPropagation();
        // console.log("Blocked refresh (Ctrl+R)");
        return false;
      }

      // Block zoom with keys
      if (
        e.ctrlKey &&
        (e.key === "+" ||
          e.key === "-" ||
          e.key === "=" ||
          e.key === "0")
      ) {
        e.preventDefault();
        e.stopPropagation();
        // console.log("Blocked zoom (Ctrl + +/-/0)");
        return false;
      }
    },
    disableZoom(e) {
      // Block Ctrl + Mouse Wheel zoom
      if (e.ctrlKey) {
        e.preventDefault();
        e.stopPropagation();
        // console.log("Blocked zoom (Ctrl + Mouse Wheel)");
        return false;
      }
    }
  },
};
</script>

<style>
/* .green-gradient {
  background: linear-gradient(
    to bottom,
    #016b00 0%,
    #ffffff 100%
  );
} */

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* font-family: Poppins, sans-serif; */
  color: #2c3e50;
}

button:hover,
.tab:hover {
  filter: brightness(1.1) !important;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
}

/* Transition for Pages */
.slide-in-enter-active,
.slide-in-leave-active {
  transition: transform 0.3s ease;
}

.slide-in-enter-from {
  transform: translateY(-30px);
  opacity: 0;
}

.slide-in-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.slide-in-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.rotate-0 {
  transform: rotate(0deg);
  transition: transform 0.3s ease;
}

button:focus {
  outline: none !important;
}

.tabs {
    display: flex;
    background: #e5e7eb;
    border-radius: 5px;
}

.tab {
    padding: 6px 16px;
    border-radius: 5px;
    font-weight: 600;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.2s ease;
    user-select: none;
}

.tab.active {
    background: #016B00;
    color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

/* Apply to all scrollable divs */
::-webkit-scrollbar {
  width: 6px;
  /* scrollbar width */
  height: 6px;
  /* for horizontal scrollbars */
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  /* track background */
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  /* scroll handle color */
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
  /* darker on hover */
}
</style>
