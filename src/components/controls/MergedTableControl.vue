<template>
  <div class="w-full">
    <!-- Table -->
    <div class="rounded border flex flex-col max-h-full h-full overflow-y-auto" style="height: 65vh;">
      <div class="overflow-x-auto flex-grow">
        <div class="overflow-y-auto">
          <table class="min-w-full text-center">
            <thead class="bg-primary text-white">
              <!-- First row: Age groups -->
              <tr>
                <th class="px-4 py-2" rowspan="2">Loan Type</th>
                <th class="px-4 py-2" colspan="2">CURRENT</th>
                <th class="px-4 py-2" colspan="2">30 DAYS</th>
                <th class="px-4 py-2" colspan="2">60 DAYS</th>
                <th class="px-4 py-2" colspan="2">90 DAYS</th>
                <th class="px-4 py-2" colspan="2">120 DAYS</th>
                <th class="px-4 py-2" colspan="2">240 DAYS</th>
                <th class="px-4 py-2" colspan="2">365 DAYS</th>
                <th class="px-4 py-2" colspan="2">OVER 365 DAYS</th>
                <th class="px-4 py-2 bg-gray-600" colspan="2">OVER 365 + UNKNOWN</th>
                <th class="px-4 py-2 bg-gray-600" colspan="2">UNKNOWN</th>
              </tr>

              <!-- Second row: Gross / Balance -->
              <tr>
                <th>Gross</th>
                <th>Balance</th>
                <th>Gross</th>
                <th>Balance</th>
                <th>Gross</th>
                <th>Balance</th>
                <th>Gross</th>
                <th>Balance</th>
                <th>Gross</th>
                <th>Balance</th>
                <th>Gross</th>
                <th>Balance</th>
                <th>Gross</th>
                <th>Balance</th>
                <th>Gross</th>
                <th>Balance</th>
                <th class="bg-gray-600">Gross</th>
                <th class="bg-gray-600">Balance</th>
                <th class="bg-gray-600">Gross</th>
                <th class="bg-gray-600">Balance</th>
              </tr>
            </thead>


            <tbody>
              <tr v-if="displayedRows.length === 0">
                <td :colspan="columns.length" class="px-2 pt-20 text-right text-grey-dark italic">
                  <div>
                    <img src="@/assets/images/papsi_box.png" class="w-32 opacity-75">
                    <p class="text-sm mt-4">No records found. Please enter the following filters above to generate data.</p>
                  </div>
                </td>
              </tr>

              <tr v-for="row in displayedRows" :key="row[rowKey] || JSON.stringify(row)" class="transition border-b"
                :class="[hover ? 'hover:bg-gray-100 cursor-pointer' : '', typeof rowClass === 'function' ? rowClass(row) : '']"
                @click="$emit('row-click', row)">
                <td v-for="col in columns" :key="col.field" class="px-3 py-2 text-xxs text-gray-500"
                  :class="cellAlign(col)">
                  <slot :name="`cell:${col.field}`" :row="row" :value="row[col.field]">
                    {{ formatValue(row[col.field]) }}
                  </slot>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Pagination (same as DataTableControl) -->
    <div v-if="pagination" class="mt-3 flex items-center justify-between">
      <div class="flex flex-row items-center justify-start" style="gap: 0.5rem;">
        <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-3">
          <div class="flex items-center gap-2">
            <label class="text-xxs text-gray-600 mr-2">Rows per page: </label>
            <select v-model.number="pageSize" class="rounded border px-1 py-1 focus:outline-none text-xxs">
              <option v-for="n in pageSizeOptions" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
        </div>
        <div class="text-xxs text-grey-dark italic mb-3">
          Showing
          <span class="font-medium">{{ sortedRows.length > 0 ? startIndex + 1 : 0 }}</span>–
          <span class="font-medium">{{ endIndex }}</span>
          of
          <span class="font-medium">{{ filteredRows.length }}</span>
        </div>
      </div>

      <div class="flex items-center" style="gap: 0.5rem;">
        <button class="flex justify-center items-center rounded-full border p-1 text-xss disabled:opacity-40"
          :class="{ 'opacity-50 cursor-default': page === 1, 'hover:bg-grey-lighter': page != 1 }"
          :disabled="page === 1" @click="page = 1">
          First
        </button>
        <button class="flex justify-center items-center rounded-full border p-1 text-xss disabled:opacity-40"
          :class="{ 'opacity-50 cursor-default': page === 1, 'hover:bg-grey-lighter': page != 1 }"
          :disabled="page === 1" @click="page--">
          Prev
        </button>
        <span class="text-xss">
          Page <strong>{{ page }}</strong> / {{ totalPages }}
        </span>
        <button class="flex justify-center items-center rounded-full border p-1 text-xss disabled:opacity-40"
          :class="{ 'opacity-50 cursor-default': page === totalPages, 'hover:bg-grey-lighter': page != totalPages }"
          :disabled="page === totalPages || totalPages === 0" @click="page++">
          Next
        </button>
        <button
          class="flex justify-center items-center rounded-full border p-1 text-xss disabled:opacity-40 hover:bg-grey-lighter"
          :class="{ 'opacity-50 cursor-default': page === totalPages, 'hover:bg-grey-lighter': page != totalPages }"
          :disabled="page === totalPages || totalPages === 0" @click="page = totalPages">
          Last
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@/mixins/controls.js";

export default {
  name: "MergedTableControl",
  mixins: [mixin],
  props: {
    columns: { type: Array, required: true },
    rows: { type: Array, required: true },
    rowKey: { type: String, default: "id" },
    emptyText: { type: String, default: "No records found" },
    pageSizeOptions: { type: Array, default: () => [5, 10, 20, 50, 100] },
    initialSort: { type: Object, default: () => null },
    hover: { type: Boolean, default: true },
    pagination: { type: Boolean, default: false },
    rowClass: { type: Function, default: null },
  },
  data() {
    return {
      pageSize: 20,
      page: 1,
      sortBy: this.initialSort ? this.initialSort.by : null,
      sortDir: this.initialSort ? this.initialSort.dir : "asc",
    };
  },
  computed: {
    filteredRows() {
      return this.rows || [];
    },
    sortedRows() {
      if (!this.sortBy) return this.filteredRows;
      const arr = [...this.filteredRows];
      arr.sort((a, b) => {
        const va = a?.[this.sortBy];
        const vb = b?.[this.sortBy];
        if (va == null && vb == null) return 0;
        if (va == null) return this.sortDir === "asc" ? 1 : -1;
        if (vb == null) return this.sortDir === "asc" ? -1 : 1;
        return this.sortDir === "asc"
          ? String(va).localeCompare(String(vb))
          : String(vb).localeCompare(String(va));
      });
      return arr;
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.sortedRows.length / this.pageSize));
    },
    startIndex() {
      return Math.min((this.page - 1) * this.pageSize, Math.max(0, this.sortedRows.length - 1));
    },
    endIndex() {
      return Math.min(this.sortedRows.length, this.startIndex + this.pageSize);
    },
    displayedRows() {
      return this.pagination ? this.sortedRows.slice(this.startIndex, this.endIndex) : this.sortedRows;
    },
  },
  methods: {
    cellAlign(col) {
      switch (col.align) {
        case "center": return "text-center";
        case "right": return "text-right";
        default: return "text-right";
      }
    },
    formatValue(v) {
      if (v == null) return "";
      return v;
    },
  },
};
</script>

<style scoped>
thead tr:first-child th {
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
}

tr:last-child {
  border-bottom: none !important;
}
</style>
