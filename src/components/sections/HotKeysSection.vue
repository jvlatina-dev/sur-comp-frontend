<template>
    <div class="flex flex-row items-center justify-start w-full" style="gap: 2rem;">
        <div class="flex flex-row items-center justify-center" v-show="home">
            <div class="w-10 h-6 bg-gray-400 text-white flex items-center justify-center font-bold text-sm ">
                <p>F1</p>
            </div>
            <p class="ml-2 text-gray-400 font-bold italic text-xs">Refresh</p>
        </div>

        <div class="flex items-center justify-center" v-show="home">
            <div class="w-10 h-6 bg-gray-400 text-white flex items-center justify-center font-bold text-sm">
                <p>Esc</p>
            </div>
            <p class="ml-2 text-gray-400 font-bold italic text-xs">Exit</p>
        </div>

        <div class="flex items-center justify-center" v-show="batch">
            <div class="w-10 h-6 bg-gray-400 text-white flex items-center justify-center font-bold text-sm">
                <p>F6</p>
            </div>
            <p class="ml-2 text-gray-400 font-bold italic text-xs">Enable Approve Records</p>
        </div>

        <div class="flex items-center justify-center" v-show="batch">
            <div class="w-10 h-6 bg-gray-400 text-white flex items-center justify-center font-bold text-sm">
                <p>F7</p>
            </div>
            <p class="ml-2 text-gray-400 font-bold italic text-xs">Enable Post Records</p>
        </div>
    </div>

</template>



<script>


export default {
    name: 'HotKeys',
    props: {
        home: { type: Boolean, default: false },
        batch: { type: Boolean, default: false },
    },
    components: {

    },
    data() {
        return {

        };
    },
    mounted() {

    },
    beforeUnmount() {

    },
    methods: {
    }
};
</script>

<style scoped></style>
