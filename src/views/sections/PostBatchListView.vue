<template>
    <div class="">

        <div class="flex flex-row justify-between items-center">

            <div class="flex flex-col items-start justify-start">
                <p class="text-primary text-xl font-bold text-left mb-2">Post Journal Voucher</p>
                <p class="text-primary bg-green-lightest px-2 py-1 rounded-lg font-bold border text-sm">Batch No: {{
                    $store.state.viewed_batch.fasu_real_batch}}</p>
            </div>

            <div class="flex flex-wrap text-gray-600 mt-2 text-sm" style="gap: 1rem;">
                <div class="rounded-lg bg-gray-50 border p-3">
                    <p class="text-xxs text-gray-500 mb-1">Cut-Off Date</p>
                    <p class="font-bold">{{ formatDate($store.state?.viewed_batch?.fasu_real_cutoff) }}</p>
                </div>

                <div class="rounded-lg bg-gray-50 border p-3">
                    <p class="text-xxs text-gray-500 mb-1">Total Amount</p>
                    <p class="font-bold">{{ formatAmount($store.state?.viewed_batch?.fasu_real_amt) }}</p>
                </div>

                <div class="rounded-lg bg-gray-50 border p-3">
                    <p class="text-xxs text-gray-500 mb-1">JV Number</p>
                    <p class="font-bold">{{ $store.state?.viewed_batch?.fjv_no }}</p>
                </div>

                <div class="rounded-lg bg-gray-50 border p-3">
                    <p class="text-xxs text-gray-500 mb-1">JV Date</p>
                    <p class="font-bold">{{ formatDate($store.state?.viewed_batch?.fjv_date) }}</p>
                </div>

                <div class="rounded-lg bg-gray-50 border p-3">
                    <p class="text-xxs text-gray-500 mb-1">Generated Date</p>
                    <p class="font-bold">{{ formatDate($store.state?.viewed_batch?.fe_date) }}</p>
                </div>

                <div class="rounded-lg bg-gray-50 border p-3">
                    <p class="text-xxs text-gray-500 mb-1">Status</p>
                    <p class="font-bold" :class="{
                        'text-gray-600': $store.state.viewed_batch.fasu_real_status === 'P',
                        'text-yellow-darker': $store.state.viewed_batch.fasu_real_status === 'F',
                        'text-primary': $store.state.viewed_batch.fasu_real_status === 'D'
                    }">
                        <span class="bg-gray-600 rounded-full w-5 h-5"></span>
                        {{ $store.state.viewed_batch.fasu_real_status === 'P'
                            ? 'Pending'
                            : $store.state.viewed_batch.fasu_real_status === 'F'
                                ? 'For Posting'
                                : $store.state.viewed_batch.fasu_real_status === 'D'
                                    ? 'Posted'
                                    : $store.state.viewed_batch.fasu_real_status }}
                    </p>
                </div>
            </div>
        </div>


        <div class="my-5">
            <DataTableControl :columns="batchColumns" :rows="batchRows" rowKey="floan_id" :pagination="false"
                :height="'45vh'" :isSelectionActive="true" @selection-change="onSelectionChange">
                <template #cell:fasu_status="{ row }">
                    <span
                        class="px-2 py-1 rounded-full text-xs font-semibold"
                        :class="getStatusClass(row.fasu_status)"
                    >
                        {{ getStatusLabel(row.fasu_status) }}
                    </span>
                </template>
            </DataTableControl>
        </div>

        <div class="flex flex-row items-center justify-between w-full">
            <div class="w-full flex items-center justify-between" style="gap: 1rem;">
                <div>

                </div>
                <ButtonControl variant="primary" @click="postJV" style="width: 7rem;" :disabled="selectedRows.length === 0">Post JV</ButtonControl>
            </div>
        </div>

        <transition name="slide-in">
            <MessageBoxControl v-if="message_modal" :is_visible="message_modal" :positiveButton="positiveBtn"
                @positiveClick="positiveClick()" :negativeButton="negativeBtn" @negativeClick="negativeClick()"
                :theme="theme" :title="title" :message="msg" style="z-index: 99999999999999 !important;">
            </MessageBoxControl>
        </transition>

        <transition name="slide-in">
            <ModalControl v-if="pin_modal" :is_visible="pin_modal" @close="pin_modal = false" :width="'w-1/4'">
                <PINValidationView @validated="approveRecords"/>
            </ModalControl>
        </transition>

        <transition name="slide-in">
            <ModalControl v-if="jv_modal" :is_visible="jv_modal" @close="jv_modal = false" :width="'w-80'">
                <PostJVView @close="jv_modal = false; this.$emit('error')" @success="successJV" @failed_print="jv_modal = false"/>
            </ModalControl>
        </transition>


    </div>
