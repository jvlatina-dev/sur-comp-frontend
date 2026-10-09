<template>
  <div class="w-full">
    <div class="rounded border flex flex-col max-h-full h-full overflow-hidden">
      <div class="overflow-x-auto flex-grow">
        <div class="overflow-y-auto" style="max-height: 53vh;">
          <table class="min-w-full text-center">
            <!-- Table Head -->
            <thead class="bg-primary">
              <tr>
                <th
                  v-for="n in columnCount"
                  :key="'head-' + n"
                  class="px-3 py-2 text-xxs font-semibold uppercase tracking-wider text-white"
                >
                  <div class="header-bar w-16 h-3 mx-auto rounded"></div>
                </th>
              </tr>
            </thead>

            <!-- Skeleton Rows -->
            <tbody>
              <tr v-for="r in rowCount" :key="'row-' + r" class="border-b">
                <td v-for="c in columnCount" :key="'cell-' + r + '-' + c" class="px-2 py-3">
                  <div class="skeleton-bar w-3/4 h-3 mx-auto rounded"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Pagination Placeholder -->
    <div class="mt-3 flex items-center justify-between">
      <div class="flex flex-row items-center" style="gap: 0.5rem;">
        <div class="skeleton-bar h-3 w-24 rounded"></div>
        <div class="skeleton-bar h-3 w-16 rounded"></div>
      </div>

      <div class="flex items-center" style="gap: 0.5rem;">
        <div v-for="i in 4" :key="i" class="skeleton-bar h-6 w-6 rounded-full"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TableSkeleton",
  props: {
    rowCount: { type: Number, default: 5 },
    columnCount: { type: Number, default: 5 }
  }
};
</script>

<style scoped>
thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #016B00;
}

/* 💫 Shimmer Animation */
@keyframes shimmer {
  0% {
    background-position: -450px 0;
  }
  100% {
    background-position: 450px 0;
  }
}

.skeleton-bar {
  background: linear-gradient(
    90deg,
    #e5e7eb 0px,
    #f3f4f6 40px,
    #e5e7eb 80px
  );
  background-size: 600px 100%;
  animation: shimmer 1.5s infinite linear;
}

.header-bar {
  background: linear-gradient(
    90deg,
    #014e00 0px,
    #016B00 40px,
    #025e00 80px
  );
  background-size: 600px 100%;
  animation: shimmer 1.5s infinite linear;
}
</style>
