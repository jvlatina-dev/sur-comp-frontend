<template>
    <div class="">
        <div class="flex flex-row items-center justify-between mb-5">
            <p class="text-primary text-xl font-bold text-left">Create New Batch</p>
            <ButtonControl variant="primary" @click="add_entry = true" style="width: 10rem;">Add New Entry</ButtonControl>
        </div>

        <DataTableControl
            :columns="columns"
            :rows="rows"
            rowKey="reference_number"
            :pagination="false"
            :height="'30vh'"
        />

        <div class="w-full flex items-center justify-between mt-4">

            <div></div>

            <div class="flex flex-row items-center justify-center" style="gap: 1rem;">
                <ButtonControl variant="secondary" @click="this.$emit('close')" style="width: 9rem;">Cancel</ButtonControl>
                <ButtonControl variant="primary" @click="saveBatch" style="width: 9rem;">Save Batch</ButtonControl>
            </div>
        </div>

        <transition name="slide-in">
            <MessageBoxControl v-if="message_modal" :is_visible="message_modal" :positiveButton="positiveBtn"
                @positiveClick="positiveClick()" :negativeButton="negativeBtn" @negativeClick="negativeClick()"
                :theme="theme" :title="title" :message="msg" style="z-index: 99999999999999 !important;">
            </MessageBoxControl>
        </transition>

        <transition name="slide-in">
            <ModalControl v-if="add_entry" :is_visible="add_entry" @close="add_entry = false" :width="'w-90'"
                :height="'auto'" style="z-index: 99999999999999 !important;">
                <AddEntryView />
            </ModalControl>
        </transition>

    </div>
</template>


<script>
import ButtonControl from '@/components/controls/ButtonControl.vue';
import ModalControl from '@/components/controls/ModalControl.vue';
import DataTableControl from '@/components/controls/DataTableControl.vue';
import MessageBoxControl from '@/components/controls/MessageBoxControl.vue';
import AddEntryView from '@/views/sections/AddEntryView.vue';

import mixin from "@/mixins/controls.js";

export default {
    name: 'CreateNewBatch',
    inject: ['setLoading'],
    mixins: [mixin],
    components: {
        ButtonControl,
        ModalControl,
        DataTableControl,
        MessageBoxControl,
        AddEntryView
    },
    data() {
        return {
            add_entry: false,
            columns: [
                { label: 'Acct. No.', field: 'act_code', align: 'center', formatAmount: false },
                { label: "Member's Name", field: 'rc_code', align: 'center', formatAmount: false },
                { label: 'Loan ID', field: 'sl_code', align: 'center', formatAmount: false },
                { label: 'Loan Type', field: 'particular', formatAmount: false },
                { label: 'Loan Date', field: 'debit', align: 'right' },
                { label: 'Action', field: 'credit', align: 'right' },
            ],
            rows: [],
            message_modal: false,
        };
    },
    mounted() {
        if (window.chrome?.webview) {
            window.chrome.webview.addEventListener("message", this.handleWebResponse);
        }

        window.addEventListener("keydown", this.handleHotkeys, true);
    },
    beforeUnmount() {
        if (window.chrome?.webview) {
            window.chrome.webview.removeEventListener("message", this.handleWebResponse);
        }

        window.removeEventListener("keydown", this.handleHotkeys, true);
    },
    methods: {
        saveBatch() {

        },
        handleWebResponse(event) {
            const msg = event.data;

            if (msg.type === "print_jv") {

                this.setLoading(false);
                this.action = "print_jv";

                if (msg.success) {

                    this.signatories_modal = false;

                    this.msg = "Journal Voucher was successfully printed.";
                    this.title = "Print Journal Voucher";
                    this.theme = "success";
                    this.positiveBtn = "OK";
                    this.negativeBtn = "";
                    this.message_modal = true;


                } else {

                    this.msg = msg.message || "Failed to print Journal Voucher.";
                    this.title = "Print Journal Voucher";
                    this.theme = "error";
                    this.positiveBtn = "OK";
                    this.negativeBtn = "";
                    this.message_modal = true;

                }
            }

        },
        handleHotkeys(event) {


        },
    }
};
</script>

<style scoped></style>
