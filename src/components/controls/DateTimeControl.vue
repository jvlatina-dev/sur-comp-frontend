<template>
  <div
    :class="[
      is_login ? 'flex flex-col text-grey-dark text-xs lg:text-2xl leading-normal' : '',
      is_footer ? 'flex flex-row text-grey-darker text-xs items-center' : '',
      'font-normal'
    ]"
  >
    <p v-if="is_login" class="font-bold">{{ formattedDate }}</p>
    <p v-if="is_login">{{ formattedTime }}</p>

    <div v-else class="flex flex-row items-center" style="gap:1rem;">
      <p>{{ formattedDate }}</p>
      <p>{{ formattedTime }}</p>
    </div>
  </div>
</template>


<script>
export default {
  name: "v-datetime",
  data() {
    return {
      current_date_time: new Date(),
    };
  },
  props: {
    is_login: {
      type: Boolean,
      default: false
    },
    is_footer: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    formattedDate() {
        return this.current_date_time.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long', 
            day: 'numeric' 
        });
    },
    formattedTime() {
      let hours = this.current_date_time.getHours();
      const minutes = this.current_date_time.getMinutes();
      const seconds = this.current_date_time.getSeconds();

      const ampm = hours >= 12 ? "PM" : "AM";

      hours = hours % 12;
      hours = hours ? hours : 12;

      const formattedHours = hours < 10 ? `0${hours}` : hours;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

      return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
    },
  },
  mounted() {
    this.startClock();
  },
  beforeUnmount() {
    clearInterval(this.interval);
  },
  methods: {
    startClock() {
      this.interval = setInterval(() => {
        this.current_date_time = new Date();
      }, 1000);
    }
  },
};
</script>

<style scoped>

</style>