</template>


<script>
import ButtonControl from '@/components/controls/ButtonControl.vue';
import ModalControl from '@/components/controls/ModalControl.vue';
import DataTableControl from '@/components/controls/DataTableControl.vue';
import TextControl from '@/components/controls/TextControl.vue';
import ComboBoxControl from '@/components/controls/ComboBoxControl.vue';
import MessageBoxControl from '@/components/controls/MessageBoxControl.vue';
import HotKeysSection from '@/components/sections/HotKeysSection.vue';
import PINValidationView from '@/components/controls/PINValidationView.vue';

import PostJVView from './PostJVView.vue';

import mixin from "@/mixins/controls.js";

export default {
    name: 'Archive',
    inject: ['setLoading'],
    mixins: [mixin],
    components: {
        ButtonControl,
        ModalControl,
        DataTableControl,
        ComboBoxControl,
        TextControl,
        MessageBoxControl,
        HotKeysSection,
        PostJVView,
        PINValidationView
    },
    watch: {
        search(newValue) {
            if (newValue.trim() === "") {
                this.appliedSearch = "";
            }
        }
    },
    data() {
        return {
            pin_modal: false,
            jv_modal: false,
            selectedRows: [],
            batchColumns: [
                { label: 'Member Key', field: 'fkey', align: 'center', formatAmount: false, width: '90px' },
                { label: 'Acct. No.', field: 'facct_no', align: 'center', formatAmount: false, width: '80px'  },
                { label: 'Name', field: 'fname', formatAmount: false, width: '160px'  },
                { label: 'DedCode', field: 'fdedcode', align: 'center', formatAmount: false, width: '90px'  },
                { label: 'Date', field: 'fdate', align: 'center', formatAmount: false, width: '90px'  },
                { label: 'Amount', field: 'amount', align: 'right', width: '160px'  },
                { label: 'Reference', field: 'freference', align: 'left', formatAmount: false, width: '170px'  },
                { label: 'Loan ID', field: 'floan_id', align: 'center', formatAmount: false, width: '100px'  },
                { label: 'BR', field: 'fbr_code', align: 'center', formatAmount: false, width: '60px' },
                { label: 'Terms', field: 'fterms', align: 'center', formatAmount: false, width: '90px' },
                { label: 'Balance', field: 'balance', align: 'right', width: '160px' },
                { label: 'Status', field: 'fasu_status', align: 'center', formatAmount: false, width: '120px' },
            ],
            message_modal: false,
            title: '',
            msg: '',
            theme: '',
            positiveBtn: '',
            negativeBtn: '',
            batch_ledger: false
        };
    },
    computed: {
        batchRows() {
            const raw = this.$store.state?.viewed_records || [];

            const records = raw.filter(
                row => row.fasu_status == "F"
            );

            const totalAmount = records.reduce(
                (sum, row) => sum + (Number(row.amount) || 0),
                0
            );

            const totalBalance = records.reduce(
                (sum, row) => sum + (Number(row.balance) || 0),
                0
            );

            return [
                ...records,
                {
                    isTotalRow: true,
                    fname: "TOTAL",
                    amount: totalAmount,
                    balance: totalBalance
                }
            ];
        }
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
        postJV() {
            this.jv_modal = true;
            this.$store.state.viewed_records.selected_jv = this.selectedRows;
        },
        successJV() {
            const postedRows = [...this.selectedRows];

            // 1. Close PostJVView modal
            this.jv_modal = false;

            // 2. Update selected records locally
            postedRows.forEach(selected => {
                const row = this.$store.state.viewed_records.find(
                    x => x.fpk === selected.fpk
                );

                if (row) {
                    row.fasu_status = "D";
                }
            });

            // 3. Clear selected rows
            this.selectedRows = [];

            // 4. Clear selected JV records
            this.$store.state.viewed_records.selected_jv = [];

            // 5. Tell ArchiveView that posting was successful
            this.$emit('success');
        },
        onSelectionChange({ selectedRows }) {
            this.selectedRows = selectedRows;
        },
        positiveClick() {
            this.message_modal = false;
        },
        negativeClick() {
            this.message_modal = false;
        },
        formatAmount(value) {
            if (value === null || value === undefined || value === "") {
                return "0.00";
            }

            const amount = Number(value);

            if (isNaN(amount)) {
                return "0.00";
            }

            return amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        },
        approveRecords() {
            this.pin_modal = false;

            if (!this.selectedRows.length) {
                this.theme = "error";
                this.title = "No Records Selected";
                this.msg = "Please select at least one record.";
                this.positiveBtn = "Okay";
                this.negativeBtn = "";
                this.message_modal = true;
                return;
            }

            this.setLoading(true);

            console.log('Batch key: ', this.$store.state.viewed_batch.fasu_real_batch);
            console.log('Selected Rows: ', this.selectedRows);
            window.chrome.webview.postMessage({
                action: "approve_records",
                data: this.selectedRows,
                batch_key: this.$store.state.viewed_batch.fasu_real_batch
            });
        },
        getStatusLabel(status) {
            return {
                P: "Pending",
                F: "For Posting",
                D: "Posted"
            }[status] || status;
        },
        getStatusClass(status) {
            switch (status) {
                case "P":
                    return "bg-gray-200 text-gray-700";
                case "F":
                    return "bg-yellow-lightest text-yellow-darker";
                case "D":
                    return "bg-green-lightest text-primary";
                default:
                    return "bg-gray-100 text-gray-600";
            }
        },
        applySearch() {
            this.appliedSearch = this.search.trim();
        },
        handleWebResponse(event) {
            const msg = event.data;

            if (msg.type === "approve_records") {
                this.setLoading(false);
                const approvedRows = [...this.selectedRows];

                if (msg.success) {
                    this.theme = "success";
                    this.title = "Success";
                    this.msg = msg.message;
                    this.positiveBtn = "Okay";
                    this.negativeBtn = "";

                    this.message_modal = true;

                    approvedRows.forEach(selected => {
                        const row = this.$store.state.viewed_records.find(
                            x => x.fpk === selected.fpk
                        );

                        if (row) {
                            row.fasu_status = "F";
                        }
                    });

                    this.selectedRows = [];

                }
                else {
                    this.theme = "error";
                    this.title = "Approval Failed";
                    this.msg = msg.message;
                    this.positiveBtn = "Okay";
                    this.negativeBtn = "";
                    this.selectedRows = [];
                    this.message_modal = true;
                }
            }

        },
        postLedger() {
            this.jv_modal = true;
            this.$store.state.for_posting = this.batchRows.filter(row => !row.isTotalRow);
            console.log('for posting: ', this.$store.state.for_posting);
        },
        getHeaders() {
            this.setLoading(true);

            window.chrome.webview.postMessage({
                action: "get_headers"
            });
        },
        formatDate(date) {
            if (!date) return '';

            const d = new Date(date);

            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const year = d.getFullYear();

            return `${month}/${day}/${year}`;
        },
        handleHotkeys(event) {

            if (event.key === "F1") {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                this.getHeaders();
                return false;
            }
        },
    }
};
</script>

<style scoped></style>
