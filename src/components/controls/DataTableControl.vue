<template>
  <div class="w-full mb-2">
    <!-- Table -->
    <div class="rounded border flex flex-col max-h-full h-full overflow-hidden">
      <!-- header wrapper -->
      <div ref="headerScroll" class="overflow-x-auto overflow-y-hidden table-header-scroll"
        @scroll="syncScroll('header')">
        <table class="w-full text-center table-fixed table-header">
          <colgroup>
            <col v-if="selectionActive" :style="columnWidthStyle('__select')" />
            <col v-for="col in columns" :key="col.field" :style="columnWidthStyle(col)" />
          </colgroup>
          <thead class="bg-primary">
            <tr>
              <th v-if="selectionActive" scope="col"
                class="px-3 py-2 text-xxs font-semibold uppercase tracking-wider select-none border-r border-green-700 bg-primary cursor-pointer"
                @click="toggleSelectAllDisplayedRows(!allDisplayedSelected)">
                <div class="flex flex-col items-center justify-center">
                  <input type="checkbox" tabindex="-1" class="pointer-events-none" style="accent-color: #016b00;"
                    :checked="allDisplayedSelected" />
                </div>
              </th>

              <th v-for="col in columns" :key="col.field" scope="col" :style="columnWidthStyle(col)"
                class="px-3 py-2 text-xxs font-semibold uppercase tracking-wider select-none border-r border-green-700 last:border-r-0 bg-primary">
                <slot :name="`header:${col.field}`" :column="col">
                  <button v-if="col.sortable !== false"
                    class="inline-flex items-center gap-1 text-white uppercase font-semibold">
                    <span>{{ col.label }}</span>
                    <span class="text-white ml-1" v-if="!col.filter && sortBy === col.field">
                      <span v-if="sortDir === 'asc'">▲</span>
                      <span v-else>▼</span>
                    </span>
                  </button>
                  <span v-else>{{ col.label }}</span>
                </slot>
              </th>
            </tr>
          </thead>
        </table>
      </div>

      <!-- scrollable body rows only -->
      <div ref="tableBody" class="overflow-y-auto overflow-x-hidden table-body-scroll border-b border-gray-200"
        @scroll="syncScroll('body')" :style="{ height: height }">
        <table class="w-full text-center table-fixed">
          <colgroup>
            <col v-if="selectionActive" :style="columnWidthStyle('__select')" />
            <col v-for="col in columns" :key="col.field" :style="columnWidthStyle(col)" />
          </colgroup>
          <tbody>
            <tr v-if="displayedBodyRows.length === 0">
              <td :colspan="columns.length + (selectionActive ? 1 : 0)" class="no-records-cell text-grey-dark italic">
                <div class="no-records-content">
                  <img src="@/assets/images/papsi_box.png" class="w-16 opacity-75">
                  <p class="text-sm mt-4">No records found.</p>
                </div>
              </td>
            </tr>

            <tr v-for="(row, index) in displayedBodyRows" :key="row[rowKey] || JSON.stringify(row)"
              class="transition border-b" @mouseenter="canHoverIndex ? hoveredRowIndex = index : null"
              @mouseleave="canHoverIndex ? hoveredRowIndex = -1 : null" :class="[
                typeof rowClass === 'function' ? rowClass(row) : '',
                highlightSelectedRow && selectionActive && selectedRowIndex === index
                  ? 'bg-yellow-lightest'
                  : '',
                selectionActive && isRowSelected(row) && selectedRowIndex !== index ? 'bg-green-lightest' : '',
                !selectionActive &&
                  (hoveredRowIndex === index || selectedRowIndex === index)
                  ? 'bg-gray-100'
                  : '',
                hover && !isRowDisabled(row) && !hasCustomRowClass(row) && !selectionActive ? 'table-row-hover cursor-pointer' : (hover && !isRowDisabled(row) && !selectionActive ? 'cursor-pointer' : ''),
                isRowDisabled(row) ? 'bg-gray-100 text-white cursor-not-allowed opacity-75' : ''
              ]" @dblclick="handleDblRowClick(row, index)" @click="handleRowClick(row, index)">
              <td v-if="selectionActive"
                class="px-3 py-1 text-xxs text-gray-500 select-none border-r border-gray-200 flex flex-col items-center justify-center">
                <input type="checkbox" tabindex="-1" class="pointer-events-none mt-1" :checked="isRowSelected(row)"
                  style="accent-color: #016b00;" />
              </td>

              <td v-for="col in columns" :key="col.field" :style="columnWidthStyle(col)"
                class="px-3 py-1 text-xxs text-gray-700 select-none border-r border-gray-200 last:border-r-0" :class="[
                  cellAlign(col),

                  highlightSelectedRow && selectedRowIndex === index
                  ? 'bg-yellow-lightest'
                  : selectionActive && isRowSelected(row)
                    ? 'bg-green-lightest'
                    : !selectionActive && selectedRowIndex === index && highlightSelectedRow
                      ? 'bg-yellow-lightest'
                      : cellColor(col, row),

                  {
                    'bg-warning-lighter':
                      col.field === highlightColumn &&
                      !(selectionActive && selectedRowIndex === index) &&
                      !(selectionActive && isRowSelected(row))
                  }
                ]">
                <input v-if="isEditing(row, col.field)" v-model="editValue" type="text"
                  class="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  @keydown="handleEditKeydown($event, row, col.field)" @blur="cancelEdit" style="accent-color: #016b00;"
                  autofocus />
                <template v-else>
                  <slot :name="`cell:${col.field}`" :row="row" :value="displayValue(row, col)">
                    {{ formatValue(displayValue(row, col), col) }}
                  </slot>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- footer wrapper -->
      <div ref="footerScroll" class="overflow-x-auto overflow-y-hidden table-footer-scroll"
        @scroll="syncScroll('footer')">
        <table v-if="displayedTotalRows.length > 0" class="w-full text-center table-fixed table-footer">
          <colgroup>
            <col v-if="selectionActive" :style="columnWidthStyle('__select')" />
            <col v-for="col in columns" :key="col.field" :style="columnWidthStyle(col)" />
          </colgroup>
          <tbody>
            <tr v-for="(row, index) in displayedTotalRows" :key="'total-' + index" class=" text-gray-600 font-bold"
              :class="[selectionActive ? 'bg-green-custom' : 'bg-gray-100']">
              <td v-if="selectionActive"
                class="px-3 py-1 text-xxs border-r border-gray-200 flex flex-col items-center justify-center">
                <span class="text-xxs mt-1 font-semibold">{{ selectedRows.length }}</span>
              </td>

              <td v-for="col in columns" :key="col.field" :style="columnWidthStyle(col)"
                class="px-3 py-1 text-xxs border-r border-gray-200 last:border-r-0" :class="cellAlign(col)">
                {{ formatValue(displayValue(row, col), col) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mt-2 flex items-center" :class="pagination ? 'justify-between' : 'justify-start'">
      <!-- LEFT SIDE -->
      <div class="flex flex-row items-center justify-start" style="gap: 0.5rem;">

        <!-- Rows per page -->
        <div v-if="pagination" class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div class="flex items-center gap-2">
            <label class="text-xxs text-gray-600 mr-2">Rows per page: </label>

            <select v-model.number="pageSize" class="rounded border px-1 py-1 focus:outline-none text-xxs">
              <option v-for="n in pageSizeOptions" :key="n" :value="n">
                {{ n }}
              </option>
            </select>
          </div>
        </div>

        <!-- Record Count -->
        <div class="text-xs text-grey-darker italic">
          <template v-if="pagination">
            Showing
            <span class="font-medium">
              {{ (sortedRows.length > 0 ? startIndex + 1 : 0).toLocaleString() }}
            </span>–
            <span class="font-medium">
              {{ endIndex.toLocaleString() }}
            </span>
            of
            <span class="font-medium">
              {{ filteredRows.length.toLocaleString() }}
            </span>
          </template>

          <template v-else>
            Total records:
            <span class="font-medium">
              {{filteredRows.filter(r => !r.isTotalRow).length.toLocaleString()}}
            </span>
          </template>
        </div>
      </div>

      <!-- RIGHT SIDE -->
      <div v-if="pagination" class="flex items-center text-xxs" style="gap: 0.5rem;">
        <button class="flex justify-center items-center rounded-full border p-1 text-xss disabled:opacity-40 bg-white"
          :class="{ 'opacity-50 cursor-default': page === 1, 'hover:bg-white': page != 1 }" :disabled="page === 1"
          @click="page = 1">
          <img :src="getIcon('first_page')" class="w-4 h-4" />
        </button>

        <button class="flex justify-center items-center rounded-full border p-1 text-xss disabled:opacity-40 bg-white"
          :class="{ 'opacity-50 cursor-default': page === 1, 'hover:bg-white': page != 1 }" :disabled="page === 1"
          @click="page--">
          <img :src="getIcon('arrow_left')" class="w-4 h-4" />
        </button>

        <span class="text-xxs">
          Page <strong>{{ page.toLocaleString() }}</strong> /
          {{ totalPages.toLocaleString() }}
        </span>

        <button class="flex justify-center items-center rounded-full border p-1 text-xss disabled:opacity-40 bg-white"
          :class="{ 'opacity-50 cursor-default': page === totalPages, 'hover:bg-white': page != totalPages }"
          :disabled="page === totalPages || totalPages === 0" @click="page++">
          <img :src="getIcon('arrow_right')" class="w-4 h-4" />
        </button>

        <button class="flex justify-center items-center rounded-full border p-1 text-xss disabled:opacity-40 bg-white"
          :class="{ 'opacity-50 cursor-default': page === totalPages, 'hover:bg-white': page != totalPages }"
          :disabled="page === totalPages || totalPages === 0" @click="page = totalPages">
          <img :src="getIcon('last_page')" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@/mixins/controls.js";

export default {
  mixins: [mixin],
  props: {
    mode: { type: String, default: '' },
    modified: { type: Boolean, default: false },
    columns: { type: Array, required: true },
    rows: { type: Array, required: true },
    rowKey: { type: String, default: "id" },
    emptyText: { type: String, default: "No records found" },
    pageSizeOptions: { type: Array, default: () => [5, 10, 20, 50, 100] },
    initialSort: { type: Object, default: () => null },
    striped: { type: Boolean, default: true },
    hover: { type: Boolean, default: true },
    pagination: { type: Boolean, default: true },
    rowClass: { type: Function, default: null },
    height: { type: String, default: '61vh' },
    editable: { type: Boolean, default: false },
    disabledRows: { type: Array, default: () => [] },
    highlightColumn: { type: String, default: null },
    canHoverIndex: { type: Boolean, default: false },
    isSavings: { type: Boolean, default: false },
    isReceivable: { type: Boolean, default: false },
    formatAmounts: { type: Boolean, default: true },
    highlightSelectedRow: { type: Boolean, default: false },
  },
  data() {
    return {
      hasScrollbar: false,
      hoveredRowIndex: -1,
      selectedRowIndex: 0,
      lastInteraction: null,
      pageSize: 20,
      page: 1,
      sortBy: this.initialSort ? this.initialSort.by : null,
      sortDir: this.initialSort ? this.initialSort.dir : "asc",
      filterModal: { open: false, column: null },
      columnFilters: {},
      editingCell: null,
      editValue: '',
      selectionActive: false,
      selectedRowKeys: [],
      isSyncingScroll: false,
    };
  },
  mounted() {
    window.addEventListener("keydown", this.handleArrowNavigation);
    window.addEventListener("keydown", this.handleSelectionHotkey);

    this.$nextTick(() => {
      if (this.displayedBodyRows.length) {
        this.selectedRowIndex = 0;
        this.hoveredRowIndex = 0;
      }
    });
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleArrowNavigation);
    window.removeEventListener("keydown", this.handleSelectionHotkey);
  },
  computed: {
    selectedTotalsDisplay() {
      let allowedFields = [];

      // SUMMARY MODE
      // ALL MODE + MODIFIED
      if (this.mode === 'ALL' && this.modified) {
        allowedFields = [
          'fdebit',
          'fcredit',
          'fcol_amt',
          'fint_amt',
          'fprin_amt',
          'fsurcharge',
        ];
      }

      else if (this.mode === 'SUMMARY') {
        allowedFields = ['gross', 'loan_balance'];
      }

      // ALL MODE + NOT MODIFIED
      else if (this.mode === 'ALL' && !this.modified) {
        allowedFields = ['fdebit', 'fcredit'];
      }


      return this.columns
        .filter(col =>
          allowedFields.includes(col.field) &&
          this.selectedTotals[col.field] != null
        )
        .map(col => ({
          field: col.field,
          label: col.label,
          value: this.selectedTotals[col.field]
        }));
    },
    filteredRows() {
      let rows = this.rows || [];
      for (const [key, selected] of Object.entries(this.columnFilters)) {
        if (!selected || selected.length === 0) continue;
        if (selected.includes("__all__")) continue;
        rows = rows.filter((r) => selected.includes(r[key]));
      }
      return rows;
    },
    selectedRows() {
      return this.sortedRows.filter((row) => {
        const key = this.getRowKeyValue(row);
        return !row.isTotalRow && this.selectedRowKeys.includes(key);
      });
    },
    displayedBodyRows() {
      return this.displayedRows.filter((row) => !row.isTotalRow);
    },
    displayedTotalRows() {
      return this.displayedRows.filter((row) => row.isTotalRow);
    },
    selectedTotals() {
      const rows = this.selectedRows;
      const totals = {};
      if (!rows.length) return totals;

      this.columns.forEach((col) => {
        const values = rows.map((row) => {
          const parsed = Number(row[col.field]);
          return Number.isNaN(parsed) ? null : parsed;
        }).filter((v) => v != null);

        if (values.length) {
          const sum = values.reduce((sum, value) => sum + value, 0);
          totals[col.field] = this.roundAmount(sum);
        }
      });

      return totals;
    },
    allDisplayedSelected() {
      const selectable = this.displayedBodyRows.filter((row) => !this.isRowDisabled(row));
      return selectable.length > 0 && selectable.every((row) => this.selectedRowKeys.includes(this.getRowKeyValue(row)));
    },
    sortedRows() {
      if (!this.sortBy) return this.filteredRows;

      const arr = [...this.filteredRows];

      arr.sort((a, b) => {
        // ✅ Always keep TOTAL row at the bottom
        if (a.isTotalRow) return 1;
        if (b.isTotalRow) return -1;

        const va = a?.[this.sortBy];
        const vb = b?.[this.sortBy];

        if (va == null && vb == null) return 0;
        if (va == null) return this.sortDir === "asc" ? 1 : -1;
        if (vb == null) return this.sortDir === "asc" ? -1 : 1;

        if (typeof va === "string" || typeof vb === "string") {
          const res = String(va).localeCompare(String(vb));
          return this.sortDir === "asc" ? res : -res;
        }

        const res = va < vb ? -1 : va > vb ? 1 : 0;
        return this.sortDir === "asc" ? res : -res;
      });

      return arr;
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.sortedRows.length / this.pageSize));
    },
    startIndex() {
      if (this.sortedRows.length === 0) return 0;
      return Math.min((this.page - 1) * this.pageSize, Math.max(0, this.sortedRows.length - 1));
    },
    endIndex() {
      if (this.sortedRows.length === 0) return 0;
      return Math.min(this.sortedRows.length, this.startIndex + this.pageSize);
    },

    // ✅ computed for display logic
    displayedRows() {
      return this.pagination ? this.sortedRows.slice(this.startIndex, this.endIndex) : this.sortedRows;
    },
  },
  watch: {
    rows() {
      this.page = 1;

      this.$nextTick(() => {
        if (this.displayedBodyRows.length) {
          this.selectedRowIndex = 0;
          this.hoveredRowIndex = 0;
        } else {
          this.selectedRowIndex = -1;
          this.hoveredRowIndex = -1;
        }
      });
    },

    pageSize() {
      this.page = 1;
      this.$emit('page-change', { page: this.page, pageSize: this.pageSize });
    },

    page(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit('page-change', { page: newVal, pageSize: this.pageSize });
      }
    },
    selectionActive(newVal) {
      if (newVal && this.displayedBodyRows.length) {
        this.selectedRowIndex = 0;
        this.hoveredRowIndex = 0;
      }
    },
    displayedBodyRows() {
      if (this.selectedRowIndex >= this.displayedBodyRows.length) {
        this.selectedRowIndex = Math.max(0, this.displayedBodyRows.length - 1);
      }
    },
    selectedRowIndex(newIdx) {
      if (newIdx == null) return;

      this.hoveredRowIndex = newIdx;
      this.$nextTick(() => {
        const tbody = this.$el.querySelector('tbody');
        if (!tbody) return;
        const tr = tbody.children[newIdx];
        if (tr && typeof tr.scrollIntoView === 'function') {
          tr.scrollIntoView({ block: 'nearest', behavior: 'auto' });
        }
      });
    },
  },
  methods: {
    handleRowClick(row, index) {
      // move yellow highlight to clicked row
      this.selectedRowIndex = index;
      this.hoveredRowIndex = index;

    },
    handleDblRowClick(row, index) {
      // move yellow highlight to clicked row
      this.selectedRowIndex = index;
      this.hoveredRowIndex = index;

      if (this.selectionActive) {
        this.toggleRowSelection(row);
      } else {
        this.$emit('row-click', row);
      }
    },
    handleSelectionHotkey(e) {
      if (e.key !== 'F7') return;

      // Prevent Edge/WebView caret browsing popup
      e.preventDefault();
      e.stopPropagation();

      const hasPermission =
        this.$store.state.permissions?.includes('M') ||
        this.$store.state.permissions?.includes('Z');

      if (!hasPermission) {
        return;
      }

      const active = document.activeElement;

      if (active && ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName)) {
        return;
      }

      this.selectionActive = !this.selectionActive;

      if (!this.selectionActive) {
        this.selectedRowKeys = [];
      }

      this.$emit('selection-mode-change', {
        active: this.selectionActive,
        selectedRows: this.selectedRows,
        selectedTotals: this.selectedTotals
      });
    },
    handleArrowNavigation(e) {
      if (!this.displayedBodyRows || this.displayedBodyRows.length === 0) return;
      const active = document.activeElement;
      if (active && ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName)) return;

      if (e instanceof KeyboardEvent) {
        this.lastInteraction = 'keyboard';
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();

        if (this.selectedRowIndex < this.displayedBodyRows.length - 1) {
          this.selectedRowIndex++;
          this.hoveredRowIndex = this.selectedRowIndex;
        }
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();

        if (this.selectedRowIndex > 0) {
          this.selectedRowIndex--;
          this.hoveredRowIndex = this.selectedRowIndex;
        }
      }

      if (e.key === "Enter") {
          e.preventDefault();

          const row = this.displayedBodyRows[this.selectedRowIndex];
          if (!row) return;

          if (this.selectionActive) {
              this.toggleRowSelection(row);
          } else {
              this.$emit('row-enter', row);
          }
      }
    },


    handleClick(row, evt) {
      this.lastInteraction = evt instanceof MouseEvent ? 'mouse' : 'keyboard';
      if (this.selectionActive) {
        this.toggleRowSelection(row);
        return;
      }
      this.$emit('row-click', row);
    },

    handleDblClick(row, evt) {

      if (this.lastInteraction === 'keyboard') {
        return;
      }
      this.$emit('row-dblclick', row);
    },

    getRowKeyValue(row) {
      const key = row[this.rowKey];
      if (key != null) return String(key);
      return JSON.stringify(row);
    },

    isRowSelected(row) {
      return this.selectedRowKeys.includes(this.getRowKeyValue(row));
    },

    toggleRowSelection(row) {
      if (row.isTotalRow || this.isRowDisabled(row)) return;
      const key = this.getRowKeyValue(row);
      const existingIndex = this.selectedRowKeys.indexOf(key);
      if (existingIndex >= 0) {
        this.selectedRowKeys.splice(existingIndex, 1);
      } else {
        this.selectedRowKeys.push(key);
      }
      this.emitSelectionChange();
    },

    toggleSelectAllDisplayedRows(checked) {
      const selectable = this.displayedBodyRows.filter((row) => !this.isRowDisabled(row));
      const keys = selectable.map((row) => this.getRowKeyValue(row));
      if (checked) {
        this.selectedRowKeys = Array.from(new Set([...this.selectedRowKeys, ...keys]));
      } else {
        this.selectedRowKeys = this.selectedRowKeys.filter((key) => !keys.includes(key));
      }
      this.emitSelectionChange();
    },

    emitSelectionChange() {
      this.$emit('selection-change', {
        selectedRows: this.selectedRows,
        selectedTotals: this.selectedTotals,
        selectedKeys: [...this.selectedRowKeys],
      });
    },

    columnWidthStyle(col) {
      if (col === '__select') {
        return {
          width: '50px',
          minWidth: '50px',
          maxWidth: '50px'
        };
      }
      if (!col || !col.width) return {};

      return {
        width: col.width,
        minWidth: col.width,
        maxWidth: col.width,
      };
    },
    cellColor(col, row) {
      // ✅ Skip coloring if the row is disabled
      if (this.isRowDisabled(row)) return '';

      // allow string or function
      if (!col.color) return '';

      if (typeof col.color === 'function') {
        return col.color(row, col);
      }

      return col.color; // string class
    },
    handleEditKeydown(e, row, field) {
      // ✅ Allow F6 only
      if (e.key === "F6") {
        e.preventDefault();
        this.$emit("f6-pressed", { row, field });
        return;
      }

      // ❌ Block ALL typing and editing keys
      e.preventDefault();
    },
    // toggleSort(key) {
    //   if (this.sortBy === key) {
    //     this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
    //   } else {
    //     this.sortBy = key;
    //     this.sortDir = "asc";
    //   }
    // },
    openFilterModal(col) {
      this.filterModal.open = true;
      this.filterModal.column = col;
      if (!this.columnFilters[col.field]) {
        this.columnFilters[col.field] = ["__all__"];
      }
    },
    applyFilters() {
      this.page = 1;
      this.filterModal.open = false;
    },
    uniqueValues(key) {
      const values = (this.rows || []).map((r) => r[key]).filter((v) => v != null);
      return [...new Set(values)];
    },
    toggleAll(key) {
      if (this.columnFilters[key].includes("__all__")) {
        this.columnFilters[key] = ["__all__"];
      }
    },
    uncheckAllIfPartial(key) {
      const values = this.uniqueValues(key);
      if (this.columnFilters[key].includes("__all__") && this.columnFilters[key].length > 1) {
        this.columnFilters[key] = this.columnFilters[key].filter((v) => v !== "__all__");
      }
      if (this.columnFilters[key].length === values.length) {
        this.columnFilters[key] = ["__all__"];
      }
    },
    cellAlign(col) {
      switch (col.align) {
        case "center":
          return "text-center";
        case "right":
          return "text-right";
        default:
          return "text-left";
      }
    },
    formatValue(v, col = null) {
      if (v == null || v === '') return "";

      // column explicitly disables formatting
      if (col?.formatAmount === false) {
        return v;
      }

      // global table formatting disabled
      if (!this.formatAmounts) {
        return v;
      }

      const num = Number(v);

      if (!isNaN(num) && v !== true && v !== false) {
        return num.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }

      return v;
    },
    roundAmount(value) {
      return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
    },
    displayValue(row, col) {
      if (!row || !col) {
        return row?.[col?.field];
      }

      if (row.isTotalRow && this.selectionActive) {
        // Hide BR and RC codes in summation mode for total row
        if (col.field === 'fbr_code' || col.field === 'frc_code' || col.field === 'fterms' || col.field === 'floan_id') {
          return '';
        }

        // Special handling for running balance in selection mode
        if (col.field === 'frunning_bal') {
          if (this.selectedRows.length > 0) {
            const debit = this.selectedTotals['fdebit'] || 0;
            const credit = this.selectedTotals['fcredit'] || 0;

            // Determine balance calculation based on ledger type
            let balance;
            if (this.isSavings) {
              // For savings: check if it's receivable
              if (this.isReceivable) {
                balance = debit - credit;  // SHARE CAPITAL CONTRIBUTION RECEIVABLE
              } else {
                balance = credit - debit;  // Regular savings
              }
            } else {
              // For loans
              balance = debit - credit;
            }

            return this.roundAmount(balance);
          }
          return '';
        }

        // Hide other balances in summation mode total row
        if (
          col.field === 'fprin_amt' || col.field === 'fint_amt' || col.field === 'fcol_amt' || col.field === 'fsurcharge' ||
          col.field === 'fgross_bal' || col.field === 'fdocnum2' || col.field === 'ftracking'
        ) {
          return '';
        }

        if (this.selectedRows.length > 0 && this.selectedTotals[col.field] != null) {
          return this.roundAmount(this.selectedTotals[col.field]);
        }

        // keep the label column content, but avoid showing the normal full-table totals in summation mode
        if (col.align === 'center' || col.field === 'loan_date' || col.field === 'fdate' || col.field === 'loan_id') {
          return row[col.field];
        }

        return '';
      }

      return row[col.field];
    },
    isRowDisabled(row) {
      return this.disabledRows.includes(row[this.rowKey]);
    },
    hasCustomRowClass(row) {
      if (typeof this.rowClass !== "function") return false;
      const cls = this.rowClass(row);
      return !!cls && cls !== "";
    },
    startEdit(row, field) {
      const col = this.columns.find(c => c.field === field);
      // Only allow editing if column has editable: true
      if (!col?.editable) return;
      // Prevent editing disabled rows
      if (this.isRowDisabled(row)) return;

      const rowKeyValue = row[this.rowKey];
      this.editingCell = { rowKey: rowKeyValue, field };
      this.editValue = String(row[field] || '');
    },
    isEditing(row, field) {
      if (!this.editingCell) return false;
      return this.editingCell.rowKey === row[this.rowKey] && this.editingCell.field === field;
    },
    saveEdit(row, field) {
      if (!this.editingCell) return;

      const oldValue = row[field];
      const newValue = this.editValue;

      // Update the row
      row[field] = newValue;

      // Emit event for parent to handle backend call
      this.$emit('cell-edit', {
        rowKey: row[this.rowKey],
        field,
        oldValue,
        newValue,
        row
      });

      this.editingCell = null;
      this.editValue = '';
    },
    cancelEdit() {
      this.editingCell = null;
      this.editValue = '';
    },
    syncScroll(source) {
      if (this.isSyncingScroll) return;
      this.isSyncingScroll = true;

      const sourceRef =
        source === 'body' ? this.$refs.tableBody :
          source === 'header' ? this.$refs.headerScroll :
            this.$refs.footerScroll;

      if (!sourceRef) {
        this.isSyncingScroll = false;
        return;
      }

      const scrollLeft = sourceRef.scrollLeft;

      if (source !== 'body' && this.$refs.tableBody) {
        this.$refs.tableBody.scrollLeft = scrollLeft;
      }
      if (source !== 'header' && this.$refs.headerScroll) {
        this.$refs.headerScroll.scrollLeft = scrollLeft;
      }
      if (source !== 'footer' && this.$refs.footerScroll) {
        this.$refs.footerScroll.scrollLeft = scrollLeft;
      }

      this.$nextTick(() => {
        this.isSyncingScroll = false;
      });
    },
  },
};
</script>

