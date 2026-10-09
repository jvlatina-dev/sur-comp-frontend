<template>
  <div class="w-full">

    <!-- 🔍 SEARCH BAR -->
    <div class="mb-3 flex items-center justify-between">
      <div class="flex items-center w-full" style="gap: 0.5rem;">
        <TextControl ref="searchInput" label="Search by Name, Account No., Serial No." v-model="search"
          fieldId="uppercase" @focus="searchFocused = true" @blur="searchFocused = false"/>
        <ButtonControl variant="primary" :disabled="loading" @click="triggerSearch" style="width: 8rem;">Search
        </ButtonControl>
         <ButtonControl variant="secondary" :disabled="loading" @click="clearSearch" style="width: 8rem;">Clear
        </ButtonControl>
      </div>
    </div>


    <!-- 📊 CUSTOM TABLE -->
    <div class="rounded overflow-hidden" tabindex="0" @keydown="handleKeyboard" ref="tableWrapper"
      style="max-height: 32vh; overflow-y: auto;">
      <table class="min-w-full border-collapse table-auto text-sm" style="width:100%;">
        <thead class="bg-primary text-white" style="position: sticky; top: 0; z-index: 999;">
          <tr>
            <th class="border px-2 py-3 text-left" style="width:30px;">#</th>
            <th v-for="col in columns" :key="col.field" class="border px-2 py-3 text-left" style="width:200px;">
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rows" :key="row[rowKey]"
            :class="{
                'bg-warning': !isSearchFocused && index === highlightedIndex,
                'bg-error text-white': row.fstatus !== 'A' && index !== highlightedIndex
              }"
            @dblclick="handleRowDblClick(row)" @click="highlightedIndex = index">
            <td class="border px-2 py-1">{{ index + 1 }}</td>
            <td v-for="col in columns" :key="col.field" class="border px-2 py-1">{{ row[col.field] }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
import DataTableControl from "@/components/controls/DataTableControl.vue";
import ButtonControl from "./ButtonControl.vue";
import TextControl from "./TextControl.vue";
import ModalControl from "./ModalControl.vue";

export default {
  name: "SearchableTableControl",

  components: {
    DataTableControl,
    ModalControl,
    TextControl,
    ButtonControl,
  },
  inject: ['setLoading'],
  props: {
    columns: { type: Array, required: true },
    rowKey: { type: String, default: "fkey" },
    height: { type: String, default: "45vh" },
    ftran_type: { type: String, default: "" },
  },
  data() {
    return {
      search: "",
      rows: [],
      highlightedIndex: 0,
      loading: false,
      searchFocused: false
    };
  },
  computed: {
    isSearchFocused() {
      const inputEl = this.$refs.searchInput?.$el?.querySelector("input");
      return document.activeElement === inputEl;
    }
  },
  watch: {
    // when search results come in we want the keyboard focus to move off the
    // input so that arrow keys feel like they move through the table
    rows(newRows) {
      if (newRows && newRows.length) {
        const inputEl = this.$refs.searchInput && this.$refs.searchInput.$el
          ? this.$refs.searchInput.$el.querySelector('input')
          : null;
        if (inputEl && typeof inputEl.blur === 'function') {
          inputEl.blur();
        }
      }
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.$refs.searchInput?.focus();
    });

    window.addEventListener("keydown", this.handleKeyboard);

    if (window.chrome?.webview) {
      window.chrome.webview.addEventListener(
        "message",
        this.handleWebViewMessage
      );
    }
  },

  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeyboard);

    if (window.chrome?.webview) {
      window.chrome.webview.removeEventListener(
        "message",
        this.handleWebViewMessage
      );
    }
  },

  methods: {
    clearSearch() {
      this.search = "";
      this.rows = [];
      this.total = 0;
      this.highlightedIndex = 0;
      this.$refs.searchInput?.focus();
    },
    handleRowDblClick(row) {
      this.$emit("row-select", {
        fkey: row.fkey,
        fmemnr: row.fmemnr,
        fname: row.fname,
        fserial: row.fserial,
      });
    },
    triggerSearch() {
      if (!window.chrome?.webview) return;
      if (!this.search) return;

      this.setLoading(true);
      window.chrome.webview.postMessage({
        action: 'search_member_info',
        query: this.search,
      });
    },

    handleWebViewMessage(event) {
      const msg = event.data;

      if (msg?.type === "query_results" || msg?.type === "smile_results") {
        this.rows = msg.data || [];
        this.total = msg.data?.length || 0;
        this.setLoading(false);
      }
    },
    handleKeyboard(e) {
      const inputEl = this.$refs.searchInput?.$el?.querySelector("input");
      const isSearchFocused = document.activeElement === inputEl;

      if (e.key === "Enter") {
        if (isSearchFocused) {
          e.preventDefault();
          this.triggerSearch();
          return;
        }

        if (!this.rows.length) return;

        e.preventDefault();
        this.handleRowDblClick(this.rows[this.highlightedIndex]);
        return;
      }

      if (isSearchFocused) return;
      if (!this.rows.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        this.highlightedIndex = Math.min(
          this.highlightedIndex + 1,
          this.rows.length - 1
        );
        this.scrollToHighlighted();

      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        this.highlightedIndex = Math.max(
          this.highlightedIndex - 1,
          0
        );
        this.scrollToHighlighted();
      }
    },
    scrollToHighlighted() {
      this.$nextTick(() => {
        const container = this.$refs.tableWrapper;
        const rows = container.querySelectorAll("tbody tr");
        const row = rows[this.highlightedIndex];

        if (!row) return;

        const rowHeight = row.offsetHeight;
        const containerHeight = container.clientHeight;
        const header = container.querySelector("thead");
        const headerHeight = header ? header.offsetHeight : 0;

        // Row position relative to container
        const rowOffsetTop = row.offsetTop;

        if (rowOffsetTop < container.scrollTop + headerHeight) {
          // row is above visible area
          container.scrollTop = rowOffsetTop - headerHeight;
        } else if (rowOffsetTop + rowHeight > container.scrollTop + containerHeight) {
          // row is below visible area
          container.scrollTop = rowOffsetTop + rowHeight - containerHeight;
        }
      });
    }
  },
};
</script>