<style scoped>
.bg-green-custom {
  background-color: #afffcb;
}

table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  box-sizing: border-box;
}


th,
td {
  box-sizing: border-box;
}

th {
  white-space: normal;
  word-break: break-word;
  line-height: 1.2;
}

thead {
  z-index: 10;
  background-color: #016b00;
}

tbody tr.sticky {
  position: sticky;
  bottom: 0;
  z-index: 20;
}

tbody tr.sticky td {
  background-color: #f4f4f4;
}

.selection-summary {
  min-height: 2.75rem;
}

.no-records-cell {
  height: 150px;
  /* adjust as needed */
  vertical-align: middle;
}

.no-records-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.table-row-hover {
  transition: filter 0.15s ease;
  background-color: #fdfdfd;
}

.table-row-hover:hover {
  filter: brightness(0.97);
}

:root {
  --scrollbar-size: 2px;
  --scrollbar-offset: 16px;
}

/* BODY */
.table-body-scroll {
  overflow-y: auto;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: #999 transparent;
  scrollbar-gutter: stable;
}

.table-body-scroll::-webkit-scrollbar {
  width: var(--scrollbar-size);
}

.table-body-scroll::-webkit-scrollbar-thumb {
  background: #999;
  border-radius: 999px;
}

/* HEADER + FOOTER scroll containers */
.table-header-scroll,
.table-footer-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-right: 10px;
}

.table-header-scroll::-webkit-scrollbar,
.table-footer-scroll::-webkit-scrollbar {
  display: none;
}

/* HEADER + FOOTER tables */
/* .table-header,
.table-footer {
  width: calc(100% - 10px);
} */
</style>
